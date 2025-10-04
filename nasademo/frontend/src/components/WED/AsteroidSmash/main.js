// Retro Space Defense - main.js
// All visuals are code-generated pixel art drawn on the canvas.
'use strict';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// --- Simple WebAudio SFX manager (code-generated sounds, no external files) ---
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let masterGain = null;
const SFX = {
  init(){
    if(audioCtx) return;
    audioCtx = new AudioCtx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(audioCtx.destination);
  },
  resume(){ if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); },
  toggleMute(){ if(!audioCtx) this.init(); masterGain.gain.value = masterGain.gain.value ? 0 : 1; },
  playShot(){
    this.init(); const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(1200, t);
    g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.frequency.exponentialRampToValueAtTime(420, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    o.stop(t + 0.3);
  },
  playExplosion(){
    this.init(); const t = audioCtx.currentTime;
    // noise burst
    const dur = 0.6;
    const bufferSize = audioCtx.sampleRate * dur;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++) data[i] = (Math.random()*2 -1) * Math.pow(1 - i/bufferSize, 2);
    const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
    const noiseFilter = audioCtx.createBiquadFilter(); noiseFilter.type = 'bandpass'; noiseFilter.frequency.setValueAtTime(800, t);
    const ng = audioCtx.createGain(); ng.gain.setValueAtTime(0.6, t); ng.gain.exponentialRampToValueAtTime(0.001, t + dur);
    noise.connect(noiseFilter); noiseFilter.connect(ng); ng.connect(masterGain);
    noise.start(t); noise.stop(t + dur + 0.02);
    // low boom
    const o = audioCtx.createOscillator(); const og = audioCtx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(180, t);
    og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(0.6, t + 0.02);
    o.connect(og); og.connect(masterGain);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    og.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.02);
  },
  playHit(){
    this.init(); const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(260, t);
    g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(0.28, t + 0.01);
    o.connect(g); g.connect(masterGain);
    o.frequency.exponentialRampToValueAtTime(120, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.start(t); o.stop(t + 0.45);
  }
};
// ---------------------------------------------------------------------------
// Optional assets loader: place PNGs in c:\asteroid game\assets\ with names
// ship.png, asteroid.png, heart.png, earth.png to override code-drawn visuals.
const assets = {};
function loadAssets(list, cb){
  let toLoad = list.length;
  if(toLoad === 0){ cb && cb(); return; }
  for(const name of list){
    const img = new Image();
    img.onload = ()=>{ assets[name] = img; toLoad--; if(toLoad===0) cb && cb(); };
    img.onerror = ()=>{ toLoad--; if(toLoad===0) cb && cb(); };
    img.src = `assets/${name}.png`;
  }
}

// Logical resolution (small, pixel-art friendly) using a landscape 16:9 base
// so the game scales to standard desktop sizes like 1280x720 crisply.
const LOGICAL_WIDTH = 320;
const LOGICAL_HEIGHT = 180;
let PIXEL_SCALE = 2; // will be recalculated on resize to an integer >=1
const TARGET_CSS_WIDTH = 1280;
const TARGET_CSS_HEIGHT = 720;

let DPR = Math.max(1, window.devicePixelRatio || 1);

