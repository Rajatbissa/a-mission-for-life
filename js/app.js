const LANG_KEY = "amfl-lang";
const params = new URLSearchParams(location.search);
let lang = params.get("lang") === "en" || params.get("lang") === "hi"
  ? params.get("lang")
  : (localStorage.getItem(LANG_KEY) || "hi");

const campPost = () => POSTS.find((p) => p.type === "camp");

function t(key) {
  return UI[lang][key];
}

function tx(obj) {
  return obj[lang];
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function formatDate(iso) {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function dayParts(iso) {
  const date = new Date(`${iso}T00:00:00`);
  return {
    day: date.getDate(),
    month: new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", { month: "short" }).format(date),
  };
}

function waHref() {
  return `https://wa.me/${SITE.wa}?text=${encodeURIComponent(t("waText"))}`;
}

function pills(post) {
  const kind = post.type === "photos" ? "photo" : post.type;
  const sample = post.sample ? `<span class="pill pill-gold">${esc(t("sample"))}</span>` : "";
  const when = post.date ? `<span>${esc(formatDate(post.date))}</span>` : "";
  return `<div class="meta"><span class="pill">${esc(t(kind))}</span>${sample}${when}</div>`;
}

function campCard(post) {
  return `<article class="card" id="camps">
    ${pills(post)}
    <h2>${esc(tx(post.title))}</h2>
    <p class="body">${esc(tx(post.place))} · ${esc(tx(post.time))}</p>
    <p class="body">${esc(tx(post.body))}</p>
    <div class="stack">
      <a class="btn btn-navy" href="camp.html?id=${esc(post.id)}">${esc(t("viewCamp"))}</a>
      <a class="btn btn-wa" href="${esc(waHref())}" target="_blank" rel="noopener">${esc(t("whatsapp"))}</a>
    </div>
  </article>`;
}

function storyCard(post) {
  return `<article class="card">
    ${pills(post)}
    <h2>${esc(tx(post.title))}</h2>
    <p class="body">${esc(tx(post.body))}</p>
  </article>`;
}

function photoCard(post) {
  const images = post.images.map((image, index) =>
    `<img src="${esc(image.src)}" alt="${esc(tx(image.alt))}"${index === 0 ? "" : ""}>`
  ).join("");
  return `<article class="card" id="photos">
    ${pills(post)}
    <h2>${esc(tx(post.title))}</h2>
    <div class="mosaic">${images}</div>
    <p class="note">${esc(t("photoNote"))}</p>
  </article>`;
}

function reelCard(post) {
  return `<article class="card">
    ${pills(post)}
    <h2>${esc(tx(post.title))}</h2>
    <button class="reel-frame" type="button" data-reel>
      <img src="${esc(post.cover)}" alt="">
      <span class="play" aria-hidden="true">▶</span>
      <small>${esc(t("play"))}</small>
    </button>
  </article>`;
}

function renderPost(post) {
  if (post.type === "camp") return campCard(post);
  if (post.type === "story") return storyCard(post);
  if (post.type === "photos") return photoCard(post);
  if (post.type === "reel") return reelCard(post);
  return "";
}

function banner() {
  if (sessionStorage.getItem("amfl-banner") === "0") return "";
  return `<div class="banner"><span>${esc(t("banner"))}</span><button type="button" data-hide-banner>${esc(t("hide"))}</button></div>`;
}

function header() {
  const home = document.body.dataset.page === "home";
  const feedHref = home ? "#feed" : "index.html#feed";
  const campHref = home ? "#camps" : "index.html#camps";
  const photoHref = home ? "#photos" : "index.html#photos";
  return `<a class="skip" href="${feedHref}">${esc(t("skip"))}</a>
  <header class="topbar">
    <a class="brand" href="index.html">
      <span class="mark"><img src="assets/logo.png" alt=""></span>
      <span class="brand-text"><strong>A Mission <em>For Life</em></strong><small>FOUNDATION</small></span>
    </a>
    <nav class="nav" aria-label="Primary">
      <a href="${feedHref}">${esc(t("feed"))}</a>
      <a href="${campHref}">${esc(t("camps"))}</a>
      <a href="${photoHref}">${esc(t("photos"))}</a>
    </nav>
    <div class="lang" role="group" aria-label="${esc(t("langLabel"))}">
      <button type="button" data-lang="hi" aria-pressed="${lang === "hi"}">हिंदी</button>
      <button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="foot-note">
      <div><strong>${esc(SITE.name)}</strong><div>${esc(SITE.tagline)}</div></div>
      <div>${esc(t("footer"))}</div>
    </div>
    <div class="bbr-bar">
      <a class="bbr-link" href="https://boostbyrajat.onrender.com/" target="_blank" rel="noopener">
        <img src="assets/bbr-logo.png" alt="BBR BoostByRajat">
      </a>
      <p class="head-copy">${esc(t("copy"))}</p>
    </div>
  </footer>`;
}

function contactPanel() {
  return `<aside class="panel">
    <h2>${esc(t("contactTitle"))}</h2>
    <p>${esc(t("contactBody"))}</p>
    <a class="phone" href="tel:${esc(SITE.phoneTel)}">${esc(SITE.phonePretty)}</a>
    <div class="stack">
      <a class="btn btn-wa" href="${esc(waHref())}" target="_blank" rel="noopener">${esc(t("whatsapp"))}</a>
      <a class="btn btn-ghost" href="tel:${esc(SITE.phoneTel)}">${esc(t("call"))}</a>
    </div>
    <p class="insta">${esc(t("instaSoon"))}</p>
  </aside>`;
}

function renderHome() {
  const upcoming = campPost();
  return `${banner()}${header()}
  <main>
    <section class="hero shell">
      <div>
        <div class="hero-plate"><img class="hero-logo" src="assets/logo.png" alt="${esc(SITE.name)}"></div>
        <p class="lede">${esc(t("lede"))}</p>
        <div class="hero-actions">
          <a class="btn btn-green" href="#feed">${esc(t("seeFeed"))}</a>
          <a class="btn btn-wa" href="${esc(waHref())}" target="_blank" rel="noopener">${esc(t("whatsapp"))}</a>
        </div>
      </div>
      <a class="next-pill" href="camp.html?id=${esc(upcoming.id)}">
        <span>${esc(t("upcoming"))}</span>
        <strong>${esc(formatDate(upcoming.date))}</strong>
        <em>${esc(tx(upcoming.time))} · ${esc(tx(upcoming.place))}</em>
      </a>
    </section>
    <div class="shell layout" id="feed">
      <div class="feed">${POSTS.map(renderPost).join("")}</div>
      <div class="side">${contactPanel()}</div>
    </div>
  </main>
  ${footer()}`;
}

function renderCamp() {
  const id = params.get("id");
  const post = POSTS.find((item) => item.id === id && item.type === "camp") || campPost();
  const parts = dayParts(post.date);
  const steps = post.steps.map((step) =>
    `<li><strong>${esc(tx(step.t))}</strong><span>${esc(tx(step.d))}</span></li>`
  ).join("");
  const bring = post.bring.map((item) => `<li>${esc(tx(item))}</li>`).join("");
  const who = post.who.map((item) => `<li>${esc(tx(item))}</li>`).join("");
  return `${banner()}${header()}
  <main class="page shell">
    <a class="back" href="index.html#camps">${esc(t("back"))}</a>
    <div class="camp-wrap">
      <section class="date-card">
        <p class="meta"><span class="pill">${esc(t("camp"))}</span><span class="pill pill-gold">${esc(t("sample"))}</span></p>
        <p class="date-num">${esc(parts.day)}</p>
        <p>${esc(parts.month)} · ${esc(formatDate(post.date))}</p>
      </section>
      <article class="block" style="padding:18px">
        <h2>${esc(tx(post.title))}</h2>
        <p>${esc(tx(post.body))}</p>
        <dl class="facts">
          <div><dt>${esc(t("when"))}</dt><dd>${esc(tx(post.time))}</dd></div>
          <div><dt>${esc(t("where"))}</dt><dd>${esc(tx(post.place))}</dd></div>
          <div><dt>${esc(t("by"))}</dt><dd>${esc(SITE.name)}</dd></div>
        </dl>
        <div class="stack">
          <a class="btn btn-wa" href="${esc(waHref())}" target="_blank" rel="noopener">${esc(t("attend"))}</a>
          <a class="btn btn-ghost" href="tel:${esc(SITE.phoneTel)}">${esc(t("call"))} ${esc(SITE.phonePretty)}</a>
        </div>
      </article>
    </div>
    <div class="layout">
      <section class="block" style="padding:18px">
        <h2>${esc(t("stepsTitle"))}</h2>
        <ol class="steps">${steps}</ol>
      </section>
      <div class="side">
        <section class="block" style="padding:18px">
          <h2>${esc(t("bringTitle"))}</h2>
          <ul class="plain">${bring}</ul>
        </section>
        <section class="block" style="padding:18px">
          <h2>${esc(t("whoTitle"))}</h2>
          <ul class="plain">${who}</ul>
          <p class="who-note">${esc(t("whoNote"))}</p>
        </section>
      </div>
    </div>
    <div class="map-placeholder">${esc(t("mapNote"))}</div>
  </main>
  ${footer()}
  `;
}

function dialogHtml() {
  return `<dialog id="reelDialog">
    <p class="tag">REEL</p>
    <h3>${esc(t("reelTitle"))}</h3>
    <p>${esc(t("reelBody"))}</p>
    <form method="dialog"><button class="btn btn-navy" type="submit">${esc(t("close"))}</button></form>
  </dialog>`;
}

function render() {
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  document.title = SITE.name;
  const page = document.body.dataset.page === "camp" ? renderCamp() : renderHome();
  document.getElementById("app").innerHTML = page + dialogHtml();
  bind();
}

function bind() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const y = window.scrollY;
      lang = button.dataset.lang;
      localStorage.setItem(LANG_KEY, lang);
      render();
      window.scrollTo(0, y);
    });
  });
  document.querySelector("[data-hide-banner]")?.addEventListener("click", () => {
    sessionStorage.setItem("amfl-banner", "0");
    render();
  });
  document.querySelector("[data-reel]")?.addEventListener("click", () => {
    document.getElementById("reelDialog").showModal();
  });
  bindTilt();
}

function bindTilt() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduce || coarse) return;
  document.querySelectorAll(".card, .panel, .block, .next-pill").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

document.body.insertAdjacentHTML("afterbegin", `<div class="stage" aria-hidden="true">
  <span class="bubble b1"><b class="grp">A+</b></span>
  <span class="bubble b2"><b class="grp">O−</b></span>
  <span class="bubble b3"><b class="grp">B+</b></span>
  <span class="bubble b4"></span>
  <span class="bubble b5"><b class="grp">O+</b></span>
  <span class="bubble b6"></span>
  <span class="bubble b7"><b class="grp">AB+</b></span>
  <span class="bubble b8"></span>
  <span class="fall s1"><span class="bldrop"></span><b class="grp">A−</b></span>
  <span class="fall s2"><span class="bldrop"></span><b class="grp">B−</b></span>
  <span class="fall s3"><span class="bldrop"></span><b class="grp">AB−</b></span>
</div>`);

function bindDrift() {
  const bits = document.querySelectorAll(".bubble, .fall");
  if (!bits.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    bits.forEach((bit, index) => {
      const depth = 8 + (index % 5) * 7;
      bit.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
}
bindDrift();

render();
