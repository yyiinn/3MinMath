let currentTable = null;
let currentQuestion = {};
let questionsPool = [];
let currentInput = "";
let score = 0;
let timer = 180;
let interval = null;
let username = '';
let streak = 0;
let playerData = { highScores: {}, unlockedTables: [2] };
let totalQuestions = 0;
let flawlessBonusGiven = false;


function saveUsername() {
  username = document.getElementById('usernameInput').value.trim();

  if (username) {

    const savedData = localStorage.getItem("player_" + username);
    playerData = savedData
      ? JSON.parse(savedData)
      : { highScores: {}, unlockedTables: [2] };

      renderTimesTableButtons();
    localStorage.setItem("username", username); 
    document.getElementById('username-screen').classList.remove('active');
    document.getElementById('start-menu').classList.add('active');
  
  } else {
    alert('Please enter your name!');
  }
}








function startGame(table) {
  currentTable = table;
  document.getElementById('start-menu').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  document.getElementById('level-label').textContent = `Level: ×${table}`;
  let count = 3;
  document.getElementById('countdown').textContent = count;
  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      document.getElementById('countdown').textContent = count;
    } else {
      clearInterval(countdownInterval);
      document.getElementById('countdown').textContent = '';
      resetGame();
      generateQuestion();
    }
  }, 1000);
}


function returnToMenu() {
  clearInterval(interval);
  renderTimesTableButtons();
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('game-screen').classList.remove('active');
  document.getElementById('profile-screen').classList.remove('active');
  document.getElementById('highscore-screen').classList.remove('active');
  document.getElementById('start-menu').classList.add('active');
}



function showHighScores() {


  if (username && playerData) {
    localStorage.setItem("player_" + username, JSON.stringify(playerData));
  }



  document.getElementById('start-menu').classList.remove('active');
  document.getElementById('highscore-screen').classList.add('active');

  const players = [];

 
  

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("player_")) {
      try {
        const name = key.replace("player_", "");
        const data = JSON.parse(localStorage.getItem(key));
        const highestLevel = Math.max(...(data.unlockedTables || [2]));
        const scores = Object.values(data.highScores || {}).filter(s => typeof s === 'number' && !isNaN(s));
        const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

        players.push({
          name,
          level: `×${highestLevel}`,
          score: bestScore
        });
      } catch (err) {
        console.warn(`Skipping corrupt player data: ${key}`);
      }
    }
  }


  if (players.length === 0) {
    document.getElementById('highscore-list').innerHTML = "No player data yet.";
    return;
  }




  players.sort((a, b) => b.score - a.score);


let html = "";
for (const player of players) {
  const isCurrent = player.name === username;
  html += `<div class="${isCurrent ? 'highlighted-player' : ''}">
    <strong>${isCurrent ? "👑 " : ""}${player.name}</strong> — 
    Level: <span style="color:#4CAF50;">${player.level}</span> — 
    Best Score: <span style="color:#ff5722;">${player.score}</span>
  </div>`;
}

  document.getElementById('highscore-list').innerHTML = html;
}






function showProfile() {
  document.getElementById('start-menu').classList.remove('active');
  document.getElementById('profile-screen').classList.add('active');

  document.getElementById('profile-name').textContent = username;

  let stats = "<strong>Unlocked Levels:</strong><br>";
  stats += playerData.unlockedTables.sort((a, b) => a - b).map(n => `×${n}`).join(", ");
  stats += "<br><br><strong>High Scores:</strong><br>";

  if (Object.keys(playerData.highScores).length === 0) {
    stats += "No scores yet!";
  } else {
    for (const [table, score] of Object.entries(playerData.highScores)) {
      stats += `×${table}: ${score}<br>`;
    }
  }

  document.getElementById('profile-stats').innerHTML = stats;
}



