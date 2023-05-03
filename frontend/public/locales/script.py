import json

def read_translation(lang):
    with open(f"{lang}/translation.json", "r", encoding='UTF-8') as f:
        return json.load(f)

def write_translations(langs):
    translations = {lang: read_translation(lang) for lang in langs}
    keys = translations[langs[0]].keys()

    with open(f"{'-'.join(langs)}-translations.txt", "w", encoding='UTF-8') as f:
        for key in keys:
            for lang in langs:
                f.write(f"{translations[lang][key]}\n")
            
            f.write("\n")

langs = ["en", "se"]
write_translations(langs)
