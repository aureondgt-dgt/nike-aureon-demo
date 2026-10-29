import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
await mkdir(".design-check", { recursive: true });
const browser = await chromium.launch();
const baseUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4173";
const results = [];

async function photos(page) {
  return page.evaluate(async () => {
    const images = [...document.images];
    images.forEach((image) => { image.loading = "eager"; });
    await Promise.all(images.map((image) => image.decode().catch(() => {})));
    return images.map((image) => ({ alt: image.alt, loaded: image.complete && image.naturalWidth > 0, embedded: image.src.startsWith("data:image/") }));
  });
}
async function checkPhotos(page) {
  const list = await photos(page);
  assert(list.length >= 10);
  assert(list.every((photo) => photo.loaded && photo.embedded), JSON.stringify(list.filter((photo) => !photo.loaded || !photo.embedded)));
  return list.length;
}
async function section(page, id) {
  await page.locator(`#${id}`).evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
  await page.waitForTimeout(900);
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route("**/*", (route) => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  await context.addInitScript(() => { localStorage.setItem("nike-consent-v1", "essential"); });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);
  const photoCount = await checkPhotos(page);
  assert(await page.evaluate(() => document.fonts.check('800 italic 40px "Barlow Condensed"')));
  await page.screenshot({ path: ".design-check/desktop-hero.png" });
  for (const id of ["colecao", "tecnologia", "cultura", "by-you", "faq", "membros"]) {
    await section(page, id);
    await page.screenshot({ path: `.design-check/desktop-${id}.png` });
  }
  await page.screenshot({ path: ".design-check/desktop-full.png", fullPage: true });

  await section(page, "colecao");
  assert.equal(await page.locator("#colecao article").count(), 7);
  await page.locator("#colecao article").first().locator(".product-heart").click();
  await page.getByRole("button", { name: "Ver 1 favoritos", exact: true }).click();
  await page.waitForTimeout(600);
  assert.equal(await page.locator("#colecao article").count(), 1);
  await page.locator(".filter-tab").filter({ hasText: "Todos" }).click();
  await page.selectOption("#sort", "menor");
  await page.waitForTimeout(450);
  assert((await page.locator("#colecao article").first().innerText()).includes("799,99"));
  await page.selectOption("#sort", "destaques");
  await page.waitForTimeout(450);
  await page.locator("#colecao article").first().getByRole("button", { name: /em detalhes/ }).click();
  const detail = page.getByRole("dialog", { name: /Detalhes de/ });
  await detail.waitFor();
  await page.waitForTimeout(500);
  await page.keyboard.press("Tab");
  assert(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog[open]"))), "Dialog must retain keyboard focus");
  await page.screenshot({ path: ".design-check/desktop-product.png" });
  await detail.getByRole("button", { name: "Adicionar à sacola", exact: true }).click();
  assert(await detail.getByRole("alert").isVisible());
  await detail.getByRole("button", { name: "Guia de tamanhos" }).click();
  const guide = page.getByRole("dialog", { name: "Guia de tamanhos", exact: true });
  await guide.getByLabel("Comprimento do pé (cm)").fill("26,8");
  assert(await guide.getByText("BR 42", { exact: true }).first().isVisible());
  await page.keyboard.press("Escape");
  assert(await detail.isVisible());
  await detail.locator(".size-grid button").filter({ hasText: /^42$/ }).click();
  await detail.getByRole("button", { name: "Ampliar foto" }).click();
  assert(await detail.locator(".pdp-photo.is-zoomed").count());
  await detail.getByRole("button", { name: "Diminuir foto" }).click();
  await detail.getByRole("button", { name: "Ver foto original" }).click();
  await page.waitForTimeout(500);
  await checkPhotos(page);
  await detail.getByRole("button", { name: "Adicionar à sacola", exact: true }).click();
  const bag = page.getByRole("dialog", { name: "Sua sacola", exact: true });
  await bag.waitFor();
  await bag.getByRole("button", { name: "Aumentar quantidade" }).click();
  await bag.getByRole("button", { name: "Diminuir quantidade" }).click();
  await page.screenshot({ path: ".design-check/desktop-bag.png" });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Abrir sacola com 1 itens" }).click();
  await bag.waitFor();
  assert(await bag.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0));
  await bag.getByRole("button", { name: "Finalizar compra" }).click();
  await bag.getByLabel("Nome", { exact: true }).fill("Atleta Teste");
  await bag.getByLabel("E-mail", { exact: true }).fill("atleta@example.com");
  await bag.getByLabel("CEP", { exact: true }).fill("01001000");
  await bag.getByLabel("Entendo que este é um pedido de demonstração.").check();
  await page.screenshot({ path: ".design-check/desktop-checkout.png" });
  await bag.getByRole("button", { name: "Confirmar simulação" }).click();
  await bag.getByText("Demonstração concluída", { exact: true }).waitFor();
  await bag.getByRole("button", { name: "Continuar explorando" }).click();
  assert(await page.getByRole("button", { name: "Abrir sacola com 0 itens" }).count());

  await page.getByRole("button", { name: "Buscar produtos", exact: true }).click();
  const search = page.getByRole("dialog", { name: "Buscar produtos", exact: true });
  await search.getByRole("textbox").fill("zzzzzzz");
  assert(await search.getByText("Nenhum par por aqui. Ainda.").isVisible());
  await search.getByRole("textbox").fill("Dunk");
  await search.locator(".search-results > button").first().click();
  await detail.waitFor();
  await page.keyboard.press("Escape");

  await section(page, "by-you");
  await page.getByRole("button", { name: "Personalizar Air Max 97", exact: true }).click();
  await page.getByLabel("Deixe sua marca", { exact: false }).fill("MEGA");
  await page.locator("#by-you .size-grid button").filter({ hasText: /^43$/ }).click();
  await page.getByRole("button", { name: "Adicionar minha criação" }).click();
  await bag.waitFor();
  assert((await bag.innerText()).includes("MEGA"));
  assert((await bag.innerText()).includes("BR 43"));
  await bag.getByRole("button", { name: /Remover .* da sacola/ }).click();
  assert(await bag.getByText("Todo movimento", { exact: false }).isVisible());
  await bag.getByRole("button", { name: "Fechar sacola" }).click();

  await section(page, "membros");
  await page.getByLabel("Qual é o seu e-mail?").fill("atleta@example.com");
  await page.getByLabel("Concordo em salvar meu interesse neste navegador.").check();
  await page.getByRole("button", { name: "Entrar no movimento", exact: true }).click();
  assert(await page.getByText("Você faz parte do próximo passo.").isVisible());
  assert.deepEqual(errors, []);
  results.push({ desktop: true, photoCount, localFonts: true, favorites: true, filters: true, sort: true, zoom: true, sizeGuide: true, cartPersistence: true, checkout: true, search: true, customizer: true, membership: true, errors });
  await context.close();

  for (const width of [390, 360]) {
    const mobile = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    await mobile.route("**/*", (route) => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await mobile.addInitScript(() => localStorage.setItem("nike-consent-v1", "essential"));
    const p = await mobile.newPage();
    const mobileErrors = [];
    p.on("pageerror", (error) => mobileErrors.push(error.message));
    await p.goto(baseUrl, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1300);
    await checkPhotos(p);
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Horizontal overflow on mobile");
    await p.screenshot({ path: `.design-check/mobile-${width}-hero.png` });
    await p.getByRole("button", { name: "Proximo modelo" }).click();
    await p.waitForTimeout(1400);
    assert((await p.locator(".hero-current").innerText()).includes("Air Max 97"));
    await p.getByRole("button", { name: "Abrir menu" }).click();
    await p.waitForTimeout(600);
    await p.screenshot({ path: `.design-check/mobile-${width}-menu.png` });
    await p.getByRole("dialog", { name: "Menu principal" }).getByRole("link", { name: /A coleção/ }).click();
    await section(p, "colecao");
    await p.screenshot({ path: `.design-check/mobile-${width}-collection.png` });
    await p.locator("#colecao article").first().getByRole("button", { name: /em detalhes/ }).click();
    await p.getByRole("dialog", { name: /Detalhes de/ }).waitFor();
    await p.waitForTimeout(600);
    await p.screenshot({ path: `.design-check/mobile-${width}-product.png` });
    const mobileDetail = p.getByRole("dialog", { name: /Detalhes de/ });
    await mobileDetail.locator(".size-grid button").filter({ hasText: /^42$/ }).click();
    await mobileDetail.getByRole("button", { name: "Adicionar à sacola", exact: true }).click();
    const mobileBag = p.getByRole("dialog", { name: "Sua sacola", exact: true });
    await mobileBag.waitFor();
    await p.waitForTimeout(500);
    await p.screenshot({ path: `.design-check/mobile-${width}-bag.png` });
    await mobileBag.getByRole("button", { name: "Finalizar compra" }).click();
    await p.screenshot({ path: `.design-check/mobile-${width}-checkout.png` });
    await mobileBag.getByRole("button", { name: "Fechar sacola" }).click();
    for (const id of ["tecnologia", "cultura", "by-you", "membros"]) { await section(p, id); await p.screenshot({ path: `.design-check/mobile-${width}-${id}.png` }); }
    assert(await p.locator(".membership-layout").evaluate((element) => element.scrollWidth <= element.clientWidth + 1), "Membership content must fit mobile viewport");
    assert.deepEqual(mobileErrors, []);
    results.push({ mobile: width, photos: true, menu: true, noOverflow: true, errors: mobileErrors });
    await mobile.close();
  }
  const standalone = await browser.newPage();
  await standalone.route("https://**/*", (route) => route.abort());
  await standalone.goto(pathToFileURL(resolve("dist/index.html")).href);
  await checkPhotos(standalone);
  results.push({ standaloneHtml: true, embeddedPhotos: true });
  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await reduced.route("**/*", (route) => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const still = await reduced.newPage();
  await still.goto(baseUrl, { waitUntil: "networkidle" });
  await still.mouse.move(300, 330);
  assert(await still.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches));
  assert.equal(await still.locator(".hero-perspective").evaluate((element) => getComputedStyle(element).transform), "none");
  await reduced.close();
  results.push({ reducedMotion: true, keyboardFocus: true });
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }