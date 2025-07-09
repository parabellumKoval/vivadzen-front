import os
import re

def update_scss_files(root_dir):
    # Шаблоны для удаления импортов
    import_patterns = [
        r"@import\s*['\"]\./assets/scss/vars['\"];",
        r"@import\s*['\"]\./assets/scss/mixins['\"];"
    ]
    
    # Шаблоны для переименования миксинов
    mixin_replacements = {
        r"@include\s+_desktop": "@include desktop",
        r"@include\s+_tablet": "@include tablet",
        r"@include\s+_ld": "@include ld",
        r"@include\s+_xld": "@include xld"
    }

    # Рекурсивный обход всех файлов
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.scss'):
                file_path = os.path.join(root, file)
                try:
                    # Чтение содержимого файла
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Удаление импортов
                    for pattern in import_patterns:
                        content = re.sub(pattern, '', content, flags=re.MULTILINE)

                    # Переименование миксинов
                    for old, new in mixin_replacements.items():
                        content = re.sub(old, new, content)

                    # Удаление пустых строк после удаления импортов
                    content = re.sub(r'\n\s*\n', '\n', content)

                    # Запись обновленного содержимого
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content.strip())

                    print(f"Обработан файл: {file_path}")

                except Exception as e:
                    print(f"Ошибка при обработке файла {file_path}: {str(e)}")

if __name__ == "__main__":
    # Укажите путь к корневой папке проекта
    project_root = "./"  # Текущая директория, измените при необходимости
    update_scss_files(project_root)
    print("Обработка всех SCSS файлов завершена.")