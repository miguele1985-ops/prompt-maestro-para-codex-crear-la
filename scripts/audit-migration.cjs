const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const crypto = require("node:crypto");
const { JSDOM } = require("jsdom");
const mobile = process.argv[2] || "C:/Users/Valeria/Documents/Codex/SV/mobile/src/data";
const cache = new Map();
function load(file) {
  const resolved = path.resolve(mobile, file.endsWith(".js") ? file : file + ".js");
  if (!resolved.startsWith(path.resolve(mobile) + path.sep))
    throw Error("Data import outside source directory");
  if (cache.has(resolved)) return cache.get(resolved);
  const result = {};
  cache.set(resolved, result);
  const source = fs.readFileSync(resolved, "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(
    code,
    {
      exports: result,
      require: (name) => {
        if (/\.(png|jpe?g|webp|avif)$/i.test(name)) return name;
        return load(name.replace(/^\.\//, ""));
      },
    },
    { timeout: 5000 },
  );
  return result;
}
const data = load("initialData");
const plants = load("encyclopediaImportedData");
const records = [];
for (const category of data.GUIDES)
  for (const article of category.articles || [])
    records.push({
      source: "mobile/initialData",
      id: article.id,
      title: article.title,
      category: category.title,
      destination: `/guias/${category.id}/${article.id}`,
      status: "pending-editorial-review",
      reason:
        "Contenido original localizado. Requiere contraste de afirmaciones, fuentes y derechos de imágenes antes de publicar.",
    });
for (const scenario of data.CRISIS_SCENARIOS)
  records.push({
    source: "mobile/crisisData",
    id: scenario.id,
    title: scenario.title,
    destination: `/modo-crisis/${scenario.id}`,
    status: "pending-safety-review",
  });
for (const name of ["SPAIN_EDIBLE_PLANTS", "SPAIN_DANGEROUS_PLANTS", "SPAIN_MEDICINAL_PLANTS"])
  for (const plant of plants[name])
    records.push({
      source: `mobile/${name}`,
      id: plant.id,
      title: plant.nombre,
      scientificName: plant.latin,
      destination: `/plantas/${plant.nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`,
      status: "pending-botanical-review",
      reason:
        "La fuente no incluye atribución verificable por ficha. No se publica consejo de consumo sin revisar identificación, toxicidad y fuentes.",
    });
const documents = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f);
    else if (f.endsWith(".html")) {
      const html = fs.readFileSync(f, "utf8");
      const hash = crypto.createHash("sha256").update(html).digest("hex");
      if (documents.some((d) => d.sha256 === hash)) continue;
      const document = new JSDOM(html).window.document;
      documents.push({
        file: f,
        sha256: hash,
        title: document.title,
        headings: [...document.querySelectorAll("h1,h2")].map((h) => h.textContent.trim()),
        words: document.body.textContent.split(/\s+/).length,
      });
    }
  }
}
walk(".codex-remote-attachments");
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync(
  "docs/migration-inventory.json",
  JSON.stringify(
    {
      auditedAt: "2026-09-26",
      documents,
      counts: {
        guides: data.GUIDES.reduce((n, c) => n + (c.articles || []).length, 0),
        scenarios: data.CRISIS_SCENARIOS.length,
        plants: ["SPAIN_EDIBLE_PLANTS", "SPAIN_DANGEROUS_PLANTS", "SPAIN_MEDICINAL_PLANTS"].reduce(
          (n, key) => n + plants[key].length,
          0,
        ),
      },
      records,
    },
    null,
    2,
  ) + "\n",
);
console.log("Inventario:", records.length, "registros y", documents.length, "HTML únicos.");
