// ================================================
//   SEEN — A Memorial for Lost Privacy
//   script.js
// ================================================

const { animate, stagger, createTimeline } = anime;

// ---------- SESSION SETUP ----------
const sessionId = 'SN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
const sessionStart = Date.now();

// Check for return visits using localStorage
let visitCount = 1;
try {
  const stored = localStorage.getItem('seen_visits');
  visitCount = stored ? parseInt(stored) + 1 : 1;
  localStorage.setItem('seen_visits', visitCount);
} catch(e) {}

let cursorMoves = 0;
let hesitationCount = 0;
let lastMoveTime = Date.now();
let hesitationTimer = null;
let threatState = 'LOW';
const profileTags = new Set();

document.getElementById('sessionId').textContent = sessionId;
document.getElementById('profileId').textContent = 'FILE #' + sessionId;


// (audio removed)


// ================================================
//   CONSENT FAKE-OUT
//   Appears a moment after load like a standard
//   cookie banner. Only option is Acknowledge —
//   no real choice. Auto-dismisses after 5s
//   whether the user clicks it or not.
// ================================================

function showConsentBanner() {
  const banner = document.getElementById('consentBanner');
  if (!banner) return;

  // fade in
  animate(banner, {
    opacity: [0, 1],
    translateY: [16, 0],
    duration: 500,
    ease: 'outExpo'
  });
  banner.classList.add('visible');

  function dismissBanner() {
    animate(banner, {
      opacity: [1, 0],
      translateY: [0, 12],
      duration: 400,
      ease: 'inQuad',
      complete: () => { banner.style.display = 'none'; }
    });
    pushSidebarLine('CONSENT_LOGGED');
    
  }

  document.getElementById('consentBtn').addEventListener('click', dismissBanner);

  // auto-dismiss after 5 seconds even if not clicked
  setTimeout(dismissBanner, 5000);
}


// ================================================
//   EXIT INTENT DETECTION
//   When the cursor moves near the top of the
//   browser (within 20px), the site logs it as
//   an exit attempt — just like real analytics do.
// ================================================

let exitIntentFired = false;

document.addEventListener('mousemove', (e) => {
  if (!exitIntentFired && e.clientY < 20) {
    exitIntentFired = true;
    pushSidebarLine('EXIT INTENT — LOGGED');
    
    // reset after 8s so it can fire again
    setTimeout(() => { exitIntentFired = false; }, 8000);
  }
});


// ================================================
//   INTRO FLASH
// ================================================

function runIntroFlash() {
  const flash = document.getElementById('introFlash');
  if (!flash) return;
  animate(flash, {
    opacity: [1, 1, 0],
    duration: 650,
    easing: 'easeInOutQuad',
    delay: 80
  });
}


// ================================================
//   TYPEWRITER UTILITY
// ================================================

function typeWriter(el, text, speed = 38, delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      let i = 0;
      el.textContent = '';
      const cursorEl = document.createElement('span');
      cursorEl.className = 'term-cursor';
      el.parentElement.appendChild(cursorEl);
      const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          cursorEl.remove();
          resolve();
        }
      }, speed);
    }, delay);
  });
}


// ================================================
//   SCREEN 01 TERMINAL LINES
// ================================================

const s1Lines = [
  { id: 'tl1', text: 'SESSION_INIT ......... OK' },
  { id: 'tl2', text: 'SUBJECT_PROFILING .... ACTIVE' },
  { id: 'tl3', text: 'AWAITING INPUT ........ _' },
];

window.addEventListener('load', () => {

  runIntroFlash();

  // show consent banner shortly after flash clears
  setTimeout(showConsentBanner, 900);

  // if return visitor, note it in sidebar
  if (visitCount > 1) {
    setTimeout(() => {
      pushSidebarLine('RETURN VISIT — SESSION ' + visitCount);
      
    }, 3000);
  }

  animate(
    ['#landingTag', '#landingTitle', '#landingSub', '#landingBody', '#landingQuote', '#landingBtn'],
    {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 700,
      ease: 'outExpo',
      delay: stagger(120, { start: 500 })
    }
  );

  animate('#livePanel01', {
    opacity: [0, 1],
    translateX: [30, 0],
    duration: 800,
    ease: 'outExpo',
    delay: 1100
  });

  animate('#livePanel01 .data-row', {
    opacity: [0, 1],
    translateX: [10, 0],
    duration: 400,
    ease: 'outQuad',
    delay: stagger(60, { start: 1300 })
  });

  (async () => {
    for (let i = 0; i < s1Lines.length; i++) {
      const el = document.getElementById(s1Lines[i].id);
      await typeWriter(el, s1Lines[i].text, 36, i === 0 ? 2000 : 0);
      await new Promise(r => setTimeout(r, 200));
    }
  })();

  updateSidebarClock();
});


