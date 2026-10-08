# Pitchdeck Generator

Schrijf een pitchdeck in [de 10 slides van Guy Kawasaki](https://guykawasaki.com/the-only-10-slides-you-need-in-your-pitch/).
Statische single-page app met native ES modules: geen build, geen backend. Decks worden automatisch opgeslagen in `localStorage`.

## Lokaal draaien

ES modules werken niet via `file://`, dus start een statische server in de root:

```sh
python3 -m http.server 8000
```

en open http://localhost:8000.

## Deployen

GitHub Pages: *Settings → Pages → Deploy from a branch → `master` / root*. `.nojekyll` zorgt dat Jekyll de bestanden ongemoeid laat.

## Structuur

```
index.html
assets/css/                 reset + stijl
assets/js/app.mjs           hash-router (#/ en #/deck/<id>/<slide>)
assets/js/defaults.mjs      de 10 standaardslides (placeholders)
assets/js/deck.mjs          datamodel: create/normalize/naam/voortgang
assets/js/autosave.mjs      debounced opslaan
assets/js/dom.mjs           mini element-builder (geen innerHTML)
assets/js/storage/          opslag-adapters
assets/js/views/            overzicht en editor
```

## Opslag

Alle opslag loopt via één async interface (`list`, `get`, `save`, `remove`), gekozen in
[`assets/js/storage/index.mjs`](assets/js/storage/index.mjs). Elk deck is één JSON-document:

```json
{ "id": "…", "createdAt": "…", "updatedAt": "…", "slides": [{ "title": "…", "content": "…" }] }
```

Om naar een JSON storage API over te stappen: schrijf een adapter met dezelfde vier methodes en wissel hem daar in.
