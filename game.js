// Configuración del juego
let currentRound = 1;
let lives = 5;
let score = 0;
let currentPattern = [];
let correctAnswer = null;
let hintsAvailable = 2;
let currentPatternType = "";

// Iconos de Lucide organizados por categorías
const iconSets = {
  shapes: ["circle", "square", "triangle", "diamond", "hexagon", "octagon"],
  nature: [
    "flower",
    "flower-2",
    "leaf",
    "cloud",
    "sun",
    "moon",
    "star",
    "sparkles",
  ],
  objects: ["heart", "music", "coffee", "gift", "award", "gem", "crown", "zap"],
  symbols: [
    "check",
    "x",
    "plus",
    "minus",
    "asterisk",
    "hash",
    "at-sign",
    "percent",
  ],
  arrows: [
    "arrow-up",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "chevron-up",
    "chevron-down",
  ],
  tech: [
    "smartphone",
    "monitor",
    "headphones",
    "camera",
    "mic",
    "radio",
    "wifi",
    "bluetooth",
  ],
};

// Colores para los iconos
const colors = [
  "text-blue-500",
  "text-purple-500",
  "text-pink-500",
  "text-indigo-500",
  "text-cyan-500",
  "text-violet-500",
];

// Función para obtener iconos aleatorios según la dificultad
function getRandomIcons(count, round) {
  let selectedIcons = [];

  if (round <= 3) {
    const categories = Object.keys(iconSets);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categoryIcons = iconSets[category];
    selectedIcons = categoryIcons.slice(0, count);
  } else if (round <= 6) {
    const categories = Object.keys(iconSets);
    const cat1 = categories[Math.floor(Math.random() * categories.length)];
    let cat2 = categories[Math.floor(Math.random() * categories.length)];
    while (cat2 === cat1) {
      cat2 = categories[Math.floor(Math.random() * categories.length)];
    }
    selectedIcons = [
      ...iconSets[cat1].slice(0, Math.ceil(count / 2)),
      ...iconSets[cat2].slice(0, Math.floor(count / 2)),
    ];
  } else {
    const allIcons = Object.values(iconSets).flat();
    const shuffled = [...allIcons].sort(() => Math.random() - 0.5);
    selectedIcons = shuffled.slice(0, count);
  }

  return selectedIcons.map((icon, index) => ({
    name: icon,
    color: colors[index % colors.length],
  }));
}

// Crear partículas de fondo
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 10 + "s";
    particle.style.animationDuration = 10 + Math.random() * 5 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Generar patrón según la dificultad de la ronda
