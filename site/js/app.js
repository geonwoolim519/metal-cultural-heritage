(function () {
  const path = location.pathname.split("/").pop() || "index.html";

  function header(active) {
    return `
      <header class="site-header">
        <a class="brand" href="./index.html">
          <small>DIGITAL HERITAGE CURATOR</small>
          <strong>금속문화재</strong>
        </a>
        <nav>
          <a class="${active === "index.html" ? "active" : ""}" href="./index.html">전시</a>
          <a class="${active === "materials.html" ? "active" : ""}" href="./materials.html">재료</a>
          <a class="${active === "conservation.html" ? "active" : ""}" href="./conservation.html">보존</a>
          <a class="${active === "about.html" ? "active" : ""}" href="./about.html">기획</a>
        </nav>
      </header>
    `;
  }

  function footer() {
    return `
      <footer>
        디지털헤리티지큐레이터 양성과정 · 문화재재료학 및 실험에서 출발한 금속문화재 웹전시.<br>
        원소 함량은 해당 유물의 분석자료가 확인된 경우에만 수치로 표기합니다.
      </footer>
    `;
  }

  document.body.insertAdjacentHTML("afterbegin", header(path));
  document.body.insertAdjacentHTML("beforeend", footer());

  const list = document.querySelector("[data-artifact-list]");
  if (list && window.EXHIBITION) {
    list.innerHTML = EXHIBITION.artifacts
      .map(
        (item) => `
      <a class="card" href="./artifact.html?id=${item.id}">
        <div class="plate ${item.materialClass}" data-metal="${item.materialLabel}"></div>
        <div class="card-body">
          <em>${item.no} · ${item.era}</em>
          <h3>${item.name}</h3>
          <p>${item.summary}</p>
        </div>
      </a>`
      )
      .join("");
  }

  const root = document.querySelector("[data-artifact]");
  if (root && window.EXHIBITION) {
    const id = new URLSearchParams(location.search).get("id");
    const item = EXHIBITION.artifacts.find((a) => a.id === id) || EXHIBITION.artifacts[0];
    document.title = `${item.name} · 금속문화재`;
    root.innerHTML = `
      <section class="hero">
        <p class="kicker">${item.no} / ${item.era} / ${item.material}</p>
        <h1>${item.name}</h1>
        <p class="lede">${item.summary}</p>
        <p class="quote">${item.sentence}</p>
      </section>
      <section class="section">
        <h2>기본 정보</h2>
        <div class="rule"></div>
        <dl class="meta-grid">
          ${[
            ["문화재명", item.name],
            ["시대", item.era],
            ["제작 시기", item.period],
            ["재질", item.material],
            ["크기", item.size],
            ["지정", item.designation],
            ["출토·발견", item.origin],
            ["현재 소장처", item.collection],
            ["용도", item.use]
          ]
            .map(
              ([k, v]) => `<div class="meta-item"><dt>${k}</dt><dd>${v}</dd></div>`
            )
            .join("")}
        </dl>
      </section>
      <section class="section">
        <h2>금속 원소</h2>
        <div class="rule"></div>
        <div class="split">
          <div class="block"><span>주요 금속</span><p>${item.elements.primary}</p></div>
          <div class="block"><span>표면 처리</span><p>${item.elements.surface}</p></div>
          <div class="block"><span>합금 여부</span><p>${item.elements.alloy}</p></div>
          <div class="block"><span>분석 원칙</span><p>${item.elements.analysis}</p></div>
        </div>
        <p class="note">${EXHIBITION.reliability}</p>
      </section>
      <section class="section">
        <h2>금속의 성질 · 금속학적 특징</h2>
        <div class="rule"></div>
        <div class="split">
          <div class="block"><span>성질</span><ul class="list">${item.properties.map((x) => `<li>${x}</li>`).join("")}</ul></div>
          <div class="block"><span>왜 이 금속인가</span><ul class="list">${item.metallurgy.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        </div>
      </section>
      <section class="section">
        <h2>제작기법</h2>
        <div class="rule"></div>
        <p>${item.techniques.join(" · ")}</p>
        <ul class="list">${item.making.map((x) => `<li>${x}</li>`).join("")}</ul>
      </section>
      <section class="section">
        <h2>제작 배경</h2>
        <div class="rule"></div>
        <ul class="list">${item.background.map((x) => `<li>${x}</li>`).join("")}</ul>
      </section>
      <section class="section">
        <h2>표면과 부식 · 보존과학</h2>
        <div class="rule"></div>
        <div class="split">
          <div class="block"><span>표면</span><ul class="list">${item.surface.map((x) => `<li>${x}</li>`).join("")}</ul></div>
          <div class="block"><span>보존</span><ul class="list">${item.conservation.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        </div>
      </section>
      <section class="section">
        <h2>확대해서 보기</h2>
        <div class="rule"></div>
        <div class="plate ${item.materialClass}" data-metal="${item.material} · 사진 등록 대기" style="min-height:280px"></div>
        <p class="note">유물 사진은 아직 사이트에 넣지 않았습니다. 사진을 주시면 전체 모습, 금속 표면, 세부 문양, 제작 흔적, 부식 또는 표면 변화 순으로 배치합니다.</p>
      </section>
    `;
  }
})();
