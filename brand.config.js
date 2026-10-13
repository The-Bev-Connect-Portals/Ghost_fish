// ─────────────────────────────────────────────────────────────
//  BRAND CONFIG — the only file that changes to onboard a brewery.
//
//  If you find yourself editing assets/app.js or assets/styles.css to
//  onboard a client, the abstraction leaked. Fix it here instead, then
//  push the fix back to portal-template so every future brand gets it.
//
//  Every value below marked  ‹REPLACE›  must be changed. Search the file
//  for that marker before you deploy — nothing else should need touching.
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  // ── Identity ──────────────────────────────────────────────
  //  `slug` is load-bearing. It is the single string that has to match
  //  across five systems. Set it once, here, and derive everything else
  //  from it. See NAMING in the README.
  //
  //    slug                 rincon
  //    repo                 jgrasty123/portal-rincon
  //    Shopify product tag  portal:rincon
  //    smart collection     portal-rincon        ← collectionHandle below
  //    cart attribute       portal = rincon
  //    Netlify site         portal-rincon
  //
  slug: "ghostfish",

  name: "Ghostfish",
  logo: "/assets/logo.png",
  favicon: "/assets/favicon.png",

  // Set true when the logo file already contains the brand name as a
  // wordmark — the text beside it is then hidden visually but kept for
  // screen readers, so the name isn't printed twice.
  logoIncludesName: true,   // assets/logo.png is their black header wordmark

  // Optional hero wordmark: replaces the brand name in the H1 with an
  // image. Leave null unless the client supplies a clean bare logotype.
  heroMark: null,

  // Optional hero badge (e.g. an award, a claim stamp). Client artwork
  // only — do not invent one. Leave null to hide.
  //  Ghostfish's own fish emblem (from their site icon), circle-cropped.
  heroBadge: { image: "/assets/ghostfish-emblem.png", label: "Ghostfish Brewing Company emblem" },
  // heroBadge: { image: "/assets/badge.png", label: "Est. 1998" },

  // ── Look ──────────────────────────────────────────────────
  //  EXTRACT these from the client's live site. Do not invent a palette.
  //  Save their homepage as HTML and pull the most frequent hex values
  //  from the CSS; the theme-color meta tag is usually their primary.
  //
  //  ⚠ Check whether their site is LIGHT or DARK before designing anything.
  //    The values below are a neutral light default so an un-themed deploy
  //    looks obviously unfinished rather than accidentally plausible.
  colors: {
    //  Extracted 2026-10-13 from ghostfishbrewing.com (WordPress, Bootswatch
    //  "Slate" preset + child theme). Their site is LIGHT: white header and
    //  ground, #181818 nav text, slate #3A3F44 primary, tan #C89452 accent
    //  on hero buttons and the cookie bar.
    //  WCAG: #C89452 with white text is ~2.6:1 and fails, so the primary
    //  button uses their slate (#3A3F44 / white, ~11:1) and the tan stays a
    //  highlight only.
    bg:         "#FFFFFF",
    surface:    "#F4F4F2",
    surfaceAlt: "#E9ECEF",   // Bootswatch Slate --light
    text:       "#181818",   // their nav text
    muted:      "#5F666C",   // their --gray #7A8288 darkened to 5.7:1 on white
    line:       "#DADDE0",
    accent:     "#3A3F44",   // their --primary
    accentText: "#FFFFFF",
    gold:       "#C89452",   // their tan accent
  },

  //  Pull the real faces from their Google Fonts <link> and font-family
  //  declarations. If their type is licensed and self-hosted, we do not
  //  have the license — pick the closest free stand-in and say so here.
  fonts: {
    //  Their site loads Roboto Slab + Roboto from Google Fonts.
    display: "'Roboto Slab', Georgia, serif",
    body:    "'Roboto', system-ui, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;700" +
      "&family=Roboto:wght@400;500;700&display=swap",
  },

  // ── Shipping coverage page ────────────────────────────────
  //  Drives /shipping.html. Which coverage map applies to this
  //  brand's products:
  //    "beer"     beer, wine, malt- and wine-based RTDs  (46 + DC)
  //    "spirits"  spirits and spirits-based RTDs         (40 + DC)
  //  Spirits-based canned cocktails are "spirits", not "beer".
  //  Both listed renders a toggle. The state data itself lives in
  //  assets/shipping-coverage.js and is identical in every repo.
  shipping: { categories: ["beer"] },

  // ── Copy ──────────────────────────────────────────────────
  tagline: "Award-winning gluten free beer, brewed in Seattle and shipped to your door.",
  heroKicker: "Unusual grains, legendary taste",   // their homepage headline

  // The logo links here. On our subdomain this is the only thread back
  // to the brand — it must point at their real site, never at us.
  backToSiteUrl: "https://ghostfishbrewing.com/",
  backToSiteLabel: "Back to Main Site",

  // Header nav. Mirror the client's own nav where it has an equivalent;
  // link out to their site where it doesn't. `external: true` opens a
  // new tab and adds rel="noopener".
  nav: [
    { label: "Shop",  href: "#grid" },
    { label: "Our Beers", href: "https://ghostfishbrewing.com/beers/", external: true },
    { label: "Taproom", href: "https://ghostfishbrewing.com/taproom/", external: true },
    { label: "Where We Ship", href: "#shipping" },
  ],

  // Announcement bar. DISPLAY ONLY — never the enforcement layer.
  // Do not name states here. Destination eligibility is decided at
  // Shopify checkout and nowhere else.
  shippingLine:
    "Shipping eligibility is confirmed at checkout. Adult 21+ signature required.",

  // Section headings and empty states. Here so brewery vocabulary can be
  // swapped without touching app.js.
  labels: {
    filtersHeading:  "Style",
    emptyFilterTitle: "Nothing here yet",
    emptyFilterLine:  "No beers match that filter right now. Try another style.",
    cartEmptyTitle:   "Your cart is empty.",
    cartEmptyLine:    "Add a few beers and they'll show up here.",
    addLabel:         "Add",
    soldOutLabel:     "Sold out",
  },

  // ── Adult signature ───────────────────────────────────────
  //  Disclosure only. The fee is applied at Shopify checkout as a
  //  shipping-rate component, NOT as a cart line here.
  //
  //  ⚠ ONCE PER ORDER, not per line item. If a customer sees $5.99 here
  //    and is charged $17.97 at checkout for three items, that is a
  //    checkout-side misconfiguration — fix it there, not by editing this
  //    copy. This has gone wrong before on bundled products.
  adultSignature: {
    active: true,
    fee: 5.99,
    line: "Adult signature required on delivery \u2014 $5.99 per order, " +
          "added at checkout. Someone 21+ must be there to sign.",
  },

  // ── Pre-sale ──────────────────────────────────────────────
  //  Set active:false the day stock ships and the entire treatment
  //  disappears — announcement bar, notice card, and cart drawer note.
  //  `window` empty renders `line` alone; fill it as soon as a real
  //  ship window is confirmed. Vague windows generate support email.
  presale: {
    active: false,
    label: "Pre-Sale Only",
    line: "Shipping soon",
    window: "",                            // e.g. "Ships the week of Oct 6"
    note: "You're pre-ordering. Your card is charged today and your order " +
          "ships as soon as stock lands.",
  },

  // ── Minimum order quantity ────────────────────────────────
  //  THE PORTAL DOES NOT ENFORCE THIS. It sets expectations and disables
  //  its own checkout button. The cart is localStorage and the Shopify
  //  checkout URL is a plain shareable link, so anything decided here can
  //  be walked around. Real enforcement is the Yuko validation function
  //  (Shopify Functions), which runs server-side and covers Shop Pay and
  //  the other express buttons too.
  //
  //  ⚠ `scope` MUST match how the Yuko rule is configured:
  //      "cart" → Yuko scope Cart — minimum N total items, any mix
  //      "line" → Yuko scope Product/Variant — minimum N of each item
  //
  //  ⚠ The Yuko rule MUST be scoped to THIS brand's collection
  //    (portal-<slug>). bro-basket.myshopify.com serves BroBasket and
  //    Go-To Gifting from the same store; an unscoped rule puts a
  //    minimum on every gift basket order on the account.
  minOrder: {
    //  James, 2026-10-13: Ghostfish always has a two-pack minimum — any two
    //  4-packs, mixed or matched. Same rule as Topa Topa and Fig Mountain.
    //  The portal only disables its own checkout button; real enforcement is
    //  a Yuko rule on Brew Hunters, scope Cart, min 2, limited to the
    //  ghostfish-brewing-company collection. Unscoped, it would hit every
    //  Brew Hunters order.
    //  If a variety pack or case is ever added, the "4-packs" copy below
    //  goes stale — switch it to unit-neutral wording.
    active: true,
    qty: 2,
    scope: "cart",
    heading: "2-pack minimum",
    line: "Orders start at two 4-packs. Mix and match any beers you like.",
  },

  // ── Promo ticker ──────────────────────────────────────────
  //  Scrolling band under the hero, drawn in CSS from the palette (no
  //  dependency on the client's CDN). Copy only — nothing is added to the
  //  cart and nothing reaches the Bev Connect pick list. Anything promised
  //  here has to be fulfilled by hand, so switch it off the moment the
  //  offer ends.
  //
  //  `tickerText` repeats, so keep it short. `line` is the full sentence:
  //  read once by screen readers, and shown as static text instead of the
  //  scroll for visitors who prefer reduced motion.
  promo: {
    active: false,
    tickerText: "",
    line: "",
  },

  // ── Help widget ───────────────────────────────────────────
  //  Floating "?" button, bottom right. Posts to Netlify Forms — no
  //  backend, no third-party script, no cookies.
  //
  //  ⚠ TWO THINGS OR IT SILENTLY FAILS:
  //    1. Form detection must be enabled in the Netlify dashboard.
  //       A 404 on POST with correct markup means detection was never
  //       turned on — it is not a code bug. Netlify's post-processor
  //       strips data-netlify and the honeypot attrs from the deployed
  //       HTML when detection worked; that's the reliable signal.
  //    2. Set the notification email under Site configuration → Forms →
  //       Form notifications, or nobody ever sees a submission.
  //
  //  formName must also be updated in index.html — twice (the form's
  //  name attribute and the hidden form-name input).
  helpForm: {
    active: true,
    formName: "ghostfish-help",
    heading: "Need a hand?",
    line: "Questions about an order or shipping? Send a note and we'll " +
          "get back to you.",
    success: "Thanks \u2014 we've got it. We'll reply by email shortly.",
  },

  // Shown if the catalog fails to load. Go-To Gifting is the seller of
  // record, so this is our contact unless the client wants theirs.
  supportEmail: "james@gotogifting.com",
  supportPhone: "",

  // ── Filters ───────────────────────────────────────────────
  //  Build these from the tags actually on the products, not from a spec.
  //  A filter with zero matching products hides itself, so a partial tag
  //  pass degrades quietly instead of showing empty categories — check
  //  the live grid, don't assume.
  filters: [
    //  ⚠ These tags are on the DEMO products only. Ghostfish's own store has
    //  no tags at all, and the Brew Hunters copies carry bucket tags
    //  (bh:*, portal:ghostfish), not style tags. Add these flat style tags
    //  to the Brew Hunters products before going live or every filter but
    //  "All Beer" hides itself.
    { label: "All Beer",   tag: null },
    { label: "IPA",        tag: "ipa" },
    { label: "Pale Ale",   tag: "pale-ale" },
    { label: "Lager",      tag: "lager" },
    { label: "Stout",      tag: "stout" },
    { label: "Belgian",    tag: "belgian" },
    { label: "Sour",       tag: "sour" },
    { label: "Seasonal",   tag: "seasonal" },
  ],

  // ── Shopify ───────────────────────────────────────────────
  //  Catalog is filtered by COLLECTION HANDLE, not by vendor.
  //  Do not "simplify" this back to a vendor query: installed apps
  //  (Route, Rise.ai, Fast Bundle, BYOB) write to the vendor field, so
  //  that namespace is polluted and returns wrong or partial catalogs.
  //
  //  Set up: tag the products portal:<slug> → build a smart collection on
  //  that tag → put its handle here. If the handle is wrong the portal
  //  fails loud with a named error rather than rendering an empty grid.
  //
  //  ⚠ portal-<slug> collections are ALWAYS smart, never manual. The rule is
  //    TAG EQUALS portal:<slug>, appliedDisjunctively: false. Tagging a
  //    product is therefore the ONE action that puts it in the grid.
  //    A manual collection looks identical in admin but silently drops any
  //    newly tagged product, so check before trusting it:
  //      collectionByHandle(handle:"portal-<slug>") { ruleSet }
  //    ruleSet: null means manual — convert it with collectionUpdate before
  //    adding products. All six portal collections were converted 2026-09-10.
  // Merchandising order, by product handle. Shopify smart collections cannot
  // be sorted manually, so the order lives here. Handles not listed keep their
  // Shopify order and follow the listed ones — a newly tagged product always
  // shows up, it just lands at the end until you add it here.
  // Leave as [] to use Shopify's own collection sort.
  productOrder: ["it-came-from-the-haze-hazy-ipa", "kick-step-ipa", "grapefruit-ipa", "peak-buster-dipa", "vanishing-point-pale-ale", "meteor-shower-pale-lager", "watchstander-stout", "shrouded-summit-belgian-white-ale", "gosefish", "lunar-harvest-pumpkin-ale"],

  collectionHandle: "ghostfish-brewing-company",   // Brew Hunters smart collection, TAG EQUALS portal:ghostfish (created 2026-09-14)

  shopDomain: "fbxhgf-1f.myshopify.com",   // Brew Hunters

  //  Public Storefront token from the brand's own Headless storefront.
  //  Safe to ship client-side: read-only, scoped to public product data.
  //  Give every brand its own so it can be rotated independently.
  //  NEVER put an Admin API token here.
  storefrontToken: "REPLACE",              // ‹REPLACE› public token from a "Ghostfish" Headless channel on Brew Hunters — not created yet
  apiVersion: "2026-04",

  //  Written onto the Shopify cart as an attribute. This is what the
  //  Shopify Flow order-tagging workflow keys on for portal attribution,
  //  and what invoicing and P&L allocation read.
  //
  //  ⚠ Flow must be configured against the CART ATTRIBUTE, not product
  //    tags, and the value must match `slug` exactly. Getting this wrong
  //    means orders land untagged and the client's commission can't be
  //    calculated. Verify with a real test order before launch.
  sourceTag: "ghostfish",

  // Seller of record. Legally operative — do not soften, do not blur to
  // make the handoff feel more seamless.
  sellerOfRecord: "Go-To Gifting",
  sellerNote:
    "Checkout is handled by Go-To Gifting, our licensed retail partner.",

  // ── DEMO MODE ─────────────────────────────────────────────
  //  While `demoProducts` is a non-empty array the portal renders from it
  //  and never calls Shopify. Checkout is disabled and says so plainly —
  //  it does not pretend to work. Use this for pitch previews before the
  //  client's products exist in the store.
  //
  //  Going live: import the products, publish them to this brand's
  //  Headless storefront, paste the token above, set demoProducts: [].
  demoProducts: [
    //  Snapshot of ghostfish-beer.myshopify.com, 2026-10-13: prices, pack sizes,
    //  sold-out flags and copy are THEIR live listings, not ours. ABV / IBU /
    //  awards appear only where their own copy states them. The Beer of the
    //  Month subscription is left out on purpose (portals don't do subscriptions).
    {"id": "ghostfish-it-came-from-the-haze-hazy-ipa", "title": "Ghostfish - It Came From the Haze Hazy IPA", "handle": "it-came-from-the-haze-hazy-ipa", "tags": ["ipa", "hazy-ipa"], "description": "Our rotating Hazy IPA series — each batch evolves with a different blend of hops. Hazy, juicy and expressive, with strong notes of pineapple and papaya, full-bodied, with resinous, dank, grassy notes on the back end.", "specs": ["4-pack of 16oz cans", "6% ABV", "47 IBU", "2023 Great American Beer Festival® Gold Medal, Gluten Free Beer"], "inStock": true, "image": "/assets/products/it-came-from-the-haze-hazy-ipa.jpg", "alt": "It Came From the Haze Hazy IPA, 4-pack of 16oz cans", "price": {"amount": "21.99", "currencyCode": "USD"}},
    {"id": "ghostfish-kick-step-ipa", "title": "Ghostfish - Kick Step IPA", "handle": "kick-step-ipa", "tags": ["ipa"], "description": "A classic NW-style IPA, golden in color with complex hop aromas of citrus, mango and pine. Sturdy, yet light bodied with a dry finish. A project beer with The Mountaineers.", "specs": ["4-pack of 12oz cans"], "inStock": true, "image": "/assets/products/kick-step-ipa.jpg", "alt": "Kick Step IPA, 4-pack of 12oz cans", "price": {"amount": "17.99", "currencyCode": "USD"}},
    {"id": "ghostfish-grapefruit-ipa", "title": "Ghostfish - Grapefruit IPA", "handle": "grapefruit-ipa", "tags": ["ipa"], "description": "Brewed with grapefruit peel and an experimental hop codenamed “Experimental Grapefruit” — a serious citrus bomb. Lively and bright, bracingly bitter, and eminently refreshing.", "specs": ["4-pack of 12oz cans"], "inStock": true, "image": "/assets/products/grapefruit-ipa.jpg", "alt": "Grapefruit IPA, 4-pack of 12oz cans", "price": {"amount": "17.99", "currencyCode": "USD"}},
    {"id": "ghostfish-peak-buster-dipa", "title": "Ghostfish - Peak Buster DIPA", "handle": "peak-buster-dipa", "tags": ["ipa", "double-ipa"], "description": "A mountain of Summit, Azacca, Centennial and Eureka hops on a heavy foundation of malted rice, millet and buckwheat. Over-the-top passionfruit, mango and pine.", "specs": ["4-pack of 16oz cans"], "inStock": true, "image": "/assets/products/peak-buster-dipa.jpg", "alt": "Peak Buster DIPA, 4-pack of 16oz cans", "price": {"amount": "21.99", "currencyCode": "USD"}},
    {"id": "ghostfish-vanishing-point-pale-ale", "title": "Ghostfish - Vanishing Point Pale Ale", "handle": "vanishing-point-pale-ale", "tags": ["pale-ale"], "description": "A classic American pale ale built on artisan gluten-free millet and rice malts and four varieties of Washington-grown hops.", "specs": ["4-pack of 12oz cans"], "inStock": true, "image": "/assets/products/vanishing-point-pale-ale.jpg", "alt": "Vanishing Point Pale Ale, 4-pack of 12oz cans", "price": {"amount": "17.99", "currencyCode": "USD"}},
    {"id": "ghostfish-meteor-shower-pale-lager", "title": "Ghostfish - Meteor Shower Pale Lager", "handle": "meteor-shower-pale-lager", "tags": ["lager"], "description": "Sparkling, crisp and highly refreshing. Malted millet and California-grown brown rice, kissed by Noble German Perle hops for a light bitterness and a floral aroma.", "specs": ["4-pack of 12oz cans"], "inStock": false, "image": "/assets/products/meteor-shower-pale-lager.jpg", "alt": "Meteor Shower Pale Lager, 4-pack of 12oz cans", "price": {"amount": "17.99", "currencyCode": "USD"}},
    {"id": "ghostfish-watchstander-stout", "title": "Ghostfish - Watchstander Stout", "handle": "watchstander-stout", "tags": ["stout"], "description": "Dark roasts of malted millet, buckwheat and brown rice bring dark chocolate, toasted marshmallow and coffee. Gluten free rolled oats give it a fluffy mouthfeel. Pair with chili, stew, or cookies by the fire.", "specs": ["4-pack of 16oz cans", "2015 Great American Beer Festival Gold Medal, Gluten Free Beer"], "inStock": true, "image": "/assets/products/watchstander-stout.jpg", "alt": "Watchstander Stout, 4-pack of 16oz cans", "price": {"amount": "21.99", "currencyCode": "USD"}},
    {"id": "ghostfish-shrouded-summit-belgian-white-ale", "title": "Ghostfish - Shrouded Summit Belgian White Ale", "handle": "shrouded-summit-belgian-white-ale", "tags": ["belgian"], "description": "A proper witbier without wheat or barley. Hazy golden body, a snowy head, juniper and citrus, and classic Belgian-style aromatics of banana, clove and sweet orange.", "specs": ["4-pack of 12oz cans"], "inStock": false, "image": "/assets/products/shrouded-summit-belgian-white-ale.jpg", "alt": "Shrouded Summit Belgian White Ale, 4-pack of 12oz cans", "price": {"amount": "17.99", "currencyCode": "USD"}},
    {"id": "ghostfish-gosefish", "title": "Ghostfish - Gosefish", "handle": "gosefish", "tags": ["sour", "seasonal"], "description": "A vivid pink, tart, salty, refreshing take on the traditional German sour ale, brewed with cranberry, hibiscus and coriander.", "specs": ["4-pack of 16oz cans", "5.0% ABV", "8 IBU"], "inStock": true, "image": "/assets/products/gosefish.jpg", "alt": "Gosefish, 4-pack of 16oz cans", "price": {"amount": "19.99", "currencyCode": "USD"}},
    {"id": "ghostfish-lunar-harvest-pumpkin-ale", "title": "Ghostfish - Lunar Harvest Pumpkin Ale", "handle": "lunar-harvest-pumpkin-ale", "tags": ["seasonal"], "description": "Our annual Belgian-style pumpkin ale: fall spices and pumpkin purée blended with the fruity esters of Belgian yeast. Warm and refreshing at once.", "specs": ["4-pack of 16oz cans", "5.0% ABV", "20 IBU", "Silver Medal, Pastry/Dessert Beer — 2021 Sip Magazine Best of the Northwest"], "inStock": false, "image": "/assets/products/lunar-harvest-pumpkin-ale.jpg", "alt": "Lunar Harvest Pumpkin Ale, 4-pack of 16oz cans", "price": {"amount": "21.99", "currencyCode": "USD"}},
  ],
};
