// Small enhancements for the EPIC theme
document.addEventListener('DOMContentLoaded', function(){
  // subtle parallax on mouse move for hero
  const hero = document.querySelector('.hero');
  if(!hero) return;
  hero.addEventListener('mousemove', e => {
    const rX = (e.clientX - window.innerWidth/2)/40;
    const rY = (e.clientY - window.innerHeight/2)/80;
    hero.style.transform = `perspective(800px) rotateX(${rY}deg) rotateY(${rX}deg)`;
  });
  hero.addEventListener('mouseleave', ()=> hero.style.transform='none');
});
