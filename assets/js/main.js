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
    const revealDistance = 350; // pixels from spotlight center to reveal - larger than Bitcoin
    let sessionDiscovered = false; // Track session locally, not from storage

    // Random position generator
    function getRandomPosition(){
      const minTop = 20;
      const maxTop = 70;
      const minLeft = 15;
      const maxLeft = 75;

      return {
        top: Math.random() * (maxTop - minTop) + minTop,
        left: Math.random() * (maxLeft - minLeft) + minLeft
      };
    }

    // Set Bitcoin position based on find count
    function setBitcoinPosition(){
      const achievements = getAchievements();
      const seed = achievements.bitcoinFinds; // Use find count as seed

      // Generate position based on find count
      const positions = [
        {top: 35, right: 15}, // Initial position
        {top: 60, left: 20},
        {top: 25, left: 70},
        {top: 50, left: 40},
        {top: 70, left: 80},
        {top: 20, left: 25}
      ];

      const pos = positions[seed % positions.length];

      if(pos.right !== undefined){
        bitcoinEgg.style.right = pos.right + '%';
        bitcoinEgg.style.left = 'auto';
      } else {
        bitcoinEgg.style.left = pos.left + '%';
        bitcoinEgg.style.right = 'auto';
      }
      bitcoinEgg.style.top = pos.top + '%';
    }

    // Initialize position
    setBitcoinPosition();

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
      const achievements = getAchievements();
      achievements.bitcoinFinds++;
      if(!achievements.firstDiscovery){
        achievements.firstDiscovery = new Date().toISOString();
      }
      saveAchievements(achievements);
      updateStatsDisplay();

      // Move Bitcoin to new position and reset for this session
      setTimeout(() => {
        setBitcoinPosition();
        sessionDiscovered = false; // Reset so it can be found again this session
      }, 4500);
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
          if(!sessionDiscovered){
            sessionDiscovered = true;
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
