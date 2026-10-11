# EverySpend website

Minimal Next.js website with the ivory and charcoal palette, local Albert Sans typography, and approved pouch illustrations.

The home page includes a centered introduction and compact pouch artwork, an interactive example spending selector with expense and category views, a manual/SMS setup switch, FAQs, and an Android download link. Example amounts are labeled. Reduced-motion preferences disable movement.

Contact, privacy, and terms share the same visual style. Existing policy sections and the contact submission flow are retained.

## Development

Run npm run dev -- --port 3003 in C:/EverySpend-Website.
Run npm run build for the static export, then node scripts/check-export.cjs to verify exported routes and assets.
NEXT_PUBLIC_BASE_PATH supports GitHub Pages deployments.

## Browser checks

Serve out/ locally and start Chrome with remote debugging enabled. Run node scripts/check-landing.cjs.
The defaults are a site at http://127.0.0.1:3044 and a browser debugger at http://127.0.0.1:9333; override with QA_SITE_URL and QA_DEBUGGER_URL.
Checks cover desktop/tablet/mobile widths, image loading, expense selection, setup choices, FAQs, reduced motion, and supporting routes. No contact request is sent.
Optionally set QA_SCREENSHOT_DIR to an existing folder to save desktop and mobile previews.

The brand library remains in public/branding/, separate from the mobile app bundle. See docs/branding/README.md.
