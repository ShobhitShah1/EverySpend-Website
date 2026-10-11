const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../out");
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
let checked = 0;
for (const page of ["index.html", "privacy/index.html", "terms/index.html", "contact/index.html"]) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const url = match[1];
    if (url.startsWith("//")) continue;
    assert(!prefix || url.startsWith(prefix + "/"), "Missing deployment base path: " + url);
    const file = path.join(root, decodeURIComponent(url.slice(prefix.length)));
    assert(fs.existsSync(file), "Missing exported asset or page: " + url);
    checked++;
  }
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
for (const icon of manifest.icons) assert(fs.existsSync(path.join(root, icon.src)), "Missing manifest icon");
for (const gallery of ["index.html", "brand-assets.html", "charts.html", "prototypes.html"]) assert(fs.existsSync(path.join(root, "branding", gallery)));
console.log("Passed: " + checked + " exported links/assets, manifest icons and branding galleries.");
