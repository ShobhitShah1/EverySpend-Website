const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const siteUrl = process.env.QA_SITE_URL || "http://127.0.0.1:3044";
const debuggerUrl = process.env.QA_DEBUGGER_URL || "http://127.0.0.1:9333";
async function main() {
  const pages = await (await fetch(debuggerUrl + "/json")).json();
  const socket = new WebSocket(pages.find((page) => page.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  const errors = [];
  socket.addEventListener("message", (message) => {
    const data = JSON.parse(message.data);
    if (data.method === "Runtime.exceptionThrown") errors.push(data.params.exceptionDetails.text);
    if (data.id) { const callback = pending.get(data.id); pending.delete(data.id); data.error ? callback.reject(data.error) : callback.resolve(data.result); }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); });
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw Error(response.exceptionDetails.text);
    return response.result.value;
  };
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Page.navigate", { url: siteUrl + "/" });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  await evaluate("document.fonts.ready");
  await evaluate("Promise.all([...document.images].map(async i=>{i.loading='eager';await i.decode()}))");
  for (const width of [1440, 768, 390, 320]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise((resolve) => setTimeout(resolve, 150));
    const layout = await evaluate("({width:innerWidth, scroll:document.documentElement.scrollWidth, broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)})");
    assert.equal(await evaluate("document.documentElement.scrollHeight <= innerHeight"), true, "Vertical scroll at " + width);
    assert(layout.scroll <= width, "Horizontal overflow at " + width + ": " + layout.scroll);
    assert.deepEqual(layout.broken, [], "Broken image at " + width);
    if (process.env.QA_SCREENSHOT_DIR && (width === 1440 || width === 390)) {
      const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
      fs.writeFileSync(path.join(process.env.QA_SCREENSHOT_DIR, "single-" + width + ".png"), Buffer.from(shot.data, "base64"));
    }
  }

  await evaluate("document.documentElement.dataset.theme='light';localStorage.setItem('everyspend-theme','light')");
  assert.equal(await evaluate("getComputedStyle(document.body).backgroundColor"), "rgb(250, 250, 249)");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.single-download')).backgroundColor"), "rgb(28, 28, 28)");
  const beforeTheme = await evaluate("document.documentElement.dataset.theme");
  await evaluate("document.querySelector('.theme-toggle').click()");
  await new Promise((resolve) => setTimeout(resolve, 100));
  const afterTheme = await evaluate("document.documentElement.dataset.theme");
  assert.notEqual(beforeTheme, afterTheme);
  assert.equal(await evaluate("localStorage.getItem('everyspend-theme')"), afterTheme);
  await send("Page.reload");
  await new Promise((resolve) => setTimeout(resolve, 700));
  assert.equal(await evaluate("document.documentElement.dataset.theme"), afterTheme);
  await evaluate("document.documentElement.dataset.theme='dark';localStorage.setItem('everyspend-theme','dark');scrollTo({top:0,behavior:'instant'})");
  await new Promise((resolve) => setTimeout(resolve, 200));
  assert.equal(await evaluate("getComputedStyle(document.body).backgroundColor"), "rgb(28, 28, 28)");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.single-download')).backgroundColor"), "rgb(233, 233, 231)");
  if (process.env.QA_SCREENSHOT_DIR) {
    const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(process.env.QA_SCREENSHOT_DIR, "single-dark.png"), Buffer.from(shot.data, "base64"));
  }
  assert.equal(await evaluate("document.querySelector('.pouch-coin')"), null, "Coin decoration removed");
  assert.equal(await evaluate("!!document.querySelector('.single-download .play-store-icon')"), true, "Google Play icon present");
  for (const [width, height] of [[2299, 1265], [1920, 1080], [320, 600], [390, 700], [430, 932], [768, 1024], [1440, 700]]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    assert.equal(await evaluate("(()=>{const image=document.querySelector('.bottom-pouch img');const box=image.getBoundingClientRect();const scale=Math.max(box.width/image.naturalWidth,box.height/image.naturalHeight);return image.naturalWidth*.25*scale <= innerWidth*.85})()"), true, "Pouch face fits viewport");
    if (width > 900) {
      const gap = await evaluate("document.querySelector('.bottom-pouch').getBoundingClientRect().top + document.querySelector('.bottom-pouch').clientHeight * .34 - document.querySelector('.single-download').getBoundingClientRect().bottom");
      assert(gap >= 24, "Desktop artwork overlaps download: " + gap);
      assert.equal(await evaluate("document.querySelector('.single-intro').getBoundingClientRect().top <= innerHeight*.18"), true, "Intro is too low");
      assert.equal(await evaluate("document.querySelector('.single-intro').getBoundingClientRect().top >= document.querySelector('.single-header').getBoundingClientRect().bottom"), true, "Intro overlaps header");
    }
    assert.equal(await evaluate("document.documentElement.scrollHeight <= innerHeight && document.documentElement.scrollWidth <= innerWidth"), true, "Short viewport overflow");
    assert.equal(await evaluate("document.querySelector('.single-download').getBoundingClientRect().bottom < document.querySelector('.bottom-pouch').getBoundingClientRect().top + document.querySelector('.bottom-pouch').clientHeight * .3"), true, "Download overlaps pouch rim at " + width + "x" + height + ": " + JSON.stringify(await evaluate("({button:document.querySelector(\'.single-download\').getBoundingClientRect().bottom,pouch:document.querySelector(\'.bottom-pouch\').getBoundingClientRect().top,height:document.querySelector(\'.bottom-pouch\').clientHeight})")));
  }
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await new Promise((resolve) => setTimeout(resolve, 150));
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.single-download')).transitionDuration"), "0s");
  for (const route of ["privacy", "terms", "contact"]) {
    await send("Page.navigate", { url: siteUrl + "/" + route + "/" });
    await new Promise((resolve) => setTimeout(resolve, 350));
    assert(await evaluate("!!document.querySelector('h1')"), "Missing heading on " + route);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, "Overflow on " + route);
  }
  assert.deepEqual(errors, []);
  socket.close();
  console.log("Passed: four viewport widths, loaded artwork, no-scroll landing, theme switching/persistence, reduced motion, and support routes. No form submitted.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; process.exit(); });