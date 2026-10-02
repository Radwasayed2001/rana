/* =====================================================================
   BODY IN MOTION — visual library
   - Base images: public-domain skeleton drawings (see assets/sources).
   - Every other diagram is drawn here as SVG, so parts can be clicked,
     highlighted and animated. Drawings marked SCHEMATIC are teaching
     simplifications, not anatomical illustrations.
   ===================================================================== */
window.BIO = (function () {

const IMG = {
  front: { src: 'assets/images/skeleton-front.svg', w: 456.056, h: 925.702 },
  back: { src: 'assets/images/skeleton-back.svg', w: 343.482, h: 806.959 }
};

const COL = {
  bone: '#ecdfc4', boneLine: '#3b3326', cart: '#6fb7dc', muscle: '#d0584c', muscleDark: '#9c3a31',
  tendon: '#efe9da', lig: '#e0915c', nerve: '#f2c94c', actin: '#ef5d67', myosin: '#5b9cf0',
  cerv: '#c8673c', thor: '#3f7fd6', lumb: '#e3b23c', sacr: '#4fa35a', cocc: '#8a5cc7', fluid: 'rgba(120,200,235,.28)'
};

/* ---------- custom drawings: each returns {vb, svg, spots:{id:{x,y,r}|{rect}}} ---------- */

function spine() {
  let y = 14, s = '', idx = 0;
  const regions = {};
  const W = 220, cx = 110;
  function seg(n, h, w0, w1, col, id) {
    const y0 = y;
    for (let i = 0; i < n; i++) {
      idx++;
      const w = w0 + (w1 - w0) * (n > 1 ? i / (n - 1) : 0);
      s += '<rect x="' + (cx - w / 2) + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + col + '" stroke="#081012" stroke-width="1.2"/>';
      y += h;
      if (idx >= 2 && idx <= 24) { s += '<rect x="' + (cx - w / 2 + 3) + '" y="' + y + '" width="' + (w - 6) + '" height="3" rx="1.5" fill="' + COL.cart + '"/>'; y += 3; }
      else y += 1;
    }
    regions[id] = { y0, y1: y, w: Math.max(w0, w1) };
  }
  seg(7, 11, 30, 38, COL.cerv, 'cerv');
  seg(12, 14, 40, 52, COL.thor, 'thor');
  seg(5, 18, 56, 66, COL.lumb, 'lumb');
  // sacrum: 5 fused
  const sy = y;
  s += '<path d="M' + (cx - 34) + ' ' + sy + ' L' + (cx + 34) + ' ' + sy + ' L' + (cx + 12) + ' ' + (sy + 70) + ' L' + (cx - 12) + ' ' + (sy + 70) + ' Z" fill="' + COL.sacr + '" stroke="#081012" stroke-width="1.2"/>';
  for (let i = 1; i < 5; i++) { const yy = sy + i * 14, hw = 34 - 22 * (i / 5); s += '<line x1="' + (cx - hw + 3) + '" y1="' + yy + '" x2="' + (cx + hw - 3) + '" y2="' + yy + '" stroke="#081012" stroke-opacity=".45"/>'; }
  regions.sacr = { y0: sy, y1: sy + 70, w: 68 };
  y = sy + 71;
  const cy0 = y;
  s += '<path d="M' + (cx - 11) + ' ' + y + ' L' + (cx + 11) + ' ' + y + ' L' + (cx + 3) + ' ' + (y + 30) + ' L' + (cx - 3) + ' ' + (y + 30) + ' Z" fill="' + COL.cocc + '" stroke="#081012" stroke-width="1.2"/>';
  for (let i = 1; i < 4; i++) { const yy = y + i * 7.5, hw = 11 - 8 * (i / 4); s += '<line x1="' + (cx - hw + 1) + '" y1="' + yy + '" x2="' + (cx + hw - 1) + '" y2="' + yy + '" stroke="#081012" stroke-opacity=".5"/>'; }
  regions.cocc = { y0: cy0, y1: cy0 + 30, w: 22 };
  const H = cy0 + 44;
  const lbl = { cerv: '1–7', thor: '8–19', lumb: '20–24', sacr: '25–29', cocc: '30–33' };
  Object.keys(regions).forEach(k => { const r = regions[k]; s += '<text x="' + (cx + 50) + '" y="' + ((r.y0 + r.y1) / 2 + 4) + '" class="dlab" text-anchor="start">' + lbl[k] + '</text>'; });
  const spots = {};
  Object.keys(regions).forEach(k => { const r = regions[k]; spots[k] = { rect: [cx - r.w / 2 - 6, r.y0, r.w + 12, r.y1 - r.y0] }; });
  return { vb: [0, 0, W, H], svg: s, spots };
}

function curves(st) {
  const fetus = st && st.fetus;
  let s = '<text x="16" y="18" class="dlab">↖ خلف</text><text x="244" y="18" class="dlab" text-anchor="end">أمام ↗</text>';
  if (fetus) {
    const segs = [[COL.cerv, 'M150 40 Q118 60 108 92'], [COL.thor, 'M108 92 Q88 160 92 220'], [COL.lumb, 'M92 220 Q96 262 110 292'], [COL.sacr, 'M110 292 Q126 322 150 340']];
    segs.forEach(g => { s += '<path d="' + g[1] + '" stroke="' + g[0] + '" stroke-width="13" fill="none" stroke-linecap="round"/>'; });
    s += '<text x="130" y="372" class="dlab" text-anchor="middle">جنين / حديث الولادة: انحناء واحد للخلف</text>';
  } else {
    const segs = [['cerv', COL.cerv, 'M120 30 Q146 62 124 96'], ['thor', COL.thor, 'M124 96 Q78 160 120 226'], ['lumb', COL.lumb, 'M120 226 Q152 256 130 290'], ['sacr', COL.sacr, 'M130 290 Q100 316 122 350']];
    segs.forEach(g => { s += '<path d="' + g[2] + '" stroke="' + g[1] + '" stroke-width="13" fill="none" stroke-linecap="round"/>'; });
    s += '<text x="130" y="372" class="dlab" text-anchor="middle">بالغ: 4 انحناءات</text>';
  }
  return { vb: [0, 0, 260, 380], svg: s, spots: fetus ? {} : { cerv: { x: 140, y: 62, r: 22 }, thor: { x: 100, y: 160, r: 30 }, lumb: { x: 142, y: 258, r: 22 }, sacr: { x: 112, y: 320, r: 22 } } };
}

function vertebra() {
  const b = COL.bone, l = COL.boneLine;
  let s = '';
  // transverse processes
  s += '<path d="M118 96 L46 70 Q36 68 38 80 L112 116 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  s += '<path d="M182 96 L254 70 Q264 68 262 80 L188 116 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  // spinous process
  s += '<path d="M140 74 L146 14 Q150 6 154 14 L160 74 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  // body
  s += '<ellipse cx="150" cy="196" rx="76" ry="56" fill="' + b + '" stroke="' + l + '" stroke-width="2.4"/>';
  s += '<ellipse cx="150" cy="198" rx="58" ry="40" fill="none" stroke="' + l + '" stroke-opacity=".25" stroke-width="2"/>';
  // neural arch
  s += '<path d="M96 150 Q96 70 150 66 Q204 70 204 150 L178 150 Q178 92 150 92 Q122 92 122 150 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  // canal
  s += '<path d="M122 150 Q122 92 150 92 Q178 92 178 150 Z" fill="#0b1416" stroke="' + l + '" stroke-width="1.5"/>';
  // articular processes: superior (blue) and inferior (darker)
  s += '<ellipse cx="118" cy="84" rx="11" ry="8" fill="' + COL.cart + '" stroke="' + l + '" stroke-width="1.5"/><ellipse cx="182" cy="84" rx="11" ry="8" fill="' + COL.cart + '" stroke="' + l + '" stroke-width="1.5"/>';
  s += '<ellipse cx="134" cy="60" rx="8" ry="6" fill="#b9a983" stroke="' + l + '" stroke-width="1.5"/><ellipse cx="166" cy="60" rx="8" ry="6" fill="#b9a983" stroke="' + l + '" stroke-width="1.5"/>';
  s += '<text x="150" y="268" class="dlab" text-anchor="middle">↓ أمام (جهة البطن)</text>';
  return { vb: [0, 0, 300, 276], svg: s, spots: {
    body: { x: 150, y: 205, r: 26 }, canal: { x: 150, y: 128, r: 16 }, arch: { x: 104, y: 128, r: 13 },
    spinous: { x: 150, y: 32, r: 15 }, transverse: { x: 56, y: 80, r: 15 }, supArt: { x: 190, y: 88, r: 12 }, infArt: { x: 166, y: 54, r: 10 } } };
}

function ribs(st) {
  const cx = 210, s0 = [];
  const hl = (st && st.hl) || '';
  let s = '';
  for (let i = 0; i < 12; i++) s += '<rect x="' + (cx - 9) + '" y="' + (16 + i * 21) + '" width="18" height="17" rx="3" fill="#56657a" opacity=".55"/>';
  const W = [62, 86, 102, 114, 122, 128, 132, 134, 134, 128, 112, 94];
  const grp = i => i <= 7 ? 'true' : i <= 10 ? 'false' : 'float';
  const colr = { true: '#e8c46a', false: '#ef9a5a', float: '#ef6b6b' };
  for (let side of [-1, 1]) {
    for (let i = 1; i <= 12; i++) {
      const yp = 22 + (i - 1) * 21, w = W[i - 1], g = grp(i);
      let ex, ey;
      if (i <= 7) { const ys = 38 + (i - 1) * 25; ex = cx + side * (42 + i * 4); ey = ys + 8; }
      else if (i <= 10) { ex = cx + side * (96 + (i - 8) * 12); ey = 214 + (i - 8) * 22; }
      else { ex = cx + side * (i === 11 ? 118 : 100); ey = yp + (i === 11 ? 52 : 40); }
      const on = hl === g;
      s += '<path class="rib r-' + g + '" d="M' + (cx + side * 10) + ' ' + yp + ' C' + (cx + side * w) + ' ' + (yp - 14) + ' ' + (cx + side * (w + 8)) + ' ' + (ey - 6) + ' ' + ex + ' ' + ey + '" stroke="' + (on ? colr[g] : COL.bone) + '" stroke-width="' + (on ? 8 : 6.5) + '" fill="none" stroke-linecap="round"/>';
      if (i <= 7) { const ys = 38 + (i - 1) * 25; s += '<path d="M' + ex + ' ' + ey + ' L' + (cx + side * 17) + ' ' + ys + '" stroke="' + COL.cart + '" stroke-width="5" stroke-linecap="round"/>'; }
      else if (i <= 10) { s += '<path d="M' + ex + ' ' + ey + ' Q' + (cx + side * 70) + ' ' + (ey - 8) + ' ' + (cx + side * 60) + ' 196" stroke="' + COL.cart + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>'; }
    }
  }
  // sternum (bony) + lower cartilaginous tip
  s += '<path d="M' + (cx - 22) + ' 26 Q' + cx + ' 18 ' + (cx + 22) + ' 26 L' + (cx + 17) + ' 200 L' + (cx - 17) + ' 200 Z" fill="' + (hl === 'sternum' ? '#ffe39a' : '#d8c8a6') + '" stroke="' + COL.boneLine + '" stroke-width="1.5"/>';
  s += '<path d="M' + (cx - 12) + ' 200 L' + (cx + 12) + ' 200 L' + cx + ' 232 Z" fill="' + COL.cart + '" stroke="' + COL.boneLine + '" stroke-width="1.2"/>';
  return { vb: [0, 0, 420, 320], svg: s, spots: {
    sternum: { x: cx, y: 110, r: 16 }, xiph: { x: cx, y: 214, r: 10 }, true: { x: cx - 112, y: 100, r: 16 }, false: { x: cx + 126, y: 226, r: 17 },
    float: { x: cx - 112, y: 284, r: 16 }, cart: { x: cx + 46, y: 160, r: 12 }, vert: { x: cx, y: 270, r: 12 } } };
}

function knee() {
  const b = COL.bone, l = COL.boneLine;
  let s = '';
  s += '<path d="M115 0 L185 0 L188 96 Q232 104 226 148 Q220 172 186 166 Q164 160 150 150 Q136 160 114 166 Q80 172 74 148 Q68 104 112 96 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  s += '<path d="M78 150 Q86 168 112 166 M188 166 Q214 168 222 150" stroke="' + COL.cart + '" stroke-width="5" fill="none"/>';
  s += '<path d="M72 184 Q150 172 228 184 L222 204 Q196 214 184 232 L178 320 L122 320 L116 232 Q104 214 78 204 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  s += '<path d="M80 184 Q150 174 220 184" stroke="' + COL.cart + '" stroke-width="5" fill="none"/>';
  s += '<path d="M232 212 Q248 206 254 222 L248 320 L234 320 L230 228 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  s += '<path d="M138 146 L166 186" stroke="#c03a7a" stroke-width="7" stroke-linecap="round"/>';
  s += '<path d="M164 146 L134 186" stroke="#e05a6a" stroke-width="7" stroke-linecap="round"/>';
  s += '<path d="M76 124 Q66 160 82 206" stroke="' + COL.lig + '" stroke-width="9" fill="none" stroke-linecap="round"/>';
  s += '<path d="M224 124 Q238 164 240 212" stroke="' + COL.lig + '" stroke-width="9" fill="none" stroke-linecap="round"/>';
  s += '<text x="60" y="300" class="dlab" text-anchor="middle">داخلي</text><text x="270" y="300" class="dlab" text-anchor="middle">خارجي</text>';
  return { vb: [0, 0, 300, 320], svg: s, spots: {
    femur: { x: 150, y: 50, r: 18 }, tibia: { x: 150, y: 270, r: 18 }, fibula: { x: 242, y: 282, r: 12 },
    acl: { x: 139, y: 180, r: 9 }, pcl: { x: 161, y: 180, r: 9 }, medial: { x: 70, y: 166, r: 12 }, lateral: { x: 236, y: 168, r: 12 } } };
}

function synovial() {
  const b = COL.bone, l = COL.boneLine;
  let s = '';
  s += '<path d="M90 146 Q150 172 210 146 L210 214 L90 214 Z" fill="' + COL.fluid + '"/>';
  s += '<path d="M112 0 L188 0 L188 104 Q206 132 186 148 Q150 166 114 148 Q94 132 112 104 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  s += '<path d="M100 132 Q110 154 150 160 Q190 154 200 132" stroke="' + COL.cart + '" stroke-width="7" fill="none" stroke-linecap="round"/>';
  s += '<path d="M104 300 L196 300 L196 214 Q204 196 196 186 Q150 172 104 186 Q96 196 104 214 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  s += '<path d="M106 190 Q150 176 194 190" stroke="' + COL.cart + '" stroke-width="7" fill="none" stroke-linecap="round"/>';
  s += '<path d="M104 112 Q84 160 104 222 M196 112 Q216 160 196 222" stroke="' + COL.lig + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
  s += '<path d="M60 18 Q34 70 52 150 Q60 176 74 190" stroke="' + COL.muscle + '" stroke-width="26" fill="none" stroke-linecap="round"/>';
  s += '<path d="M74 190 Q88 210 104 236" stroke="' + COL.tendon + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
  return { vb: [0, 0, 300, 300], svg: s, spots: {
    bone: { x: 150, y: 50, r: 16 }, cart: { x: 150, y: 150, r: 11 }, fluid: { x: 150, y: 172, r: 10 }, lig: { x: 208, y: 168, r: 11 },
    muscle: { x: 44, y: 96, r: 16 }, tendon: { x: 92, y: 214, r: 11 } } };
}

function forearm(st) {
  const prone = st && st.prone, b = COL.bone, l = COL.boneLine;
  let s = '<text x="40" y="20" class="dlab">داخلي</text><text x="262" y="20" class="dlab" text-anchor="end">خارجي</text>';
  s += '<path d="M128 0 L172 0 L176 64 Q184 82 150 86 Q116 82 124 64 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  s += '<path d="M118 84 L136 84 L134 246 L120 246 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  const rad = prone ? 'M170 84 L186 84 L132 250 L114 246 Z' : 'M168 84 L184 84 L192 248 L174 250 Z';
  s += '<path class="radius" d="' + rad + '" fill="#f3d38a" stroke="' + l + '" stroke-width="2"/>';
  const hx = 152;
  s += '<rect x="' + (hx - 46) + '" y="254" width="92" height="30" rx="8" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
  for (let i = 0; i < 4; i++) s += '<rect x="' + (hx - 40 + i * 22) + '" y="286" width="12" height="48" rx="5" fill="' + b + '" stroke="' + l + '" stroke-width="1.5"/>';
  const tx = prone ? hx - 62 : hx + 52;
  s += '<rect x="' + tx + '" y="262" width="12" height="40" rx="5" transform="rotate(' + (prone ? 28 : -28) + ' ' + (tx + 6) + ' 262)" fill="#f3d38a" stroke="' + l + '" stroke-width="1.5"/>';
  s += '<text x="150" y="350" class="dlab" text-anchor="middle">' + (prone ? 'الكعبرة لفّت حول الزند (شكل ×)' : 'الوضع التشريحي: الكعبرة جهة الإبهام') + '</text>';
  return { vb: [0, 0, 300, 356], svg: s, spots: {
    humerus: { x: 150, y: 36, r: 15 }, ulna: { x: 127, y: 170, r: 12 }, radius: prone ? { x: 152, y: 168, r: 12 } : { x: 181, y: 168, r: 12 },
    carpals: { x: 152, y: 269, r: 12 }, thumb: prone ? { x: hx - 66, y: 286, r: 10 } : { x: hx + 70, y: 286, r: 10 } } };
}

function pelvis() {
  const b = COL.bone, l = COL.boneLine;
  const one = (ox, wide) => {
    const k = wide ? 1.18 : 1;
    let p = '';
    p += '<path d="M' + (ox - 92 * k) + ' 40 Q' + (ox - 104 * k) + ' 100 ' + (ox - 56 * k) + ' 130 L' + (ox - 22 * k) + ' 176 L' + (ox + 22 * k) + ' 176 L' + (ox + 56 * k) + ' 130 Q' + (ox + 104 * k) + ' 100 ' + (ox + 92 * k) + ' 40 Q' + ox + ' 70 ' + (ox - 92 * k) + ' 40 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/>';
    if (wide) p += '<ellipse cx="' + ox + '" cy="118" rx="46" ry="34" fill="#0b1416" stroke="' + l + '"/>';
    else p += '<path d="M' + (ox - 32) + ' 92 Q' + ox + ' 78 ' + (ox + 32) + ' 92 Q' + (ox + 28) + ' 132 ' + ox + ' 150 Q' + (ox - 28) + ' 132 ' + (ox - 32) + ' 92 Z" fill="#0b1416" stroke="' + l + '"/>';
    const a = wide ? 34 : 18;
    p += '<path d="M' + (ox - a) + ' 206 L' + ox + ' 178 L' + (ox + a) + ' 206" stroke="#ef8a6a" stroke-width="3" fill="none"/>';
    p += '<rect x="' + (ox - 4) + '" y="168" width="8" height="12" fill="' + COL.cart + '"/>';
    return p;
  };
  let s = one(118, false) + one(338, true);
  s += '<text x="118" y="228" class="dlab" text-anchor="middle">ذكر</text><text x="338" y="228" class="dlab" text-anchor="middle">أنثى</text>';
  return { vb: [0, 0, 460, 236], svg: s, spots: {} };
}

/* muscle zoom levels */
function zWhole() {
  return { vb: [0, 0, 400, 160], svg: '<rect x="0" y="62" width="70" height="36" rx="16" fill="' + COL.bone + '"/><rect x="330" y="62" width="70" height="36" rx="16" fill="' + COL.bone + '"/>' +
    '<path d="M70 80 L110 80" stroke="' + COL.tendon + '" stroke-width="10"/><path d="M290 80 L330 80" stroke="' + COL.tendon + '" stroke-width="10"/>' +
    '<path d="M110 80 Q200 0 290 80 Q200 160 110 80 Z" fill="' + COL.muscle + '" stroke="' + COL.muscleDark + '" stroke-width="2"/>' +
    '<text x="90" y="54" class="dlab" text-anchor="middle">وتر</text><text x="35" y="120" class="dlab" text-anchor="middle">عظمة</text><text x="200" y="152" class="dlab" text-anchor="middle">عضلة</text>', spots: {} };
}
function zBundle() {
  let s = '<circle cx="200" cy="90" r="82" fill="' + COL.muscleDark + '" stroke="#f0d0c8" stroke-width="3"/>';
  [[170, 60], [230, 60], [150, 110], [200, 100], [250, 112], [190, 148], [236, 150]].forEach(p => {
    s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="22" fill="' + COL.muscle + '" stroke="#f6e3dc" stroke-width="2"/>';
    for (let i = 0; i < 6; i++) s += '<circle cx="' + (p[0] - 9 + (i % 3) * 9) + '" cy="' + (p[1] - 5 + Math.floor(i / 3) * 10) + '" r="3.6" fill="#f2a59a"/>';
  });
  s += '<text x="200" y="186" class="dlab" text-anchor="middle">مقطع: حزم يحيط بكل منها غشاء — وكل حزمة فيها ألياف</text>';
  return { vb: [0, 0, 400, 196], svg: s, spots: {} };
}
function zFiber() {
  let s = '<rect x="20" y="40" width="360" height="90" rx="40" fill="' + COL.muscle + '" stroke="#f6e3dc" stroke-width="3"/>';
  for (let i = 0; i < 5; i++) s += '<line x1="50" y1="' + (62 + i * 12) + '" x2="350" y2="' + (62 + i * 12) + '" stroke="#f2a59a" stroke-width="5"/>';
  [[80, 44], [170, 126], [250, 44], [330, 126]].forEach(p => { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="13" ry="6" fill="#5a1e5a" stroke="#f6e3dc"/>'; });
  s += '<text x="200" y="22" class="dlab" text-anchor="middle">ليفة (خلية): ساركوليما تحيط بساركوبلازم + أنوية كثيرة + ليفات</text>';
  return { vb: [0, 0, 400, 150], svg: s, spots: {} };
}
function zFibril() {
  let s = '<rect x="10" y="50" width="380" height="50" rx="22" fill="#f4dcd4"/>';
  for (let i = 0; i < 4; i++) {
    const x = 30 + i * 95;
    s += '<rect x="' + (x + 20) + '" y="50" width="52" height="50" fill="#7a2c3a"/>';
    s += '<line x1="' + (x - 2) + '" y1="50" x2="' + (x - 2) + '" y2="100" stroke="#20080c" stroke-width="3"/>';
  }
  s += '<text x="200" y="32" class="dlab" text-anchor="middle">ليفة عضلية: مناطق داكنة (A) ومضيئة (I) يقطعها خط Z</text>';
  return { vb: [0, 0, 400, 120], svg: s, spots: {} };
}

function sarcomere(st) {
  const c = Math.max(0, Math.min(1, (st && st.c) || 0));
  const z1 = 90 + 40 * c, z2 = 370 - 40 * c, m0 = 170, m1 = 290, AL = 100;
  let s = '';
  s += '<rect x="0" y="40" width="460" height="130" fill="rgba(255,255,255,.02)"/>';
  [60, 90, 120, 150].forEach(y => {
    s += '<line x1="' + z1 + '" y1="' + y + '" x2="' + (z1 + AL) + '" y2="' + y + '" stroke="' + COL.actin + '" stroke-width="3"/>';
    s += '<line x1="' + (z2 - AL) + '" y1="' + y + '" x2="' + z2 + '" y2="' + y + '" stroke="' + COL.actin + '" stroke-width="3"/>';
    s += '<line x1="' + Math.max(0, z1 - (m0 - z1)) + '" y1="' + y + '" x2="' + z1 + '" y2="' + y + '" stroke="' + COL.actin + '" stroke-width="3" opacity=".35"/>';
    s += '<line x1="' + z2 + '" y1="' + y + '" x2="' + Math.min(460, z2 + (z2 - m1)) + '" y2="' + y + '" stroke="' + COL.actin + '" stroke-width="3" opacity=".35"/>';
  });
  [75, 105, 135].forEach(y => {
    s += '<rect x="' + m0 + '" y="' + (y - 5) + '" width="' + (m1 - m0) + '" height="10" rx="5" fill="' + COL.myosin + '"/>';
    for (let x = m0 + 8; x < m1 - 4; x += 14) { if (Math.abs(x - 230) < 12) continue; const d = x < 230 ? -1 : 1; s += '<line x1="' + x + '" y1="' + (y - 5) + '" x2="' + (x + d * 5) + '" y2="' + (y - 11) + '" stroke="' + COL.myosin + '" stroke-width="2"/><line x1="' + x + '" y1="' + (y + 5) + '" x2="' + (x + d * 5) + '" y2="' + (y + 11) + '" stroke="' + COL.myosin + '" stroke-width="2"/>'; }
  });
  s += '<line x1="' + z1 + '" y1="48" x2="' + z1 + '" y2="162" stroke="#f2f2f2" stroke-width="4"/><line x1="' + z2 + '" y1="48" x2="' + z2 + '" y2="162" stroke="#f2f2f2" stroke-width="4"/>';
  s += '<text x="' + z1 + '" y="40" class="dlab" text-anchor="middle">Z</text><text x="' + z2 + '" y="40" class="dlab" text-anchor="middle">Z</text>';
  const br = (x0, x1, y, t, col) => x1 - x0 < 2 ? '<text x="' + ((x0 + x1) / 2) + '" y="' + (y + 4) + '" class="dlab" text-anchor="middle" fill="' + col + '">' + t + ' = 0</text>' :
    '<path d="M' + x0 + ' ' + (y - 5) + ' V' + y + ' H' + x1 + ' V' + (y - 5) + '" stroke="' + col + '" fill="none" stroke-width="1.6"/><text x="' + ((x0 + x1) / 2) + '" y="' + (y + 14) + '" class="dlab" text-anchor="middle" fill="' + col + '">' + t + '</text>';
  const hl = z1 + AL, hr = z2 - AL;
  s += br(m0, m1, 186, 'A', '#9fc3ff');
  s += br(Math.max(0, z1 - (m0 - z1)), m0, 186, 'I', '#ffb0b6');
  s += br(Math.min(hl, hr), Math.max(hl, hr) > Math.min(hl, hr) && hl < hr ? hr : Math.min(hl, hr), 210, 'H', '#ffe08a');
  s += br(z1, z2, 232, 'قطعة عضلية (ساركومير)', '#d8f3e8');
  return { vb: [0, 0, 460, 250], svg: s, spots: {
    Z: { x: z1, y: 105, r: 9 }, actin: { x: z1 + 20, y: 60, r: 9 }, myosin: { x: 230, y: 105, r: 11 }, I: { x: (Math.max(0, z1 - (m0 - z1)) + m0) / 2, y: 186, r: 10 }, A: { x: 230, y: 186, r: 10 }, H: { x: 230, y: 140, r: 9 } },
    m: { I: 2 * (m0 - z1), H: Math.max(0, hr - hl), A: m1 - m0, S: z2 - z1 } };
}

function nmj(st) {
  st = st || {};
  const ph = st.ph || 0, tox = st.tox || 'none';
  const depol = st.depol;
  let s = '';
  s += '<path d="M60 0 Q90 40 160 40 L200 40" stroke="' + COL.nerve + '" stroke-width="12" fill="none" stroke-linecap="round" class="' + (ph === 1 ? 'zap' : '') + '"/>';
  s += '<path d="M150 40 Q130 40 132 80 Q136 128 210 128 Q284 128 288 80 Q290 40 250 40 Z" fill="#f6d36b" stroke="#8a6d14" stroke-width="2"/>';
  const ves = [[180, 82], [212, 70], [244, 84], [196, 106], [230, 108]];
  ves.forEach((v, i) => { const gone = (ph >= 3 && tox !== 'botox' && i < 3); s += '<circle cx="' + v[0] + '" cy="' + v[1] + '" r="11" fill="#fff6d8" stroke="#8a6d14" opacity="' + (gone ? .25 : 1) + '"/>'; if (!gone) for (let k = 0; k < 3; k++) s += '<circle cx="' + (v[0] - 4 + k * 4) + '" cy="' + (v[1] + (k % 2 ? 3 : -2)) + '" r="1.8" fill="#4caf50"/>'; });
  if (ph === 2) for (let i = 0; i < 3; i++) s += '<text x="' + (100 + i * 40) + '" y="' + (40 + i * 14) + '" class="ion ca">Ca²⁺ →</text>';
  if (tox === 'botox') s += '<text x="300" y="120" class="ion" fill="#ff8fa0">✖ لا يتحرر الأستيل كولين</text>';
  // cleft and membrane
  const outside = depol ? '−' : '+', inside = depol ? '+' : '−';
  s += '<rect x="20" y="172" width="400" height="18" fill="#e8a3b6" stroke="#8c3a54"/>';
  for (let x = 40; x < 410; x += 26) { s += '<text x="' + x + '" y="166" class="chg ' + (depol ? 'neg' : 'pos') + '">' + outside + '</text><text x="' + x + '" y="208" class="chg ' + (depol ? 'pos' : 'neg') + '">' + inside + '</text>'; }
  const recX = [150, 190, 230, 270];
  recX.forEach(x => {
    if (tox === 'auto' && ph >= 1) { s += '<path d="M' + (x - 8) + ' 172 l16 -10 M' + (x + 8) + ' 172 l-16 -10" stroke="#ff6b7a" stroke-width="2"/>'; return; }
    s += '<path d="M' + (x - 9) + ' 172 v-9 h5 v6 h8 v-6 h5 v9 Z" fill="#2fb9a5"/>';
    if (tox === 'cobra' && ph >= 3) s += '<circle cx="' + x + '" cy="160" r="5" fill="#9b59b6"/>';
    else if (ph >= 4 && ph < 7 && tox !== 'botox') s += '<circle cx="' + x + '" cy="160" r="4" fill="#4caf50"/>';
  });
  if (ph >= 3 && ph < 6 && tox !== 'botox') for (let i = 0; i < 6; i++) s += '<circle cx="' + (150 + i * 24) + '" cy="' + (148 + (i % 2) * 6) + '" r="3" fill="#4caf50"/>';
  if (depol) for (let i = 0; i < 4; i++) s += '<text x="' + (120 + i * 60) + '" y="232" class="ion na">Na⁺ ↓</text>';
  if (ph >= 6 && tox !== 'nochol') s += '<text x="300" y="150" class="ion">✂️ كولين إستيريز</text>';
  // fiber interior with myofibril
  const shrink = st.contract ? .8 : 1;
  s += '<g transform="translate(' + (220 - 160 * shrink) + ' 0) scale(' + shrink + ' 1)"><rect x="0" y="246" width="320" height="16" rx="8" fill="' + COL.muscle + '"/>';
  for (let i = 0; i < 8; i++) s += '<rect x="' + (10 + i * 40) + '" y="246" width="16" height="16" fill="' + COL.muscleDark + '"/>';
  s += '</g>';
  s += '<text x="20" y="300" class="dlab">نهاية عصبية ↑ • شق تشابكي • غشاء الليفة • داخل الليفة ↓</text>';
  return { vb: [0, 0, 440, 310], svg: s, spots: {} };
}

function muscleIcon(kind) {
  let s = '';
  if (kind === 'skeletal') { for (let i = 0; i < 3; i++) { s += '<rect x="10" y="' + (8 + i * 26) + '" width="160" height="22" rx="11" fill="' + COL.muscle + '"/>'; for (let x = 22; x < 166; x += 12) s += '<line x1="' + x + '" y1="' + (9 + i * 26) + '" x2="' + x + '" y2="' + (29 + i * 26) + '" stroke="' + COL.muscleDark + '" stroke-width="3"/>'; [40, 100, 150].forEach(x => { s += '<ellipse cx="' + x + '" cy="' + (10 + i * 26) + '" rx="6" ry="3" fill="#4a1650"/>'; }); } }
  if (kind === 'cardiac') { s += '<path d="M10 20 H70 L90 40 H170 M10 60 H60 L80 40 M90 40 L110 64 H170 M10 86 H170" stroke="' + COL.muscle + '" stroke-width="18" fill="none" stroke-linecap="round"/>'; for (let x = 20; x < 170; x += 14) s += '<line x1="' + x + '" y1="12" x2="' + x + '" y2="94" stroke="' + COL.muscleDark + '" stroke-width="1.6" opacity=".7"/>'; [[40, 20], [130, 40], [50, 86], [140, 86]].forEach(p => { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="6" ry="3.5" fill="#4a1650"/>'; }); }
  if (kind === 'smooth') { [[40, 30], [120, 30], [80, 62], [150, 74], [30, 80]].forEach(p => { s += '<path d="M' + (p[0] - 34) + ' ' + p[1] + ' Q' + p[0] + ' ' + (p[1] - 14) + ' ' + (p[0] + 34) + ' ' + p[1] + ' Q' + p[0] + ' ' + (p[1] + 14) + ' ' + (p[0] - 34) + ' ' + p[1] + ' Z" fill="' + COL.muscle + '"/><ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="6" ry="3" fill="#4a1650"/>'; }); }
  return '<svg viewBox="0 0 180 100" class="micon" aria-hidden="true">' + s + '</svg>';
}

function jointIcon(kind) {
  const b = COL.bone, l = COL.boneLine;
  let s = '';
  if (kind === 'ball') s = '<path d="M20 50 Q50 20 80 50 Q50 80 20 50" fill="' + COL.cart + '" opacity=".6"/><g class="spin"><circle cx="50" cy="50" r="17" fill="' + b + '" stroke="' + l + '" stroke-width="2"/><rect x="45" y="50" width="10" height="44" fill="' + b + '" stroke="' + l + '" stroke-width="2"/></g>';
  if (kind === 'hinge') s = '<rect x="40" y="6" width="20" height="46" rx="8" fill="' + b + '" stroke="' + l + '" stroke-width="2"/><g class="swing"><rect x="40" y="50" width="20" height="46" rx="8" fill="' + b + '" stroke="' + l + '" stroke-width="2"/></g><circle cx="50" cy="51" r="6" fill="' + COL.cart + '"/>';
  if (kind === 'pivot') s = '<rect x="30" y="8" width="16" height="84" rx="7" fill="' + b + '" stroke="' + l + '" stroke-width="2"/><g class="pivot"><rect x="56" y="8" width="14" height="84" rx="7" fill="#f3d38a" stroke="' + l + '" stroke-width="2"/></g>';
  if (kind === 'fibrous') s = '<path d="M10 20 H90 V80 H10 Z" fill="' + b + '" stroke="' + l + '" stroke-width="2"/><path d="M50 20 l-6 8 l8 6 l-8 8 l8 8 l-8 8 l8 8 l-6 14" stroke="' + l + '" stroke-width="2.4" fill="none"/>';
  return '<svg viewBox="0 0 100 100" class="jicon" aria-hidden="true">' + s + '</svg>';
}

/* qualitative mini-graph (shape only, like the textbook's graphs) */
function graph(pts, o) {
  o = o || {};
  const P = pts.map(p => [22 + p[0] * 130, 82 - p[1] * 70]);
  const d = 'M' + P.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  let s = '<path d="M22 6 V82 H158" stroke="currentColor" stroke-opacity=".55" fill="none" stroke-width="1.4"/>' +
    '<path d="' + d + '" stroke="' + (o.c || '#ff8a73') + '" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  if (o.pts2) { const Q = o.pts2.map(p => [22 + p[0] * 130, 82 - p[1] * 70]); s += '<path d="M' + Q.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + '" stroke="#7cc6f0" stroke-width="3.2" fill="none" stroke-linecap="round"/>'; }
  if (o.y) s += '<text x="26" y="12" font-size="10" fill="currentColor" fill-opacity=".8">' + o.y + '</text>';
  if (o.x) s += '<text x="156" y="96" font-size="10" fill="currentColor" fill-opacity=".8" text-anchor="end">' + o.x + '</text>';
  return '<svg viewBox="0 0 170 100" class="mgraph" role="img" aria-label="' + (o.alt || 'منحنى') + '">' + s + '</svg>';
}

const CUSTOM = { spine, curves, vertebra, ribs, knee, synovial, forearm, pelvis, zWhole, zBundle, zFiber, zFibril, sarcomere, nmj };

/* ---------- generic diagram: image-based or custom ---------- */
function build(d, st) {
  if (IMG[d.base]) {
    const I = IMG[d.base], v = d.view || [0, 0, 100, 100];
    return {
      vb: [v[0] * I.w / 100, v[1] * I.h / 100, v[2] * I.w / 100, v[3] * I.h / 100],
      inner: '<image href="' + I.src + '" x="0" y="0" width="' + I.w + '" height="' + I.h + '"/>',
      pos: sp => ({ x: sp.x * I.w / 100, y: sp.y * I.h / 100, r: (sp.r || 3.4) * I.w / 100 }),
      img: true
    };
  }
  const C = CUSTOM[d.base](st || d.state || {});
  return { vb: C.vb, inner: C.svg, pos: sp => { const p = C.spots[sp.id] || sp; return p.rect ? { rect: p.rect } : { x: p.x, y: p.y, r: p.r || 10 }; }, meta: C.m };
}

function svgFor(d, st, spotsHtml) {
  const B = build(d, st);
  return '<svg class="dg ' + (B.img ? 'dg-img' : 'dg-own') + '" viewBox="' + B.vb.join(' ') + '" role="img" aria-label="' + (d.alt || 'مخطط') + '">' + B.inner + (spotsHtml ? spotsHtml(B) : '') + '</svg>';
}

return { build, svgFor, IMG, COL, muscleIcon, jointIcon, CUSTOM, graph };
})();
