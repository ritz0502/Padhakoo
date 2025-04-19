
    const userCount = document.getElementById("userCount");

    function getRandomUserCount() {
      const base = 10500;
      const variation = Math.floor(Math.random() * 1000); // adds up to 1000 users randomly
      const total = base + variation;
      return (total / 1000).toFixed(1) + 'K+';
    }
    
    function updateUserCount() {
      userCount.textContent = getRandomUserCount();
    }
    
    // Update every 5 seconds
    updateUserCount();
    setInterval(updateUserCount, 5000);
