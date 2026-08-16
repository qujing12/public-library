function renderBooks(filter, search) {
    let filtered = booksData;
    if (filter && filter !== "all") filtered = filtered.filter(b => b.category === filter);
    if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(b => b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s) || b.tags.some(t => t.toLowerCase().includes(s)));
    }
    const grid = document.getElementById("booksGrid");
    const empty = document.getElementById("emptyState");
    if (filtered.length === 0) { grid.innerHTML = ""; empty.style.display = "block"; return; }
    empty.style.display = "none";
    grid.innerHTML = filtered.map(book => {
        const tagsHtml = book.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
        const stars = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);
        return `<div class="book-card" onclick="openModal('${book.title}')"><div class="book-header"><div class="book-cover">📖</div><div class="book-info"><h3>${book.title}</h3><span class="author">${book.author}</span></div></div><p class="book-desc">${book.desc}</p><div class="book-tags">${tagsHtml}</div><div class="book-rating">${stars}</div></div>`;
    }).join("");
}
function buildFilterTabs() {
    const categories = [...new Set(booksData.map(b => b.categoryLabel))];
    const container = document.getElementById("filterTabs");
    container.innerHTML = `<button class="filter-btn active" data-filter="all">全部</button>` + categories.map(c => `<button class="filter-btn" data-filter="${c}">${c}</button>`).join("");
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
            renderBooks(activeBtn ? activeBtn.dataset.filter : "all", input.value.trim());
        }, 200);
    });
}
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
    dlBtn.onclick = function(e) { e.preventDefault(); window.open(book.downloadUrl, "_blank"); };
    document.getElementById("bookModal").classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeModal() {
    document.getElementById("bookModal").classList.remove("active");
    document.body.style.overflow = "";
}
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("bookModal").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeModal(); });
function animateNumbers() {
    const animate = (id, target) => {
        const el = document.getElementById(id);
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => { current += step; if (current >= target) { current = target; clearInterval(timer); } el.textContent = current; }, 30);
    };
    animate("bookCount", booksData.length);
    animate("categoryCount", [...new Set(booksData.map(b => b.category))].length);
}
function initMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");
    menuBtn.addEventListener("click", () => { navLinks.classList.toggle("active"); menuBtn.textContent = navLinks.classList.contains("active") ? "✕" : "☰"; });
}
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) { target.scrollIntoView({ behavior: "smooth" }); document.querySelector(".nav-links").classList.remove("active"); }
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    renderBooks();
    buildFilterTabs();
    initSearch();
    initMobileMenu();
    initSmoothScroll();
    animateNumbers();
});
