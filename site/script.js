(function(){
  var btn=document.querySelector('.nav-toggle');
  var nav=document.getElementById('primary-nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      });
    });
  }
})();
