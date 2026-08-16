"""
sync_data.py - 从 Google Sheets 同步数据到 data.json

使用前请设置环境变量：
  export GOOGLE_SHEETS_ID="你的表格ID"
  export GOOGLE_SHEETS_RANGE="Sheet1!A2:G100"

运行方式：
  python sync_data.py
"""

import json
import os
import sys
from pathlib import Path

# ===== 配置 =====
WEBSITE_DIR = Path(__file__).parent
DATA_FILE = WEBSITE_DIR / "js" / "data.json"

# 本地数据文件路径（可手动维护的备选方案）
LOCAL_DATA = WEBSITE_DIR / "js" / "data_local.json"


def read_local_data():
    """读取本地 data_local.json 作为数据源（无需 API）"""
    if not LOCAL_DATA.exists():
        print("警告：data_local.json 不存在，请手动编辑或运行 sync_from_sheets()")
        return None

    with open(LOCAL_DATA, "r", encoding="utf-8") as f:
        return json.load(f)


def sync_from_sheets():
    """从 Google Sheets 同步数据（需要 google-api-python-client）"""
    try:
        from google.oauth2.credentials import Credentials
        from googleapiclient.discovery import build
    except ImportError:
        print("请先安装：pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib")
        return None

    sheets_id = os.environ.get("GOOGLE_SHEETS_ID")
    if not sheets_id:
        print("错误：请设置环境变量 GOOGLE_SHEETS_ID")
        return None

    range_name = os.environ.get("GOOGLE_SHEETS_RANGE", "Sheet1!A2:G100")

    # 简化版：使用公开表格的 CSV 导出
    url = f"https://docs.google.com/spreadsheets/d/{sheets_id}/gviz/tq?tqx=out:csv&sheet=Sheet1"
    import urllib.request
    with urllib.request.urlopen(url) as resp:
        csv_data = resp.read().decode("utf-8-sig")

    import csv
    from io import StringIO
    reader = csv.reader(StringIO(csv_data))
    rows = list(reader)

    books = []
    for row in rows:
        if len(row) < 3:
            continue
        books.append({
            "title": row[0].strip(),
            "author": row[1].strip(),
            "desc": row[2].strip(),
            "category": row[3].strip() if len(row) > 3 else "",
            "categoryLabel": row[3].strip() if len(row) > 3 else "",
            "tags": row[4].strip().split(",") if len(row) > 4 else [],
            "rating": int(row[5]) if len(row) > 5 and row[5].strip() else 3,
            "downloadUrl": row[6].strip() if len(row) > 6 else "#",
            "format": "PDF",
            "size": "未知"
        })

    return {"books": books, "tutorials": []}


def write_data(data):
    """将数据写入 data.json"""
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ 已写入 {DATA_FILE}，共 {len(data.get('books', []))} 本书")


def main():
    print("=" * 40)
    print("电子书数据同步工具")
    print("=" * 40)

    # 优先尝试本地文件
    local = read_local_data()
    if local:
        print("使用本地 data_local.json")
        write_data(local)
        return

    # 其次尝试 Google Sheets
    if "GOOGLE_SHEETS_ID" in os.environ:
        print("检测到 GOOGLE_SHEETS_ID，尝试从 Google Sheets 同步...")
        sheets = sync_from_sheets()
        if sheets:
            write_data(sheets)
            return

    # 输出使用说明
    print("""
使用方法：

方案1 - 本地维护（推荐小白使用）：
  编辑 js/data_local.json，格式如下：
  {
    "books": [
      {
        "title": "书名",
        "author": "作者",
        "desc": "简介",
        "category": "tech",
        "categoryLabel": "技术",
        "tags": ["标签1", "标签2"],
        "rating": 5,
        "downloadUrl": "https://你的网盘链接",
        "format": "PDF",
        "size": "约10MB"
      }
    ],
    "tutorials": []
  }
  然后运行：python sync_data.py

方案2 - Google Sheets 同步：
  pip install google-api-python-client
  export GOOGLE_SHEETS_ID="你的表格ID"
  python sync_data.py

表格列顺序：书名 | 作者 | 简介 | 分类 | 标签(逗号分隔) | 评分 | 下载链接
""")


if __name__ == "__main__":
    main()
