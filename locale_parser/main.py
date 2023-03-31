import json


with open("translations/en_translation.json", "r", encoding="utf8") as file:
    en_data = json.load(file)

with open("translations/ru_translation.json", "r", encoding="utf8") as file:
    ru_data = json.load(file)

with open("translations/ua_translation.json", "r", encoding="utf8") as file:
    ua_data = json.load(file)


print(len(en_data))
print(len(ru_data))
print(len(ua_data))


with open('translations.txt', 'w', encoding="utf8") as txt_file:
    for field in en_data:
        txt_file.write(f'{en_data[field]}\n')
        txt_file.write(f'{ru_data[field]}\n')
        txt_file.write(f'{ua_data[field]}\n\n')

# en_fields = []
# for en_field in en_data:
#     en_fields.append(en_field)

# ru_fields = []
# for ru_field in ru_data:
#     ru_fields.append(ru_field)

# ua_fields = []
# for ua_field in ua_data:
#     ua_fields.append(ua_field)


# list_c = []
# for template in ru_fields:
#     if template not in en_fields:
#         list_c.append(template)

# print(list_c)