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
    const bounds = await evaluate("(()=>{const rect=s=>document.querySelector(s).getBoundingClientRect();const intro=rect('.single-intro'),image=rect('.bottom-pouch img'),art=rect('.bottom-pouch'),header=rect('.single-header');return {overflow:document.documentElement.scrollWidth>innerWidth,separate:intro.bottom<=art.top,belowHeader:intro.top>=header.bottom,faceFits:image.left+image.width*.38>=0&&image.left+image.width*.62<=innerWidth,ratio:image.width/image.height,loaded:document.querySelector('.bottom-pouch img').naturalWidth>0}})()");
    assert.equal(bounds.overflow, false, "Horizontal overflow at " + width);
    assert(bounds.separate, "Artwork overlaps content at " + width + "x" + height);
    assert(bounds.belowHeader, "Wordmark overlaps header");
    assert(bounds.faceFits, "Pouch face is cropped");
    assert(bounds.loaded, "Pouch artwork did not load");
    assert(Math.abs(bounds.ratio - 3) < .01, "Artwork is distorted");
  }
  assert.equal(await evaluate("document.querySelectorAll('.pouch-eye').length"), 2, "Two independently animated eyes");
  assert.equal(await evaluate("document.querySelectorAll('.pouch-eye-white').length"), 2, "Outer eye shapes stay fixed");
  await send("Page.reload");
  await new Promise((resolve) => setTimeout(resolve, 700));
  let idleGlance = false;
  for (let attempt = 0; attempt < 65; attempt++) {
    idleGlance = await evaluate("(()=>{const value=document.querySelector('.pouch-pupil')?.style.transform;const offsets=value?.match(/-?[0-9.]+(?=px)/g)?.map(Number);return !!offsets&&offsets.some(n=>Math.abs(n)>2)})()");
    if (idleGlance) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert(idleGlance, "Eyes glance around without pointer input");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.pouch-eye')).animationName"), "pouch-blink", "Blink animation is active");
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 40, y: 120 });
  await new Promise((resolve) => setTimeout(resolve, 600));
  assert.notEqual(await evaluate("document.querySelector('.pouch-pupil').style.transform"), "translate(0px, 0px)", "Eyes follow the pointer");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await new Promise((resolve) => setTimeout(resolve, 150));
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.single-download')).transitionDuration"), "0s");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.pouch-eye')).animationName"), "none", "Reduced motion stops blinking");
  assert.equal(await evaluate("document.querySelector('.pouch-pupil').style.transform"), "translate(0px, 0px)", "Reduced motion resets gaze");
  for (const route of ["privacy", "terms", "contact"]) {
    await send("Page.navigate", { url: siteUrl + "/" + route + "/" });
    await new Promise((resolve) => setTimeout(resolve, 350));
    assert(await evaluate("!!document.querySelector('h1')"), "Missing heading on " + route);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, "Overflow on " + route);
  }
  assert.deepEqual(errors, []);
  socket.close();
  console.log("Passed: four viewport widths, loaded artwork, flowing landing, uncropped artwork and no text overlap, theme switching/persistence, reduced motion, and support routes. No form submitted.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; process.exit(); });
