# Countdown Timer (16:9 · LED rood) — met unit-toggles + 21:45-minutenbadge

- **Formaat:** 16:9 fullscreen
- **Weergave:** minuten : seconden . honderdsten (klassieke rode LED)
- **Instellen:** per onderdeel (minuten / seconden / honderdsten)
- **Tonen/Verbergen:** toggles voor Minuten, Seconden, Honderdsten (scheidingstekens passen zich automatisch aan)
- **Bediening:** Start · Pauze · Reset (Sneltoetsen: Spatie = start/pauze, R = reset)
- **Extra:** Links-boven een **minuten-countdown tot 21:45 (uu:mm)** van de huidige/volgende dag

## Gebruik
1. Plaats de bestanden in je repo en open `index.html` (of activeer GitHub Pages).
2. Stel de gewenste tijd in en kies welke eenheden je wilt tonen.
3. De badge linksboven toont het aantal minuten tot **21:45**. Na bereiken springt hij automatisch naar de volgende dag.

## Techniek
- Nauwkeurige timing via `performance.now()` + `requestAnimationFrame`.
- 7-segment digits met SVG, LED rode glow.
- Geen externe libraries of build stap.

## Licentie
MIT
