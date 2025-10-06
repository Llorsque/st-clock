# Countdown Timer (Fullscreen 16:9) — mm:ss:00 (grote rode LED digits)

**Kenmerken**
- Enorm grote cijfers die de hele pagina benutten (16:9 canvas).
- Stijl: vlakke **rode** seven‑segment digits zoals op de referentieklok.
- Weergave **mm:ss:00** (honderdsten vast op 00; focus op leesbare minuten/seconden).
- Start · Pauze · Reset en inputs voor minuten/seconden.

**Gebruik**
1. Plaats de bestanden in je GitHub-repo en open `index.html` (of activeer Pages).
2. Stel minuten/seconden in en druk **Start**.

**Techniek**
- Nauwkeurige timing (`performance.now()` + `requestAnimationFrame`).
- Digits met SVG-polygons (afgeschuinde segment-uiteinden).

MIT-licentie.
