(function(){
  var header=document.querySelector('.site-header');
  function onScroll(){header&&header.classList.toggle('scrolled',window.scrollY>30)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  var btn=document.querySelector('.menu-btn'),list=document.querySelector('.nav ul');
  if(btn&&list){
    btn.addEventListener('click',function(){
      var o=list.classList.toggle('open');btn.setAttribute('aria-expanded',o);
      document.body.style.overflow=o?'hidden':'';
    });
    list.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){list.classList.remove('open');document.body.style.overflow=''})});
  }

  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(el){io.observe(el)});
  }else{els.forEach(function(el){el.classList.add('in')})}

  // Formulário -> abre o WhatsApp com a mensagem pronta
  var form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var d=new FormData(form);
      var msg='Olá, Seeds! Meu nome é '+d.get('nome')+'.\n'+
        'Meu objetivo: '+d.get('objetivo')+'.\n'+
        'Meu nível de inglês: '+d.get('nivel')+'.'+
        (d.get('mensagem')?'\n'+d.get('mensagem'):'')+
        '\nGostaria de saber mais sobre a mentoria.';
      window.open('https://wa.me/553584174856?text='+encodeURIComponent(msg),'_blank','noopener');
    });
  }

  // Aprovações (edite assets/aprovacoes.js)
  var box=document.getElementById('aprovacoes');
  if(box){
    var list2=(window.SEEDS_APROVACOES||[]);
    if(!list2.length){
      box.innerHTML='<div class="results-empty reveal in"><div class="title">As primeiras aprovações estão a caminho</div><p class="lead" style="margin:0 auto">Cada conquista dos nossos alunos será contada aqui.</p></div>';
    }else{
      box.className='grid g3';
      box.innerHTML=list2.map(function(r,i){
        return '<article class="card res-card reveal d'+((i%3)+1)+'">'+(r.destaque?'<div class="num">'+r.destaque+'</div>':'')+(r.ano?'<div class="meta">'+r.ano+'</div>':'')+'<div class="school">'+r.instituicao+'</div><p style="margin-top:10px">'+(r.detalhe||'')+'</p></article>';
      }).join('');
      box.querySelectorAll('.reveal').forEach(function(el){setTimeout(function(){el.classList.add('in')},60)});
    }
  }
})();