// ================================================
//   SIDEBAR CLOCK
// ================================================

function updateSidebarClock() {
  setInterval(() => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    const el = document.getElementById('sidebarTime');
    if (el) el.textContent = h + ':' + m + ':' + s;
  }, 1000);
}


// ================================================
//   SIDEBAR TERMINAL FEED
// ================================================

const sidebarLines = [
  'CONN ESTABLISHED',
  'IP MASKED — LOGGED',
  'CURSOR TRACKED',
  'SCROLL MONITORED',
  'FINGERPRINT SAVED',
  'PROFILE BUILDING',
  'RISK ASSESSED',
  'DATA ENCRYPTED',
  'ARCHIVE ACCESSED',
  'SUBJECT ENGAGED',
  'PATTERN RECORDED',
  'DOSSIER UPDATED',
  'TRANSMISSION QUEUED',
  'NODE RELAYED',
  'RECORD COMMITTED',
];

let sidebarLineIndex = 0;

function pushSidebarLine(text) {
  const container = document.getElementById('sidebarTerminal');
  if (!container) return;

  const line = document.createElement('div');
  line.className = 'sidebar-term-line';
  line.textContent = text || sidebarLines[sidebarLineIndex % sidebarLines.length];
  sidebarLineIndex++;

  container.prepend(line);

  animate(line, {
    opacity: [0, 1],
    translateX: [-4, 0],
    duration: 300,
    ease: 'outQuad'
  });

  const all = container.querySelectorAll('.sidebar-term-line');
  if (all.length > 20) all[all.length - 1].remove();
}

setTimeout(() => pushSidebarLine('CONN ESTABLISHED'), 1200);
setTimeout(() => pushSidebarLine('IP MASKED — LOGGED'), 2400);
setTimeout(() => pushSidebarLine('CURSOR TRACKED'), 3400);


// ================================================
//   SCROLL OBSERVER
// ================================================

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (id === 'screen02') animateArchive();
      if (id === 'screen03') animateMirror();
      if (id === 'screen04') animateClosing();
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

sectionObserver.observe(document.getElementById('screen02'));
sectionObserver.observe(document.getElementById('screen03'));
sectionObserver.observe(document.getElementById('screen04'));


// ================================================
//   SCREEN 02 — ARCHIVE REVEAL
// ================================================

function animateArchive() {
  pushSidebarLine('ARCHIVE ACCESSED');

  animate('#screen02 .section-header', {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    ease: 'outExpo'
  });

  animate('.archive-card', {
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 600,
    ease: 'outExpo',
    delay: stagger(90, { start: 300 })
  });

  document.querySelectorAll('.survival-fill').forEach((bar, i) => {
    const target = parseFloat(bar.getAttribute('data-target')) || 0;
    animate(bar, {
      width: ['0%', target + '%'],
      duration: 900,
      ease: 'outExpo',
      delay: 600 + (i * 90)
    });
  });

  setTimeout(async () => {
    await typeWriter(document.getElementById('tl4'), 'ARCHIVE_QUERY ........ COMPLETE', 34);
    await new Promise(r => setTimeout(r, 180));
    await typeWriter(document.getElementById('tl5'), 'SUBJECT_DWELL_TIME ... RECORDING', 34);
  }, 900);
}


// ================================================
//   SCREEN 03 — MIRROR REVEAL
// ================================================