function resetGame() {
  score = 0;
  timer = 180;
  streak = 0;
  totalQuestions = 0;
  flawlessBonusGiven = false;

  const next = currentTable < 12 ? currentTable + 1 : null;

  document.getElementById('score').textContent = 0;
  document.getElementById('timer').textContent = timer;
  document.getElementById('streak').textContent = '';
  clearInterval(interval);

  interval = setInterval(() => {
    timer--;
    const timerEl = document.getElementById('timer');
    timerEl.textContent = timer;

    if (timer <= 30) {
      timerEl.classList.add('urgent');
    } else {
      timerEl.classList.remove('urgent');
    }

    if (timer <= 0) {
      clearInterval(interval);

      // Unlock next level
      if (score >= 10 && currentTable !== 'random') {
        if (next && !playerData.unlockedTables.includes(next)) {
          playerData.unlockedTables.push(next);

          document.getElementById('unlock-text').textContent = `You unlocked the ×${next} level! Great job, ${username}!`;
          document.getElementById('levelUnlock').style.display = 'flex';

          const unlockSound = document.getElementById('unlockSound');
          if (unlockSound && unlockSound.play) {
            try {
              unlockSound.currentTime = 0;
              unlockSound.play();
            } catch (e) {
              console.warn("Unlock sound blocked or unavailable.");
            }
          }

        
          renderTimesTableButtons();
          localStorage.setItem("player_" + username, JSON.stringify(playerData));
        }
      }

      if (currentTable !== 'random' && streak === 12 && score === 24) {

  if (!flawlessBonusGiven) {
    score += 5;
    message += `<br><span style="color: yellow;">🎯 Perfect Score Bonus! +5</span>`;
  }
}




      const tableKey = currentTable.toString();
      const previousBest = playerData.highScores[tableKey] || 0;
      let newRecord = false;

      if (score > previousBest && currentTable !== 'random') {
        playerData.highScores[tableKey] = score;
        localStorage.setItem(`player_${username}`, JSON.stringify(playerData));
        newRecord = true;
      }


      let message = `⏰ Time's up!<br><strong>${username}</strong><br>Your score: <strong>${score}</strong>`;

      if (currentTable !== 'random') {
        message += `<br>High score (×${currentTable}): <strong>${playerData.highScores[tableKey]}</strong>`;
      }

      if (newRecord) {
        message += `<br><span style="color: gold; font-size: 1.5rem;">🏆 New High Score!</span>`;
      }



if (currentTable !== 'random' && flawlessBonusGiven) {
  message += `<br><span style="color: #ffd700; font-size: 1.3rem;">🌟 Perfect Table Mastery! You answered all 12 questions correctly first time!</span>`;
}



if (currentTable !== 'random' && streak > 0 && streak * 2 === score) {
  score += 5;
  message += `<br><span style="color: green;">🎯 Perfect score bonus! +5</span>`;
  document.getElementById('score').textContent = score; 
}




      message += `<br><button onclick="returnToMenu();document.getElementById('gameOver').style.display='none';" 
      style="margin-top:1rem; padding:0.5rem 1rem; font-size:1.2rem;">Return to Menu</button>`;

      document.getElementById('gameOver').innerHTML = message;
      document.getElementById('gameOver').style.display = 'block';

      setTimeout(() => {
        returnToMenu();
        document.getElementById('gameOver').style.display = 'none';
      }, 10000); // auto return to menu
    }
  }, 1000);
}












function closeUnlock() {
  document.getElementById('levelUnlock').style.display = 'none';
}




function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateQuestion() {

  if (currentTable !== 'random') {
    if (questionsPool.length === 0) {

      questionsPool = shuffleArray([...Array(12).keys()].map(i => i + 1));
    }
    const num1 = questionsPool.pop();
    const num2 = currentTable;
    currentQuestion = { a: num1, b: num2, answer: num1 * num2 };
  } else {

    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    currentQuestion = { a: num1, b: num2, answer: num1 * num2 };
  }

  document.getElementById('question').textContent = `${currentQuestion.a} × ${currentQuestion.b} =`;
  currentInput = "";
  document.getElementById('answer').textContent = "";
  document.getElementById('feedback').textContent = "";
  totalQuestions++;
}


