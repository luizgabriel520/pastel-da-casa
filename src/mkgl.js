export function mkGL(cv){
 let gl;try{gl=cv.getContext("webgl",{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,powerPreference:"low-power"})}catch(e){}
 if(!gl)return null;
 const fs=`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uR;uniform float uT,uK;
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float nz(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1.,0.)),f.x),mix(hs(i+vec2(0.,1.)),hs(i+vec2(1.,1.)),f.x),f.y);}
float fb(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*nz(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
void main(){
 vec2 uv=vec2(gl_FragCoord.x/uR.x,1.-gl_FragCoord.y/uR.y);
 float rise=(.34-uv.y)/.34;
 if(rise<0.||rise>1.){gl_FragColor=vec4(0.);return;}
 float t=uT;
 vec2 p=vec2(uv.x*7.,uv.y*3.2+t*.42);
 vec2 q=vec2(fb(p*.8+vec2(0.,t*.15)),fb(p*.8+vec2(4.3,t*.11)));
 p+=(q-.5)*(1.2+1.6*rise);
 float s=fb(p);
 float d=mix(smoothstep(.38,.78,s),pow(1.-abs(2.*s-1.),3.),.45);
 float c1=.44+.04*sin(t*.55+rise*4.2)+.025*sin(t*1.1+rise*9.);
 float c2=.54+.035*sin(t*.47+rise*3.4+1.7)+.02*sin(t*1.3+rise*8.+.8);
 float sg=.03+.11*rise;
 float m=exp(-pow((uv.x-c1)/sg,2.))+.75*exp(-pow((uv.x-c2)/(sg*1.15),2.));
 float e=smoothstep(0.,.1,rise)*(1.-smoothstep(.5,1.,rise));
 float a=clamp(d*m*e*uK*1.05,0.,.7);
 gl_FragColor=vec4(vec3(1.,.95,.88)*a,a);
}`;
 const mk=(ty,s)=>{const o=gl.createShader(ty);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null};
 const v=mk(gl.VERTEX_SHADER,"attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"),f=mk(gl.FRAGMENT_SHADER,fs);if(!v||!f)return null;
 const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))return null;
 gl.useProgram(p);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const l=gl.getAttribLocation(p,"a");gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
 const uR=gl.getUniformLocation(p,"uR"),uT=gl.getUniformLocation(p,"uT"),uK=gl.getUniformLocation(p,"uK");gl.clearColor(0,0,0,0);
 cv.addEventListener("webglcontextlost",e=>{e.preventDefault();cv.style.display="none"});
 return{rs(w,h){gl.viewport(0,0,w,h);gl.uniform2f(uR,w,h)},draw(s,k){gl.uniform1f(uT,s);gl.uniform1f(uK,k);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3)}}
}