function animateMirror() {
  pushSidebarLine('PROFILE COMPILED');
  pushSidebarLine('DOSSIER UPDATED');

  document.getElementById('screen03').classList.add('mirror-active');

  const tl = createTimeline({ defaults: { ease: 'outExpo' } });

  tl.add('#screen03 .section-header', {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600
  });

  tl.add('.profile-card', {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 700
  }, '-=200');

  tl.add('.profile-row', {
    opacity: [0, 1],
    translateX: [-12, 0],
    duration: 350,
    delay: stagger(80)
  }, '+=100');

  tl.add('.mirror-text', {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 700
  }, '-=400');

  tl.add('#brokerValue', {
    color: ['#c0392b', '#0a0a0a', '#c0392b', '#0a0a0a', '#c0392b'],
    duration: 1200,
    ease: 'linear'
  }, '+=300');

  setTimeout(async () => {
    await typeWriter(document.getElementById('tl6'), 'MIRROR_PROTOCOL ...... ENGAGED', 34);
    await new Promise(r => setTimeout(r, 200));
    await typeWriter(document.getElementById('tl7'), 'PROFILE_EXPORT ....... PENDING', 34);
    await new Promise(r => setTimeout(r, 200));
    await typeWriter(document.getElementById('tl8'), 'DATA_BROKER_SYNC ..... QUEUED', 34);
  }, 1400);
}


// ================================================
//   SCREEN 04 — CLOSING / RETENTION
//   The final screen fades in on a black background.
//   A deletion countdown starts and is rigged to
//   always slow down and never reach zero.
// ================================================

function animateClosing() {
  const screen = document.getElementById('screen04');
  screen.classList.add('closing-active');

  pushSidebarLine('RETENTION_LOCK — ON');
  pushSidebarLine('DELETION — SUSPENDED');

  const tl = createTimeline({ defaults: { ease: 'outExpo' } });

  tl.add('.closing-title', {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800
  });

  tl.add('.closing-statement', {
    opacity: [0, 1],
    translateY: [14, 0],
    duration: 500,
    delay: stagger(120)
  }, '+=100');

  tl.add('.countdown-wrap', {
    opacity: [0, 1],
    duration: 600
  }, '-=200');

  tl.add('.closing-terminal', {
    opacity: [0, 1],
    duration: 500
  }, '+=200');

  tl.add('.closing-credits', {
    opacity: [0, 1],
    duration: 700
  }, '+=300');

  // type terminal lines on screen 04
  setTimeout(async () => {
    await typeWriter(document.getElementById('tl9'),  'RETENTION_PERIOD ..... INDEFINITE', 34);
    await new Promise(r => setTimeout(r, 200));
    await typeWriter(document.getElementById('tl10'), 'DELETION_REQUEST ..... SUSPENDED', 34);
    await new Promise(r => setTimeout(r, 200));
    await typeWriter(document.getElementById('tl11'), 'RECORD_STATUS ........ PERMANENT', 34);
  }, 1200);

  startRetentionCountdown();
}

// Countdown that never reaches zero — it ticks down at normal
// speed but progressively slows to a crawl, Zeno-style.
function startRetentionCountdown() {
  let totalSeconds = 3 * 60 * 60; // start at 3 hours
  let speed = 1000;                // ms per tick, starts fast
  const display = document.getElementById('retentionCountdown');
  if (!display) return;

  function tick() {
    // never go below 1
    if (totalSeconds > 1) totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    display.textContent =
      h.toString().padStart(2, '0') + ':' +
      m.toString().padStart(2, '0') + ':' +
      s.toString().padStart(2, '0');

    // As it approaches zero, slow exponentially.
    // Below 10 seconds it starts to drag — never quite arrives.
    if (totalSeconds < 10) {
      speed = Math.min(speed * 1.35, 8000); // cap at 8s per tick
    } else if (totalSeconds < 60) {
      speed = 1200;
    } else {
      speed = 1000;
    }

    setTimeout(tick, speed);
  }

  setTimeout(tick, 1000);
}


// ================================================
//   THREAT LEVEL
// ================================================

function shakeThreatRow() {
  animate('#threatLevel', {
    translateX: [0, -5, 5, -4, 4, -2, 2, 0],
    duration: 450,
    ease: 'linear'
  });
  pushSidebarLine('THREAT ESCALATED');

  const eye = document.getElementById('globalEye');
  if (eye) {
    eye.classList.remove('pulse');
    void eye.offsetWidth;
    eye.classList.add('pulse');
  }
}

