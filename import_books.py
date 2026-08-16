import csv, json
from pathlib import Path

WEBSITE_DIR = Path(__file__).parent
DATA_LOCAL = WEBSITE_DIR / 'js' / 'data_local.json'
DATA_JSON = WEBSITE_DIR / 'js' / 'data.json'
MAIN_JS = WEBSITE_DIR / 'js' / 'main.js'
IMPORT_CSV = WEBSITE_DIR / 'books_import.csv'
CATEGORIES = {'技术': 'tech', '商业': 'business', '心理': 'psychology', '文学': 'literature', '历史': 'history', '科学': 'science', '其他': 'other'}

JS_FUNCTIONS = open(Path(__file__).parent / 'js_functions.js', encoding='utf-8').read()

def main():
    print('Reading', IMPORT_CSV)
    if not IMPORT_CSV.exists():
        print('Error: books_import.csv not found')
        return
    with open(IMPORT_CSV, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        books = []
        for row in reader:
            if not row.get('书名') or row['书名'].strip() == '':
                continue
            tags_raw = row.get('标签', '')
            tags = [t.strip() for t in tags_raw.split(',') if t.strip()] if tags_raw else []
            try:
                rating = max(1, min(5, int(row.get('评分', 3))))
            except:
                rating = 3
            cat_label = row.get('分类', '其他').strip()
            cat_code = CATEGORIES.get(cat_label, 'other')
            books.append({
                'title': row['书名'].strip(),
                'author': row.get('作者', '').strip(),
                'desc': row.get('简介', '').strip(),
                'category': cat_code,
                'categoryLabel': cat_label,
                'tags': tags,
                'rating': rating,
                'downloadUrl': row.get('下载链接', '#').strip(),
                'format': (row.get('格式') or 'PDF').strip() or 'PDF',
                'size': (row.get('大小') or '未知').strip() or '未知'
            })
    with open(DATA_LOCAL, 'w', encoding='utf-8') as f:
        json.dump({'books': books, 'tutorials': []}, f, ensure_ascii=False, indent=2)
    with open(DATA_JSON, 'w', encoding='utf-8') as f:
        json.dump({'books': books, 'tutorials': []}, f, ensure_ascii=False, indent=2)
    print('Wrote data files, total', len(books), 'books')
    lines = []
    for b in books:
        tags = json.dumps(b['tags'], ensure_ascii=False)
        line = '    {title: ' + repr(b['title']) + ', author: ' + repr(b['author']) + ', desc: ' + repr(b['desc']) + ', category: ' + repr(b['category']) + ', categoryLabel: ' + repr(b['categoryLabel']) + ', tags: ' + tags + ', rating: ' + str(b['rating']) + ', downloadUrl: ' + repr(b['downloadUrl']) + ', format: ' + repr(b['format']) + ', size: ' + repr(b['size']) + '},'
        lines.append(line)
    js = 'const booksData = [' + chr(10) + chr(10).join(lines) + chr(10) + '];' + chr(10) + JS_FUNCTIONS
    with open(MAIN_JS, 'w', encoding='utf-8') as f:
        f.write(js)
    print('Wrote main.js')
    print('Done!')

if __name__ == '__main__':
    main()
