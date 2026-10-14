import * as THREE from "three";

// Ashima Arts 3D simplex noise (MIT), the standard GLSL implementation.
export const simplex3 = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

/** A procedural photo studio, sampled by reflection direction: chrome without a texture download. */
export const studio = /* glsl */ `
vec3 studio(vec3 r){
  float y = r.y;
  vec3 c = mix(vec3(0.015), vec3(0.11), smoothstep(-0.9, 0.35, y));       // floor to dim ceiling
  c += vec3(1.05) * smoothstep(0.5, 0.58, y) * smoothstep(0.92, 0.7, y);    // overhead softbox
  c += vec3(0.85) * smoothstep(0.09, 0.0, abs(r.x - 0.62)) * smoothstep(-0.3, 0.5, y); // key strip, right
  c += vec3(0.35) * smoothstep(0.06, 0.0, abs(r.x + 0.7)) * smoothstep(-0.1, 0.6, y);  // fill strip, left
  c += vec3(0.5) * smoothstep(0.035, 0.0, abs(y + 0.12));                  // horizon line
  return c;
}`;

/** Liquid chrome: noise-displaced sphere with recomputed normals, cursor dent and a cobalt rim. */
export function chromeMaterial(liquid = true) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: liquid ? 0.22 : 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 2) },
      uPush: { value: 0 },
      uAccent: { value: new THREE.Color("#3d5bff") },
      uRim: { value: 0.55 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime, uAmp, uPush; uniform vec3 uPointer;
      varying vec3 vNormal; varying vec3 vView; varying float vN;
      ${simplex3}
      float disp(vec3 p){
        float n = snoise(p * 1.05 + vec3(0.0, uTime * 0.11, 0.0)) * 0.6 + snoise(p * 2.4 - uTime * 0.07) * 0.25;
        float d = distance(normalize(p), normalize(uPointer));
        return n * uAmp - exp(-d * d * 7.0) * uPush * 0.32;
      }
      void main(){
        vec3 n = normalize(normal);
        vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        vec3 b = cross(n, t);
        float e = 0.012;
        vec3 p0 = position + n * disp(position);
        vec3 p1 = position + t * e; p1 += normalize(p1) * disp(p1);
        vec3 p2 = position + b * e; p2 += normalize(p2) * disp(p2);
        vec3 nn = normalize(cross(p1 - p0, p2 - p0));
        if (dot(nn, n) < 0.0) nn = -nn;
        vN = disp(position);
        vNormal = normalize(normalMatrix * nn);
        vec4 mv = modelViewMatrix * vec4(p0, 1.0);
        vView = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uAccent; uniform float uRim;
      varying vec3 vNormal; varying vec3 vView; varying float vN;
      ${studio}
      void main(){
        vec3 N = normalize(vNormal); vec3 V = normalize(vView);
        vec3 R = reflect(-V, N);
        vec3 col = studio(R) * 0.92;
        float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        col += uAccent * fres * uRim;
        col *= 0.9 + vN * 0.5;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}
