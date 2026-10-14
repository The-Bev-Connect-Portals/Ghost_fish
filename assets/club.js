/* ═══════════════════════════════════════════════════════════
   Pick-6 Club — build-your-own monthly box.

   Self-contained: reads BRAND.club, fetches its own catalog, and runs
   its own cartCreate. It never touches the regular cart, so the 2-pack
   minimum and the one-off checkout are unaffected.

   Checkout = one line (the club product, flat price, monthly selling
   plan) with the picks as line attributes. Billing, renewals, skips and
   cancellations are Shopify Subscriptions — nothing recurring lives here.
   ═══════════════════════════════════════════════════════════ */

import { BRAND } from "../brand.config.js";

const C = BRAND.club;
const PREVIEW = new URLSearchParams(location.search).get("club") === "preview";
const ENDPOINT = `https://${BRAND.shopDomain}/api/${BRAND.apiVersion}/graphql.json`;
const KEY = `club:${BRAND.slug}`;

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => `$${Number(n).toFixed(2)}`;

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json",
               "X-Shopify-Storefront-Access-Token": BRAND.storefrontToken },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Storefront API returned ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

const QUERY = `
  query Club($collection: String!, $club: String!) {
    collection(handle: $collection) {
      products(first: 100) { nodes {
        handle title availableForSale tags
        featuredImage { url(transform: { maxWidth: 240 }) altText }
      } }
    }
    product(handle: $club) {
      availableForSale
      variants(first: 1) { nodes { id availableForSale } }
      sellingPlanGroups(first: 5) { nodes { sellingPlans(first: 5) { nodes { id name } } } }
    }
  }`;

const CART_CREATE = `
  mutation ($input: CartInput!) {
    cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } }
  }`;

// "Ghostfish Kick Step IPA - 4 Pack (12oz Cans)" → "Kick Step IPA"
function beerName(title) {
  let t = title.replace(/\s+-\s+\d+\s*Pack.*$/i, "");
  for (const p of [`${BRAND.name} - `, `${BRAND.name} `]) if (t.startsWith(p)) t = t.slice(p.length);
  return t;
}
function style(p) {
  const f = (BRAND.filters || []).find((x) => x.tag && p.tags.includes(x.tag));
  return f ? f.label : "Beer";
}

let beers = [];
let picks = {};           // handle → qty
let plan = null;          // { variantId, sellingPlanId }
try { picks = JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch { picks = {}; }
const total = () => Object.values(picks).reduce((a, b) => a + b, 0);
const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(picks)); } catch {} };

function render() {
  const n = total(), full = n >= C.size;
  $("#club-list").innerHTML = beers.map((b) => {
    const q = picks[b.handle] || 0;
    const out = !b.availableForSale;
    return `<li class="club__beer${q ? " is-picked" : ""}${out ? " is-out" : ""}">
      ${b.featuredImage ? `<img src="${esc(b.featuredImage.url)}" alt="" loading="lazy" width="80" height="80">` : ""}
      <div class="club__meta"><span class="club__style">${esc(style(b))}</span>
        <span class="club__name">${esc(beerName(b.title))}</span>
        ${out ? `<span class="club__out">Sold out</span>` : ""}</div>
      <div class="club__step" role="group" aria-label="${esc(beerName(b.title))}">
        <button type="button" data-dec="${esc(b.handle)}" ${q ? "" : "disabled"} aria-label="Remove one ${esc(beerName(b.title))}">−</button>
        <output aria-live="polite">${q}</output>
        <button type="button" data-inc="${esc(b.handle)}" ${out || full ? "disabled" : ""} aria-label="Add one ${esc(beerName(b.title))}">+</button>
      </div></li>`;
  }).join("");

  $("#club-count").textContent = `${n} of ${C.size} picked`;
  $("#club-bar").style.setProperty("--fill", `${(n / C.size) * 100}%`);
  $("#club-picks").innerHTML = Object.entries(picks).filter(([, q]) => q).map(([h, q]) => {
    const b = beers.find((x) => x.handle === h);
    return b ? `<li>${esc(beerName(b.title))}${q > 1 ? ` <b>×${q}</b>` : ""}</li>` : "";
  }).join("") || `<li class="club__empty">Nothing yet — tap + on any beer.</li>`;

  const ready = n === C.size && $("#club-consent").checked && plan;
  const btn = $("#club-go");
  btn.disabled = !ready;
  btn.textContent = !plan ? "Opening soon"
    : n < C.size ? `Pick ${C.size - n} more`
    : "Start my monthly box";
}