function setThreatBodyClass(level) {
  document.body.classList.remove('threat-low', 'threat-medium', 'threat-high');
  if (level === 'MEDIUM') document.body.classList.add('threat-medium');
  if (level === 'HIGH')   document.body.classList.add('threat-high');
}


// ================================================
//   CURSOR TRACKING
// ================================================

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorMoves++;

  document.getElementById('cursorX').textContent = Math.round(e.clientX) + 'px';
  document.getElementById('cursorY').textContent = Math.round(e.clientY) + 'px';

  const canvasEl = document.getElementById('eyeCanvas');
  const rect = canvasEl.getBoundingClientRect();
  const canvasCX = rect.left + rect.width / 2;
  const canvasCY = rect.top + rect.height / 2;
  const dx = e.clientX - canvasCX;
  const dy = e.clientY - canvasCY;
  const angle = Math.atan2(dy, dx);
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 250);
  const mapped = (dist / 250) * 20;
  targetPupilX = ECX + Math.cos(angle) * mapped;
  targetPupilY = ECY + Math.sin(angle) * mapped;

  clearTimeout(hesitationTimer);
  hesitationTimer = setTimeout(() => {
    hesitationCount++;
    document.getElementById('hesitations').textContent = hesitationCount;
    document.getElementById('totalHesitations').textContent = hesitationCount + ' detected';
    if (hesitationCount % 3 === 0) pushSidebarLine('HESITATION LOGGED');
    updateThreat();
  }, 2200);

  lastMoveTime = Date.now();
});


// ================================================
//   HALFTONE CANVAS EYE
// ================================================

const eyeCanvas = document.getElementById('eyeCanvas');
const eyeCtx = eyeCanvas.getContext('2d');
const EW = eyeCanvas.width;
const EH = eyeCanvas.height;
const ECX = EW / 2;
const ECY = EH / 2;

let pupilX = ECX;
let pupilY = ECY;
let targetPupilX = ECX;
let targetPupilY = ECY;
let dilation = 0;
let targetDilation = 0;

let blinkProgress = 0;
let blinkDir = 0;
let blinkTimer = scheduleNextBlink();

function scheduleNextBlink() {
  return setTimeout(() => { blinkDir = 1; }, 3000 + Math.random() * 4000);
}

function noise(x, y, seed) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.3) * 43758.5453;
  return n - Math.floor(n);
}

function almondPath(ctx, cx, cy, rx, ry) {
  ctx.beginPath();
  ctx.moveTo(cx - rx, cy);
  ctx.bezierCurveTo(cx - rx * 0.5, cy - ry * 1.15, cx + rx * 0.5, cy - ry * 1.15, cx + rx, cy);
  ctx.bezierCurveTo(cx + rx * 0.5, cy + ry * 1.15, cx - rx * 0.5, cy + ry * 1.15, cx - rx, cy);
  ctx.closePath();
}

