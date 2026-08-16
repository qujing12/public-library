const booksData = [
    {title: '总论', author: 'Randal E. Bryant', desc: '计算机科学的经典之作，涵盖位级表示、处理器架构、存储器层次结构、链接、异常控制流、虚拟内存、系统级I/O等核心内容。', category: 'tech', categoryLabel: '技术', tags: ["系统", "底层", "经典"], rating: 5, downloadUrl: 'https://pan.quark.cn/s/f62c76716bef', format: 'PDF', size: '约45MB'},
    {title: '设计模式', author: 'Erich Gamma', desc: '面向对象设计的经典指南，总结了23种经典设计模式，是软件工程师必读之作。', category: 'tech', categoryLabel: '技术', tags: ["设计模式", "OOP", "架构"], rating: 5, downloadUrl: '#', format: 'PDF', size: '约12MB'},
    {title: '思考，快与慢', author: 'Daniel Kahneman', desc: '诺贝尔奖得主揭示人类决策的两套系统，探讨直觉与理性如何在日常生活中发挥作用。', category: 'psychology', categoryLabel: '心理', tags: ["心理学", "决策", "思维"], rating: 4, downloadUrl: '#', format: 'PDF', size: '约8MB'},
    {title: '三体', author: '刘慈欣', desc: '中国科幻的里程碑之作，讲述人类文明与三体文明的博弈，想象力震撼人心。', category: 'literature', categoryLabel: '文学', tags: ["科幻", "文学", "中国"], rating: 5, downloadUrl: '#', format: 'PDF', size: '约3MB'},
    {title: '算法导论', author: 'Thomas H. Cormen', desc: '算法领域的经典教材，全面系统地介绍算法设计与分析，被誉为算法圣经。', category: 'tech', categoryLabel: '技术', tags: ["算法", "数据结构", "经典"], rating: 5, downloadUrl: '#', format: 'PDF', size: '约65MB'},
    {title: '被讨厌的勇气', author: '岸见一郎', desc: '阿德勒心理学的入门经典，以对话形式阐述自我接纳与自由人生的理念。', category: 'psychology', categoryLabel: '心理', tags: ["心理学", "阿德勒", "自我"], rating: 4, downloadUrl: '#', format: 'PDF', size: '约5MB'},
    {title: '创业维艰', author: 'Ben Horowitz', desc: '硅谷投资人分享创业实战经验，不灌鸡汤，只讲真实残酷的创业历程。', category: 'business', categoryLabel: '商业', tags: ["创业", "管理", "实战"], rating: 4, downloadUrl: '#', format: 'PDF', size: '约6MB'},
    {title: '原则', author: 'Ray Dalio', desc: '桥水基金创始人的生活原则，分享他如何建立原则体系来应对人生挑战。', category: 'business', categoryLabel: '商业', tags: ["管理", "决策", "人生"], rating: 4, downloadUrl: '#', format: 'PDF', size: '约10MB'},
];

// ====== 渲染函数 ======

function renderBooks(filter, search) {
    let filtered = booksData;
    if (filter && filter !== "all") {
        filtered = filtered.filter(b => b.category === filter);
    }
    if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(b =>
            b.title.toLowerCase().includes(s) ||
            b.author.toLowerCase().includes(s) ||
            b.tags.some(t => t.toLowerCase().includes(s))
        );
    }
    const grid = document.getElementById("booksGrid");
    const empty = document.getElementById("emptyState");
    if (filtered.length === 0) {
        grid.innerHTML = "";
        empty.style.display = "block";
        return;
    }
    empty.style.display = "none";
    grid.innerHTML = filtered.map(book => {
        const tagsHtml = book.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
        const stars = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);
        return `<div class="book-card" onclick="openModal('${book.title}')">
            <div class="book-header">
                <div class="book-cover">📖</div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <span class="author">${book.author}</span>
                </div>
            </div>
            <p class="book-desc">${book.desc}</p>
            <div class="book-tags">${tagsHtml}</div>
            <div class="book-rating">${stars}</div>
        </div>`;
    }).join("");
}

function buildFilterTabs() {
    const categories = [...new Set(booksData.map(b => b.categoryLabel))];
    const container = document.getElementById("filterTabs");
    container.innerHTML = `<button class="filter-btn active" data-filter="all">全部</button>` +
        categories.map(c => `<button class="filter-btn" data-filter="${c}">${c}</button>`).join("");
    container.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderBooks(btn.dataset.filter, document.getElementById("searchInput").value.trim());
        });
    });
}

function initSearch() {
    const input = document.getElementById("searchInput");
    let timer;
    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const activeBtn = document.querySelector("#filterTabs .filter-btn.active");
            const filter = activeBtn ? activeBtn.dataset.filter : "all";
            renderBooks(filter, input.value.trim());
        }, 200);
    });
}

// ====== 弹窗 ======

function openModal(title) {
    const book = booksData.find(b => b.title === title);
    if (!book) return;
    document.getElementById("modalTitle").textContent = book.title;
    document.getElementById("modalAuthor").textContent = "作者：" + book.author;
    document.getElementById("modalDesc").textContent = book.desc;
    document.getElementById("modalCategory").textContent = "分类：" + book.categoryLabel;
    document.getElementById("modalFormat").textContent = "格式：" + book.format;
    document.getElementById("modalSize").textContent = "大小：" + book.size;
    document.getElementById("modalTags").innerHTML = book.tags.map(t => `<span class="tag">${t}</span>`).join("");
    document.getElementById("modalRating").textContent = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);
    const dlBtn = document.getElementById("modalDownload");
    dlBtn.href = book.downloadUrl;
    dlBtn.onclick = function(e) {
        e.preventDefault();
        window.open(book.downloadUrl, "_blank");
    };
    document.getElementById("bookModal").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("bookModal").classList.remove("active");
    document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("bookModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// ====== 动画 ======

function animateNumbers() {
    const animate = (id, target) => {
        const el = document.getElementById(id);
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current;
        }, 30);
    };
    animate("bookCount", booksData.length);
    animate("categoryCount", [...new Set(booksData.map(b => b.category))].length);
}

// ====== 移动端菜单 ======

function initMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuBtn.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
    });
}

// ====== 平滑滚动 ======

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
                document.querySelector(".nav-links").classList.remove("active");
            }
        });
    });
}

// ====== 初始化 ======

document.addEventListener("DOMContentLoaded", () => {
    renderBooks();
    buildFilterTabs();
    initSearch();
    initMobileMenu();
    initSmoothScroll();
    animateNumbers();
});
