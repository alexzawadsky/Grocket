import json
import requests
import io

languages = ['zh','fr', 'de', 'nl', 'se', 'ua', 'it', 'pl']
result_arr = []

with open('./data/json/categories.json', encoding='UTF-8') as f:
    categories = json.load(f)

try:
    with open('./translated_categories.json', mode='r', encoding='UTF-8') as f:
        translated_categories = json.load(f)
except:
    translated_categories = []
        

for key, category in enumerate(categories):
    translated_category = {
        'pk': category.get('pk'),
        'title_en': category.get('fields').get('title_en'),
        'title_ru': category.get('fields').get('title_ru')
        }
    
    category_title= category.get('fields').get('title')
    print(f'({key + 1}/{len(categories)}) {key / len(categories)}% - Translating {category_title}')

    for lang_code in languages:
        if [i for i in translated_categories if i.get('pk') == category.get('pk')]:
            trans = [i for i in translated_categories if i.get('pk') == category.get('pk')][0].get(f'title_{lang_code}')
            if trans:
                translated_category.update({f'title_{lang_code}': trans})
                print(f'Skip {category_title} {lang_code}, translation already exists')
                continue

        print(lang_code)

        res = requests.post(
                url='https://translate.argosopentech.com/translate',
                headers={'Content-Type': 'application/json'},
                data=json.dumps({
                    'q': category_title,
                    'source': 'en',
                    'target': lang_code
                })
            )
        
        res_json = res.json()
        translated_category.update({f'title_{lang_code}': res_json.get('translatedText')})
        print(res_json)
    result_arr.append(translated_category)
    with open('translated_categories.json', mode='w', encoding='UTF-8') as f:
        f.write(json.dumps(result_arr, indent='    '))

print('Translation finished!')