function generatePattern(round) {
  const patternLength = Math.min(4 + round, 9);
  const pattern = [];
  const numIcons = Math.min(3 + Math.floor(round / 2), 8);
  const availableIcons = getRandomIcons(numIcons + 3, round);

  let patternTypes = [];

  if (round <= 2) {
    patternTypes = ["simple", "alternating"];
  } else if (round <= 4) {
    patternTypes = ["alternating", "doubling", "skip"];
  } else if (round <= 6) {
    patternTypes = ["triple", "reverse", "pyramid", "skip"];
  } else if (round <= 8) {
    patternTypes = ["fibonacci", "mirror", "growing", "reverse"];
  } else {
    patternTypes = ["fibonacci", "complex", "mixed", "rotation"];
  }

  const type = patternTypes[Math.floor(Math.random() * patternTypes.length)];
  currentPatternType = type;

  switch (type) {
    case "simple":
      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[i % 2]);
      }
      correctAnswer = availableIcons[patternLength % 2];
      break;

    case "alternating":
      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[i % 3]);
      }
      correctAnswer = availableIcons[patternLength % 3];
      break;

    case "doubling":
      let dubIndex = 0;
      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[dubIndex]);
        if (i % 2 === 1) dubIndex++;
      }
      if (patternLength % 2 === 0) {
        correctAnswer = availableIcons[dubIndex];
      } else {
        correctAnswer = availableIcons[dubIndex];
      }
      break;

    case "skip":
      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[i % 4]);
      }
      correctAnswer = availableIcons[patternLength % 4];
      break;

    case "triple":
      let triIndex = 0;
      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[triIndex]);
        if ((i + 1) % 3 === 0) triIndex++;
      }
      if (patternLength % 3 === 0) {
        correctAnswer = availableIcons[triIndex];
      } else {
        correctAnswer = availableIcons[triIndex];
      }
      break;

    case "reverse":
      const halfLen = Math.floor(patternLength / 2);
      for (let i = 0; i < halfLen; i++) {
        pattern.push(availableIcons[i]);
      }
      for (let i = halfLen - 1; i >= 0 && pattern.length < patternLength; i--) {
        pattern.push(availableIcons[i]);
      }
      if (patternLength % 2 === 0) {
        correctAnswer = availableIcons[halfLen - 1];
      } else {
        correctAnswer = availableIcons[0];
      }
      break;

    case "pyramid":
      const pyramidBase = Math.min(3, availableIcons.length);
      let pyrIndex = 0;
      let pyrDirection = 1;
      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[pyrIndex]);
        pyrIndex += pyrDirection;
        if (pyrIndex >= pyramidBase) {
          pyrDirection = -1;
          pyrIndex = pyramidBase - 2;
        } else if (pyrIndex < 0) {
          pyrDirection = 1;
          pyrIndex = 1;
        }
      }
      correctAnswer = availableIcons[pyrIndex];
      break;

    case "fibonacci":
      const fibSeq = [1, 1, 2, 3, 2, 1];
      let fibPosition = 0;
      let fibIconIndex = 0;
      let fibCount = 0;

      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[fibIconIndex % 2]);
        fibCount++;

        if (fibCount >= fibSeq[fibPosition % fibSeq.length]) {
          fibCount = 0;
          fibIconIndex++;
          fibPosition++;
        }
      }

      if (fibCount === 0) {
        correctAnswer = availableIcons[fibIconIndex % 2];
      } else {
        correctAnswer = availableIcons[fibIconIndex % 2];
      }
      break;

    case "mirror":
      const mirrorHalf = Math.floor(patternLength / 2);
      for (let i = 0; i < mirrorHalf; i++) {
        pattern.push(availableIcons[i]);
      }
      if (patternLength % 2 === 1) {
        pattern.push(availableIcons[mirrorHalf]);
      }
      for (
        let i = mirrorHalf - 1;
        i >= 0 && pattern.length < patternLength;
        i--
      ) {
        pattern.push(availableIcons[i]);
      }
      correctAnswer =
        availableIcons[mirrorHalf - 1 - (patternLength - mirrorHalf * 2)];
      break;

    case "growing":
      let growIndex = 0;
      let growRepeat = 1;
      let growCount = 0;

      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[growIndex]);
        growCount++;

        if (growCount >= growRepeat) {
          growCount = 0;
          growIndex++;
          growRepeat++;
        }
      }

      if (growCount === 0) {
        correctAnswer = availableIcons[growIndex];
      } else {
        correctAnswer = availableIcons[growIndex];
      }
      break;

    case "complex":
      for (let i = 0; i < patternLength; i++) {
        if (i % 2 === 0) {
          pattern.push(availableIcons[0]);
        } else {
          pattern.push(availableIcons[1 + (Math.floor(i / 4) % 2)]);
        }
      }
      if (patternLength % 2 === 0) {
        correctAnswer = availableIcons[0];
      } else {
        const nextOddPos = Math.floor(patternLength / 4) % 2;
        correctAnswer = availableIcons[1 + nextOddPos];
      }
      break;

    case "mixed":
      const mixedPattern = [0, 0, 1, 2, 2];
      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[mixedPattern[i % mixedPattern.length]]);
      }
      correctAnswer =
        availableIcons[mixedPattern[patternLength % mixedPattern.length]];
      break;

    case "rotation":
      const rotBase = Math.min(4, availableIcons.length);
      let rotOffset = 0;
      for (let i = 0; i < patternLength; i++) {
        pattern.push(availableIcons[(i + rotOffset) % rotBase]);
        if ((i + 1) % rotBase === 0) rotOffset++;
      }
      correctAnswer = availableIcons[(patternLength + rotOffset) % rotBase];
      break;
  }

  return pattern;
}

