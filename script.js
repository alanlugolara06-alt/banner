const fields = [
  "title", "subtitle", "buttonText", "link",
  "bgColor", "bgColor2", "textColor", "buttonColor", "buttonTextColor",
  "imageUrl", "align", "height", "radius", "openNewTab"
];

const preview = document.getElementById("preview");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str) {
  return escapeHtml(str);
}

function getValues() {
  const v = {};
  for (const id of fields) {
    const el = document.getElementById(id);
    v[id] = el.type === "checkbox" ? el.checked : el.value;
  }
  return v;
}

function buildBannerHtml(v) {
  const align = ["left", "center", "right"].includes(v.align) ? v.align : "center";
  const height = parseInt(v.height, 10) || 220;
  const radius = parseInt(v.radius, 10) || 0;

  const bg = v.bgColor2 && v.bgColor2 !== v.bgColor
    ? `linear-gradient(135deg, ${v.bgColor}, ${v.bgColor2})`
    : v.bgColor;

  const target = v.openNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
  const safeLink = escapeAttr(v.link || "#");

  const containerStyle = [
    `background:${bg}`,
    `color:${v.textColor}`,
    `border-radius:${radius}px`,
    `min-height:${height}px`,
    `padding:28px`,
    `display:flex`,
    `gap:24px`,
    `align-items:center`,
    align === "center" ? "justify-content:center;flex-direction:column;text-align:center"
      : align === "right" ? "justify-content:flex-end;text-align:right"
      : "justify-content:flex-start;text-align:left",
    `font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif`,
    `overflow:hidden`
  ].join(";");

  const linkStyle = "display:block;text-decoration:none;color:inherit;";

  const image = v.imageUrl
    ? `<img src="${escapeAttr(v.imageUrl)}" alt="" style="max-height:${height - 40}px;max-width:200px;border-radius:8px;object-fit:cover;" />`
    : "";

  const buttonStyle = [
    `display:inline-block`,
    `padding:10px 18px`,
    `border-radius:8px`,
    `background:${v.buttonColor}`,
    `color:${v.buttonTextColor}`,
    `font-weight:600`,
    `font-size:0.95rem`,
    `text-decoration:none`,
    `margin-top:6px`
  ].join(";");

  const content = `
    <div class="banner-content">
      <h3 style="margin:0 0 8px;font-size:1.8rem;font-weight:700;">${escapeHtml(v.title)}</h3>
      <p style="margin:0 0 14px;font-size:1rem;opacity:0.95;">${escapeHtml(v.subtitle)}</p>
      <span style="${buttonStyle}">${escapeHtml(v.buttonText)}</span>
    </div>
  `.trim();

  return `<a href="${safeLink}"${target} style="${linkStyle}">
  <div style="${containerStyle}">
    ${image}
    ${content}
  </div>
</a>`;
}

function render() {
  const v = getValues();
  const html = buildBannerHtml(v);
  preview.innerHTML = html;
  output.value = html;
}

for (const id of fields) {
  const el = document.getElementById(id);
  el.addEventListener("input", render);
  el.addEventListener("change", render);
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    copyStatus.textContent = "¡Copiado!";
  } catch {
    output.select();
    document.execCommand("copy");
    copyStatus.textContent = "Copiado (fallback)";
  }
  setTimeout(() => (copyStatus.textContent = ""), 2000);
});

render();
