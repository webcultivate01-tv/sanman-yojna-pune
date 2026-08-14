# SEO & Google indexing — sanmanyojana.org

Everything in this file is about getting the site found. The live domain is
**https://sanmanyojana.org** (apex, no `www`). Every canonical URL, Open Graph
URL, sitemap entry and structured-data `@id` in the repo points at that host — if
the domain ever changes, search and replace `sanmanyojana.org` across `*.html`,
`robots.txt` and `sitemap.xml` in one pass, or Google will index the wrong host.

## What is already in the pages

Each of the 11 pages carries, in `<head>`:

| Tag | Purpose |
| --- | --- |
| `<title data-i18n="page.title.*">` | The blue link in search results. Under 60 characters so it is not truncated. |
| `<meta name="description" data-i18n-content="page.desc.*">` | The grey snippet under the link. Under ~160 characters. |
| `<link rel="canonical">` | Tells Google the one true URL for the page. |
| `<meta name="robots" content="index, follow, max-image-preview:large">` | Explicitly allows indexing and large image previews. |
| Open Graph + Twitter tags | The preview card on WhatsApp, Facebook and X. |
| `application/ld+json` | Structured data — see below. |

Titles and descriptions live in `assets/js/i18n.js` under the `page.title.*` and
`page.desc.*` keys, in all three languages. When the visitor switches language,
`applyI18n()` in `assets/js/main.js` rewrites both the `<title>` and the meta
description. Google crawls the English HTML as served, so **the English strings
in the HTML are the ones that rank** — keep the HTML `content=` attribute and the
`en` entry in `i18n.js` saying the same thing.

## The share card (what shows up when the link is pasted into WhatsApp)

Every page points `og:image` and `twitter:image` at
`assets/img/og-logo.jpg` — the brand logo centred on a cream 1200x630 card, 69 KB.
Three things about it are deliberate:

- **1200x630.** WhatsApp only draws the big preview card for images at or near
  1.91:1; anything squarer collapses to a small corner thumbnail.
- **JPEG, under 300 KB.** WhatsApp refuses to fetch heavy previews, which is why
  `assets/img/logo.png` (14222x14222, 16 MB) can never be used here directly. The
  card is generated from it, not linked to it. WebP is unreliable in previews too.
- **Absolute URL on the live host.** Relative paths silently produce no preview.

If the logo art changes, regenerate the card at the same path and size, then paste
a page URL into <https://developers.facebook.com/tools/debug/> and hit *Scrape
Again* — WhatsApp and Facebook share that cache and will otherwise keep serving
the old image for days.

`hero-poster.jpg` is still the `image` on the `FuneralHome` schema node, and that
is correct: Google wants a photograph of the business there, not a logotype.

## Structured data (what Google reads for rich results)

| Page | Schema types |
| --- | --- |
| `index.html` | `FuneralHome` (the business: address, phone, hours, geo, offer catalogue) + `WebSite` |
| `services.html` | `ItemList` of the 8 services + `WebPage` + `BreadcrumbList` |
| `packages.html` | `CollectionPage` + `ItemList` of the 4 priced plans + `BreadcrumbList` |
| `package-*.html` | `Service` with a priced `Offer` + `BreadcrumbList` |
| `about.html` | `AboutPage` + `BreadcrumbList` |
| `contact.html` | `ContactPage` (address, phone, geo) + `BreadcrumbList` |
| `gallery.html` | `ImageGallery` + `BreadcrumbList` |
| `terms.html` | `WebPage` + `BreadcrumbList` |

Everything references the single organisation node `https://sanmanyojana.org/#organization`
defined on the home page, so Google treats it as one business, not eleven.

**Keep in sync**: the phone, address, geo coordinates and plan prices appear in
`assets/js/config.js`, in the JSON-LD, and in the visible page text. If one
changes, change all three — mismatched NAP (name/address/phone) data is the most
common reason a local business panel fails to appear.

Validate any change at <https://search.google.com/test/rich-results>.

## Getting indexed — do these in order

1. **Deploy** so `https://sanmanyojana.org/` serves the site over HTTPS.
   Confirm `https://sanmanyojana.org/robots.txt` and
   `https://sanmanyojana.org/sitemap.xml` both load in a browser.
2. **Pick one hostname.** If both `sanmanyojana.org` and `www.sanmanyojana.org`
   resolve, 301-redirect `www` → apex at the host/DNS level. Same for
   `http` → `https`. Two reachable hostnames split the ranking signals.
3. **Verify in Google Search Console** — <https://search.google.com/search-console>.
   Add property → URL prefix → `https://sanmanyojana.org` → HTML tag method.
   Paste the token into the commented `google-site-verification` tag near the top
   of `index.html`, uncomment it, deploy, then click Verify.
   (Domain-property verification via a DNS TXT record also works and covers every
   subdomain — use it if you have DNS access.)
4. **Submit the sitemap**: Search Console → Sitemaps → enter `sitemap.xml` → Submit.
5. **Request indexing for the home page**: Search Console → URL Inspection →
   paste `https://sanmanyojana.org/` → Request Indexing. Do the same for
   `services.html`, `packages.html` and `contact.html`. The rest follow from the
   sitemap. Expect a few days to a couple of weeks for first appearance.
6. **Google Business Profile** — <https://business.google.com>. For a local
   funeral service in Pune this drives more calls than the website ranking does.
   Use the exact same name, address and phone as `config.js`, pick the "Funeral
   home" category, add photos, and link the site to `https://sanmanyojana.org/`.
7. **Bing Webmaster Tools** — <https://www.bing.com/webmasters>. It can import
   the Search Console property directly, which also covers DuckDuckGo.

## Maintenance

- **New page** → add it to `sitemap.xml`, give it a `page.title.*` / `page.desc.*`
  pair in all three languages, and copy the `<head>` block from a sibling page
  (canonical, OG, Twitter, JSON-LD all need the new URL).
- **Content change on a page** → bump that page's `<lastmod>` in `sitemap.xml`.
- **Price change** → update `config.js`, the visible price, the meta description,
  and the `Offer` price in the page's JSON-LD *and* in the `ItemList` on
  `packages.html`.
- Check Search Console → Pages every month or so for pages that dropped out of
  the index, and Performance for which queries are actually bringing people in.
