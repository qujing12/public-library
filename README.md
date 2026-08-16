# 我的书架 - 电子书下载站

个人电子书分享网站，纯静态，可免费托管在 GitHub Pages。

## 功能

- 书籍列表展示，支持分类筛选和搜索
- 点击卡片弹出详情弹窗，含下载按钮
- 响应式设计，适配手机端
- 数据可本地维护或同步 Google Sheets

## 快速开始

### 本地运行

直接用浏览器打开 `index.html` 即可：

```bash
cd D:/codexwangye/personal-website
# 双击 index.html，或使用 VS Code Live Server
```

### 添加/修改书籍

编辑 `js/data_local.json`，按以下格式添加：

```json
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
```

然后运行同步脚本：

```bash
python sync_data.py
```

### 分类代码对照

| code | 中文 |
|------|------|
| tech | 技术 |
| business | 商业 |
| psychology | 心理 |
| literature | 文学 |
| history | 历史 |
| other | 其他 |

## 部署到 GitHub Pages

1. 将项目推送到 GitHub 仓库
2. 仓库设置 → Pages → Source 选 `main` 分支
3. 等待部署完成，访问 `https://用户名.github.io/仓库名`

## 数据同步（可选）

### Google Sheets 方式

1. 创建 Google Sheets，列顺序：书名 | 作者 | 简介 | 分类 | 标签(逗号分隔) | 评分 | 下载链接
2. 文件 → 分享 → 公开到网络
3. 获取表格 ID（URL 中 `/d/` 和 `/edit` 之间的部分）
4. 运行同步：

```bash
export GOOGLE_SHEETS_ID="你的表格ID"
python sync_data.py
```

## 文件结构

```
personal-website/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式
├── js/
│   ├── main.js         # 前端逻辑
│   ├── data.json       # 生成后的数据（自动生成）
│   └── data_local.json # 手动维护的数据源
├── sync_data.py        # 数据同步脚本
└── .github/workflows/
    └── deploy.yml      # GitHub Pages 自动部署
```
