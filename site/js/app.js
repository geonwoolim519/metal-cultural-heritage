(function () {
  const METAL_LABEL = {
    gold: "금",
    gilt: "금동",
    bronze: "청동",
    silver: "은",
    iron: "철"
  };

  const items = window.EXHIBITION.artifacts;
  const masonry = document.querySelector("[data-masonry]");
  const detail = document.querySelector("[data-detail]");

  function bullets(arr) {
    const seen = new Set();
    const lines = arr.filter((line) => {
      const key = String(line || "").replace(/\s+/g, " ").trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return `<ul>${lines.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  }

  function listHref(item) {
    const from = new URLSearchParams(location.search).get("from");
    const allowed = Object.keys(METAL_LABEL);
    const metal =
      from && allowed.includes(from) && item.metals.includes(from)
        ? from
        : item.metals[0];
    return metal ? `./index.html?metal=${metal}` : "./index.html";
  }

  function articleHtml(item, heading) {
    return `
      <img class="hero-shot" src="${item.image}" alt="${item.name}" />
      <div>
        <div class="detail-top">
          <div class="metal">${item.no} · ${item.metals.map((m) => METAL_LABEL[m]).join(" · ")} · ${item.materialLabel}</div>
          <a class="back" href="${listHref(item)}">← 목록으로</a>
        </div>
        ${heading}
        <p class="sentence">${item.sentence}</p>
        <dl class="facts">
          <div><dt>시대</dt><dd>${item.era} · ${item.period}</dd></div>
          <div><dt>영문명</dt><dd>${item.englishName}</dd></div>
          <div><dt>지정</dt><dd>${item.designation}</dd></div>
          <div><dt>출토</dt><dd>${item.origin}</dd></div>
          <div><dt>소장</dt><dd>${item.collection}</dd></div>
          <div><dt>크기</dt><dd>${item.size}</dd></div>
          <div><dt>용도</dt><dd>${item.use}</dd></div>
        </dl>
        <div class="block"><h4>금속학적 특징</h4>${bullets([
          item.elements.primary,
          item.elements.alloy,
          item.elements.surface,
          item.elements.analysis,
          ...item.properties,
          ...item.metallurgy
        ])}</div>
        <div class="block"><h4>제작기법</h4><p>${item.techniques.join(" · ")}</p>${bullets(item.making)}</div>
        <div class="block"><h4>제작배경</h4>${bullets(item.background)}</div>
        <div class="block"><h4>보존과학</h4>${bullets([...item.surface, ...item.conservation])}</div>
        <p class="note">${window.EXHIBITION.reliability}</p>
      </div>
    `;
  }

  if (detail) {
    const id = new URLSearchParams(location.search).get("id");
    const item = items.find((x) => x.id === id) || items[0];
    document.title = `${item.name} · 금속문화재박물관`;
    detail.innerHTML = articleHtml(item, `<h1>${item.name}</h1>`);
    return;
  }

  if (!masonry) return;

  const titleEl = document.querySelector("[data-gallery-title]");
  const countEl = document.querySelector("[data-gallery-count]");
  const metalControls = [...document.querySelectorAll("[data-metal]")];
  let metal = new URLSearchParams(location.search).get("metal") || "";

  function filtered() {
    if (!metal) return items;
    return items.filter((item) => item.metals.includes(metal));
  }

  function renderGallery() {
    const listItems = filtered();
    titleEl.textContent = metal ? METAL_LABEL[metal] : "전체";
    countEl.textContent = `${listItems.length}점`;
    masonry.classList.toggle("is-stack", Boolean(metal));
    masonry.innerHTML = listItems
      .map(
        (item) => `
      <a class="tile" href="./artifact.html?id=${item.id}${metal ? `&from=${metal}` : ""}">
        <img src="${item.image}" alt="${item.name}" />
      </a>`
      )
      .join("");
  }

  function markMetal() {
    metalControls.forEach((b) => b.classList.toggle("is-on", b.dataset.metal === metal));
  }

  metalControls.forEach((btn) => {
    btn.addEventListener("click", () => {
      metal = btn.dataset.metal;
      markMetal();
      document.getElementById("home").classList.toggle("is-away", Boolean(metal));
      renderGallery();
      window.scrollTo({ top: 0, behavior: metal ? "auto" : "smooth" });
    });
  });
  markMetal();

  if (metal) {
    document.getElementById("home").classList.add("is-away");
  }

  renderGallery();
})();
