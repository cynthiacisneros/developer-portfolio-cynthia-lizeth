# Legacy standalone HTML pages

These files are **archived backups** of the old multi-page portfolio. The live site is a **single-page** experience: open **`../index.html`** (repository root) for the current version.

## Contents

| File | Notes |
|------|--------|
| `about.html` | Standalone About page (includes portrait). |
| `skills.html` | Skills intro only. |
| `projects.html` | Projects + gallery. |
| `contact.html` | Contact intro only. |
| `creativeinterests.html` | Creative interests (not on single-page nav). |

## Paths

Asset and stylesheet links use **`../`** so they resolve to the repo root (`home.css`, `style.css`, `about.css`, `home.js`, `images/`). Open via a local server from the **repository root** (e.g. `npx serve .`) and visit `/archive/legacy-html/about.html` if you need to preview an archived page.

## Restoring

To use multi-page layout again at the root, move the HTML files back to the project root and update navigation in each file to match your desired URLs.
