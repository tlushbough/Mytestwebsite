// EPIC interactive spotlight effect
document.addEventListener('DOMContentLoaded', function(){
  // Achievement tracking with localStorage
  const STORAGE_KEY = 'epicHelloworldAchievements';

  function getAchievements(){
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      bitcoinFinds: 0,
      firstDiscovery: null,
      satoshis: 0,
      totalSatoshis: 0,
      upgrades: {
        spotlightBoost: 0,
        bitcoinMagnet: 0,
        speedMiner: 0,
        goldenBitcoin: 0,
        autoMiner: 0
      }
    };
  }

  function saveAchievements(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function updateStatsDisplay(){
    const achievements = getAchievements();
    const countEl = document.getElementById('bitcoinCount');
    const firstFindEl = document.getElementById('firstFind');
    const satoshisEl = document.getElementById('satoshisCount');

    if(countEl) countEl.textContent = achievements.bitcoinFinds;
    if(satoshisEl) satoshisEl.textContent = Math.floor(achievements.satoshis).toLocaleString();
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

  // Upgrade system
  const UPGRADES = {
    spotlightBoost: {
      name: 'Spotlight Boost',
      icon: '🔍',
      baseCost: 100,
      costMultiplier: 1.5,
      description: 'Increases reveal radius',
      effect: (level) => 350 + (level * 50) // Base 350px + 50px per level
    },
    bitcoinMagnet: {
      name: 'Bitcoin Magnet',
      icon: '🧲',
      baseCost: 250,
      costMultiplier: 2,
      description: 'Bitcoin pulses when you\'re close',
      effect: (level) => level > 0 // Enabled if level > 0
    },
    speedMiner: {
      name: 'Speed Miner',
      icon: '⚡',
      baseCost: 500,
      costMultiplier: 2.5,
      description: 'Reduces respawn time',
      effect: (level) => Math.max(1000, 4500 - (level * 500)) // Min 1s, -0.5s per level
    },
    goldenBitcoin: {
      name: 'Golden Bitcoin',
      icon: '🌟',
      baseCost: 1000,
      costMultiplier: 3,
      description: '10% chance for 10x Satoshis',
      effect: (level) => level * 0.1 // 10% per level
    },
    autoMiner: {
      name: 'Auto Miner',
      icon: '🤖',
      baseCost: 2000,
      costMultiplier: 4,
      description: 'Earn Satoshis per second',
      effect: (level) => level * 0.5 // 0.5 Satoshis/sec per level
    }
  };

  function getUpgradeCost(upgradeKey){
    const achievements = getAchievements();
    const level = achievements.upgrades[upgradeKey];
    const upgrade = UPGRADES[upgradeKey];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  }

  function purchaseUpgrade(upgradeKey){
    const achievements = getAchievements();
    const cost = getUpgradeCost(upgradeKey);

    if(achievements.satoshis >= cost){
      achievements.satoshis -= cost;
      achievements.upgrades[upgradeKey]++;
      saveAchievements(achievements);
      updateStatsDisplay();
      updateUpgradeButtons();
      return true;
    }
    return false;
  }

  function updateUpgradeButtons(){
    const achievements = getAchievements();

    Object.keys(UPGRADES).forEach(key => {
      const btn = document.getElementById(`upgrade-${key}`);
      if(!btn) return;

      const cost = getUpgradeCost(key);
      const level = achievements.upgrades[key];
      const canAfford = achievements.satoshis >= cost;

      btn.querySelector('.upgrade-cost').textContent = cost.toLocaleString();
      btn.querySelector('.upgrade-level').textContent = `Lv ${level}`;
      btn.disabled = !canAfford;
      btn.classList.toggle('affordable', canAfford);
    });
  }
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
  console.log('Bitcoin egg element:', bitcoinEgg); // Debug log

  if(bitcoinEgg){
    let sessionDiscovered = false; // Track session locally, not from storage

    function getRevealDistance(){
      const achievements = getAchievements();
      return UPGRADES.spotlightBoost.effect(achievements.upgrades.spotlightBoost);
    }

    function getRespawnDelay(){
      const achievements = getAchievements();
      return UPGRADES.speedMiner.effect(achievements.upgrades.speedMiner);
    }

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

      // Award Satoshis with golden bitcoin chance
      let baseSatoshis = 10;
      const goldenChance = UPGRADES.goldenBitcoin.effect(achievements.upgrades.goldenBitcoin);
      const isGolden = Math.random() < goldenChance;

      if(isGolden){
        baseSatoshis *= 10;
        bitcoinEgg.style.color = '#ffd700'; // Golden color
      }

      achievements.satoshis += baseSatoshis;
      achievements.totalSatoshis += baseSatoshis;
      saveAchievements(achievements);
      updateStatsDisplay();
      updateUpgradeButtons();

      // Move Bitcoin to new position and reset for this session
      const respawnDelay = getRespawnDelay();
      setTimeout(() => {
        setBitcoinPosition();
        bitcoinEgg.style.color = '#f7931a'; // Reset to orange
        sessionDiscovered = false; // Reset so it can be found again this session
      }, respawnDelay);
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

      const revealDistance = getRevealDistance();

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

  // Auto Miner passive income system
  setInterval(() => {
    const achievements = getAchievements();
    const passiveIncome = UPGRADES.autoMiner.effect(achievements.upgrades.autoMiner);

    if(passiveIncome > 0){
      achievements.satoshis += passiveIncome;
      achievements.totalSatoshis += passiveIncome;
      saveAchievements(achievements);
      updateStatsDisplay();
      updateUpgradeButtons();
    }
  }, 1000); // Run every second

  // Initialize upgrade buttons and setup click handlers
  Object.keys(UPGRADES).forEach(key => {
    const btn = document.getElementById(`upgrade-${key}`);
    if(btn){
      btn.addEventListener('click', () => {
        if(purchaseUpgrade(key)){
          // Show purchase feedback
          btn.classList.add('just-purchased');
          setTimeout(() => btn.classList.remove('just-purchased'), 300);
        }
      });
    }
  });
  updateUpgradeButtons();

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
