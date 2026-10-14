/* Animação: três sementes saem do Brasil e brotam nos Estados Unidos */
(function(){
  var svg=document.getElementById('mapsvg');if(!svg)return;
  var NS='http://www.w3.org/2000/svg';
  var X0=-125,Y0=50,S=8; // projeção simples: lon/lat -> svg
  function P(lo,la){return[(lo-X0)*S,(Y0-la)*S]}
  function poly(pts){return 'M'+pts.map(function(p){var q=P(p[0],p[1]);return q[0].toFixed(1)+' '+q[1].toFixed(1)}).join('L')+'Z'}
  var BR=[[-51.6,4.3],[-50,1.8],[-50,0],[-48.5,-1],[-44.5,-2.4],[-41.5,-2.9],[-38.5,-3.7],[-35.2,-5.3],[-34.8,-7.5],[-35.3,-9.5],[-37,-11.5],[-38.9,-13],[-39.1,-17.7],[-40,-20],[-41,-22],[-43,-23],[-45.5,-23.7],[-48,-25.5],[-48.7,-28],[-50.5,-30.5],[-53.4,-33.7],[-53.5,-32.5],[-57.6,-30.2],[-56,-28],[-54,-26],[-54.6,-25.5],[-57.6,-22.2],[-58.2,-20],[-57.8,-17.5],[-60.2,-15.5],[-60.5,-13.5],[-65.3,-10],[-68.5,-11],[-73,-9.5],[-72.5,-7.5],[-70,-4.2],[-69.9,-1],[-67,1.5],[-64,4.2],[-60,5.2],[-57,2],[-54,2.3]];
  var US=[[-124.7,48.4],[-123,48.3],[-95,49],[-89.5,48],[-84.5,46.5],[-82.5,45.3],[-82.4,43],[-79,43.3],[-76.5,44.2],[-75,45],[-71.5,45],[-69.2,47.4],[-67.8,47],[-67,44.8],[-70.2,43.6],[-70.7,42.5],[-70,41.7],[-73.9,40.6],[-74,39],[-75.5,38],[-76,36.9],[-75.5,35.3],[-77.5,34],[-79,33.2],[-81,31.5],[-81.3,30],[-80,26.8],[-80.4,25.2],[-81.2,25.2],[-82.7,27.5],[-83,29],[-84,30],[-85.3,29.7],[-87,30.3],[-89,30.2],[-89.5,29],[-91.5,29.5],[-94,29.6],[-96.5,28.3],[-97.2,26],[-99.1,26.4],[-101,29.8],[-102.7,29.7],[-104.5,29.6],[-106.5,31.8],[-108.2,31.8],[-111,31.3],[-114.8,32.5],[-117.1,32.5],[-118.5,34],[-120.6,34.6],[-121.9,36.6],[-123,38],[-124.2,40.3],[-124.1,42.8],[-124.5,46.2]];

  function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e}
  el('path',{d:poly(US),'class':'land hl'});
  el('path',{d:poly(BR),'class':'land hl'});
  var t1=el('text',{x:P(-122,35)[0],y:P(-122,35)[1],'class':'map-label','text-anchor':'start'});t1.textContent='Estados Unidos';
  var t2=el('text',{x:P(-52,-12)[0],y:P(-52,-12)[1],'class':'map-label','text-anchor':'middle'});t2.textContent='Brasil';

  var start=P(-46,-19);
  // pulso na origem
  el('circle',{cx:start[0],cy:start[1],r:10,'class':'pin-pulse'});
  el('circle',{cx:start[0],cy:start[1],r:4.5,fill:'#B78505'});

  var targets=[[-100,35],[-91,40],[-80,34]]; // onde cada semente brota
  var ctrl=[[560,170],[590,90],[640,230]];
  var seeds=[];
  targets.forEach(function(t,i){
    var end=P(t[0],t[1]);
    var c=ctrl[i];
    var d='M'+start[0]+' '+start[1]+' Q'+c[0]+' '+c[1]+' '+end[0]+' '+end[1];
    var trail=el('path',{d:d,'class':'trail'});
    var len=trail.getTotalLength?trail.getTotalLength():600;
    // broto
    var g=el('g',{'class':'sprout',transform:'translate('+end[0]+' '+end[1]+')'});
    el('circle',{cx:0,cy:0,r:9,'class':'ring'},g);
    el('path',{d:'M0 0 C0 -10 0 -20 0 -30','class':'stem'},g);
    el('path',{d:'M0 -18 C-16 -20 -22 -30 -20 -38 C-8 -38 0 -30 0 -18Z','class':'leaf'},g);
    el('path',{d:'M0 -24 C16 -26 22 -36 20 -44 C8 -44 0 -36 0 -24Z','class':'leaf r'},g);
    el('circle',{cx:0,cy:-33,r:4,'class':'bud'},g);
    var seed=el('ellipse',{rx:5.5,ry:3.6,'class':'seed',opacity:0},null);
    seeds.push({d:d,trail:trail,len:len,sprout:g,seed:seed,p0:start,c:c,p1:end,delay:i*650});
  });

  function bez(s,t){var u=1-t;return[u*u*s.p0[0]+2*u*t*s.c[0]+t*t*s.p1[0],u*u*s.p0[1]+2*u*t*s.c[1]+t*t*s.p1[1]]}
  function ang(s,t){var u=1-t;var dx=2*u*(s.c[0]-s.p0[0])+2*t*(s.p1[0]-s.c[0]);var dy=2*u*(s.c[1]-s.p0[1])+2*t*(s.p1[1]-s.c[1]);return Math.atan2(dy,dx)*180/Math.PI}

  var DUR=2600,HOLD=5200,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function reset(){seeds.forEach(function(s){s.sprout.classList.remove('bloom');s.trail.style.opacity=0;s.trail.style.strokeDashoffset=0;s.seed.setAttribute('opacity',0);s.done=false})}
  function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}

  if(reduce){seeds.forEach(function(s){s.sprout.classList.add('bloom');s.trail.style.opacity=.5});return}

  var t0=null;
  function frame(ts){
    if(t0===null)t0=ts;
    var el_=ts-t0;
    var total=DUR+seeds[seeds.length-1].delay+HOLD;
    if(el_>total){t0=ts;el_=0;reset()}
    seeds.forEach(function(s){
      var t=(el_-s.delay)/DUR;
      if(t<=0)return;
      if(t<1){
        var e=ease(t),pt=bez(s,e);
        s.seed.setAttribute('transform','translate('+pt[0]+' '+pt[1]+') rotate('+ang(s,e)+')');
        s.seed.setAttribute('opacity',1);
        s.trail.style.opacity=.55;
        s.trail.style.strokeDasharray='3 7';
      }else if(!s.done){
        s.done=true;s.seed.setAttribute('opacity',0);s.sprout.classList.add('bloom');s.trail.style.opacity=.3;
      }
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
