import io
import os
import tempfile
import re
import uuid
from functools import wraps
from html import unescape
from timeit import default_timer
from datetime import datetime

import argostranslatefiles
from argostranslatefiles import get_supported_formats
from flask import (abort, Blueprint, Flask, jsonify, render_template, request,
                   Response, send_file, url_for, session)
from flask_swagger import swagger
from flask_swagger_ui import get_swaggerui_blueprint
from flask_session import Session
from translatehtml import translate_html
from werkzeug.utils import secure_filename
from werkzeug.exceptions import HTTPException
from werkzeug.http import http_date
from flask_babel import Babel

from libretranslate import scheduler, flood, secret, remove_translated_files, security, storage
from libretranslate.language import detect_languages, improve_translation_formatting
from libretranslate.locales import (_, _lazy, get_available_locales, get_available_locale_codes, gettext_escaped, 
        gettext_html, lazy_swag, get_alternate_locale_links)

from .api_keys import Database, RemoteDatabase
from .suggestions import Database as SuggestionsDatabase


def get_version():
    try:
        with open("VERSION") as f:
            return f.read().strip()
    except:
        return "?"


def get_upload_dir():
    upload_dir = os.path.join(tempfile.gettempdir(), "libretranslate-files-translate")

    if not os.path.isdir(upload_dir):
        os.mkdir(upload_dir)

    return upload_dir


def get_req_api_key():
    if request.is_json:
        json = get_json_dict(request)
        ak = json.get("api_key")
    else:
        ak = request.values.get("api_key")

    return ak

def get_req_secret():
    if request.is_json:
        json = get_json_dict(request)
        ak = json.get("secret")
    else:
        ak = request.values.get("secret")

    return ak


def get_json_dict(request):
    d = request.get_json()
    if not isinstance(d, dict):
        abort(400, description=_("Invalid JSON format"))
    return d


def get_remote_address():
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0].split(",")[0]
    else:
        ip = request.remote_addr or "127.0.0.1"

    return ip


def get_req_limits(default_limit, api_keys_db, multiplier=1):
    req_limit = default_limit

    if api_keys_db:
        api_key = get_req_api_key()

        if api_key:
            db_req_limit = api_keys_db.lookup(api_key)
            if db_req_limit is not None:
                req_limit = db_req_limit * multiplier

    return req_limit


def get_routes_limits(default_req_limit, daily_req_limit, api_keys_db):
    if default_req_limit == -1:
        # TODO: better way?
        default_req_limit = 9999999999999

    def minute_limits():
        return "%s per minute" % get_req_limits(default_req_limit, api_keys_db)

    def daily_limits():
        return "%s per day" % get_req_limits(daily_req_limit, api_keys_db, 1440)

    res = [minute_limits]

    if daily_req_limit > 0:
        res.append(daily_limits)

    return res


