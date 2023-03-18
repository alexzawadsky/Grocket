# Generated by Django 4.1.7 on 2023-03-18 11:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0002_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='status',
            old_name='title_en_us',
            new_name='title_af',
        ),
        migrations.AddField(
            model_name='status',
            name='title_ar',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ar_dz',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ast',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_az',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_be',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_bg',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_bn',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_br',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_bs',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ca',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_cs',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_cy',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_da',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_de',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_dsb',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_el',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_en',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_en_au',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_en_gb',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_eo',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_es',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_es_ar',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_es_co',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_es_mx',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_es_ni',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_es_ve',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_et',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_eu',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_fa',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_fi',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_fr',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_fy',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ga',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_gd',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_gl',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_he',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_hi',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_hr',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_hsb',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_hu',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_hy',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ia',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ig',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ind',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_io',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_is',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_it',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ja',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ka',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_kab',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_kk',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_km',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_kn',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ko',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ky',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_lb',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_lt',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_lv',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_mk',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ml',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_mn',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_mr',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ms',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_my',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_nb',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ne',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_nn',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_os',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_pa',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_pl',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_pt',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_pt_br',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ro',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_sk',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_sl',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_sq',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_sr',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_sr_latn',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_sv',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_sw',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ta',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_te',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_tg',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_th',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_tk',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_tr',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_tt',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_udm',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_uk',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_ur',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_uz',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_vi',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_zh_hans',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
        migrations.AddField(
            model_name='status',
            name='title_zh_hant',
            field=models.CharField(max_length=50, null=True, verbose_name='title'),
        ),
    ]