// Crear elemento de icono Lucide
function createIconElement(icon, size = "pattern-icon") {
  const i = document.createElement("i");
  i.setAttribute("data-lucide", icon.name);
  i.className = `${size} ${icon.color}`;
  return i;
}

// Mostrar el patrón en pantalla
function displayPattern() {
  const patternDisplay = document.getElementById("pattern-display");
  patternDisplay.innerHTML = "";

  currentPattern.forEach((icon, index) => {
    const iconWrapper = document.createElement("div");
    iconWrapper.className = "opacity-0";
    iconWrapper.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;

    const iconElement = createIconElement(icon);
    iconWrapper.appendChild(iconElement);
    patternDisplay.appendChild(iconWrapper);
  });

  const questionDiv = document.createElement("div");
  questionDiv.className =
    "opacity-0 text-blue-400 font-bold text-3xl sm:text-4xl";
  questionDiv.textContent = "?";
  questionDiv.style.animation = `fadeIn 0.5s ease-out ${currentPattern.length * 0.1}s forwards, pulse 1s ease-in-out ${currentPattern.length * 0.1}s infinite`;
  patternDisplay.appendChild(questionDiv);

  lucide.createIcons();
}

// Generar opciones de respuesta
function generateOptions() {
  const options = [correctAnswer];

  const usedIcons = [...new Set(currentPattern.map((i) => i.name))];

  const numIcons = Math.min(8 + Math.floor(currentRound / 2), 20);
  let availableIcons = getRandomIcons(numIcons, currentRound);

  while (options.length < 4) {
    const randomIcon =
      availableIcons[Math.floor(Math.random() * availableIcons.length)];
    const isDuplicate = options.some(
      (opt) => opt.name === randomIcon.name && opt.color === randomIcon.color,
    );

    if (!isDuplicate) {
      options.push(randomIcon);
    }
  }

  return options.sort(() => Math.random() - 0.5);
}

// Mostrar opciones en pantalla
function displayOptions() {
  const optionsDisplay = document.getElementById("options-display");
  optionsDisplay.innerHTML = "";

  const options = generateOptions();

  options.forEach((icon, index) => {
    const optionBtn = document.createElement("button");
    optionBtn.className =
      "pattern-option bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg opacity-0 flex items-center justify-center";
    optionBtn.style.animation = `fadeIn 0.5s ease-out ${0.5 + index * 0.1}s forwards`;

    const iconElement = createIconElement(icon, "w-10 h-10 sm:w-12 sm:h-12");
    optionBtn.appendChild(iconElement);

    optionBtn.onclick = () => checkAnswer(icon);
    optionsDisplay.appendChild(optionBtn);
  });

  lucide.createIcons();
}

// Verificar respuesta
function checkAnswer(selectedIcon) {
  const feedback = document.getElementById("feedback");
  const optionsDisplay = document.getElementById("options-display");

  optionsDisplay.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  });

  const isCorrect =
    selectedIcon.name === correctAnswer.name &&
    selectedIcon.color === correctAnswer.color;

  if (isCorrect) {
    feedback.innerHTML =
      '<i data-lucide="check-circle" class="w-5 h-5 inline mr-1"></i> Correcto';
    feedback.className =
      "text-center text-sm sm:text-base font-semibold h-6 sm:h-8 text-green-500";
    score += 10 * currentRound;
    document.getElementById("score").textContent = score;

    setTimeout(() => {
      if (currentRound < 10) {
        nextRound();
      } else {
        showVictory();
      }
    }, 1500);
  } else {
    feedback.innerHTML =
      '<i data-lucide="x-circle" class="w-5 h-5 inline mr-1"></i> Intentalo de nuevo';
    feedback.className =
      "text-center text-sm sm:text-base font-semibold h-6 sm:h-8 text-red-500";
    lives--;
    updateLives();

    if (lives <= 0) {
      setTimeout(() => {
        gameOver();
      }, 1500);
    } else {
      setTimeout(() => {
        optionsDisplay.querySelectorAll("button").forEach((btn) => {
          btn.disabled = false;
          btn.style.opacity = "1";
          btn.style.cursor = "pointer";
        });
        feedback.textContent = "";
      }, 1500);
    }
  }

  lucide.createIcons();
}