async function start() {
  const err = $("#club-error");
  err.hidden = true;
  if (total() !== C.size || !plan) return;
  const btn = $("#club-go");
  btn.disabled = true; btn.textContent = "Preparing checkout…";

  // One attribute per can-pack so the packing slip reads like a pick list.
  // Style rides along so the warehouse can swap like-for-like on a sell-out.
  const attrs = [];
  for (const [h, q] of Object.entries(picks)) {
    const b = beers.find((x) => x.handle === h);
    for (let i = 0; i < q; i++) attrs.push(`${beerName(b.title)} (${style(b)})`);
  }
  try {
    const d = await gql(CART_CREATE, { input: {
      lines: [{ merchandiseId: plan.variantId, sellingPlanId: plan.sellingPlanId, quantity: 1,
                attributes: attrs.map((v, i) => ({ key: `Pick ${i + 1}`, value: v })) }],
      attributes: [{ key: "portal", value: BRAND.sourceTag }, { key: "box", value: "pick-6-club" }],
      note: `${C.name} via the ${BRAND.name} portal: ${attrs.join("; ")}`,
    } });
    const r = d.cartCreate;
    if (r.userErrors?.length) throw new Error(r.userErrors[0].message);
    location.href = r.cart.checkoutUrl;
  } catch (e) {
    err.textContent = `Couldn't start checkout: ${e.message} Try again, or email ${BRAND.supportEmail}.`;
    err.hidden = false;
    render();
  }
}

async function init() {
  if (!C || (!C.active && !PREVIEW)) { $("#club")?.remove(); return; }
  const sec = $("#club");
  sec.hidden = false;
  $("#club-name").textContent = C.name;
  $("#club-heading").textContent = C.heading;
  $("#club-intro").textContent = C.intro;
  $("#club-price").textContent = `${money(C.price)} / month`;
  $("#club-terms").textContent = C.terms;
  $("#club-consent-label").textContent = C.consent;

  // Nav link, added only when the section is actually on the page.
  const nav = $("#brand-nav");
  if (nav && !nav.querySelector('a[href="#club"]')) {
    const a = document.createElement("a");
    a.href = "#club"; a.textContent = C.name; a.className = nav.querySelector("a")?.className || "";
    nav.insertBefore(a, nav.children[1] || null);
  }

  sec.addEventListener("click", (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.inc && total() < C.size) picks[t.dataset.inc] = (picks[t.dataset.inc] || 0) + 1;
    else if (t.dataset.dec) { picks[t.dataset.dec] = Math.max(0, (picks[t.dataset.dec] || 0) - 1); if (!picks[t.dataset.dec]) delete picks[t.dataset.dec]; }
    else if (t.id === "club-go") return start();
    else if (t.id === "club-clear") picks = {};
    else return;
    save(); render();
  });
  $("#club-consent").addEventListener("change", render);

  try {
    const d = await gql(QUERY, { collection: BRAND.collectionHandle, club: C.productHandle });
    const order = BRAND.productOrder || [];
    beers = (d.collection?.products.nodes || [])
      .sort((a, b) => ((order.indexOf(a.handle) + 1) || 999) - ((order.indexOf(b.handle) + 1) || 999));
    // Drop picks that are no longer offered or have sold out.
    for (const h of Object.keys(picks)) {
      const b = beers.find((x) => x.handle === h);
      if (!b || !b.availableForSale) delete picks[h];
    }
    const v = d.product?.variants.nodes[0];
    const sp = d.product?.sellingPlanGroups.nodes[0]?.sellingPlans.nodes[0];
    if (v?.availableForSale && sp) plan = { variantId: v.id, sellingPlanId: sp.id };
    else if (PREVIEW) $("#club-error").hidden = false,
      $("#club-error").textContent = "Preview: the club product or its monthly plan isn't set up in Shopify yet, so checkout is off.";
  } catch (e) {
    $("#club-list").innerHTML = `<li class="club__empty">Couldn't load the beers. Refresh, or email ${esc(BRAND.supportEmail)}.</li>`;
    return;
  }
  render();
}

init();