function drawEye(px, py, blink, dilate) {
  eyeCtx.clearRect(0, 0, EW, EH);

  const eyeRX = EW * 0.445;
  const eyeRY = EH * 0.255;
  const irisR  = EW * 0.21 + dilate * (EW * 0.032);
  const pupilR = EW * 0.10 + dilate * (EW * 0.041);

  const pdx = px - ECX;
  const pdy = py - ECY;
  const pangle = Math.atan2(pdy, pdx);
  const pdist  = Math.sqrt(pdx * pdx + pdy * pdy);
  const clampedDist = Math.min(pdist, 20);
  const ppx = ECX + Math.cos(pangle) * clampedDist;
  const ppy = ECY + Math.sin(pangle) * clampedDist;

  eyeCtx.save();
  almondPath(eyeCtx, ECX, ECY, eyeRX, eyeRY);
  eyeCtx.clip();

  const spacing = 4;
  const half = spacing * 0.5;

  for (let gx = ECX - eyeRX - spacing; gx <= ECX + eyeRX + spacing; gx += spacing) {
    for (let gy = ECY - eyeRY - spacing; gy <= ECY + eyeRY + spacing; gy += spacing) {
      const dx  = gx - ECX;
      const dy  = gy - ECY;
      const dpx = gx - ppx;
      const dpy = gy - ppy;
      const distPupil  = Math.sqrt(dpx * dpx + dpy * dpy);

      let brightness;

      if (distPupil < pupilR * 0.55) {
        brightness = 0.02 + noise(gx, gy, 1) * 0.06;
      } else if (distPupil < pupilR) {
        const t = (distPupil - pupilR * 0.55) / (pupilR * 0.45);
        brightness = 0.02 + t * 0.12 + noise(gx, gy, 9) * 0.08;
      } else if (distPupil < irisR) {
        const radialAngle = Math.atan2(dpy, dpx);
        const t = (distPupil - pupilR) / (irisR - pupilR);
        const spokes = Math.sin(radialAngle * 16 + distPupil * 0.5) * 0.11
                     + Math.sin(radialAngle * 28 - distPupil * 0.3) * 0.06;
        const rings  = Math.sin(distPupil * 1.4) * 0.07
                     + Math.sin(distPupil * 2.6) * 0.05;
        const grain  = noise(gx, gy, 2) * 0.12 + noise(gx, gy, 12) * 0.08;
        const baseBrightness = 0.26 + t * 0.3;
        brightness = baseBrightness + spokes + rings + grain;
        brightness = Math.max(0.06, Math.min(brightness, 0.85));
      } else {
        const ex = dx / (eyeRX * 0.88);
        const ey = dy / (eyeRY * 0.88);
        const edgeFade = Math.max(0, 1 - Math.sqrt(ex * ex + ey * ey));
        brightness = 0.78 * edgeFade + noise(gx, gy, 3) * 0.1;
        const shadowBelow = Math.max(0, (ppy - gy) / (eyeRY * 0.6));
        brightness -= shadowBelow * 0.12;
        brightness = Math.max(0, brightness);
      }

      const maxR = half * 0.96;
      const r = maxR * (1 - brightness);

      if (r > 0.35) {
        if (dilate > 0.05 && distPupil >= pupilR && distPupil < irisR) {
          const grey = Math.round(brightness * 220);
          const redBoost = Math.round(20 * dilate);
          eyeCtx.fillStyle = `rgb(${Math.min(255, grey + redBoost)},${grey},${grey})`;
        } else {
          const grey = Math.round(brightness * 220);
          eyeCtx.fillStyle = `rgb(${grey},${grey},${grey})`;
        }
        eyeCtx.beginPath();
        eyeCtx.arc(gx, gy, r, 0, Math.PI * 2);
        eyeCtx.fill();
      }
    }
  }

  const hlx = ppx - 9;
  const hly = ppy - 9;
  const hlg = eyeCtx.createRadialGradient(hlx, hly, 0, hlx, hly, 7);
  hlg.addColorStop(0, 'rgba(255,255,255,1)');
  hlg.addColorStop(0.5, 'rgba(255,255,255,0.6)');
  hlg.addColorStop(1, 'rgba(255,255,255,0)');
  eyeCtx.fillStyle = hlg;
  eyeCtx.beginPath();
  eyeCtx.arc(hlx, hly, 7, 0, Math.PI * 2);
  eyeCtx.fill();

  const grainSeed = Math.floor(Date.now() / 90);
  for (let i = 0; i < 550; i++) {
    const gx = (ECX - eyeRX) + noise(i, grainSeed, 5) * eyeRX * 2;
    const gy = (ECY - eyeRY) + noise(i, grainSeed, 6) * eyeRY * 2;
    const ga = noise(i, grainSeed, 7) * 0.28;
    const gs = noise(i, grainSeed, 8) * 1.6 + 0.2;
    eyeCtx.fillStyle = `rgba(0,0,0,${ga})`;
    eyeCtx.beginPath();
    eyeCtx.arc(gx, gy, gs, 0, Math.PI * 2);
    eyeCtx.fill();
  }

  eyeCtx.restore();

  if (blink > 0) {
    eyeCtx.save();
    eyeCtx.fillStyle = '#0a0a0a';

    eyeCtx.save();
    almondPath(eyeCtx, ECX, ECY, eyeRX, eyeRY);
    eyeCtx.clip();
    const lidMid = ECY - eyeRY * 1.15 + (eyeRY * 2.3 * blink * 0.5);
    eyeCtx.fillRect(ECX - eyeRX - 2, ECY - eyeRY * 1.2, eyeRX * 2 + 4, (lidMid - (ECY - eyeRY * 1.2)));
    eyeCtx.restore();

    eyeCtx.save();
    almondPath(eyeCtx, ECX, ECY, eyeRX, eyeRY);
    eyeCtx.clip();
    const lidMidB = ECY + eyeRY * 1.15 - (eyeRY * 2.3 * blink * 0.5);
    eyeCtx.fillRect(ECX - eyeRX - 2, lidMidB, eyeRX * 2 + 4, ECY + eyeRY * 1.2 - lidMidB);
    eyeCtx.restore();

    eyeCtx.restore();
  }
}