function handleKey(key) {

  if (timer <= 0) return;

  const clickSound = document.getElementById('clickSound');
  if (clickSound && clickSound.readyState >= 2) {
    try {
      clickSound.currentTime = 0;
      clickSound.play();
    } catch (err) {

    }
  }

  if (key === 'C') {
    currentInput = "";
  } else if (key === '⏎') {
    checkAnswer();
    return;
  } else if (currentInput.length < 3) {
    currentInput += key;
  }
  document.getElementById('answer').textContent = currentInput;
}




function checkAnswer() {
  const isCorrect = parseInt(currentInput) === currentQuestion.answer;
  document.getElementById('feedback').textContent = isCorrect ? "✅ Correct!" : `❌ Oops! It was ${currentQuestion.answer}`;
if (isCorrect) {
  streak++;
  score += 2;





if (
  currentTable !== 'random' &&
  !flawlessBonusGiven &&
  score === 24 && 
  streak === 12   

) {
  flawlessBonusGiven = true;
  score += 10;
  document.getElementById('score').textContent = score;


  const bonusPopup = document.createElement('div');
  bonusPopup.innerHTML = `🎯 <strong>Flawless!</strong><br>You got all 12 questions correct first try!<br><span style="font-size:1.2rem; color:green;">+10 Bonus Points!</span>`;
  bonusPopup.style.position = 'fixed';
  bonusPopup.style.top = '30%';
  bonusPopup.style.left = '50%';
  bonusPopup.style.transform = 'translateX(-50%)';
  bonusPopup.style.background = '#fff';
  bonusPopup.style.color = '#333';
  bonusPopup.style.padding = '1.5rem';
  bonusPopup.style.borderRadius = '12px';
  bonusPopup.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
  bonusPopup.style.zIndex = 9999;
  bonusPopup.style.textAlign = 'center';
  document.body.appendChild(bonusPopup);

  document.getElementById('bonusSound')?.play();

  setTimeout(() => bonusPopup.remove(), 4000);
}






  const stars = "⭐".repeat(Math.min(streak, 3));
  document.getElementById('streak').textContent = `Streak: ${stars}`;


  const confetti = document.createElement('div');
  confetti.textContent = '🎉';
  confetti.style.position = 'absolute';
  confetti.style.fontSize = '3rem';
  confetti.style.zIndex = 9999;
  confetti.style.top = '50%';
  confetti.style.left = '50%';
  confetti.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1000);
} else {
  streak = 0;
  document.getElementById('streak').textContent = '';
}

  document.getElementById('score').textContent = score;


  const tableKey = currentTable.toString();
  const currentBest = playerData.highScores[tableKey] || 0;
  if (currentTable !== 'random' && score > currentBest) {
    playerData.highScores[tableKey] = score;
    localStorage.setItem('player_' + username, JSON.stringify(playerData));
    console.log(`New high score for ×${currentTable}: ${score}`);
  }



  generateQuestion();
}

function renderTimesTableButtons() {
  const container = document.getElementById('table-buttons');
  container.innerHTML = ''; // Clear previous

  for (let i = 1; i <= 12; i++) {
    const btn = document.createElement('button');

    if (i === 1) {

      btn.textContent = '🎲 Random';
      btn.className = 'table-button random';
      btn.onclick = () => startGame('random');
    } else {
      btn.textContent = `×${i}`;
      btn.className = 'table-button';
      btn.disabled = !playerData.unlockedTables.includes(i);
      if (btn.disabled) btn.classList.add('locked');
      btn.onclick = () => startGame(i);
    }

    container.appendChild(btn);
  }
}


function resetAllScores() {
  const confirmReset = confirm("Are you sure you want to delete all player data and scores?");
  if (confirmReset) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key.startsWith("player_")) {
        localStorage.removeItem(key);
      }
    }
    alert("All player scores have been reset.");
    showHighScores(); // Refresh list
  }
}





if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log("✅ Service Worker Registered"))
      .catch(err => console.log("❌ SW registration failed:", err));
  });
}