// Actualizar vidas
function updateLives() {
  document.getElementById("lives").textContent = lives;
}

// Actualizar nivel de dificultad
function updateDifficultyLevel() {
  const difficultyElement = document.getElementById("difficulty-level");

  if (currentRound <= 2) {
    difficultyElement.textContent = "Fácil";
    difficultyElement.className =
      "text-xs sm:text-sm font-semibold text-green-700";
  } else if (currentRound <= 4) {
    difficultyElement.textContent = "Medio";
    difficultyElement.className =
      "text-xs sm:text-sm font-semibold text-yellow-700";
  } else if (currentRound <= 6) {
    difficultyElement.textContent = "Difícil";
    difficultyElement.className =
      "text-xs sm:text-sm font-semibold text-orange-700";
  } else if (currentRound <= 8) {
    difficultyElement.textContent = "Muy Difícil";
    difficultyElement.className =
      "text-xs sm:text-sm font-semibold text-red-700";
  } else {
    difficultyElement.textContent = "Experto";
    difficultyElement.className =
      "text-xs sm:text-sm font-semibold text-purple-700";
  }
}

// Siguiente ronda
function nextRound() {
  currentRound++;
  document.getElementById("round-number").textContent = currentRound;
  document.getElementById("feedback").textContent = "";
  updateDifficultyLevel();
  startRound();
}

// Iniciar una ronda
function startRound() {
  currentPattern = generatePattern(currentRound);
  displayPattern();
  displayOptions();
}

// Mostrar pantalla de victoria
function showVictory() {
  const gameScreen = document.getElementById("game-screen");
  const victoryScreen = document.getElementById("victory-screen");

  gameScreen.style.opacity = "0";
  gameScreen.style.transition = "opacity 0.5s";

  setTimeout(() => {
    gameScreen.classList.add("hidden");
    victoryScreen.classList.remove("hidden");
    victoryScreen.style.opacity = "0";

    setTimeout(() => {
      victoryScreen.style.transition = "opacity 0.5s";
      victoryScreen.style.opacity = "1";
      lucide.createIcons();
    }, 50);
  }, 500);
}

// Game Over
function gameOver() {
  const feedback = document.getElementById("feedback");
  feedback.innerHTML =
    '<i data-lucide="rotate-ccw" class="w-5 h-5 inline mr-1"></i> Reiniciando...';
  feedback.className =
    "text-center text-sm sm:text-base font-semibold h-6 sm:h-8 text-blue-500";

  setTimeout(() => {
    resetGame();
  }, 2000);

  lucide.createIcons();
}

// Reiniciar juego
function resetGame() {
  currentRound = 1;
  lives = 5;
  score = 0;
  document.getElementById("round-number").textContent = currentRound;
  document.getElementById("score").textContent = score;
  updateLives();
  updateDifficultyLevel();
  document.getElementById("feedback").textContent = "";
  startRound();
}

// Inicializar todo cuando el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
  createParticles();
  updateDifficultyLevel();
  startRound();

  setTimeout(() => {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }, 100);

  // Botón de inicio
  const startBtn = document.getElementById("start-game-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const startScreen = document.getElementById("start-screen");
      const gameScreen = document.getElementById("game-screen");

      startScreen.style.opacity = "0";
      startScreen.style.transition = "opacity 0.5s";

      setTimeout(() => {
        startScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        gameScreen.style.opacity = "0";

        setTimeout(() => {
          gameScreen.style.transition = "opacity 0.5s";
          gameScreen.style.opacity = "1";
          lucide.createIcons();
        }, 50);
      }, 500);
    });
  }

  // Botón continuar a sorpresa
  const continueBtn = document.getElementById("continue-btn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      const victoryScreen = document.getElementById("victory-screen");
      const surpriseScreen = document.getElementById("surprise-screen");

      victoryScreen.style.opacity = "0";
      victoryScreen.style.transition = "opacity 0.5s";

      setTimeout(() => {
        victoryScreen.classList.add("hidden");
        surpriseScreen.classList.remove("hidden");
        window.scrollTo(0, 0);

        setTimeout(() => {
          lucide.createIcons();
        }, 100);
      }, 500);
    });
  }
});
