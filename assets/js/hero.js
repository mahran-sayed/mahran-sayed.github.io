/* Hero animations (canvas). Two scenes, both driven by real velocity fields:

   1. "airfoil"   - potential flow around a Joukowski airfoil with the Kutta condition.
   2. "propeller" - a vessel in double-body potential flow (free surface = symmetry plane)
                    with a spinning propeller, an actuator-disc wake and tip vortices.

   Trails are drawn from a short per-particle position history on a freshly cleared
   canvas every frame, so nothing can "ghost" or freeze over time.
   Respects prefers-reduced-motion and pauses when off-screen / hidden. */
(function (global) {
  "use strict";

  function parseColor(str, fallback) {
    str = (str || "").trim();
    var m;
    if ((m = str.match(/^#([0-9a-f]{3})$/i))) {
      return [parseInt(m[1][0] + m[1][0], 16), parseInt(m[1][1] + m[1][1], 16), parseInt(m[1][2] + m[1][2], 16)];
    }
    if ((m = str.match(/^#([0-9a-f]{6})$/i))) {
      return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
    }
    if ((m = str.match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i))) return [+m[1], +m[2], +m[3]];
    return fallback || [56, 225, 255];
  }

  /* ------------------------------------------------------------------ trails */
  function Trails(n, L) {
    this.n = n; this.L = L;
    this.hx = new Float32Array(n * L); this.hy = new Float32Array(n * L);
    this.x = new Float32Array(n); this.y = new Float32Array(n);
    this.head = new Uint16Array(n);
    this.age = new Float32Array(n); this.max = new Float32Array(n);
    this.col = new Uint8Array(n);
  }
  Trails.prototype.place = function (i, x, y, max) {
    this.x[i] = x; this.y[i] = y; this.age[i] = 0; this.max[i] = max; this.head[i] = 0;
    var o = i * this.L;
    for (var k = 0; k < this.L; k++) { this.hx[o + k] = x; this.hy[o + k] = y; }
  };
  Trails.prototype.push = function (i, x, y) {
    var h = (this.head[i] + 1) % this.L;
    this.head[i] = h;
    var o = i * this.L + h;
    this.hx[o] = x; this.hy[o] = y; this.x[i] = x; this.y[i] = y;
  };
  // colour classes: 0 slow, 1 mid, 2 fast (suction side); 3,4,5 = young/mid/old tip-vortex particles
  var AGE_ALPHA = [1, 0.62, 0.34, 0.13];
  var BASE_ALPHA = [0.30, 0.75, 0.92, 0.98, 0.62, 0.28];
  Trails.prototype.draw = function (ctx, colors, cMin, cMax, lineWidth, onlyActive) {
    var AB = 4, L = this.L, seg = Math.max(1, Math.floor(L / AB)), paths = [], i, k;
    for (i = 0; i < 6 * AB; i++) paths.push(new Path2D());
    for (i = 0; i < this.n; i++) {
      var c = this.col[i];
      if (c < cMin || c > cMax) continue;
      if (onlyActive && this.age[i] >= this.max[i]) continue;
      var h = this.head[i], o = i * L;
      for (k = 0; k < L - 1; k++) {
        var ia = o + ((h - k + L) % L), ib = o + ((h - k - 1 + L) % L);
        var a = Math.min(AB - 1, (k / seg) | 0);
        var p = paths[c * AB + a];
        p.moveTo(this.hx[ib], this.hy[ib]);
        p.lineTo(this.hx[ia], this.hy[ia]);
      }
    }
    ctx.lineWidth = lineWidth; ctx.lineCap = "round";
    for (var cc = cMin; cc <= cMax; cc++) {
      var rgb = (cc === 0 || cc === 1) ? colors.a : colors.b;
      for (var aa = 0; aa < AB; aa++) {
        ctx.strokeStyle = "rgba(" + rgb.join(",") + "," + (BASE_ALPHA[cc] * AGE_ALPHA[aa]).toFixed(3) + ")";
        ctx.stroke(paths[cc * AB + aa]);
      }
    }
  };

  /* ------------------------------------------------------- scene: airfoil */
  function airfoilScene() {
    var c = 1, e = 0.13, hOff = 0.07;
    var z0 = [-e, hOff];
    var a = Math.sqrt((c + e) * (c + e) + hOff * hOff);
    var beta = Math.asin(hOff / a);
    var alpha = 9 * Math.PI / 180;
    var U = 1;
    var Gamma = 4 * Math.PI * U * a * Math.sin(alpha + beta);
    var cosA = Math.cos(alpha), sinA = Math.sin(alpha);

    var poly = [], minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (var i = 0; i < 260; i++) {
      var th = (i / 260) * 2 * Math.PI;
      var zr = z0[0] + a * Math.cos(th), zi = z0[1] + a * Math.sin(th);
      var m2 = zr * zr + zi * zi;
      var x = zr + c * c * zr / m2, y = zi - c * c * zi / m2;
      poly.push([x, y]);
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    var cF = [(minX + maxX) / 2, (minY + maxY) / 2];
    var chordUnits = maxX - minX;
    var w = 0, h = 0, scale = 1, cx = 0, cy = 0;

    function toDisplay(p) {
      var dx = p[0] - cF[0], dy = p[1] - cF[1];
      var X = dx * cosA + dy * sinA, Y = -dx * sinA + dy * cosA;
      return [cx + X * scale, cy - Y * scale];
    }

    var S = { name: "Airfoil", dynamic: false, density: 1 };
    S.setup = function (W, H, narrow) {
      w = W; h = H;
      var chordPx = narrow ? Math.min(w * 0.75, 420) : Math.min(Math.max(w * 0.34, 260), 520);
      scale = chordPx / chordUnits;
      cx = narrow ? w * 0.5 : w * 0.70;
      cy = narrow ? h * 0.74 : h * 0.52;
    };
    S.velocity = function (px, py) {
      var X = (px - cx) / scale, Y = (cy - py) / scale;
      var fx = X * cosA - Y * sinA + cF[0], fy = X * sinA + Y * cosA + cF[1];
      var z2r = fx * fx - fy * fy - 4 * c * c, z2i = 2 * fx * fy;
      var mod = Math.sqrt(z2r * z2r + z2i * z2i);
      var sr = Math.sqrt(Math.max(0, (mod + z2r) / 2));
      var si = Math.sqrt(Math.max(0, (mod - z2r) / 2)) * (z2i < 0 ? -1 : 1);
      var r1 = (fx + sr) / 2, i1 = (fy + si) / 2, r2 = (fx - sr) / 2, i2 = (fy - si) / 2;
      var d1 = Math.hypot(r1 - z0[0], i1 - z0[1]), d2 = Math.hypot(r2 - z0[0], i2 - z0[1]);
      var zr, zi, d;
      if (d1 >= d2) { zr = r1; zi = i1; d = d1; } else { zr = r2; zi = i2; d = d2; }
      if (d < a * 1.004) return null;
      var p = zr - z0[0], q = zi - z0[1], m = p * p + q * q;
      var s2r = p * p - q * q, s2i = 2 * p * q, sM = Math.max(s2r * s2r + s2i * s2i, 1e-12);
      var t2r = a * a * (cosA * s2r + sinA * s2i) / sM;
      var t2i = a * a * (sinA * s2r - cosA * s2i) / sM;
      var dWr = U * (cosA - t2r) + (Gamma / (2 * Math.PI)) * (q / m);
      var dWi = U * (-sinA - t2i) + (Gamma / (2 * Math.PI)) * (p / m);
      var zz = zr * zr - zi * zi, zzi = 2 * zr * zi, M = Math.max(zz * zz + zzi * zzi, 1e-9);
      var Dr = 1 - c * c * zz / M, Di = c * c * zzi / M;
      var DM = Math.max(Dr * Dr + Di * Di, 4e-4);
      var qr = (dWr * Dr + dWi * Di) / DM, qi = (dWi * Dr - dWr * Di) / DM;
      var u = qr, v = -qi;
      var sp = Math.hypot(u, v);
      if (!(sp === sp)) return null;
      if (sp > 3) { u *= 3 / sp; v *= 3 / sp; sp = 3; }
      return [u * cosA + v * sinA, -(-u * sinA + v * cosA), sp];
    };
    S.spawn = function (anywhere) { return [anywhere ? Math.random() * w : -10 - Math.random() * 20, Math.random() * h]; };
    S.inBounds = function (x, y) { return x < w + 30 && y > -40 && y < h + 40; };
    S.drawBody = function (ctx, colors) {
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      for (var i = 0; i < poly.length; i++) {
        var d = toDisplay(poly[i]);
        if (i) ctx.lineTo(d[0], d[1]); else ctx.moveTo(d[0], d[1]);
      }
      ctx.closePath();
      ctx.fillStyle = colors.fill; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = "rgb(" + colors.b.join(",") + ")"; ctx.stroke();
      var teP = [2 * c, 0], lePt = poly[0], bd = -1;
      for (var q = 0; q < poly.length; q++) { var dd = Math.hypot(poly[q][0] - teP[0], poly[q][1] - teP[1]); if (dd > bd) { bd = dd; lePt = poly[q]; } }
      var le = toDisplay(lePt), te = toDisplay(teP);
      var ux = te[0] - le[0], uy = te[1] - le[1], ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
      le = [le[0] - ux * 22, le[1] - uy * 22]; te = [te[0] + ux * 22, te[1] + uy * 22];
      ctx.setLineDash([4, 5]); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(" + colors.b.join(",") + ",.55)";
      ctx.beginPath(); ctx.moveTo(le[0], le[1]); ctx.lineTo(te[0], te[1]); ctx.stroke(); ctx.setLineDash([]);
    };
    S.step = function () { return null; };
    return S;
  }

  function label(ctx, colors, text, x, y) {
    ctx.font = "11px ui-monospace, Menlo, Consolas, monospace";
    ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.strokeStyle = colors.bg; ctx.strokeText(text, x, y);
    ctx.fillStyle = colors.text; ctx.globalAlpha = 0.9; ctx.fillText(text, x, y); ctx.globalAlpha = 1;
  }

  /* ----------------------------------------------------- scene: propeller */
  function propellerScene() {
    // Double-body flow: the free surface is a symmetry plane, the hull is the lower half of an ellipse.
    var ratio = 3.4, ra = 1, c2 = (ratio - 1) / (ratio + 1);
    var Au = ra + c2 / ra, Bu = ra - c2 / ra;
    var Z = 4, pitch = 0.5, omega = 0.21;
    var w = 0, h = 0, s = 1, cx = 0, wl = 0, Apx = 0, Bpx = 0, xp = 0, yp = 0, Rp = 0;
    var theta = 0, phase = 0, tt = 0;

    var S = { name: "Propeller", dynamic: true, density: 0.6 };
    S.setup = function (W, H, narrow) {
      w = W; h = H;
      Apx = narrow ? Math.min(w * 0.36, 170) : Math.min(Math.max(w * 0.21, 150), 290);
      s = Apx / Au; Bpx = Bu * s;
      cx = narrow ? w * 0.42 : w * 0.62;
      wl = narrow ? h * 0.60 : h * 0.40;
      xp = cx + Apx * 1.05; yp = wl + Bpx * 0.66; Rp = Bpx * 0.60;
      S.density = Math.max(0.35, (h - wl) / h);
    };

    S.velocity = function (px, py) {
      var X = (px - cx) / s, Y = (wl - py) / s;
      if (Y > 0.02) return null;
      var z2r = X * X - Y * Y - 4 * c2, z2i = 2 * X * Y;
      var mod = Math.sqrt(z2r * z2r + z2i * z2i);
      var sr = Math.sqrt(Math.max(0, (mod + z2r) / 2));
      var si = Math.sqrt(Math.max(0, (mod - z2r) / 2)) * (z2i < 0 ? -1 : 1);
      var r1 = (X + sr) / 2, i1 = (Y + si) / 2, r2 = (X - sr) / 2, i2 = (Y - si) / 2;
      var m1 = r1 * r1 + i1 * i1, m2 = r2 * r2 + i2 * i2;
      var zr, zi, mm;
      if (m1 >= m2) { zr = r1; zi = i1; mm = m1; } else { zr = r2; zi = i2; mm = m2; }
      if (mm < ra * ra * 1.006) return null;
      var zr2 = zr * zr - zi * zi, zi2 = 2 * zr * zi, M2 = Math.max(zr2 * zr2 + zi2 * zi2, 1e-12);
      var invr = zr2 / M2, invi = -zi2 / M2;
      var dWr = 1 - ra * ra * invr, dWi = -ra * ra * invi;
      var Dr = 1 - c2 * invr, Di = -c2 * invi;
      var DM = Math.max(Dr * Dr + Di * Di, 4e-4);
      var u = (dWr * Dr + dWi * Di) / DM, v = -((dWi * Dr - dWr * Di) / DM); // y-up
      var sp0 = Math.hypot(u, v);
      if (!(sp0 === sp0)) return null;
      if (sp0 > 3) { u *= 3 / sp0; v *= 3 / sp0; }

      // propeller: suction ahead of the disc, accelerated and swirling wake behind it
      var dx = px - xp, ry = (py - yp) / Rp;
      var env = Math.exp(-ry * ry / 1.4);
      if (dx > 0) {
        var ramp = 1 - Math.exp(-dx / (0.5 * Rp)), decay = Math.exp(-dx / (7 * Rp));
        var k = env * ramp * decay;
        u += 0.95 * k;
        v += ry * 0.10 * k + 0.26 * k * Math.sin(1.7 * dx / Rp - phase);
      } else {
        u += 0.30 * Math.exp(-(dx * dx) / (2.2 * Rp * Rp)) * Math.exp(-ry * ry / 1.6);
      }
      var sp = Math.hypot(u, v);
      return [u, -v, sp];
    };

    S.spawn = function (anywhere) {
      return [anywhere ? Math.random() * w : -10 - Math.random() * 20, wl + 6 + Math.random() * Math.max(10, h - wl - 6)];
    };
    S.inBounds = function (x, y) { return x < w + 30 && y > wl + 3 && y < h + 30; };

    // blade tips (for tip-vortex particles) - called each frame
    S.step = function (dt) {
      theta += omega * dt; phase += omega * dt; tt += dt;
      var out = [];
      for (var k = 0; k < Z; k++) {
        var phi = theta + (2 * Math.PI * k) / Z;
        out.push([xp + 2, yp + Rp * Math.cos(phi) * 0.96]);
      }
      out.push([xp + 1, yp]);
      return out;
    };

    function bladePath(ctx, phi, hubx, huby) {
      // true 3-D blade outline projected orthographically (looking along the lateral axis)
      var r0 = 0.16 * Rp, N = 10, i, pts = [];
      var cp = Math.cos(pitch), sp = Math.sin(pitch);
      function P(r, sw) {
        var er_y = Math.cos(phi), er_z = Math.sin(phi);
        var et_y = -Math.sin(phi);
        var x = hubx + sw * sp;
        var y = huby + r * er_y + sw * cp * et_y;
        return [x, y];
      }
      function half(r) { var t = (r - r0) / (Rp - r0); return 0.34 * Rp * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.75) * 0.97 + 0.02), 0.9) * (1 - 0.35 * t); }
      for (i = 0; i <= N; i++) { var r = r0 + (Rp - r0) * (i / N); pts.push(P(r, half(r))); }
      for (i = N; i >= 0; i--) { var r2 = r0 + (Rp - r0) * (i / N); pts.push(P(r2, -half(r2) * 0.55)); }
      ctx.beginPath();
      for (i = 0; i < pts.length; i++) { if (i) ctx.lineTo(pts[i][0], pts[i][1]); else ctx.moveTo(pts[i][0], pts[i][1]); }
      ctx.closePath();
    }

    S.drawBody = function (ctx, colors) {
      var i, x, y;
      ctx.clearRect(0, 0, w, h);
      var ca = colors.a.join(","), cb = colors.b.join(",");

      // water tint
      var g = ctx.createLinearGradient(0, wl, 0, h);
      g.addColorStop(0, "rgba(" + ca + ",.10)"); g.addColorStop(1, "rgba(" + ca + ",.015)");
      ctx.fillStyle = g; ctx.fillRect(0, wl, w, h - wl);

      // hull below the waterline (lower half ellipse) + freeboard
      var F = Bpx * 0.62;
      ctx.beginPath();
      ctx.moveTo(cx + Apx, wl);
      for (i = 0; i <= 60; i++) { var a = (i / 60) * Math.PI; ctx.lineTo(cx + Apx * Math.cos(a), wl + Bpx * Math.sin(a)); }
      ctx.lineTo(cx - Apx, wl);
      ctx.quadraticCurveTo(cx - Apx * 1.02, wl - F * 0.55, cx - Apx * 0.88, wl - F);
      ctx.lineTo(cx + Apx * 0.94, wl - F * 0.86);
      ctx.lineTo(cx + Apx, wl);
      ctx.closePath();
      ctx.fillStyle = colors.fill; ctx.fill();
      ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.strokeStyle = "rgb(" + cb + ")"; ctx.stroke();

      // superstructure: bridge, funnel, mast, stern A-frame
      ctx.lineWidth = 1.8; ctx.strokeStyle = "rgb(" + cb + ")"; ctx.fillStyle = colors.fill;
      var deckY = wl - F * 0.92;
      ctx.beginPath(); ctx.rect(cx - Apx * 0.18, deckY - Bpx * 0.62, Apx * 0.42, Bpx * 0.62); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx - Apx * 0.08, deckY - Bpx * 1.02, Apx * 0.22, Bpx * 0.4); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(cx + Apx * 0.30, deckY - Bpx * 0.48, Apx * 0.06, Bpx * 0.48); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(" + ca + ",.9)"; ctx.lineWidth = 1.4;
      for (i = 0; i < 4; i++) { ctx.beginPath(); ctx.rect(cx - Apx * 0.14 + i * Apx * 0.1, deckY - Bpx * 0.5, Apx * 0.05, Bpx * 0.14); ctx.stroke(); }
      ctx.strokeStyle = "rgb(" + cb + ")"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(cx + Apx * 0.03, deckY - Bpx * 1.02); ctx.lineTo(cx + Apx * 0.03, deckY - Bpx * 1.5);
      ctx.moveTo(cx - Apx * 0.05, deckY - Bpx * 1.34); ctx.lineTo(cx + Apx * 0.11, deckY - Bpx * 1.34); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + Apx * 0.86, deckY + F * 0.12); ctx.lineTo(cx + Apx * 0.76, deckY - Bpx * 0.9); ctx.lineTo(cx + Apx * 0.66, deckY + F * 0.1); ctx.stroke();

      // shaft, strut and hub
      ctx.strokeStyle = "rgba(" + cb + ",.95)"; ctx.lineWidth = 2.4;
      var sx = cx + Apx * 0.80;
      ctx.beginPath(); ctx.moveTo(sx, yp); ctx.lineTo(xp, yp); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + Apx * 0.94, wl + Bpx * 0.34); ctx.lineTo(cx + Apx * 0.99, yp); ctx.stroke();

      // propeller: ghost blades (motion blur) then solid blades sorted back-to-front
      var order = [];
      for (var k = 0; k < Z; k++) { var phi = theta + (2 * Math.PI * k) / Z; order.push({ phi: phi, z: Math.sin(phi) }); }
      order.sort(function (p, q) { return p.z - q.z; });
      for (var gh = 3; gh >= 1; gh--) {
        for (k = 0; k < Z; k++) {
          bladePath(ctx, theta - omega * gh * 1.4 + (2 * Math.PI * k) / Z, xp, yp);
          ctx.fillStyle = "rgba(" + cb + "," + (0.045 * (4 - gh)).toFixed(3) + ")"; ctx.fill();
        }
      }
      for (k = 0; k < order.length; k++) {
        var o = order[k], front = o.z > 0;
        bladePath(ctx, o.phi, xp, yp);
        ctx.fillStyle = colors.fill; ctx.fill();
        ctx.fillStyle = "rgba(" + cb + "," + (front ? 0.55 : 0.28) + ")"; ctx.fill();
        ctx.lineWidth = 1.4; ctx.strokeStyle = "rgba(" + cb + "," + (front ? 1 : 0.7) + ")"; ctx.stroke();
      }
      ctx.beginPath(); ctx.ellipse(xp + Rp * 0.05, yp, Rp * 0.16, Rp * 0.12, 0, 0, Math.PI * 2);
      ctx.fillStyle = colors.fill; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgb(" + cb + ")"; ctx.stroke();

      // free surface: ripples, bow wave and an amplified wake behind the stern
      ctx.lineWidth = 1.7; ctx.strokeStyle = "rgba(" + ca + ",.85)";
      ctx.beginPath();
      for (x = 0; x <= w; x += 5) {
        var amp = 1.6 + 7 * Math.max(0, Math.min(1, (x - xp) / (Rp * 5))) * Math.exp(-(x - xp) / (Rp * 18)) + 3.2 * Math.exp(-Math.pow((x - (cx - Apx)) / 40, 2));
        y = wl + Math.sin(x * 0.045 - tt * 0.09) * amp + Math.sin(x * 0.11 - tt * 0.13) * amp * 0.25;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(" + ca + ",.3)";
      ctx.beginPath();
      for (x = 0; x <= w; x += 6) { y = wl + 7 + Math.sin(x * 0.03 - tt * 0.06 + 1.7) * 2.2; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke();

      label(ctx, colors, "double-body potential flow  |  actuator-disc wake + tip vortices", Math.max(12, cx - Apx * 0.9), Math.min(h - 14, wl + Bpx * 2.05));
    };
    return S;
  }

  var FACTORIES = { airfoil: airfoilScene, propeller: propellerScene };

  /* ------------------------------------------------------------------ engine */
  function create(host, options) {
    options = options || {};
    var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var names = (options.scenes && options.scenes.length ? options.scenes : ["airfoil", "propeller"]).filter(function (n) { return FACTORIES[n]; });
    if (!names.length) names = ["airfoil"];
    var scenes = names.map(function (n) { return FACTORIES[n](); });
    var cycleSec = options.cycleSeconds == null ? 18 : options.cycleSeconds;

    var cT = document.createElement("canvas"); cT.className = "flow-trail";
    var cB = document.createElement("canvas"); cB.className = "flow-body";
    cT.setAttribute("aria-hidden", "true"); cB.setAttribute("aria-hidden", "true");
    host.appendChild(cT); host.appendChild(cB);
    var xT = cT.getContext("2d"), xB = cB.getContext("2d");

    var w = 0, h = 0, dpr = 1, speed = 2.3, narrow = false;
    var idx = 0, scene = scenes[0], bg = null, tips = null, tipPtr = 0;
    var raf = 0, running = false, visible = true, colors = null, last = 0;
    var auto = cycleSec > 0 && scenes.length > 1 && !reduce;
    var cycleTimer = 0, swapTimer = 0;

    // ---- scene switcher UI ----
    var sw = null;
    if (scenes.length > 1) {
      sw = document.createElement("div");
      sw.className = "flow-switch";
      sw.style.setProperty("--cycle", cycleSec + "s");
      sw.innerHTML = scenes.map(function (s, i) { return '<button type="button" data-i="' + i + '"><b>0' + (i + 1) + "</b> " + s.name + "</button>"; }).join("");
      host.appendChild(sw);
      sw.addEventListener("click", function (ev) {
        var b = ev.target.closest("button"); if (!b) return;
        auto = false; clearTimeout(cycleTimer); sw.classList.remove("auto");
        goTo(+b.getAttribute("data-i"));
      });
    }
    function markActive() {
      if (!sw) return;
      var bs = sw.querySelectorAll("button");
      for (var i = 0; i < bs.length; i++) bs[i].classList.toggle("active", i === idx);
      sw.classList.remove("auto"); void sw.offsetWidth;
      if (auto) sw.classList.add("auto");
    }

    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      colors = {
        a: parseColor(cs.getPropertyValue("--flow-a"), [56, 225, 255]),
        b: parseColor(cs.getPropertyValue("--flow-b"), [255, 180, 84]),
        fill: cs.getPropertyValue("--flow-body").trim() || "#0a1222",
        text: cs.getPropertyValue("--muted").trim() || "#9fb4d6",
        bg: cs.getPropertyValue("--bg").trim() || "#05080f",
      };
    }

    function respawn(i, anywhere) {
      var p = scene.spawn(anywhere);
      if (anywhere && scene.velocity(p[0], p[1]) === null) p = scene.spawn(false);
      bg.place(i, p[0], p[1], 6000 + Math.random() * 2000);
    }

    function initScene() {
      scene.setup(w, h, narrow);
      var n = Math.round(Math.min(Math.max((w * h * scene.density) / 2600, 140), 520));
      bg = new Trails(n, 26);
      for (var i = 0; i < n; i++) respawn(i, true);
      tips = scene.dynamic ? new Trails(scene.dynamic ? 460 : 0, 30) : null;
      if (tips) for (var j = 0; j < tips.n; j++) { tips.place(j, -99, -99, 0); tips.age[j] = 1; }
      tipPtr = 0;
      xT.clearRect(0, 0, w, h);
      readColors();
      scene.drawBody(xB, colors);
      markActive();
    }

    function setup() {
      w = host.clientWidth; h = host.clientHeight;
      if (!w || !h) return false;
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      [cT, cB].forEach(function (cv) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.width = w + "px"; cv.style.height = h + "px"; });
      xT.setTransform(dpr, 0, 0, dpr, 0, 0); xB.setTransform(dpr, 0, 0, dpr, 0, 0);
      narrow = w < 760;
      speed = narrow ? 1.7 : 2.3;
      initScene();
      return true;
    }

    function stepBg(dt) {
      var n = bg.n;
      for (var i = 0; i < n; i++) {
        if (bg.age[i] > bg.max[i]) { respawn(i, false); continue; }
        var v = scene.velocity(bg.x[i], bg.y[i]);
        if (!v) { respawn(i, false); continue; }
        var k = v[2] < 0.45 ? 0.45 / Math.max(v[2], 1e-3) : 1;
        var nx = bg.x[i] + v[0] * k * speed * dt, ny = bg.y[i] + v[1] * k * speed * dt;
        if (!(nx === nx && ny === ny) || !scene.inBounds(nx, ny)) { respawn(i, false); continue; }
        bg.push(i, nx, ny); bg.age[i] += dt;
        bg.col[i] = v[2] > 1.18 ? 2 : v[2] > 0.82 ? 1 : 0;
      }
    }

    function stepTips(dt, spawnPts) {
      var i, n = tips.n;
      if (spawnPts) {
        for (var s = 0; s < spawnPts.length; s++) {
          for (var tries = 0; tries < n; tries++) {
            i = tipPtr; tipPtr = (tipPtr + 1) % n;
            if (tips.age[i] >= tips.max[i]) { tips.place(i, spawnPts[s][0], spawnPts[s][1], 92 + Math.random() * 12); tips.col[i] = 3; break; }
          }
        }
      }
      for (i = 0; i < n; i++) {
        if (tips.age[i] >= tips.max[i]) continue;
        var v = scene.velocity(tips.x[i], tips.y[i]);
        if (!v) { tips.age[i] = tips.max[i]; continue; }
        var nx = tips.x[i] + v[0] * speed * dt, ny = tips.y[i] + v[1] * speed * dt;
        if (!(nx === nx && ny === ny) || !scene.inBounds(nx, ny)) { tips.age[i] = tips.max[i]; continue; }
        tips.push(i, nx, ny); tips.age[i] += dt;
        var f = tips.age[i] / tips.max[i];
        tips.col[i] = 3 + (f > 0.35 ? 1 : 0) + (f > 0.7 ? 1 : 0);
      }
    }

    var frames = 0;
    function frame(dt) {
      frames++;
      var spawnPts = scene.step(dt);
      stepBg(dt);
      if (tips) stepTips(dt, spawnPts);
      xT.clearRect(0, 0, w, h);
      bg.draw(xT, colors, 0, 2, 1.3, false);
      if (tips) tips.draw(xT, colors, 3, 5, 1.9, true);
      if (scene.dynamic) scene.drawBody(xB, colors);
    }

    function loop(t) {
      if (!running) return;
      var dt = last ? Math.min(Math.max((t - last) / 16.67, 0.5), 2) : 1;
      last = t;
      frame(dt);
      raf = requestAnimationFrame(loop);
    }
    function play() {
      if (running || reduce || !visible || document.hidden || !bg) return;
      running = true; last = 0; raf = requestAnimationFrame(loop);
      scheduleCycle();
    }
    function pause() { running = false; cancelAnimationFrame(raf); clearTimeout(cycleTimer); }

    function paintStatic() { for (var n = 0; n < 160; n++) frame(1); }

    function scheduleCycle() {
      clearTimeout(cycleTimer);
      if (!auto || !running) return;
      cycleTimer = setTimeout(function () { goTo((idx + 1) % scenes.length); }, cycleSec * 1000);
    }

    function goTo(i) {
      if (i === idx && bg) return;
      clearTimeout(swapTimer);
      host.classList.add("swap");
      swapTimer = setTimeout(function () {
        idx = i; scene = scenes[idx];
        initScene();
        if (reduce) paintStatic();
        host.classList.remove("swap");
        scheduleCycle();
      }, 380);
    }

    if (setup()) { if (reduce) paintStatic(); else play(); }

    var rt;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(function () { pause(); if (setup()) { if (reduce) paintStatic(); else play(); } }, 160);
    }
    global.addEventListener("resize", onResize);
    function onVis() { if (document.hidden) pause(); else play(); }
    document.addEventListener("visibilitychange", onVis);
    var io = null;
    if ("IntersectionObserver" in global) {
      io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) play(); else pause(); });
      io.observe(host);
    }

    return {
      refreshColors: function () { readColors(); if (scene) scene.drawBody(xB, colors); if (reduce && bg) { xT.clearRect(0, 0, w, h); paintStatic(); } },
      destroy: function () {
        pause(); clearTimeout(swapTimer);
        global.removeEventListener("resize", onResize); document.removeEventListener("visibilitychange", onVis);
        if (io) io.disconnect();
        [cT, cB, sw].forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
        host.classList.remove("swap");
      },
      // for tests
      _debug: function () { return { scene: scene.name, n: bg && bg.n, stats: bg ? (function(){var b=[0,0,0,0,0,0],d=0;for(var i=0;i<bg.n;i++){b[Math.min(5,Math.max(0,Math.floor(bg.x[i]/w*6)))]++;if(bg.age[i]>bg.max[i])d++;}return {bins:b,dead:d,w:w,fps:frames};})() : null, finite: bg ? Array.prototype.every.call(bg.x, function (v) { return v === v; }) : null }; },
    };
  }

  global.HeroFlow = { create: create };
})(window);
