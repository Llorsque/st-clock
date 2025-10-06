// LED countdown — smooth triangular segments; unit toggles; big 21:45 minutes badge
const screen = document.getElementById('screen');
const inputMinutes = document.getElementById('input-minutes');
const inputSeconds = document.getElementById('input-seconds');
const inputHundredths = document.getElementById('input-hundredths');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const btnHardReset = document.getElementById('btn-hardreset');

const toggleMinutes = document.getElementById('toggle-minutes');
const toggleSeconds = document.getElementById('toggle-seconds');
const toggleHundredths = document.getElementById('toggle-hundredths');

const badgeMinsVal = document.getElementById('badge-mins-val');

const SEGMENTS = {
  '0': [1,1,1,1,1,1,0],
  '1': [0,1,1,0,0,0,0],
  '2': [1,1,0,1,1,0,1],
  '3': [1,1,1,1,0,0,1],
  '4': [0,1,1,0,0,1,1],
  '5': [1,0,1,1,0,1,1],
  '6': [1,0,1,1,1,1,1],
  '7': [1,1,1,0,0,0,0],
  '8': [1,1,1,1,1,1,1],
  '9': [1,1,1,1,0,1,1],
};

/* Smooth triangular segment geometry builder */
function createDigit() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 140 220');
  svg.classList.add('digit');

  const t = 34;   // thickness
  const o = 14;   // margin
  const W = 140 - 2*o;
  const H = 220 - 2*o;
  const mid = o + H/2;
  const b = 22;   // bevel length (consistent ends)

  // Helper to make a horizontal bar polygon with triangular ends
  const hbar = (y) => `${o+b},${y} ${o+W-b},${y} ${o+W-b-t/2},${y+t} ${o+b+t/2},${y+t}`;
  // Helper to make a vertical bar polygon with triangular ends
  const vbar = (x, y1, y2) => `${x},${y1+b} ${x+t},${y1} ${x+t},${y2-b} ${x},${y2}`;

  const polys = {
    a: hbar(o),
    g: hbar(mid - t/2),
    d: hbar(o+H-t),
    b: vbar(o+W-t, o, mid),
    c: vbar(o+W-t, mid, o+H),
    f: vbar(o, o, mid),
    e: vbar(o, mid, o+H)
  };

  const segs = {};
  Object.entries(polys).forEach(([key, points]) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    p.setAttribute('points', points);
    p.setAttribute('vector-effect', 'non-scaling-stroke');
    p.classList.add('segment');
    svg.appendChild(p);
    segs[key] = p;
  });

  svg._segments = segs;
  svg._set = (digit) => {
    const on = SEGMENTS[digit] || [0,0,0,0,0,0,0];
    const keys = ['a','b','c','d','e','f','g'];
    keys.forEach((k, i) => {
      if (on[i]) segs[k].classList.add('lit');
      else segs[k].classList.remove('lit');
    });
  };
  svg._set('8'); // show full segment shape initially
  return svg;
}

function createColon() {
  const wrap = document.createElement('div');
  wrap.className = 'separator'; wrap.id = 'sep-colon';
  const stack = document.createElement('div');
  stack.className = 'sep-colon';
  const t = document.createElement('div'); t.className = 'sep-circle';
  const b = document.createElement('div'); b.className = 'sep-circle';
  stack.appendChild(t); stack.appendChild(b);
  wrap.appendChild(stack);
  return wrap;
}
function createDot() {
  const wrap = document.createElement('div');
  wrap.className = 'separator'; wrap.id = 'sep-dot';
  const stack = document.createElement('div');
  stack.className = 'sep-dot';
  const dot = document.createElement('div'); dot.className = 'dot-rect';
  stack.appendChild(dot);
  wrap.appendChild(stack);
  return wrap;
}

const digits = [];
let sepColonEl = null;
let sepDotEl = null;
function buildDisplay() {
  screen.innerHTML = '';
  const m1 = createDigit(); const m2 = createDigit();
  const s1 = createDigit(); const s2 = createDigit();
  const h1 = createDigit(); const h2 = createDigit();
  digits.splice(0, digits.length, m1, m2, s1, s2, h1, h2);

  sepColonEl = createColon();
  sepDotEl = createDot();

  screen.appendChild(m1); screen.appendChild(m2);
  screen.appendChild(sepColonEl);
  screen.appendChild(s1); screen.appendChild(s2);
  screen.appendChild(sepDotEl);
  screen.appendChild(h1); screen.appendChild(h2);
}
buildDisplay();

