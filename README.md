# Countdown Timer (MM:SS.HH)

Een strakke, high‑end countdown klok voor web:

- **Weergave:** minuten, seconden en honderdsten
- **Instellen:** per onderdeel (minuten / seconden / honderdsten) met numerieke inputs
- **Bediening:** Start · Pauze · Reset
- **Sneltoetsen:** `Spatie` (Start/Pauze) en `R` (Reset)
- **UI/Branding:** Donkerblauw (#212945) + Lichtblauw (#52E8E8), font: Archivo
- **Techniek:** Pure HTML/CSS/JS, geen build stap of externe libs. 7‑segment cijfers via SVG.

## Gebruik

1. Zet de bestanden in een nieuwe GitHub‑repo.
2. Open `index.html` lokaal, of activeer GitHub Pages (Branch: `main`, folder: `/root`).
3. Stel minuten/seconden/honderdsten in en klik **Start**.

Timing is **nauwkeurig** door te rekenen vanaf een doel‑tijd (`performance.now()`), niet door telkens 10ms af te tellen. We renderen met `requestAnimationFrame` en ronden naar honderdsten voor de weergave.

## Bestanden

- `index.html` – markup en laad volgsorde
- `styles.css` – strakke high‑end UI
- `app.js` – countdown‑logica + 7‑segment renderer
- `README.md` – deze uitleg

## Licentie

MIT — gebruik vrij in eigen projecten.
