/*! Synapse by ELO - water ground (WebGL1). Author: Krishan NAVAS */
// Copy of synapse-theme-lab/pure/water/water.js (validated 2026-10-10).
// The "/*!" header survives minification, so the author line stays in the single-file bundle.
// Water ground: a dependency-free WebGL1 rewrite of the ShaderGradient "waterPlane" used by the Molten field.
// Same model as the original: a 10x10 plane displaced along its normal by classic 3D Perlin noise, coloured by
// its displaced local position, lit by the "city" environment. The environment is replaced by 9 spherical
// harmonics (fitted offline on city.hdr) evaluated for the diffuse term (normal) and the blurred specular
// term (reflection, roughness 0.6), with the same split-sum / multi-scattering maths as the physical material.
// mountWater(container, { colors, speed, still, pixelRatioCap, fps, onFrame }) -> { setStill(bool), destroy() }

// City environment, real SH bands 0..2 (order: 00, 1-1 y, 10 z, 11 x, 2-2 xy, 2-1 yz, 20, 21 xz, 22), linear RGB.
const SH = [1.987,1.949,2.265, 1.772,1.908,2.292, -.448,-.463,-.525, -.153,-.142,-.189, -.161,-.204,-.265,
  -.566,-.547,-.619, -.399,-.397,-.486, -.097,-.109,-.101, -.844,-.843,-1.021];
const SEG = 120; // grid resolution (the original uses 192; the shading is smooth, 120 is visually identical)

const VS = `
attribute vec2 a;
uniform float t,D,S;
uniform vec3 E,X,Y,Z;
uniform vec2 K;
varying vec3 P,W;
vec4 m(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 q(vec4 x){return m((x*34.+1.)*x);}
float n(vec3 p){
vec3 i0=floor(p),i1=i0+1.,f0=fract(p),f1=f0-1.;
i0=mod(i0,289.);i1=mod(i1,289.);
vec4 ix=vec4(i0.x,i1.x,i0.x,i1.x),iy=vec4(i0.yy,i1.yy),h=q(q(ix)+iy),h0=q(h+i0.z),h1=q(h+i1.z);
vec4 x0=h0/7.,y0=fract(floor(x0)/7.)-.5;x0=fract(x0);vec4 z0=.5-abs(x0)-abs(y0),s0=step(z0,vec4(0));
x0-=s0*(step(0.,x0)-.5);y0-=s0*(step(0.,y0)-.5);
vec4 x1=h1/7.,y1=fract(floor(x1)/7.)-.5;x1=fract(x1);vec4 z1=.5-abs(x1)-abs(y1),s1=step(z1,vec4(0));
x1-=s1*(step(0.,x1)-.5);y1-=s1*(step(0.,y1)-.5);
vec3 g0=vec3(x0.x,y0.x,z0.x),g1=vec3(x0.y,y0.y,z0.y),g2=vec3(x0.z,y0.z,z0.z),g3=vec3(x0.w,y0.w,z0.w),
g4=vec3(x1.x,y1.x,z1.x),g5=vec3(x1.y,y1.y,z1.y),g6=vec3(x1.z,y1.z,z1.z),g7=vec3(x1.w,y1.w,z1.w);
vec4 r0=1.79284291-.85373472*vec4(dot(g0,g0),dot(g2,g2),dot(g1,g1),dot(g3,g3)),
r1=1.79284291-.85373472*vec4(dot(g4,g4),dot(g6,g6),dot(g5,g5),dot(g7,g7));
vec3 u=f0*f0*f0*(f0*(f0*6.-15.)+10.);
vec4 v=mix(vec4(dot(g0*r0.x,f0),dot(g1*r0.z,vec3(f1.x,f0.yz)),dot(g2*r0.y,vec3(f0.x,f1.y,f0.z)),dot(g3*r0.w,vec3(f1.xy,f0.z))),
vec4(dot(g4*r1.x,vec3(f0.xy,f1.z)),dot(g5*r1.z,vec3(f1.x,f0.y,f1.z)),dot(g6*r1.y,vec3(f0.x,f1.yz)),dot(g7*r1.w,f1)),u.z);
vec2 w=mix(v.xy,v.zw,u.y);
return 2.2*mix(w.x,w.y,u.x);}
vec3 o(vec3 p){return vec3(p.x,.7071068*(p.y-p.z),.7071068*(p.y+p.z))+vec3(0,.9,-.3);}
void main(){
P=vec3(a,.75*n(vec3(a*.43*D,0)+t)*S);
W=o(vec3(a,0));
vec3 d=o(P)-E;float z=dot(d,Z);
gl_Position=vec4(dot(d,X)*K.x,dot(d,Y)*K.y,z*1.002-.2002,z);}`;

