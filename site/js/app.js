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
    return `<ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  }

  function articleHtml(item, heading) {
    return `
      <img class="hero-shot" src="${item.image}" alt="${item.name}" />
      <div>
        <div class="metal">${item.no} · ${item.metals.map((m) => METAL_LABEL[m]).join(" · ")} · ${item.materialLabel}</div>
        <a class="back" href="./index.html">← 목록으로</a>
        ${heading}
        <p class="sentence">${item.sentence}</p>
        <dl class="facts">
          <div><dt>시대</dt><dd>${item.era} · ${item.period}</dd></div>
          <div><dt>재질</dt><dd>${item.material}</dd></div>
          <div><dt>지정</dt><dd>${item.designation}</dd></div>
          <div><dt>출토</dt><dd>${item.origin}</dd></div>
          <div><dt>소장</dt><dd>${item.collection}</dd></div>
          <div><dt>크기</dt><dd>${item.size}</dd></div>
          <div><dt>용도</dt><dd>${item.use}</dd></div>
        </dl>
        <div class="block"><h4>금속 원소</h4><p>${item.elements.primary}</p><p>${item.elements.alloy}</p><p>${item.elements.surface}</p><p>${item.elements.analysis}</p></div>
        <div class="block"><h4>금속의 성질</h4>${bullets(item.properties)}</div>
        <div class="block"><h4>금속학적 특징</h4>${bullets(item.metallurgy)}</div>
        <div class="block"><h4>제작기법</h4><p>${item.techniques.join(" · ")}</p>${bullets(item.making)}</div>
        <div class="block"><h4>제작 배경</h4>${bullets(item.background)}</div>
        <div class="block"><h4>표면과 부식</h4>${bullets(item.surface)}</div>
        <div class="block"><h4>보존과학</h4>${bullets(item.conservation)}</div>
        <p class="note">${window.EXHIBITION.reliability}</p>
      </div>
    `;
  }

  if (detail) {
    const id = new URLSearchParams(location.search).get("id");
    const item = items.find((x) => x.id === id) || items[0];
    document.title = `${item.name} · 금속문화재`;
    detail.innerHTML = articleHtml(item, `<h1>${item.name}</h1>`);
    return;
  }

  if (!masonry) return;

  const titleEl = document.querySelector("[data-gallery-title]");
  const countEl = document.querySelector("[data-gallery-count]");
  const navButtons = [...document.querySelectorAll(".nav [data-metal]")];
  let metal = new URLSearchParams(location.search).get("metal") || "";

  function filtered() {
    if (!metal) return items;
    return items.filter((item) => item.metals.includes(metal));
  }

  function renderGallery() {
    const listItems = filtered();
    titleEl.textContent = metal ? METAL_LABEL[metal] : "전체";
    countEl.textContent = `${listItems.length}점`;
    masonry.innerHTML = listItems
      .map(
        (item) => `
      <a class="tile" href="./artifact.html?id=${item.id}">
        <img src="${item.image}" alt="${item.name}" />
      </a>`
      )
      .join("");
  }

  navButtons.forEach((btn) => {
    if (btn.dataset.metal === metal) {
      navButtons.forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
    }
    btn.addEventListener("click", () => {
      metal = btn.dataset.metal;
      navButtons.forEach((b) => b.classList.toggle("is-on", b === btn));
      document.getElementById("home").classList.toggle("is-away", Boolean(metal));
      renderGallery();
      window.scrollTo({ top: metal ? 0 : 0, behavior: metal ? "auto" : "smooth" });
    });
  });

  if (metal) {
    document.getElementById("home").classList.add("is-away");
  }

  renderGallery();
})();
