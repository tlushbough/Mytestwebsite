// EPIC interactive spotlight effect
document.addEventListener('DOMContentLoaded', function(){
  // Mouse-following gradient spotlight
  let spotlightX = 50;
  let spotlightY = 50;
  let targetX = 50;
  let targetY = 50;

  // Smooth animation using requestAnimationFrame
  function updateSpotlight(){
    // Smooth interpolation for fluid movement
    spotlightX += (targetX - spotlightX) * 0.1;
    spotlightY += (targetY - spotlightY) * 0.1;

    document.documentElement.style.setProperty('--spotlight-x', spotlightX + '%');
    document.documentElement.style.setProperty('--spotlight-y', spotlightY + '%');

    requestAnimationFrame(updateSpotlight);
  }

  // Track mouse position
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth) * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
  });

  // Start the animation loop
  updateSpotlight();

  // Bitcoin Easter Egg Detection
  const bitcoinEgg = document.querySelector('.bitcoin-easter-egg');
  if(bitcoinEgg){
    const revealDistance = 200; // pixels from spotlight center to reveal

    function checkBitcoinProximity(){
      const rect = bitcoinEgg.getBoundingClientRect();
      const eggCenterX = rect.left + rect.width / 2;
      const eggCenterY = rect.top + rect.height / 2;

      // Calculate spotlight position in pixels
      const spotX = (spotlightX / 100) * window.innerWidth;
      const spotY = (spotlightY / 100) * window.innerHeight;

      // Calculate distance between spotlight and bitcoin
      const distance = Math.sqrt(
        Math.pow(spotX - eggCenterX, 2) +
        Math.pow(spotY - eggCenterY, 2)
      );

      // Reveal if spotlight is close enough
      if(distance < revealDistance){
        bitcoinEgg.classList.add('revealed');
      } else {
        bitcoinEgg.classList.remove('revealed');
      }

      requestAnimationFrame(checkBitcoinProximity);
    }

    checkBitcoinProximity();
  }

  // Subtle parallax on hero section
  const hero = document.querySelector('.hero');
  if(hero){
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;

      hero.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
      hero.style.transform = 'none';
    });
  }
});