function eyeLoop() {
  pupilX += (targetPupilX - pupilX) * 0.12;
  pupilY += (targetPupilY - pupilY) * 0.12;
  dilation += (targetDilation - dilation) * 0.04;

  if (blinkDir === 1) {
    blinkProgress = Math.min(blinkProgress + 0.18, 1);
    if (blinkProgress >= 1) blinkDir = -1;
  } else if (blinkDir === -1) {
    blinkProgress = Math.max(blinkProgress - 0.18, 0);
    if (blinkProgress <= 0) {
      blinkDir = 0;
      blinkTimer = scheduleNextBlink();
    }
  }

  drawEye(pupilX, pupilY, blinkProgress, dilation);
  requestAnimationFrame(eyeLoop);
}

eyeLoop();


// ================================================
//   TIME ON PAGE
// ================================================

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

setInterval(() => {
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
  const minutes = (elapsed / 60).toFixed(1);

  document.getElementById('timeOnPage').textContent = formatTime(elapsed);
  document.getElementById('totalTime').textContent = formatTime(elapsed);
  document.getElementById('collectionTime').textContent = minutes;
  document.getElementById('totalMoves').textContent = cursorMoves.toLocaleString() + ' recorded';

  if (elapsed > 0 && elapsed % 30 === 0) {
    pushSidebarLine(sidebarLines[sidebarLineIndex % sidebarLines.length]);
  }

  inferProfile(elapsed);
}, 500);


// ================================================
//   SCROLL TRACKING
// ================================================

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  document.getElementById('scrollDepth').textContent = pct + '%';

  if (pct === 25 || pct === 50 || pct === 75 || pct === 100) {
    pushSidebarLine('SCROLL ' + pct + '% — LOGGED');
  }

  updateThreat();
});


// ================================================
//   THREAT LEVEL
// ================================================

function updateThreat() {
  const el = document.getElementById('threatLevel');
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
  const scrollPct = parseInt(document.getElementById('scrollDepth').textContent) || 0;

  let newThreat = 'LOW';

  if (elapsed > 120 || hesitationCount > 8 || scrollPct > 80) {
    newThreat = 'HIGH';
    el.style.color = '#c0392b';
    targetDilation = 1;
  } else if (elapsed > 45 || hesitationCount > 3 || scrollPct > 40) {
    newThreat = 'MEDIUM';
    el.style.color = '#c0762b';
    targetDilation = 0.45;
  } else {
    el.style.color = '#0a0a0a';
    targetDilation = 0;
  }

  if (newThreat !== threatState) {
    threatState = newThreat;
    el.textContent = newThreat;
    setThreatBodyClass(newThreat);
    if (newThreat === 'MEDIUM' || newThreat === 'HIGH') shakeThreatRow();
  }
}


// ================================================
//   PROFILE INFERENCE
// ================================================

function inferProfile(elapsed) {
  const scrollPct = parseInt(document.getElementById('scrollDepth').textContent) || 0;

  let pace = 'Fast';
  if (elapsed > 180) pace = 'Very slow (thorough)';
  else if (elapsed > 90) pace = 'Slow (engaged)';
  else if (elapsed > 40) pace = 'Moderate';
  document.getElementById('readingPace').textContent = pace;

  let engagement = 'Passive';
  if (hesitationCount > 6 && scrollPct > 60) engagement = 'Highly engaged';
  else if (hesitationCount > 3 || scrollPct > 50) engagement = 'Interested';
  else if (scrollPct > 20) engagement = 'Moderately curious';
  document.getElementById('engagement').textContent = engagement;

  let concern = 'Undetermined';
  if (hesitationCount > 8) concern = 'Elevated, prolonged focus on content';
  else if (hesitationCount > 4) concern = 'Moderate';
  else if (elapsed > 60) concern = 'Present';
  document.getElementById('concernLevel').textContent = concern;

  let value = '$0.00';
  if (hesitationCount > 8 && scrollPct > 70) value = '$3.40';
  else if (hesitationCount > 4 && scrollPct > 40) value = '$1.90';
  else if (elapsed > 30) value = '$0.80';
  document.getElementById('brokerValue').textContent = value + ' (estimated)';

  document.getElementById('totalHesitations').textContent = hesitationCount + ' detected';
}