const FS = `
precision highp float;
uniform vec3 A,B,C,E,L[9];
varying vec3 P,W;
vec3 h(vec3 d,vec3 g){return g.x*.282095*L[0]+g.y*.488603*(L[1]*d.y+L[2]*d.z+L[3]*d.x)
+g.z*(1.092548*(L[4]*d.x*d.y+L[5]*d.y*d.z+L[7]*d.x*d.z)+.315392*L[6]*(3.*d.z*d.z-1.)+.546274*L[8]*(d.x*d.x-d.y*d.y));}
void main(){
vec3 b=mix(mix(A,B,smoothstep(-3.,3.,P.x)),C,P.z),
N=vec3(0,-.7071068,.7071068)*(gl_FrontFacing?1.:-1.),V=normalize(E-W),
R=normalize(mix(reflect(-V,N),N,.1296)),I=max(h(N,vec3(1,.71,.34)),0.);
float c=clamp(dot(N,V),0.,1.),e,d,g;
vec4 r=vec4(-.6,-.0165,-.3432,.0132)+vec4(1,.0425,1.04,-.04);
float k=min(r.x*r.x,exp2(-9.28*c))*r.x+r.y;
vec2 f=vec2(-1.04,1.04)*k+r.zw;
e=1.-f.x-f.y;d=.04*f.x+f.y;g=d*.0857143/(1.-e*.0857143)*e;
vec3 s=b*f.x+f.y,G=b+(1.-b)*.047619,M=mix(vec3(g),s*G/(1.-e*G)*e,.2);
gl_FragColor=vec4(b*.8*(1.-d-g)*I+max(h(R,vec3(1,.87,.64)),0.)*mix(vec3(d),s,.2)+M*I,1);}`;

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);

