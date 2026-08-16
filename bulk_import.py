import csv
import json
from pathlib import Path

WEBSITE_DIR = Path(__file__).parent
DATA_LOCAL = WEBSITE_DIR / "js" / "data_local.json"
DATA_JSON = WEBSITE_DIR / "js" / "data.json"
MAIN_JS = WEBSITE_DIR / "js" / "main.js"
IMPORT_EXAMPLE = WEBSITE_DIR / "books_import_template.csv"

def main():
    template = "书名,作者,简介,分类,标签,评分,下载链接,格式,大小\n"
    template += "深入理解计算机系统,Randal E. Bryant,计算机科学经典之作，涵盖位级表示、处理器架构等核心内容。,技术,系统,底层,经典,5,https://pan.quark.cn/s/xxxxx,PDF,约45MB\n"
    template += "三体,刘慈欣,中国科幻的里程碑之作。,文学,科幻,文学,中国,5,https://pan.quark.cn/s/xxxxx,PDF,约3MB\n"
    IMPORT_EXAMPLE.write_text(template, encoding="utf-8")
    print("模板已生成:", IMPORT_EXAMPLE)
    print("请用 Excel 打开此文件，填入你的书籍信息")
    print("每行填一本书，下载链接填在 下载链接 列")
    print("填好后保存，运行 import_books.py 导入")

if __name__ == "__main__":
    main()