function resizeCanvas(){
  DPR = Math.max(1, window.devicePixelRatio || 1);
  // compute available CSS area but cap at target 1280x720
  const maxCSSW = Math.min(TARGET_CSS_WIDTH, Math.floor(window.innerWidth * 0.95));
  const maxCSSH = Math.min(TARGET_CSS_HEIGHT, Math.floor(window.innerHeight * 0.9));
  // choose largest integer pixel scale that fits the logical resolution into maxCSSW/H
  const scaleW = Math.floor(maxCSSW / LOGICAL_WIDTH);
  const scaleH = Math.floor(maxCSSH / LOGICAL_HEIGHT);
  const scale = Math.max(1, Math.min(scaleW || 1, scaleH || 1));
  PIXEL_SCALE = scale;
  // set actual canvas (pixel) size using DPR for crispness
  canvas.width = LOGICAL_WIDTH * PIXEL_SCALE * DPR;
  canvas.height = LOGICAL_HEIGHT * PIXEL_SCALE * DPR;
  // set CSS size to logical * PIXEL_SCALE (this centers and sizes the canvas on screen)
  canvas.style.width = (LOGICAL_WIDTH * PIXEL_SCALE) + 'px';
  canvas.style.height = (LOGICAL_HEIGHT * PIXEL_SCALE) + 'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Utility pixel-draw helpers (work in logical pixels, then multiplied by PIXEL_SCALE)
function px(x){return x * PIXEL_SCALE;}
function drawPixelRect(x,y,w,h,color){
  ctx.fillStyle = color;
  ctx.fillRect(px(x), px(y), px(w), px(h));
}
function drawPixelCircle(cx,cy,r,color){
  ctx.fillStyle = color;
  // draw circle scaled to pixels
  ctx.beginPath();
  ctx.arc(px(cx), px(cy), px(r), 0, Math.PI*2);
  ctx.fill();
}
function drawText(text,x,y,color,size=6,align='left'){
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${size * PIXEL_SCALE * 1.1}px monospace`;
  ctx.textAlign = align;
  ctx.fillText(text, px(x), px(y));
  ctx.restore();
}

// draw wrapped text centered within a max logical width (logical pixels)
function drawWrappedText(text, x, y, maxWidthLogical, color, size=6, align='center', lineHeight=1.2){
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${size * PIXEL_SCALE * 1.1}px monospace`;
  const maxWpx = px(maxWidthLogical);
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for(const w of words){
    const test = line ? line + ' ' + w : w;
    const metrics = ctx.measureText(test);
    if(metrics.width > maxWpx && line){
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if(line) lines.push(line);
  // draw each line
  ctx.textAlign = align;
  const baseX = px(x);
  const lineH = size * lineHeight; // logical pixels per line
  for(let i=0;i<lines.length;i++){
    ctx.fillText(lines[i], baseX, px(y + i * lineH));
  }
  ctx.restore();
  return lines.length;
}

// Game state
let keys = {};
let player;
let missiles = [];
let asteroids = [];
let particles = [];
let stars = [];
let spawnTimer = 0;
let spawnInterval = 700; // ms
let lastTime = performance.now();
let score = 0;
let hearts = 3;
let gameOver = false;
let earthSeed = 0; // deterministic seed for earth noise
let earthThreshold = 0.3; // computed threshold so that ~30% becomes land

// Canvas-based, independent game-over fact rotation
let gameOverFactIndex = 0;
let gameOverFactNextChange = 0;
function startCanvasGameOverFacts(){
  gameOverFactIndex = Math.floor(Math.random() * FUN_FACTS.length);
  gameOverFactNextChange = performance.now() + 5000 + Math.floor(Math.random()*2000);
}
function stopCanvasGameOverFacts(){ gameOverFactNextChange = 0; }
// Earth height kept proportional to the logical height
const EARTH_HEIGHT = Math.max(10, Math.round(LOGICAL_HEIGHT * 0.09)); // ~9% of height (~16 for 180px)

function init(){
  player = {
    x: LOGICAL_WIDTH/2,
    y: LOGICAL_HEIGHT - EARTH_HEIGHT - 10,
    w: 11,
    h: 6,
    speed: 80, // logical pixels per second
    shootCooldown: 0,
  };
  missiles = [];
  asteroids = [];
  particles = [];
  score = 0;
  hearts = 3;
  gameOver = false;
  spawnTimer = 0;
  initStars();
  // try loading optional PNG assets (no error if missing)
  loadAssets(['ship','asteroid','heart','earth'], ()=>{/* assets ready if provided */});
  // deterministic seed for earth generation so landmasses don't flicker
  earthSeed = Math.floor(Math.random() * 0x7fffffff);
  // compute threshold so that roughly 30% of the hemisphere is land
  computeEarthThreshold(0.30);
}

// compute a threshold for earth land coverage using the same noise sampler
function computeEarthThreshold(targetFraction){
  // reuse parameters from drawEarth
  const centerX = LOGICAL_WIDTH/2;
  const yRadius = 60;
  const xRadius = Math.round(LOGICAL_WIDTH/2) + 28;
  const vals = [];
  // local rnd/noise matching drawEarth
  function rndLocal(x){
    let v = (x ^ earthSeed) >>> 0;
    v = (v + 0x6D2B79F5) >>> 0;
    v = Math.imul(v ^ (v >>> 15), 1 | v) >>> 0;
    return (v >>> 0) / 4294967295;
  }
  function noiseLocal(nx, ny){
    const ix = Math.floor(nx), iy = Math.floor(ny);
    const fx = nx - ix, fy = ny - iy;
    const a = rndLocal(ix + iy*57);
    const b = rndLocal(ix+1 + iy*57);
    const c = rndLocal(ix + (iy+1)*57);
    const d = rndLocal(ix+1 + (iy+1)*57);
    const lerp = (u,v,t) => u + (v-u) * t;
    const u = lerp(a,b,fx);
    const v = lerp(c,d,fx);
    return lerp(u,v,fy);
  }
  // sample the hemisphere with a stride to save time
  for(let yy = -yRadius; yy<=0; yy+=2){
    const row = Math.floor(xRadius * Math.sqrt(1 - (yy*yy) / (yRadius*yRadius)));
    for(let xx = -row; xx<=row; xx+=2){
      const pxX = Math.round(centerX + xx);
      const pxY = Math.round( ( (player && player.y) ? Math.round(player.y + 10) : (LOGICAL_HEIGHT - EARTH_HEIGHT + 10) ) + yy - yRadius);
      const s1 = noiseLocal(pxX * 0.06, pxY * 0.06);
      const s2 = noiseLocal(pxX * 0.12, pxY * 0.12) * 0.6;
      const s3 = noiseLocal(pxX * 0.28, pxY * 0.28) * 0.3;
      const v = s1 * 0.7 + s2 + s3;
      const vNorm = v / 1.6;
      vals.push(vNorm);
    }
  }
  if(vals.length === 0){ earthThreshold = 0.3; return; }
  vals.sort((a,b)=>a-b);
  // threshold such that approximately targetFraction of samples are above it
  const idx = Math.floor((1 - targetFraction) * vals.length);
  earthThreshold = vals[ Math.min(Math.max(0, idx), vals.length - 1) ];
}

function initStars(){
  stars = [];
  for(let i=0;i<60;i++){
    stars.push({x: Math.random()*LOGICAL_WIDTH, y: Math.random()*LOGICAL_HEIGHT, s: Math.random()*1.5+0.5, tw: Math.random()*1000});
  }
}

function spawnAsteroid(){
  // asteroid radius proportional to logical size (reduced further to make asteroids smaller)
  const minR = Math.max(2, Math.round(LOGICAL_WIDTH * 0.02));
  const maxR = Math.max(minR + 1, Math.round(LOGICAL_WIDTH * 0.045));
  const r = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
  const x = r + Math.random() * (LOGICAL_WIDTH - r*2);
  // keep speeds similar but give a slight size-based variation
  const speed = Math.max(8, 14 + Math.random()*30 - (r * 0.6)); // larger asteroids slightly slower
  asteroids.push({x,y: -r, r, speed, angle: Math.random()*Math.PI*2, rotSpeed: (Math.random()-0.5)*1.2});
}

function update(dt){
  if(gameOver) return;

  // Player movement (A/D keys)
  if(keys['a']) player.x -= player.speed * dt;
  if(keys['d']) player.x += player.speed * dt;
  // clamp
  player.x = Math.max(player.w/2, Math.min(LOGICAL_WIDTH - player.w/2, player.x));

  // Shooting
  player.shootCooldown -= dt*1000;
  if(keys[' '] && player.shootCooldown <= 0){
    shoot();
    player.shootCooldown = 180; // ms
  }

  // Missiles
  for(let i=missiles.length-1;i>=0;i--){
    missiles[i].y -= missiles[i].speed * dt;
    if(missiles[i].y < -4) missiles.splice(i,1);
  }

  // Asteroids
  for(let i=asteroids.length-1;i>=0;i--){
    const a = asteroids[i];
    a.y += a.speed * dt;
    a.angle += a.rotSpeed * dt;

    // Check collision with earth
    if(a.y + a.r >= LOGICAL_HEIGHT - EARTH_HEIGHT){
      // hit earth
      hearts--;
      // explosion particles
      createExplosion(a.x, LOGICAL_HEIGHT - EARTH_HEIGHT, Math.min(12, Math.floor(a.r*4)), '#ff8b6b');
      try{ SFX.playExplosion(); }catch(e){}
      asteroids.splice(i,1);
      if(hearts <= 0){
        gameOver = true;
        try{ showGameOverFact(); }catch(e){}
      }
      continue;
    }

    // Check collision with missiles
    for(let j=missiles.length-1;j>=0;j--){
      if(rectCircleCollide(missiles[j], a)){
        // destroy both
        score += Math.max(10, Math.floor((10 - a.r) * 2) + 5);
        createExplosion(a.x, a.y, Math.min(18, Math.floor(a.r*6)), '#ffd166');
        try{ SFX.playHit(); }catch(e){}
        asteroids.splice(i,1);
        missiles.splice(j,1);
        break;
      }
    }
  }

  // Particles
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.life -= dt*1000;
    if(p.life <= 0){ particles.splice(i,1); continue; }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.g * dt;
  }

  // Spawn logic
  spawnTimer -= dt*1000;
  if(spawnTimer <= 0){
    spawnAsteroid();
    spawnTimer = 400 + Math.random()*900;
  }

  // Stars twinkle
  for(let s of stars){
    s.tw -= dt*1000;
    if(s.tw <= 0){ s.tw = 500 + Math.random()*1000; s.s = Math.random()*1.6+0.4; }
  }
}

function rectCircleCollide(rect, circle){
  // rect: {x,y,w,h}, circle: {x,y,r}
  const rx = rect.x - rect.w/2;
  const ry = rect.y - rect.h/2;
  const closestX = clamp(circle.x, rx, rx + rect.w);
  const closestY = clamp(circle.y, ry, ry + rect.h);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return (dx*dx + dy*dy) < (circle.r * circle.r);
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

function shoot(){
  // limit active missiles
  if(missiles.length > 4) return;
  missiles.push({x: player.x, y: player.y - player.h/2 -1, w:2, h:6, speed: 180});
  try{ SFX.playShot(); }catch(e){}
}

function createExplosion(x,y,count,color){
  for(let i=0;i<count;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*40 + 20;
    particles.push({x,y,vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed - 20, g: 60, life: 400 + Math.random()*400, col: color, size: Math.random()*2+0.8});
  }
}

function draw(){
  // Clear (fill space)
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,px(LOGICAL_WIDTH), px(LOGICAL_HEIGHT));

  // Stars
  // subtle drift and twinkle for stars
  for(let s of stars){
    const drift = Math.sin((Date.now() + s.tw) * 0.0006 + s.x) * 0.2;
    const sy = s.y + drift;
    const shade = Math.floor(200 + s.s*30).toString(16).padStart(2,'0');
    const col = `#${shade}${shade}ff`;
    drawPixelRect(s.x, sy, s.s, s.s, col);
  }

  // Earth (pixelated band)
  // Earth (large pixel hemisphere drawn visually; collision still uses EARTH_HEIGHT)
  drawEarth();

  // Missiles
  for(let m of missiles){
    // main missile body (red laser)
    drawPixelRect(m.x - m.w/2, m.y - m.h/2, m.w, m.h, '#ff5252');
    // glowing tip and slight pulse (red)
    const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.02 + m.x);
    const glowCol = `rgba(255,100,100,${pulse})`;
    ctx.fillStyle = glowCol;
    ctx.fillRect(px(m.x - 2), px(m.y - m.h/2 -2), px(4), px(2));
    // small bright pixel
    drawPixelRect(m.x - 1, m.y - m.h/2 -1, 1, 1, '#fff1f1');
  }

  // Asteroids (pixel-art textured)
  for(let a of asteroids){
    drawAsteroid(a);
  }

  // Player ship (simple pixel ship) centered at player.x
  drawShip(player.x, player.y);
  // thruster flame (visual only) - let drawThruster compute correct Y
  drawThruster(player.x, player.y);

  // Particles
  for(let p of particles){
    drawPixelRect(p.x, p.y, p.size, p.size, p.col);
  }

  // subtle scanlines overlay to look retro (thin horizontal lines)
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for(let y=0;y<LOGICAL_HEIGHT; y+=2){
    ctx.fillRect(px(0), px(y), px(LOGICAL_WIDTH), px(1));
  }

  // HUD: hearts (top-left) and score (top-right)
  // Hearts
  for(let i=0;i<3;i++){
    const hx = 4 + i*8;
    const hy = 6;
    if(i < hearts) drawHeart(hx, hy, '#ff6b6b');
    else drawHeart(hx, hy, '#3b3b3b');
  }
  // Score
  drawText(`SCORE ${score}`, LOGICAL_WIDTH - 6, 10, '#9ef3ff', 6, 'right');

  // Instructions small: move under the hearts (top-left)
  drawText('A/D: Move  SPACE: Shoot', 4, 18, '#bfefff', 5, 'left');

  // Game Over overlay
  if(gameOver){
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(px(10), px(80), px(LOGICAL_WIDTH-20), px(80));
    // Layout: compute even vertical spacing (40-60 CSS px) converted to logical coords
    const overlayTop = 80;
    const overlayH = 80;
    // determine CSS px spacing target based on actual canvas size, clamp to [40,60]
    const canvasCssH = canvas.clientHeight || (LOGICAL_HEIGHT * PIXEL_SCALE);
    let spacingCss = Math.round(canvasCssH * 0.12);
    spacingCss = Math.max(40, Math.min(60, spacingCss));
    // convert spacing to logical pixels (approx)
    const spacingLogical = Math.max(4, Math.round(spacingCss / PIXEL_SCALE));

    // Font size hierarchy (logical font sizes)
    const titleSize = 9;   // largest
    const finalSize = 6;   // medium
    const factSize = 4;    // small
    const restartSize = 4; // small
    const factLineHeight = 1.1;

    // prepare fact lines and ensure rotation timing
    let factLines = 0;
    if(gameOverFactNextChange > 0){
      const now = performance.now();
      if(now >= gameOverFactNextChange){
        gameOverFactIndex = (gameOverFactIndex + 1) % FUN_FACTS.length;
        gameOverFactNextChange = now + 5000 + Math.floor(Math.random()*2000);
      }
      const factText = FUN_FACTS[gameOverFactIndex];
      // measure wrapped lines but don't draw yet; drawWrappedText returns the line count
      // we'll draw in sequence after computing layout
      factLines = drawWrappedText(factText, LOGICAL_WIDTH/2, -9999, LOGICAL_WIDTH - 40, '#ffd166', factSize, 'center', factLineHeight);
    }

    // compute heights (logical) of each group
    const titleH = titleSize; // approx logical pixels
    const finalH = finalSize;
    const factH = Math.max(0, factLines) * (factSize * factLineHeight);
    const restartH = restartSize;

    const groups = 4; // title, final, fact, restart
    const totalContentH = titleH + finalH + factH + restartH + spacingLogical * (groups - 1);

    // compute start Y (centered inside overlay rect)
    const startY = overlayTop + Math.round((overlayH - totalContentH) / 2);

    // draw elements in order with even spacing
    let cursorY = startY;
    drawText('GAME OVER', LOGICAL_WIDTH/2, cursorY + titleH/2, '#ffd166', titleSize, 'center');
    cursorY += titleH + spacingLogical;

    drawText(`FINAL: ${score}`, LOGICAL_WIDTH/2, cursorY + finalH/2, '#ffd166', finalSize, 'center');
    cursorY += finalH + spacingLogical;

    // now draw the fact block (may be multiple lines); place its top at cursorY
    if(gameOverFactNextChange > 0){
      const factText = FUN_FACTS[gameOverFactIndex];
      // drawWrappedText expects y as top-of-first-line; use cursorY
      drawWrappedText(factText, LOGICAL_WIDTH/2, cursorY, LOGICAL_WIDTH - 40, '#ffd166', factSize, 'center', factLineHeight);
    }
    cursorY += factH + spacingLogical;

    drawText('PRESS R TO RESTART', LOGICAL_WIDTH/2, cursorY + restartH/2, '#9ef3ff', restartSize, 'center');
  }
}

function drawShip(cx, cy){
  // larger attachment-style ship (red/white), scaled visually
  const scale = 2.5; // visual scale factor (larger for wider logical resolution)
  // if an external ship image is provided, draw it centered; prefer image assets
  if(assets['ship']){
    const img = assets['ship'];
    const w = img.width / PIXEL_SCALE;
    const h = img.height / PIXEL_SCALE;
    ctx.drawImage(img, px(Math.round(cx - w/2)), px(Math.round(cy - h/2)), px(w), px(h));
    return;
  }
  const pattern = [
    {x:0,y:-3,c:'#8b2b2b'},
    {x:-1,y:-2,c:'#ffffff'},{x:0,y:-2,c:'#ffffff'},{x:1,y:-2,c:'#ffffff'},
    {x:-2,y:-1,c:'#ff9f9f'},{x:-1,y:-1,c:'#ffffff'},{x:0,y:-1,c:'#ffffff'},{x:1,y:-1,c:'#ffffff'},{x:2,y:-1,c:'#ff9f9f'},
    {x:-3,y:0,c:'#b22f2f'},{x:-2,y:0,c:'#ff9f1c'},{x:-1,y:0,c:'#ffffff'},{x:0,y:0,c:'#ffffff'},{x:1,y:0,c:'#ffffff'},{x:2,y:0,c:'#ff9f1c'},{x:3,y:0,c:'#b22f2f'},
    {x:-2,y:1,c:'#b22f2f'},{x:-1,y:1,c:'#ff4f4f'},{x:0,y:1,c:'#ff4f4f'},{x:1,y:1,c:'#ff4f4f'},{x:2,y:1,c:'#b22f2f'},
    {x:0,y:2,c:'#ffb86b'}
  ];
  // draw scaled pixels (visual only: doesn't change player.w/h collision)
  for(let p of pattern){
    const sx = Math.round(cx + p.x * scale);
    const sy = Math.round(cy + p.y * scale);
    const size = Math.max(1, Math.round(scale));
    drawPixelRect(sx, sy, size, size, p.c);
  }
}

function drawThruster(cx, cy){
  // simple flickering flame under the ship (visual only)
  // If an external ship image is present, position thruster slightly below the image center
  let baseY = cy + 3;
  let offsets = [-1, 0, 1];
  if(assets['ship']){
    const img = assets['ship'];
    // image is in canvas pixels; compute logical half-height and width
    const imgH = (img.height / PIXEL_SCALE);
    const imgW = (img.width / PIXEL_SCALE);
    // thruster appears in the middle of the png, so push it down toward bottom
    baseY = cy + Math.round(imgH / 3);
    // compute side engine offsets from the image width
    const dx = Math.max(1, Math.round(imgW / 5));
    offsets = [-dx, 0, dx];
  }
  const t = Date.now() * 0.01;
  // Draw a flickering flame for each engine (left, center, right)
  for(let ei=0; ei<offsets.length; ei++){
    const ex = offsets[ei];
    // Slightly shorter flames and reduced horizontal jitter for a tighter look
    const flick = Math.floor(1 + Math.abs(Math.sin(t + ei)) * 2);
    for(let i=0;i<flick;i++){
      const ox = Math.round(cx + ex + (Math.random()*2-1) * 1);
      const oy = Math.round(baseY + i);
      const col = i % 2 === 0 ? '#ffb86b' : '#ff6b6b';
      drawPixelRect(ox, oy, 1, 1, col);
    }
  }
}

function drawHeart(x,y,color){
  // More heart-shaped pixel art (5x5-ish) with light highlight
  const pattern = [
    {x:1,y:0,c:color},{x:2,y:0,c:color},{x:4,y:0,c:color},{x:5,y:0,c:color},
    {x:0,y:1,c:color},{x:3,y:1,c:color},{x:6,y:1,c:color},
    {x:0,y:2,c:color},{x:6,y:2,c:color},
    {x:1,y:3,c:color},{x:2,y:3,c:color},{x:3,y:3,c:color},{x:4,y:3,c:color},{x:5,y:3,c:color},
    // highlight
    {x:2,y:1,c:'#ffd6d6'},{x:3,y:2,c:'#ffd6d6'}
  ];
  // allow PNG heart override
  if(assets['heart']){
    const img = assets['heart'];
    ctx.drawImage(img, px(x), px(y), px(7), px(7));
    return;
  }
  for(const p of pattern){
    drawPixelRect(x + p.x, y + p.y, 1, 1, p.c);
  }
}

// Draw a large pixel hemisphere Earth at the bottom for visual effect (non-colliding)
function drawEarth(){
  const centerX = LOGICAL_WIDTH/2;
  // compute radii proportionally to logical resolution
  const yRadius = Math.round(LOGICAL_HEIGHT * 0.33); // about one third of logical height
  const xRadius = Math.round(LOGICAL_WIDTH * 0.55); // wide hemisphere across bottom
  // Position the hemisphere so its top sits a bit below the player's ship (visual only)
  const topBelowShip = (player && player.y) ? Math.round(player.y + 10) : (LOGICAL_HEIGHT - EARTH_HEIGHT + 10);
  const baseY = topBelowShip + 2 * yRadius; // compute base such that top = topBelowShip
  // simple palette
  const ocean = '#2c6fa8';
  const land = '#63a33f';
  const shore = '#4f8b2f';
  // deterministic pseudo-random (32-bit) using seed
  function rnd(x){
    let v = (x ^ earthSeed) >>> 0;
    v = (v + 0x6D2B79F5) >>> 0;
    v = Math.imul(v ^ (v >>> 15), 1 | v) >>> 0;
    return (v >>> 0) / 4294967295;
  }
  // smooth value noise
  function noise(nx, ny){
    const ix = Math.floor(nx), iy = Math.floor(ny);
    const fx = nx - ix, fy = ny - iy;
    const a = rnd(ix + iy*57);
    const b = rnd(ix+1 + iy*57);
    const c = rnd(ix + (iy+1)*57);
    const d = rnd(ix+1 + (iy+1)*57);
    const lerp = (u,v,t) => u + (v-u) * t;
    const u = lerp(a,b,fx);
    const v = lerp(c,d,fx);
    return lerp(u,v,fy);
  }
  // If user provided an earth image, draw it stretched across the bottom
  if(assets['earth']){
    const img = assets['earth'];
    // desired draw width equals 2*xRadius, height equals yRadius
    const drawW = xRadius * 2;
    const drawH = yRadius;
    ctx.drawImage(img, px(centerX - drawW/2), px(baseY - drawH), px(drawW), px(drawH));
    return;
  }

  // layered deterministic noise to create static landmasses
  for(let yy = -yRadius; yy<=0; yy++){
    const row = Math.floor(xRadius * Math.sqrt(1 - (yy*yy) / (yRadius*yRadius)));
    for(let xx = -row; xx<=row; xx++){
      const pxX = Math.round(centerX + xx);
      const pxY = Math.round(baseY + yy - yRadius);
      // sample noise at a few scales
      const s1 = noise(pxX * 0.06, pxY * 0.06);
      const s2 = noise(pxX * 0.12, pxY * 0.12) * 0.6;
      const s3 = noise(pxX * 0.28, pxY * 0.28) * 0.3;
      // normalize by the maximum possible contribution (0.7 + 0.6 + 0.3 = 1.6)
      const v = s1 * 0.7 + s2 + s3;
  const vNorm = v / 1.6;
  // use computed earthThreshold to reach target land coverage
  const col = vNorm > earthThreshold ? land : ocean;
      drawPixelRect(pxX, pxY, 1, 1, col);
    }
  }
  // rim
  for(let x=centerX - xRadius; x<=centerX + xRadius; x+=1){
    const yy = Math.round(baseY - yRadius - 1);
    drawPixelRect(x, yy, 1, 1, shore);
  }
}

// Draw a textured asteroid using a small pixel template scaled to radius
function drawAsteroid(a){
  // choose a base palette of browns/oranges
  // prefer PNG asteroid if supplied (draw centered and scaled)
  if(assets['asteroid']){
    const img = assets['asteroid'];
    const s = (a.r*2) / (img.width / PIXEL_SCALE);
    const w = img.width / PIXEL_SCALE * s;
    const h = img.height / PIXEL_SCALE * s;
    ctx.drawImage(img, px(Math.round(a.x - w/2)), px(Math.round(a.y - h/2)), px(w), px(h));
    return;
  }
  const palette = ['#d67a40','#c85b36','#b2402a','#8b2f22','#5a1d16'];
  const ox = Math.round(a.x);
  const oy = Math.round(a.y);
  const r = Math.max(3, Math.round(a.r));

  // We'll use a simple diamond-shaped pixel map for a circular feel
  for(let yy = -r; yy<=r; yy++){
    const rowWidth = Math.floor(Math.sqrt(r*r - yy*yy));
    for(let xx = -rowWidth; xx<=rowWidth; xx++){
      // shade based on position to simulate lighting
      const nx = xx + r;
      const ny = yy + r;
      const shadeIdx = Math.floor(((nx + ny) / (r*2)) * (palette.length - 1));
      const col = palette[ clamp(shadeIdx, 0, palette.length-1) ];
      drawPixelRect(ox + xx, oy + yy, 1, 1, col);
    }
  }

  // add darker rim for depth
  for(let t=0;t<2;t++){
    const angle = t * Math.PI/3 + (a.angle || 0);
    const pxOff = Math.round(Math.cos(angle) * (r - 1));
    const pyOff = Math.round(Math.sin(angle) * (r - 1));
    drawPixelRect(ox + pxOff, oy + pyOff, 1, 1, '#3f1f12');
  }

  // subtle crater shadows (non-colliding detail)
  const craterCount = Math.max(1, Math.floor(r/2));
  for(let i=0;i<craterCount;i++){
    const cx = Math.round(ox + (Math.random()*2-1) * (r-2));
    const cy = Math.round(oy + (Math.random()*2-1) * (r-2));
    drawPixelRect(cx, cy, 1, 1, '#6b2f1f');
    drawPixelRect(cx+1, cy+1, 1, 1, '#8b3f27');
  }
}

// drawEarth already exists; add image override handling in it
// (we'll simply draw the provided earth image stretched across the bottom)

function loop(now){
  const dt = Math.min(0.05, (now - lastTime)/1000);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

// Input
// Input (normalize keys to lowercase so CapsLock/Shift doesn't change behavior)
window.addEventListener('keydown', (e)=>{
  const k = (e.key || '').toString().toLowerCase();
  // initialize/resume audio on first user interaction (some browsers require gesture)
  try{ SFX.init(); SFX.resume(); }catch(e){}
  if(k === 'm'){
    try{ SFX.toggleMute(); }catch(e){}
  }
  if(k === 'r'){
    if(gameOver) init();
  }
  keys[k] = true;
  // prevent default for space to avoid page scrolling
  if(k === ' ') e.preventDefault();
});
window.addEventListener('keyup', (e)=>{ const k = (e.key || '').toString().toLowerCase(); keys[k] = false; });

// Start
init();
requestAnimationFrame(loop);

// Menu wiring (DOM may not exist if script loaded earlier)
window.addEventListener('load', ()=>{
  const menu = document.getElementById('menuOverlay');
  const play = document.getElementById('playBtn');
  const exit = document.getElementById('exitBtn');
  if(play) play.addEventListener('click', ()=>{
    // hide menu and (re)start game
    if(menu) menu.style.display = 'none';
    init();
    // resume audio if needed
    try{ SFX.init(); SFX.resume(); }catch(e){}
  });
  if(exit) exit.addEventListener('click', ()=>{
    // try to close the tab; many browsers block this if not opened by script
    try{ window.close(); }
    catch(e){ alert('Close the tab using Ctrl+W (or close window).'); }
  });
});

// --- Fun facts rotating feature ---
const FUN_FACTS = [
  'Asteroids are leftover rock from the solar system\'s formation, mostly found between Mars and Jupiter.',
  'The asteroid belt contains millions of objects, but their total mass is less than the Moon\'s.',
  'Ceres is the largest object in the asteroid belt and is classified as a dwarf planet (~940 km across).',
  'Some asteroids are \"rubble piles\": loose collections of rock held together by gravity.',
  'Near-Earth asteroids occasionally cross our path — these are monitored for impact risk.',
  'Meteorites are pieces of asteroids or comets that survive passage through Earth\'s atmosphere.',
  'Jupiter\'s gravity helped shape the asteroid belt and creates gaps called Kirkwood gaps.',
  'Trojans are asteroids that share a planet\'s orbit near stable Lagrange points.',
  'Missions like OSIRIS-REx and Hayabusa returned samples from asteroids Bennu and Ryugu.',
  'Many asteroids have tiny moons — gravity works at every size in space.',
  'Asteroid speeds relative to Earth are typically tens of kilometers per second.',
  'Some primitive asteroids contain water-rich minerals and organic molecules.',
  'Metal-rich asteroids contain nickel and iron — potential targets for future mining.',
  'Large impacts have shaped Earth\'s history; one likely caused the dinosaur extinction ~66 million years ago.',
  'Space is mostly empty: asteroids are far apart, so collisions are rare on human timescales.'
];
let factIndex = 0;
let factTimer = null;
function showFactIn(element){
  if(!element) return;
  // choose next fact sequentially for variety
  factIndex = (factIndex + 1) % FUN_FACTS.length;
  element.textContent = FUN_FACTS[factIndex];
  element.classList.remove('visible');
  // trigger fade in after a tick
  requestAnimationFrame(()=>{ element.classList.add('visible'); });
}
function startFactRotation(containerId){
  const el = document.getElementById(containerId);
  if(!el) return;
  // show immediately
  showFactIn(el);
  // clear any previous timer
  if(factTimer) clearInterval(factTimer);
  // rotate every 5-7 seconds randomly
  factTimer = setInterval(()=>{
    // fade out then change text then fade in
    el.classList.remove('visible');
    setTimeout(()=> showFactIn(el), 300);
  }, 5000 + Math.floor(Math.random()*2000));
}
function stopFactRotation(){ if(factTimer) clearInterval(factTimer); factTimer = null; }

// Start rotating facts on the menu when the page loads
window.addEventListener('load', ()=>{
  startFactRotation('menuFact');
  // start the canvas-based game-over fact rotation now that FUN_FACTS exists
  startCanvasGameOverFacts();
});

// When game over, show the fact inside the game-over overlay if present
function showGameOverFact(){
  const overlay = document.querySelector('.menu-overlay');
  if(!overlay) return;
  // ensure menuFact exists in DOM (we added it to index.html)
  const el = document.getElementById('menuFact');
  if(el){ showFactIn(el); }
}