function renderTwoDigits(value, d1, d2) {
  const str = String(value).padStart(2, '0');
  d1._set(str[0]); d2._set(str[1]);
}

let running = false;
let endTimeMs = 0;
let pauseRemaining = 0;
let rafId = null;

function remainingMs() {
  const now = performance.now();
  return Math.max(0, endTimeMs - now);
}

function updateDisplayFromMs(ms) {
  const hundredths = Math.floor((ms % 1000) / 10);
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  renderTwoDigits(minutes, digits[0], digits[1]);
  renderTwoDigits(seconds, digits[2], digits[3]);
  renderTwoDigits(hundredths, digits[4], digits[5]);
}

function loop() {
  const ms = remainingMs();
  updateDisplayFromMs(ms);
  if (ms <= 0) {
    running = false;
    rafId = null;
    btnStart.disabled = false;
    return;
  }
  rafId = requestAnimationFrame(loop);
}

function getTotalMsFromInputs() {
  let m = parseInt(inputMinutes.value, 10);
  let s = parseInt(inputSeconds.value, 10);
  let h = parseInt(inputHundredths.value, 10);
  if (isNaN(m) || m < 0) m = 0;
  if (isNaN(s) || s < 0) s = 0;
  if (isNaN(h) || h < 0) h = 0;
  s = Math.min(s, 59);
  h = Math.min(h, 99);
  inputMinutes.value = String(m).padStart(2,'0');
  inputSeconds.value = String(s).padStart(2,'0');
  inputHundredths.value = String(h).padStart(2,'0');
  return m*60_000 + s*1_000 + h*10;
}

function start() {
  const total = (pauseRemaining > 0) ? pauseRemaining : getTotalMsFromInputs();
  if (total <= 0) return;
  endTimeMs = performance.now() + total;
  running = true;
  btnStart.disabled = true;
  loop();
}

function pause() {
  if (!running) return;
  pauseRemaining = remainingMs();
  running = false;
  btnStart.disabled = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

function reset() {
  running = false;
  pauseRemaining = 0;
  btnStart.disabled = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  const total = getTotalMsFromInputs();
  updateDisplayFromMs(total);
}

/* Unit visibility toggles */
function updateUnitVisibility() {
  const showM = toggleMinutes.checked;
  const showS = toggleSeconds.checked;
  const showH = toggleHundredths.checked;

  digits[0].style.display = showM ? '' : 'none';
  digits[1].style.display = showM ? '' : 'none';
  sepColonEl.style.display = (showM && showS) ? '' : 'none';
  digits[2].style.display = showS ? '' : 'none';
  digits[3].style.display = showS ? '' : 'none';
  sepDotEl.style.display = (showS && showH) ? '' : 'none';
  digits[4].style.display = showH ? '' : 'none';
  digits[5].style.display = showH ? '' : 'none';
}

toggleMinutes.addEventListener('change', updateUnitVisibility);
toggleSeconds.addEventListener('change', updateUnitVisibility);
toggleHundredths.addEventListener('change', updateUnitVisibility);

/* Minutes-to-21:45 badge — always running */
function nextTarget2145() {
  const now = new Date();
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 45, 0, 0);
  if (now.getTime() >= t.getTime()) t.setDate(t.getDate() + 1);
  return t;
}
let badgeTarget = nextTarget2145();
function updateBadge() {
  const now = Date.now();
  let diff = badgeTarget.getTime() - now;
  if (diff <= 0) { badgeTarget = nextTarget2145(); diff = badgeTarget.getTime() - now; }
  const mins = Math.max(0, Math.floor(diff / 60000));
  badgeMinsVal.textContent = String(mins);
}
setInterval(updateBadge, 1000);
updateBadge();

/* Full page reset */
btnHardReset.addEventListener('click', () => {
  // Hard reload to ensure a clean state
  location.reload();
});

btnStart.addEventListener('click', () => start());
btnPause.addEventListener('click', () => pause());
btnReset.addEventListener('click', () => reset());

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); running ? pause() : start(); }
  if (e.key.toLowerCase() === 'r') { e.preventDefault(); reset(); }
});

// Initialize
updateDisplayFromMs(getTotalMsFromInputs());
updateUnitVisibility();
