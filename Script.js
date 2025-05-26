const accesskey = "fekAlFBbAVnEqtjrdQkQM2LlLNT5-RUNp0Looiad7sc";
const navbarForm = document.getElementById("search-form");
const navbarInput = document.getElementById("search-box");
const centerForm = document.getElementById("search-form-center");
const centerInput = document.getElementById("search-box-center");
const Result = document.getElementById("search-result");
const More = document.getElementById("more");
const searchWrapper = document.getElementById("search-wrapper");

let keyword = "";
let page = 1;

const modal = document.createElement("div");
modal.className = "modal";
modal.innerHTML = `
  <div class="modal-content">
    <div class="modal-controls">
      <button class="back-btn">⬅</button>
      <a href="#" class="download-btn" target="_blank" title="Download">⬇</a>
    </div>
    <img src="" alt="Preview" class="modal-img">
  </div>
`;
document.body.appendChild(modal);

const modalImg = modal.querySelector(".modal-img");
const modalDownload = modal.querySelector(".download-btn");
const modalBack = modal.querySelector(".back-btn");

modalBack.addEventListener("click", () => {
    modal.style.display = "none";
    modalImg.src = "";
});

const loader = document.createElement("div");
loader.className = "loader";
loader.style.display = "none";
loader.innerHTML = `<div class="spinner"></div>`;
document.body.appendChild(loader);

function toggleLoader(show) {
    loader.style.display = show ? "flex" : "none";
}

async function search(inputSource) {
    keyword = inputSource.value.trim();
    if (!keyword) return;

    // Transition UI
    centerForm.classList.add("hidden");
    searchWrapper.style.display = "none";
    navbarForm.classList.remove("hidden");
    navbarInput.value = keyword;

    toggleLoader(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accesskey}&per_page=30`;
    const response = await fetch(url);
    const data = await response.json();
    toggleLoader(false);

    if (page === 1) Result.innerHTML = "";

    const results = data.results;
    results.forEach(result => {
        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description || "Image";

        const link = document.createElement("a");
        link.href = result.links.html;
        link.target = "_blank";
        link.appendChild(image);
        link.addEventListener("click", e => {
            e.preventDefault();
            modal.style.display = "flex";
            modalImg.src = result.urls.regular;
            modalImg.style.maxHeight = "90vh";
            modalImg.style.width = "auto";
            modalImg.style.maxWidth = "90vw";
            modalDownload.href = result.links.download;
        });

        Result.appendChild(link);
    });

    More.style.display = "block";
}

navbarForm.addEventListener("submit", e => {
    e.preventDefault();
    page = 1;
    search(navbarInput);
});

centerForm.addEventListener("submit", e => {
    e.preventDefault();
    page = 1;
    search(centerInput);
});

More.addEventListener("click", () => {
    page++;
    search(navbarInput);
});

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        page++;
        search(navbarInput);
    }
});