def create_app(args):
    from libretranslate.init import boot

    boot(args.load_only, args.update_models)

    from libretranslate.language import load_languages

    SWAGGER_URL = args.url_prefix + "/docs"  # Swagger UI (w/o trailing '/')
    API_URL = args.url_prefix + "/spec"

    bp = Blueprint('Main app', __name__)

    storage.setup(args.shared_storage)

    if not args.disable_files_translation:
        remove_translated_files.setup(get_upload_dir())
    languages = load_languages()
    language_pairs = {}
    for lang in languages:
        language_pairs[lang.code] = sorted([l.to_lang.code for l in lang.translations_from])

    # Map userdefined frontend languages to argos language object.
    if args.frontend_language_source == "auto":
        frontend_argos_language_source = type(
            "obj", (object,), {"code": "auto", "name": _("Auto Detect")}
        )
    else:
        frontend_argos_language_source = next(
            iter([l for l in languages if l.code == args.frontend_language_source]),
            None,
        )
    if frontend_argos_language_source is None:
        frontend_argos_language_source = languages[0]

    
    if len(languages) >= 2:
        language_target_fallback = languages[1]
    else:
        language_target_fallback = languages[0]

    if args.frontend_language_target == "locale":
      def resolve_language_locale():
          loc = get_locale()
          language_target = next(
              iter([l for l in languages if l.code == loc]), None
          )
          if language_target is None:
            language_target = language_target_fallback
          return language_target

      frontend_argos_language_target = resolve_language_locale
    else:
      language_target = next(
          iter([l for l in languages if l.code == args.frontend_language_target]), None
      )
      if language_target is None:
        language_target = language_target_fallback
      frontend_argos_language_target = lambda: language_target

    frontend_argos_supported_files_format = []

    for file_format in get_supported_formats():
        for ff in file_format.supported_file_extensions:
            frontend_argos_supported_files_format.append(ff)

    api_keys_db = None

    if args.req_limit > 0 or args.api_keys or args.daily_req_limit > 0:
        api_keys_db = None
        if args.api_keys:
            if args.api_keys_remote:
                api_keys_db = RemoteDatabase(args.api_keys_remote)
            else:
                api_keys_db = Database(args.api_keys_db_path)

        from flask_limiter import Limiter

        limiter = Limiter(
            key_func=get_remote_address,
            default_limits=get_routes_limits(
                args.req_limit, args.daily_req_limit, api_keys_db
            ),
            storage_uri=args.req_limit_storage,
        )
    else:
        from .no_limiter import Limiter

        limiter = Limiter()

    if not "gunicorn" in os.environ.get("SERVER_SOFTWARE", ""):
      # Gunicorn starts the scheduler in the master process
      scheduler.setup(args)

    flood.setup(args)
    secret.setup(args)

    measure_request = None
    gauge_request = None
    if args.metrics:
      if os.environ.get("PROMETHEUS_MULTIPROC_DIR") is None:
          default_mp_dir = os.path.abspath(os.path.join("db", "prometheus"))
          if not os.path.isdir(default_mp_dir):
            os.mkdir(default_mp_dir)
          os.environ["PROMETHEUS_MULTIPROC_DIR"] = default_mp_dir
        
      from prometheus_client import CONTENT_TYPE_LATEST, Summary, Gauge, CollectorRegistry, multiprocess, generate_latest

      @bp.route("/metrics")
      @limiter.exempt
      def prometheus_metrics():
        if args.metrics_auth_token:
          authorization = request.headers.get('Authorization')
          if authorization != "Bearer " + args.metrics_auth_token:
            abort(401, description=_("Unauthorized"))
        
        registry = CollectorRegistry()
        multiprocess.MultiProcessCollector(registry)
        return Response(generate_latest(registry), mimetype=CONTENT_TYPE_LATEST)

      measure_request = Summary('libretranslate_http_request_duration_seconds', 'Time spent on request', ['endpoint', 'status', 'request_ip', 'api_key'])
      measure_request.labels('/translate', 200, '127.0.0.1', '')

      gauge_request = Gauge('libretranslate_http_requests_in_flight', 'Active requests', ['endpoint', 'request_ip', 'api_key'], multiprocess_mode='livesum')
      gauge_request.labels('/translate', '127.0.0.1', '')

    def access_check(f):
        @wraps(f)
        def func(*a, **kw):
            ip = get_remote_address()

            if flood.is_banned(ip):
                abort(403, description=_("Too many request limits violations"))

            if args.api_keys:
                ak = get_req_api_key()
                if ak and api_keys_db.lookup(ak) is None:
                    abort(
                        403,
                        description=_("Invalid API key"),
                    )
                else:
                  need_key = False
                  key_missing = api_keys_db.lookup(ak) is None
                  
                  if (args.require_api_key_origin
                      and key_missing
                      and not re.match(args.require_api_key_origin, request.headers.get("Origin", ""))
                  ):
                    need_key = True
                  
                  if (args.require_api_key_secret
                    and key_missing
                    and not secret.secret_match(get_req_secret())
                  ):
                    need_key = True

                  if need_key:
                    description = _("Please contact the server operator to get an API key")
                    if args.get_api_key_link:
                        description = _("Visit %(url)s to get an API key", url=args.get_api_key_link)
                    abort(
                        400,
                        description=description,
                    )
            return f(*a, **kw)
        
        if args.metrics:
          @wraps(func)
          def measure_func(*a, **kw):
              start_t = default_timer()
              status = 200
              ip = get_remote_address()
              ak = get_req_api_key() or ''
              g = gauge_request.labels(request.path, ip, ak)
              try:
                g.inc()
                return func(*a, **kw)
              except HTTPException as e:
                status = e.code
                raise e
              finally:
                duration = max(default_timer() - start_t, 0)
                measure_request.labels(request.path, status, ip, ak).observe(duration)
                g.dec()
          return measure_func
        else:
          return func
    
    @bp.errorhandler(400)
    def invalid_api(e):
        return jsonify({"error": str(e.description)}), 400

    @bp.errorhandler(500)
    def server_error(e):
        return jsonify({"error": str(e.description)}), 500

    @bp.errorhandler(429)
    def slow_down_error(e):
        flood.report(get_remote_address())
        return jsonify({"error": _("Slowdown:") + " " + str(e.description)}), 429

    @bp.errorhandler(403)
    def denied(e):
        return jsonify({"error": str(e.description)}), 403

    @bp.route("/")
    @limiter.exempt
    def index():
        if args.disable_web_ui:
            abort(404)

        langcode = request.args.get('lang')
        if langcode and langcode in get_available_locale_codes(not args.debug):
            session.update(preferred_lang=langcode)

        return render_template(
            "index.html",
            gaId=args.ga_id,
            frontendTimeout=args.frontend_timeout,
            api_keys=args.api_keys,
            get_api_key_link=args.get_api_key_link,
            web_version=os.environ.get("LT_WEB") is not None,
            version=get_version(),
            swagger_url=SWAGGER_URL,
            available_locales=[{'code': l['code'], 'name': _lazy(l['name'])} for l in get_available_locales(not args.debug)],
            current_locale=get_locale(),
            alternate_locales=get_alternate_locale_links()
        )

    @bp.route("/js/app.js")
    @limiter.exempt
    def appjs():
      if args.disable_web_ui:
            abort(404)

      response = Response(render_template("app.js.template", 
            url_prefix=args.url_prefix,
            get_api_key_link=args.get_api_key_link,
            api_secret=secret.get_current_secret() if args.require_api_key_secret else ""), content_type='application/javascript; charset=utf-8')
      
      if args.require_api_key_secret:
        response.headers['Last-Modified'] = http_date(datetime.now())
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
      
      return response

    @bp.get("/languages")
    @limiter.exempt
    def langs():
        """
        Retrieve list of supported languages
        ---
        tags:
          - translate
        responses:
          200:
            description: List of languages
            schema:
              id: languages
              type: array
              items:
                type: object
                properties:
                  code:
                    type: string
                    description: Language code
                  name:
                    type: string
                    description: Human-readable language name (in English)
                  targets:
                    type: array
                    items:
                      type: string
                    description: Supported target language codes
        """
        return jsonify([{"code": l.code, "name": _lazy(l.name), "targets": language_pairs.get(l.code, [])} for l in languages])

    # Add cors
    @bp.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add(
            "Access-Control-Allow-Headers", "Authorization, Content-Type"
        )
        response.headers.add("Access-Control-Expose-Headers", "Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Max-Age", 60 * 60 * 24 * 20)
        return response

    @bp.post("/translate")
    @access_check
    def translate():
        """
        Translate text from a language to another
        ---
        tags:
          - translate
        parameters:
          - in: formData
            name: q
            schema:
              oneOf:
                - type: string
                  example: Hello world!
                - type: array
                  example: ['Hello world!']
            required: true
            description: Text(s) to translate
          - in: formData
            name: source
            schema:
              type: string
              example: en
            required: true
            description: Source language code
          - in: formData
            name: target
            schema:
              type: string
              example: es
            required: true
            description: Target language code
          - in: formData
            name: format
            schema:
              type: string
              enum: [text, html]
              default: text
              example: text
            required: false
            description: >
              Format of source text:
               * `text` - Plain text
               * `html` - HTML markup
          - in: formData
            name: api_key
            schema:
              type: string
              example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            required: false
            description: API key
        responses:
          200:
            description: Translated text
            schema:
              id: translate
              type: object
              properties:
                translatedText:
                  oneOf:
                    - type: string
                    - type: array
                  description: Translated text(s)
          400:
            description: Invalid request
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
          500:
            description: Translation error
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
          429:
            description: Slow down
            schema:
              id: error-slow-down
              type: object
              properties:
                error:
                  type: string
                  description: Reason for slow down
          403:
            description: Banned
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
        """
        if request.is_json:
            json = get_json_dict(request)
            q = json.get("q")
            source_lang = json.get("source")
            target_lang = json.get("target")
            text_format = json.get("format")
        else:
            q = request.values.get("q")
            source_lang = request.values.get("source")
            target_lang = request.values.get("target")
            text_format = request.values.get("format")

        if not q:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='q'))
        if not source_lang:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='source'))
        if not target_lang:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='target'))

        batch = isinstance(q, list)

        if batch and args.batch_limit != -1:
            batch_size = len(q)
            if args.batch_limit < batch_size:
                abort(
                    400,
                    description=_("Invalid request: request (%(size)s) exceeds text limit (%(limit)s)", size=batch_size, limit=args.batch_limit),
                )

        if args.char_limit != -1:
            if batch:
                chars = sum([len(text) for text in q])
            else:
                chars = len(q)

            if args.char_limit < chars:
                abort(
                    400,
                    description=_("Invalid request: request (%(size)s) exceeds text limit (%(limit)s)", size=chars, limit=args.char_limit),
                )

        if source_lang == "auto":
            source_langs = []
            if batch:
                auto_detect_texts = q
            else:
                auto_detect_texts = [q]

            overall_candidates = detect_languages(q)

            for text_to_check in auto_detect_texts:
                if len(text_to_check) > 40:
                    candidate_langs = detect_languages(text_to_check)
                else:
                    # Unable to accurately detect languages for short texts
                    candidate_langs = overall_candidates
                source_langs.append(candidate_langs[0])

                if args.debug:
                    print(text_to_check, candidate_langs)
                    print("Auto detected: %s" % candidate_langs[0]["language"])
        else:
            if batch:
                source_langs = [ {"confidence": 100.0, "language": source_lang} for text in q]
            else:
                source_langs = [ {"confidence": 100.0, "language": source_lang} ]

        src_langs = [next(iter([l for l in languages if l.code == source_lang["language"]]), None) for source_lang in source_langs]

        for idx, lang in enumerate(src_langs):
            if lang is None:
                abort(400, description=_("%(lang)s is not supported", lang=source_langs[idx]))

        tgt_lang = next(iter([l for l in languages if l.code == target_lang]), None)

        if tgt_lang is None:
            abort(400, description=_("%(lang)s is not supported",lang=target_lang))

        if not text_format:
            text_format = "text"

        if text_format not in ["text", "html"]:
            abort(400, description=_("%(format)s format is not supported", format=text_format))

        try:
            if batch:
                results = []
                for idx, text in enumerate(q):
                    translator = src_langs[idx].get_translation(tgt_lang)
                    if translator is None:
                        abort(400, description=_("%(tname)s (%(tcode)s) is not available as a target language from %(sname)s (%(scode)s)", tname=_lazy(tgt_lang.name), tcode=tgt_lang.code, sname=_lazy(src_langs[idx].name), scode=src_langs[idx].code))

                    if text_format == "html":
                        translated_text = str(translate_html(translator, text))
                    else:
                        translated_text = improve_translation_formatting(text, translator.translate(text))

                    results.append(unescape(translated_text))
                if source_lang == "auto":
                    return jsonify(
                        {
                            "translatedText": results,
                            "detectedLanguage": source_langs
                        }
                    )
                else:
                    return jsonify(
                          {
                            "translatedText": results
                          }
                    )
            else:
                translator = src_langs[0].get_translation(tgt_lang)
                if translator is None:
                    abort(400, description=_("%(tname)s (%(tcode)s) is not available as a target language from %(sname)s (%(scode)s)", tname=_lazy(tgt_lang.name), tcode=tgt_lang.code, sname=_lazy(src_langs[0].name), scode=src_langs[0].code))

                if text_format == "html":
                    translated_text = str(translate_html(translator, q))
                else:
                    translated_text = improve_translation_formatting(q, translator.translate(q))

                if source_lang == "auto":
                    return jsonify(
                        {
                            "translatedText": unescape(translated_text),
                            "detectedLanguage": source_langs[0]
                        }
                    )
                else:
                    return jsonify(
                        {
                            "translatedText": unescape(translated_text)
                        }
                    )
        except Exception as e:
            abort(500, description=_("Cannot translate text: %(text)s", text=str(e)))

    @bp.post("/translate_file")
    @access_check
    def translate_file():
        """
        Translate file from a language to another
        ---
        tags:
          - translate
        consumes:
         - multipart/form-data
        parameters:
          - in: formData
            name: file
            type: file
            required: true
            description: File to translate
          - in: formData
            name: source
            schema:
              type: string
              example: en
            required: true
            description: Source language code
          - in: formData
            name: target
            schema:
              type: string
              example: es
            required: true
            description: Target language code
          - in: formData
            name: api_key
            schema:
              type: string
              example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            required: false
            description: API key
        responses:
          200:
            description: Translated file
            schema:
              id: translate-file
              type: object
              properties:
                translatedFileUrl:
                  type: string
                  description: Translated file url
          400:
            description: Invalid request
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
          500:
            description: Translation error
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
          429:
            description: Slow down
            schema:
              id: error-slow-down
              type: object
              properties:
                error:
                  type: string
                  description: Reason for slow down
          403:
            description: Banned
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
        """
        if args.disable_files_translation:
            abort(403, description=_("Files translation are disabled on this server."))

        source_lang = request.form.get("source")
        target_lang = request.form.get("target")
        file = request.files['file']

        if not file:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='file'))
        if not source_lang:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='source'))
        if not target_lang:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='target'))

        if file.filename == '':
            abort(400, description=_("Invalid request: empty file"))

        if os.path.splitext(file.filename)[1] not in frontend_argos_supported_files_format:
            abort(400, description=_("Invalid request: file format not supported"))

        source_langs = [source_lang]
        src_langs = [next(iter([l for l in languages if l.code == source_lang]), None) for source_lang in source_langs]

        for idx, lang in enumerate(src_langs):
            if lang is None:
                abort(400, description=_("%(lang)s is not supported", lang=source_langs[idx]))

        tgt_lang = next(iter([l for l in languages if l.code == target_lang]), None)

        if tgt_lang is None:
            abort(400, description=_("%(lang)s is not supported", lang=target_lang))

        try:
            filename = str(uuid.uuid4()) + '.' + secure_filename(file.filename)
            filepath = os.path.join(get_upload_dir(), filename)

            file.save(filepath)

            translated_file_path = argostranslatefiles.translate_file(src_langs[0].get_translation(tgt_lang), filepath)
            translated_filename = os.path.basename(translated_file_path)

            return jsonify(
                {
                    "translatedFileUrl": url_for('Main app.download_file', filename=translated_filename, _external=True)
                }
            )
        except Exception as e:
            abort(500, description=e)

    @bp.get("/download_file/<string:filename>")
    def download_file(filename: str):
        """
        Download a translated file
        """
        if args.disable_files_translation:
            abort(400, description=_("Files translation are disabled on this server."))

        filepath = os.path.join(get_upload_dir(), filename)
        try:
            checked_filepath = security.path_traversal_check(filepath, get_upload_dir())
            if os.path.isfile(checked_filepath):
                filepath = checked_filepath
        except security.SuspiciousFileOperation:
            abort(400, description=_("Invalid filename"))

        return_data = io.BytesIO()
        with open(filepath, 'rb') as fo:
            return_data.write(fo.read())
        return_data.seek(0)

        download_filename = filename.split('.')
        download_filename.pop(0)
        download_filename = '.'.join(download_filename)

        return send_file(return_data, as_attachment=True, download_name=download_filename)

    @bp.post("/detect")
    @access_check
    def detect():
        """
        Detect the language of a single text
        ---
        tags:
          - translate
        parameters:
          - in: formData
            name: q
            schema:
              type: string
              example: Hello world!
            required: true
            description: Text to detect
          - in: formData
            name: api_key
            schema:
              type: string
              example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            required: false
            description: API key
        responses:
          200:
            description: Detections
            schema:
              id: detections
              type: array
              items:
                type: object
                properties:
                  confidence:
                    type: number
                    format: float
                    minimum: 0
                    maximum: 1
                    description: Confidence value
                    example: 0.6
                  language:
                    type: string
                    description: Language code
                    example: en
          400:
            description: Invalid request
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
          500:
            description: Detection error
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
          429:
            description: Slow down
            schema:
              id: error-slow-down
              type: object
              properties:
                error:
                  type: string
                  description: Reason for slow down
          403:
            description: Banned
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
        """
        if request.is_json:
            json = get_json_dict(request)
            q = json.get("q")
        else:
            q = request.values.get("q")

        if not q:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='q'))

        return jsonify(detect_languages(q))

    @bp.route("/frontend/settings")
    @limiter.exempt
    def frontend_settings():
        """
        Retrieve frontend specific settings
        ---
        tags:
          - frontend
        responses:
          200:
            description: frontend settings
            schema:
              id: frontend-settings
              type: object
              properties:
                charLimit:
                  type: integer
                  description: Character input limit for this language (-1 indicates no limit)
                frontendTimeout:
                  type: integer
                  description: Frontend translation timeout
                apiKeys:
                  type: boolean
                  description: Whether the API key database is enabled.
                keyRequired:
                  type: boolean
                  description: Whether an API key is required.
                suggestions:
                  type: boolean
                  description: Whether submitting suggestions is enabled.
                supportedFilesFormat:
                  type: array
                  items:
                    type: string
                  description: Supported files format
                language:
                  type: object
                  properties:
                    source:
                      type: object
                      properties:
                        code:
                          type: string
                          description: Language code
                        name:
                          type: string
                          description: Human-readable language name (in English)
                    target:
                      type: object
                      properties:
                        code:
                          type: string
                          description: Language code
                        name:
                          type: string
                          description: Human-readable language name (in English)
        """
        target_lang = frontend_argos_language_target()

        return jsonify(
            {
                "charLimit": args.char_limit,
                "frontendTimeout": args.frontend_timeout,
                "apiKeys": args.api_keys,
                "keyRequired": bool(args.api_keys and args.require_api_key_origin),
                "suggestions": args.suggestions,
                "filesTranslation": not args.disable_files_translation,
                "supportedFilesFormat": [] if args.disable_files_translation else frontend_argos_supported_files_format,
                "language": {
                    "source": {
                        "code": frontend_argos_language_source.code,
                        "name": _lazy(frontend_argos_language_source.name),
                    },
                    "target": {
                        "code": target_lang.code,
                        "name": _lazy(target_lang.name),
                    },
                },
            }
        )

    @bp.post("/suggest")
    @access_check
    def suggest():
        """
        Submit a suggestion to improve a translation
        ---
        tags:
          - feedback
        parameters:
          - in: formData
            name: q
            schema:
              type: string
              example: Hello world!
            required: true
            description: Original text
          - in: formData
            name: s
            schema:
              type: string
              example: ¡Hola mundo!
            required: true
            description: Suggested translation
          - in: formData
            name: source
            schema:
              type: string
              example: en
            required: true
            description: Language of original text
          - in: formData
            name: target
            schema:
              type: string
              example: es
            required: true
            description: Language of suggested translation
        responses:
          200:
            description: Success
            schema:
              id: suggest-response
              type: object
              properties:
                success:
                  type: boolean
                  description: Whether submission was successful
          403:
            description: Not authorized
            schema:
              id: error-response
              type: object
              properties:
                error:
                  type: string
                  description: Error message
        """
        if not args.suggestions:
            abort(403, description=_("Suggestions are disabled on this server."))

        q = request.values.get("q")
        s = request.values.get("s")
        source_lang = request.values.get("source")
        target_lang = request.values.get("target")

        if not q:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='q'))
        if not s:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='s'))
        if not source_lang:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='source'))
        if not target_lang:
            abort(400, description=_("Invalid request: missing %(name)s parameter", name='target'))

        SuggestionsDatabase().add(q, s, source_lang, target_lang)
        return jsonify({"success": True})

    app = Flask(__name__)

    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = os.path.join("db", "sessions")
    Session(app)

    if args.debug:
        app.config["TEMPLATES_AUTO_RELOAD"] = True
    if args.url_prefix:
        app.register_blueprint(bp, url_prefix=args.url_prefix)
    else:
        app.register_blueprint(bp)
    
    limiter.init_app(app)

    swag = swagger(app)
    swag["info"]["version"] = get_version()
    swag["info"]["title"] = "LibreTranslate"

    @app.route(API_URL)
    @limiter.exempt
    def spec():
        return jsonify(lazy_swag(swag))

    app.config["BABEL_TRANSLATION_DIRECTORIES"] = 'locales'

    def get_locale():
        override_lang = request.headers.get('X-Override-Accept-Language')
        if override_lang and override_lang in get_available_locale_codes():
            return override_lang
        return session.get('preferred_lang', request.accept_languages.best_match(get_available_locale_codes()))

    babel = Babel(app, locale_selector=get_locale)

    app.jinja_env.globals.update(_e=gettext_escaped, _h=gettext_html)

    # Call factory function to create our blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL)
    if args.url_prefix:
        app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
    else:
        app.register_blueprint(swaggerui_blueprint)

    return app