// ================================================
//   CARD HOVER — profile tagging
//   Each card hover logs to the sidebar AND adds
//   a tag that appears in the Screen 03 profile.
//   This ties the two screens together directly.
// ================================================

document.querySelectorAll('.archive-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    hesitationCount++;
    document.getElementById('hesitations').textContent = hesitationCount;

    const concept = (card.getAttribute('data-concept') || 'UNKNOWN').toUpperCase().substring(0, 12);
    pushSidebarLine('CARD_HOVER — ' + concept);

    // add this card's tag to the profile
    const tag = card.getAttribute('data-tag');
    if (tag && !profileTags.has(tag)) {
      profileTags.add(tag);
      updateProfileTags();
    }

    updateThreat();
  });
});

function updateProfileTags() {
  const row = document.getElementById('profileTagsRow');
  const list = document.getElementById('profileTagsList');
  if (!row || !list) return;

  const tags = Array.from(profileTags);
  if (tags.length === 0) {
    row.style.display = 'none';
    return;
  }

  row.style.display = 'flex';
  list.innerHTML = '';

  // wrap in a flex container div
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;';

  tags.forEach(t => {
    const badge = document.createElement('span');
    badge.className = 'profile-tag-badge';
    badge.textContent = t;
    wrap.appendChild(badge);
  });

  list.appendChild(wrap);
}


// ================================================
//   DOWNLOAD DOSSIER
//   Generates a plain-text file of everything
//   collected during the session and triggers a
//   browser download. Holding the file afterward
//   makes the data feel real rather than abstract.
// ================================================

document.getElementById('dossierBtn').addEventListener('click', () => {
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
  const scrollPct = document.getElementById('scrollDepth').textContent;

  const lines = [
    '================================================',
    '  SEEN — A Memorial for Lost Privacy',
    '  COMPILED SUBJECT FILE',
    '================================================',
    '',
    'SESSION ID         : ' + sessionId,
    'SESSION DATE       : ' + new Date().toUTCString(),
    'TIME ON PAGE       : ' + formatTime(elapsed),
    'TOTAL CURSOR MOVES : ' + cursorMoves.toLocaleString(),
    'HESITATIONS        : ' + hesitationCount,
    'SCROLL DEPTH       : ' + scrollPct,
    'THREAT LEVEL       : ' + threatState,
    'READING PACE       : ' + (document.getElementById('readingPace').textContent || '---'),
    'INFERRED ENGAGEMENT: ' + (document.getElementById('engagement').textContent || '---'),
    'CONCERN LEVEL      : ' + (document.getElementById('concernLevel').textContent || '---'),
    'DATA BROKER VALUE  : ' + (document.getElementById('brokerValue').textContent || '---'),
    'VISIT NUMBER       : ' + visitCount,
    '',
    'FLAGGED INTERESTS',
    '─────────────────',
  ];

  if (profileTags.size > 0) {
    Array.from(profileTags).forEach(t => lines.push('  · ' + t));
  } else {
    lines.push('  (No cards examined)');
  }

  lines.push('');
  lines.push('================================================');
  lines.push('  This data was collected using standard');
  lines.push('  browser-accessible JavaScript during your');
  lines.push('  visit. It was never transmitted or stored');
  lines.push('  outside your browser.');
  lines.push('');
  lines.push('  SEEN is a conceptual design artefact.');
  lines.push('  The discomfort of holding this file is');
  lines.push('  the correct response. It means the');
  lines.push('  design worked.');
  lines.push('================================================');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'SEEN_subject_file_' + sessionId + '.txt';
  a.click();
  URL.revokeObjectURL(url);

  pushSidebarLine('DOSSIER_DOWNLOADED');
  
});


// ================================================
//   SECTION SCROLL HELPER
// ================================================

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}