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
    updateButtonStates();
  } else {
    alert('Please enter your name!');
  }
}





function updateButtonStates() {
  const available = playerData.unlockedTables || [];
  document.getElementById('btn2').disabled = !available.includes(2);
  document.getElementById('btn5').disabled = !available.includes(5);
  document.getElementById('btn10').disabled = !available.includes(10);
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
  document.getElementById('start-menu').classList.remove('active');
  document.getElementById('highscore-screen').classList.add('active');

  const players = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("player_")) {
      const name = key.replace("player_", "");
      const data = JSON.parse(localStorage.getItem(key));

      const highestLevel = Math.max(...(data.unlockedTables || [2]));
const scoreValues = Object.values(data.highScores || {}).filter(s => typeof s === 'number' && !isNaN(s));
const bestScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
      players.push({
        name,
        level: `×${highestLevel}`,
        score: bestScore
      });
    }
  }

  if (players.length === 0) {
    document.getElementById('highscore-list').innerHTML = "No player data yet.";
    return;
  }


  players.sort((a, b) => b.score - a.score);


  let html = "";
  for (const player of players) {
    html += `<div><strong>${player.name}</strong> — Level: <span style="color:#4CAF50;">${player.level}</span> — Best Score: <span style="color:#ff5722;">${player.score}</span></div>`;
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
  document.getElementById('timer').classList.add('urgent');

  if (score > (playerData.highScores[currentTable] || 0)) {
  playerData.highScores[currentTable] = score;
}


} else {
  document.getElementById('timer').classList.remove('urgent');
}


    if (timer <= 0) {
      clearInterval(interval);


      if (score >= 10 && currentTable !== 'random') {        

        
        if (next && !playerData.unlockedTables.includes(next)) {
  playerData.unlockedTables.push(next);



document.getElementById('unlock-text').textContent = `You unlocked the ×${next} level! Great job, ${username}!`;
document.getElementById('levelUnlock').style.display = 'flex';
document.getElementById('unlockSound').play();

updateButtonStates();
renderTimesTableButtons();

localStorage.setItem("player_" + username, JSON.stringify(playerData));

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
message += `<br><button onclick="returnToMenu();document.getElementById('gameOver').style.display='none';" 
style="margin-top:1rem; padding:0.5rem 1rem; font-size:1.2rem;">Return to Menu</button>`;

document.getElementById('gameOver').style.display = 'block';
document.getElementById('gameOver').innerHTML = message;

      
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

  document.getElementById('question').textContent = `${currentQuestion.a} × ${currentQuestion.b} = ?`;
  currentInput = "";
  document.getElementById('answer').textContent = "";
  document.getElementById('feedback').textContent = "";
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
  container.innerHTML = ''; 

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



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log("✅ Service Worker Registered"))
      .catch(err => console.log("❌ SW registration failed:", err));
  });
}
