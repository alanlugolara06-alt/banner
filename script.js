const fields = [
  "title", "subtitle", "buttonText", "link", "website",
  "bgColor", "bgColor2", "textColor", "buttonColor", "buttonTextColor",
  "imageUrl", "align", "width", "height", "radius", "openNewTab", "showWebsite", "glow"
];

const preview = document.getElementById("preview");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const statusEl = document.getElementById("status");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getValues() {
  const v = {};
  for (const id of fields) {
    const el = document.getElementById(id);
    v[id] = el.type === "checkbox" ? el.checked : el.value;
  }
  return v;
}

function buildBannerStyles(v) {
  const width = parseInt(v.width, 10) || 1200;
  const height = parseInt(v.height, 10) || 300;
  const radius = parseInt(v.radius, 10) || 0;
  const align = ["left", "center", "right"].includes(v.align) ? v.align : "center";

  const bg = v.bgColor2 && v.bgColor2.toLowerCase() !== v.bgColor.toLowerCase()
    ? `linear-gradient(135deg, ${v.bgColor}, ${v.bgColor2})`
    : v.bgColor;

  const scale = Math.min(width / 1200, height / 300, 2);
  const titleSize = Math.max(1.4, Math.min(4, 2.2 * scale));
  const subSize = Math.max(0.8, Math.min(1.8, 1.1 * scale));

  return { width, height, radius, align, bg, scale, titleSize, subSize };
}

function buildBannerHtml(v, forExport = false) {
  const s = buildBannerStyles(v);

  const containerStyle = [
    `background:${s.bg}`,
    `color:${v.textColor}`,
    `border-radius:${s.radius}px`,
    `width:${s.width}px`,
    `height:${s.height}px`,
    `padding:${Math.max(20, s.height * 0.08)}px`,
    `display:flex`,
    `gap:24px`,
    `align-items:center`,
    s.align === "center" ? "justify-content:center;flex-direction:column;text-align:center"
      : s.align === "right" ? "justify-content:flex-end;text-align:right"
      : "justify-content:flex-start;text-align:left",
    `font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif`,
    `overflow:hidden`,
    `box-sizing:border-box`
  ].join(";");

  const linkStyle = "display:inline-block;text-decoration:none;color:inherit;";

  const image = v.imageUrl
    ? `<img src="${escapeHtml(v.imageUrl)}" alt="" crossorigin="anonymous" style="max-height:${s.height * 0.7}px;max-width:35%;border-radius:8px;object-fit:contain;" />`
    : "";

  const buttonStyle = [
    `display:inline-block`,
    `padding:${Math.max(8, s.height * 0.04)}px ${Math.max(16, s.height * 0.08)}px`,
    `border-radius:10px`,
    `background:${v.buttonColor}`,
    `color:${v.buttonTextColor}`,
    `font-weight:700`,
    `font-size:${Math.max(0.9, s.subSize)}rem`,
    `text-decoration:none`,
    `margin-top:6px`
  ].join(";");

  const glowText = v.glow ? `text-shadow:0 0 6px ${v.textColor},0 0 14px ${v.bgColor2 || v.buttonColor},0 0 24px ${v.bgColor2 || v.buttonColor};` : "";
  const glowBtn  = v.glow ? `box-shadow:0 0 10px ${v.buttonColor},0 0 24px ${v.buttonColor};` : "";

  const websiteHtml = v.showWebsite && v.website
    ? `<div style="margin-top:14px;font-size:${Math.max(0.85, s.subSize * 0.9)}rem;font-weight:600;letter-spacing:0.5px;opacity:0.95;${glowText}">🔗 ${escapeHtml(v.website)}</div>`
    : "";

  const content = `
    <div class="banner-content" style="max-width:100%;">
      <div style="margin:0 0 10px;font-size:${s.titleSize}rem;font-weight:800;line-height:1.1;${glowText}">${escapeHtml(v.title)}</div>
      <div style="margin:0 0 16px;font-size:${s.subSize}rem;opacity:0.95;${glowText}">${escapeHtml(v.subtitle)}</div>
      <span style="${buttonStyle}${glowBtn}">${escapeHtml(v.buttonText)}</span>
      ${websiteHtml}
    </div>
  `.trim();

  const inner = `<div style="${containerStyle}">${image}${content}</div>`;

  if (forExport) {
    // For HTML embed (web use): wrapped in clickable <a>
    const target = v.openNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
    const safeLink = escapeHtml(v.link || "#");
    return `<a href="${safeLink}"${target} style="${linkStyle}">\n  ${inner}\n</a>`;
  }
  return inner;
}