function mountWater(el, o = {}) {
  const cols = o.colors || ['#0f8a7a', '#1d3f73', '#2f6f8f'];
  const speed = o.speed == null ? 0.04 : o.speed;
  const cap = o.pixelRatioCap || 1.5;
  const step = 1000 / (o.fps || 30);
  let mq;
  try { mq = matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) { /* old browser: assume motion is fine */ }
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  cv.setAttribute('aria-hidden', 'true');
  el.prepend(cv);

  let gl, U = {}, n = 0, raf = 0, last = 0, time = 0, scale = 1, slow = 0, frames = 0;
  let still = !!o.still, shown = !document.hidden, inView = true, alive = true;

  // No WebGL: a static gradient of the same colours stands in for the field.
  const fallback = () => {
    cv.remove();
    const [a, b, c] = cols;
    el.style.background = `radial-gradient(60% 90% at 88% 30%,${a},transparent 70%),linear-gradient(100deg,${b},${c} 60%,${a})`;
  };

  function init() {
    gl = cv.getContext('webgl', { alpha: false, antialias: true, powerPreference: 'low-power' });
    if (!gl) return false;
    const p = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]]) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      gl.attachShader(p, s);
    }
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return false;
    gl.useProgram(p);
    for (const k of 'tDSEXYZKABCL') U[k] = gl.getUniformLocation(p, k);
    // Plane 10x10, rows from top to bottom, same winding as THREE.PlaneGeometry (front face = +z).
    const v = [], ix = [], r = SEG + 1;
    for (let y = 0; y < r; y++) for (let x = 0; x < r; x++) v.push(x / SEG * 10 - 5, 5 - y / SEG * 10);
    for (let y = 0; y < SEG; y++) for (let x = 0; x < SEG; x++) {
      const a = y * r + x, b = a + r;
      ix.push(a, b, a + 1, b, b + 1, a + 1);
    }
    n = ix.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ix), gl.STATIC_DRAW);
    const at = gl.getAttribLocation(p, 'a');
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    // Camera: orbit azimuth 170, polar 70, distance 4.4 around the origin, vertical fov 45.
    const az = 170 * Math.PI / 180, po = 70 * Math.PI / 180;
    const e = [4.4 * Math.sin(po) * Math.sin(az), 4.4 * Math.cos(po), 4.4 * Math.sin(po) * Math.cos(az)];
    const z = e.map((c) => -c / 4.4), xl = Math.hypot(z[2], z[0]), x = [-z[2] / xl, 0, z[0] / xl];
    const y = [x[1] * z[2] - x[2] * z[1], x[2] * z[0] - x[0] * z[2], x[0] * z[1] - x[1] * z[0]];
    gl.uniform3fv(U.E, e); gl.uniform3fv(U.X, x); gl.uniform3fv(U.Y, y); gl.uniform3fv(U.Z, z);
    gl.uniform1f(U.D, 1.2); gl.uniform1f(U.S, 3.4);
    gl.uniform3fv(U.A, hex(cols[0])); gl.uniform3fv(U.B, hex(cols[1])); gl.uniform3fv(U.C, hex(cols[2]));
    gl.uniform3fv(U.L, SH);
    // Where the folded plane leaves gaps, show the field's middle colour (the .ground background), not black.
    const [cr, cg, cb] = hex(cols[1]);
    gl.clearColor(cr, cg, cb, 1);
    size();
    return true;
  }

  function size() {
    const w = el.clientWidth, h = el.clientHeight, d = Math.min(devicePixelRatio || 1, cap) * scale;
    cv.width = Math.max(1, Math.round(w * d));
    cv.height = Math.max(1, Math.round(h * d));
    if (!gl) return;
    gl.viewport(0, 0, cv.width, cv.height);
    const f = 1 / Math.tan(22.5 * Math.PI / 180);
    gl.uniform2f(U.K, f * h / Math.max(w, 1), f);
    draw();
  }

  function draw() {
    if (!gl || gl.isContextLost()) return;
    gl.uniform1f(U.t, time * speed);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
    if (o.onFrame) o.onFrame();
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = now - last;
    if (last && dt < step - 3) return;
    if (last) {
      time += Math.min(dt, 100) / 1000;
      // Sustained slow frames: drop the render resolution (down to half), the field is soft anyway.
      slow = dt > step * 1.6 ? slow + 1 : 0;
      if (slow > 40 && scale > 0.5) { scale = Math.max(0.5, scale * 0.75); slow = 0; size(); }
    }
    last = now;
    draw();
  }

  function sync() {
    const go = alive && gl && !still && shown && inView && !(mq && mq.matches);
    if (go && !raf) { last = 0; raf = requestAnimationFrame(tick); }
    if (!go && raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  const onVis = () => { shown = !document.hidden; sync(); };
  const onLost = (e) => { e.preventDefault(); gl = null; sync(); };
  const onRestored = () => { if (init()) sync(); };
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(size) : null;
  const io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((en) => { inView = en[en.length - 1].isIntersecting; sync(); }) : null;

  if (!init()) { fallback(); return { setStill() {}, destroy() { el.style.background = ''; } }; }
  document.addEventListener('visibilitychange', onVis);
  cv.addEventListener('webglcontextlost', onLost);
  cv.addEventListener('webglcontextrestored', onRestored);
  if (mq && mq.addEventListener) mq.addEventListener('change', sync);
  if (ro) ro.observe(el); else addEventListener('resize', size);
  if (io) io.observe(el);
  sync();

  return {
    setStill(s) { still = !!s; sync(); },
    destroy() {
      alive = false; sync();
      document.removeEventListener('visibilitychange', onVis);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', sync);
      if (ro) ro.disconnect(); else removeEventListener('resize', size);
      if (io) io.disconnect();
      const x = gl && gl.getExtension('WEBGL_lose_context');
      if (x) x.loseContext();
      cv.remove();
    },
  };
}
