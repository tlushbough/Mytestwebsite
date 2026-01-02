// EPIC interactive spotlight effect
document.addEventListener('DOMContentLoaded', function(){
  // Achievement tracking with localStorage
  const STORAGE_KEY = 'epicHelloworldAchievements';

  function getAchievements(){
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      bitcoinFinds: 0,
      firstDiscovery: null,
      sessionDiscovered: false
    };
  }

  function saveAchievements(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function updateStatsDisplay(){
    const achievements = getAchievements();
    const countEl = document.getElementById('bitcoinCount');
    const firstFindEl = document.getElementById('firstFind');

    if(countEl) countEl.textContent = achievements.bitcoinFinds;
    if(firstFindEl){
      if(achievements.firstDiscovery){
        const date = new Date(achievements.firstDiscovery);
        firstFindEl.textContent = date.toLocaleDateString();
      } else {
        firstFindEl.textContent = 'Never';
      }
    }
  }

  // Reset stats button
  const resetBtn = document.getElementById('resetStats');
  if(resetBtn){
    resetBtn.addEventListener('click', () => {
      if(confirm('Reset all achievement stats?')){
        localStorage.removeItem(STORAGE_KEY);
        updateStatsDisplay();
      }
    });
  }

  // Initialize stats display
  updateStatsDisplay();
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
    let achievements = getAchievements();

    function showAchievement(){
      const toast = document.getElementById('achievementToast');
      if(toast){
        toast.classList.add('show');

        // Hide after 4 seconds
        setTimeout(() => {
          toast.classList.remove('show');
        }, 4000);
      }
    }

    function recordDiscovery(){
      achievements.bitcoinFinds++;
      if(!achievements.firstDiscovery){
        achievements.firstDiscovery = new Date().toISOString();
      }
      achievements.sessionDiscovered = true;
      saveAchievements(achievements);
      updateStatsDisplay();
    }

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
        if(!bitcoinEgg.classList.contains('revealed')){
          // First time revealing this session - show achievement and record!
          if(!achievements.sessionDiscovered){
            recordDiscovery();
            setTimeout(() => showAchievement(), 500); // Small delay for dramatic effect
          }
        }
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