function render() {
  const v = getValues();
  preview.innerHTML = buildBannerHtml(v, false);
  output.value = buildBannerHtml(v, true);
}

for (const id of fields) {
  const el = document.getElementById(id);
  el.addEventListener("input", render);
  el.addEventListener("change", render);
}

/* ---------- Presets ---------- */
const presets = {
  ma: {
    bgColor: "#000000", bgColor2: "#84cc16",
    textColor: "#ffffff", buttonColor: "#84cc16", buttonTextColor: "#000000",
    title: "M&A Market Store",
    subtitle: "Minimarket · Cigarrillos electrónicos · Bebidas · Snacks",
    buttonText: "Visitá nuestra tienda",
    glow: false
  },
  "ma-neon": {
    bgColor: "#020617", bgColor2: "#39ff14",
    textColor: "#39ff14", buttonColor: "#39ff14", buttonTextColor: "#000000",
    glow: true
  },
  "neon-pink": {
    bgColor: "#0a0014", bgColor2: "#ff10f0",
    textColor: "#ffffff", buttonColor: "#ff10f0", buttonTextColor: "#000000",
    glow: true
  },
  "neon-cyan": {
    bgColor: "#001018", bgColor2: "#00ffff",
    textColor: "#ffffff", buttonColor: "#00ffff", buttonTextColor: "#001018",
    glow: true
  },
  "neon-lime": {
    bgColor: "#0d1b00", bgColor2: "#ccff00",
    textColor: "#ccff00", buttonColor: "#ccff00", buttonTextColor: "#000000",
    glow: true
  },
  "neon-purple": {
    bgColor: "#1a002e", bgColor2: "#bf00ff",
    textColor: "#ffffff", buttonColor: "#bf00ff", buttonTextColor: "#ffffff",
    glow: true
  },
  "neon-sunset": {
    bgColor: "#ff006e", bgColor2: "#ffbe0b",
    textColor: "#ffffff", buttonColor: "#000000", buttonTextColor: "#ffbe0b",
    glow: true
  },
  vapor: {
    bgColor: "#ff71ce", bgColor2: "#01cdfe",
    textColor: "#ffffff", buttonColor: "#05ffa1", buttonTextColor: "#1a002e",
    glow: true
  },
  fire: {
    bgColor: "#dc2626", bgColor2: "#facc15",
    textColor: "#ffffff", buttonColor: "#000000", buttonTextColor: "#ffffff"
  },
  ocean: {
    bgColor: "#0284c7", bgColor2: "#a3e635",
    textColor: "#ffffff", buttonColor: "#fef08a", buttonTextColor: "#0c4a6e"
  }
};

const sizes = {
  "ig-post":     { width: 1080, height: 1080, align: "center", label: "instagram-post" },
  "ig-story":    { width: 1080, height: 1920, align: "center", label: "instagram-story" },
  "ig-reel":     { width: 1080, height: 1920, align: "center", label: "instagram-reel" },
  "fb-post":     { width: 1200, height: 630,  align: "center", label: "facebook-post" },
  "fb-cover":    { width: 1640, height: 624,  align: "center", label: "facebook-portada" },
  "tw-post":     { width: 1600, height: 900,  align: "center", label: "twitter-post" },
  "tw-header":   { width: 1500, height: 500,  align: "center", label: "twitter-header" },
  "tiktok":      { width: 1080, height: 1920, align: "center", label: "tiktok" },
  "yt-thumb":    { width: 1280, height: 720,  align: "center", label: "youtube-thumb" },
  "wsp-status":  { width: 1080, height: 1920, align: "center", label: "whatsapp-status" },
  "linkedin":    { width: 1200, height: 627,  align: "center", label: "linkedin" },
  "web":         { width: 1200, height: 300,  align: "left",   label: "web-banner" }
};

