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
  const preview = document.querySelector("[data-preview]");
  const titleEl = document.querySelector("[data-gallery-title]");
  const countEl = document.querySelector("[data-gallery-count]");
  const navButtons = [...document.querySelectorAll(".nav [data-metal]")];

  let metal = "";
  let currentId = items[0].id;

  function filtered() {
    if (!metal) return items;
    return items.filter((item) => item.metals.includes(metal));
  }

  function bullets(arr) {
    return `<ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  }

  function renderGallery() {
    const listItems = filtered();
    titleEl.textContent = metal ? METAL_LABEL[metal] : "전체";
    countEl.textContent = `${listItems.length}점`;
    masonry.innerHTML = listItems
      .map(
        (item) => `
      <figure class="tile" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" />
      </figure>`
      )
      .join("");
    markTile();
  }

  function markTile() {
    masonry.querySelectorAll(".tile").forEach((tile) => {
      tile.classList.toggle("is-on", tile.dataset.id === currentId);
    });
  }

  function renderPreview(item) {
    preview.innerHTML = `
      <img class="hero-shot" src="${item.image}" alt="${item.name}" />
      <div class="metal">${item.no} · ${item.metals.map((m) => METAL_LABEL[m]).join(" · ")} · ${item.materialLabel}</div>
      <h3>${item.name}</h3>
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
    `;
  }

  function select(id) {
    const pool = filtered();
    const item = items.find((x) => x.id === id) || pool[0] || items[0];
    currentId = item.id;
    markTile();
    renderPreview(item);
  }

  masonry.addEventListener("click", (event) => {
    const tile = event.target.closest("[data-id]");
    if (tile) select(tile.dataset.id);
  });

  masonry.addEventListener("mouseover", (event) => {
    const tile = event.target.closest("[data-id]");
    if (tile) select(tile.dataset.id);
  });

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      metal = btn.dataset.metal;
      navButtons.forEach((b) => b.classList.toggle("is-on", b === btn));
      document.getElementById("home").classList.toggle("is-away", Boolean(metal));
      renderGallery();
      const next = filtered()[0];
      if (next) select(next.id);
      if (metal) window.scrollTo({ top: 0 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  renderGallery();
  select(currentId);
})();