function applyConfig(obj) {
  for (const [k, val] of Object.entries(obj)) {
    const el = document.getElementById(k);
    if (!el) continue;
    if (el.type === "checkbox") el.checked = !!val;
    else el.value = val;
  }
}

document.querySelectorAll(".preset").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.preset) {
      const p = presets[btn.dataset.preset];
      if (p) applyConfig(p);
    }
    if (btn.dataset.size) {
      const s = sizes[btn.dataset.size];
      if (s) applyConfig(s);
    }
    render();
  });
});

/* ---------- Copy HTML ---------- */
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    statusEl.textContent = "✓ HTML copiado al portapapeles";
  } catch {
    output.select();
    document.execCommand("copy");
    statusEl.textContent = "✓ Copiado";
  }
  setTimeout(() => (statusEl.textContent = ""), 2500);
});

/* ---------- Download PNG ---------- */
function slugTitle() {
  return document.getElementById("title").value
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "banner";
}

async function captureNode(node) {
  return html2canvas(node, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    logging: false
  });
}

function triggerDownload(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function downloadCurrent() {
  if (typeof html2canvas === "undefined") {
    statusEl.textContent = "Error: librería de descarga no cargada";
    return;
  }
  statusEl.textContent = "Generando imagen...";
  try {
    const canvas = await captureNode(preview.firstElementChild);
    triggerDownload(canvas, `${slugTitle()}-${Date.now()}.png`);
    statusEl.textContent = "✓ PNG descargado";
  } catch (e) {
    statusEl.textContent = "Error al generar PNG (¿imagen externa sin CORS?)";
    console.error(e);
  }
  setTimeout(() => (statusEl.textContent = ""), 3500);
}

async function downloadForSize(sizeKey) {
  const sz = sizes[sizeKey];
  if (!sz) return;
  const prev = {
    width: document.getElementById("width").value,
    height: document.getElementById("height").value,
    align: document.getElementById("align").value
  };
  applyConfig(sz);
  render();
  await new Promise(r => setTimeout(r, 80));
  try {
    statusEl.textContent = `Generando ${sz.label}...`;
    const canvas = await captureNode(preview.firstElementChild);
    triggerDownload(canvas, `${slugTitle()}-${sz.label}.png`);
    statusEl.textContent = `✓ ${sz.label} descargado`;
  } catch (e) {
    statusEl.textContent = "Error al generar PNG";
    console.error(e);
  } finally {
    applyConfig(prev);
    render();
  }
  setTimeout(() => (statusEl.textContent = ""), 3500);
}

async function downloadAll() {
  const prev = {
    width: document.getElementById("width").value,
    height: document.getElementById("height").value,
    align: document.getElementById("align").value
  };
  const keys = Object.keys(sizes);
  for (let i = 0; i < keys.length; i++) {
    const sz = sizes[keys[i]];
    statusEl.textContent = `Descargando ${i + 1}/${keys.length}: ${sz.label}...`;
    applyConfig(sz);
    render();
    await new Promise(r => setTimeout(r, 120));
    try {
      const canvas = await captureNode(preview.firstElementChild);
      triggerDownload(canvas, `${slugTitle()}-${sz.label}.png`);
      await new Promise(r => setTimeout(r, 250));
    } catch (e) {
      console.error(`Error en ${sz.label}`, e);
    }
  }
  applyConfig(prev);
  render();
  statusEl.textContent = "✓ Pack completo descargado";
  setTimeout(() => (statusEl.textContent = ""), 4000);
}

downloadBtn.addEventListener("click", downloadCurrent);
document.getElementById("downloadAllBtn").addEventListener("click", downloadAll);
document.querySelectorAll(".dl-social").forEach(btn => {
  btn.addEventListener("click", () => downloadForSize(btn.dataset.size));
});

render();
