// FASE1. SELECCIÓN PALETAS
let colorModeIndex = 0; // 0: CMYK, 1: RGB, 2: RYB
let selectedPalette = [];
let gameState = "startScreen"; // Estados: "startScreen", "paletteSelection", "labyrinth", "questions"
const paleta_CMYK = [[0, 255, 255], [255, 0, 255], [255, 255, 0]];
const paleta_RGB = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];
const paleta_RYB = [[255, 0, 0], [255, 255, 0], [0, 0, 255]];

// FASE2. LABERINTO
let cols, rows;
let w = 100;
let grid = [];
let stack = [];
let current;
let ball;
let mazeReady = false;
let moveX = 0, moveY = 0;
let gameStarted = false;
let timer_lab = 60;
let lives = 3;
let interval;
let bgColorStep = 0;
let imgs_paletas = []

// FASE3. TRIVIA

let questions = [
    {
      question: "¿Qué color es el opuesto al verde en el círculo cromático?",
      options: ["Rojo", "Azul", "Amarillo", "Naranja"],
      correct: 0,
    },
    {
      question: "¿Cuál de estos colores es un color luz primario?",
      options: ["Cyan", "Magenta", "Verde", "Amarillo"],
      correct: 2,
    },
    {
      question:
        "¿Qué fenómeno explica por qué los colores \n parecen cambiar en diferentes iluminaciones?",
      options: ["Metamerismo", "Dispersion", "Reflexión", "Refracción"],
      correct: 0,
    },
    {
      question:
        "¿Qué células en la retina son responsables de la visión en color?",
      options: ["Bastones", "Conos", "Fotorreceptores", "Amacrinas"],
      correct: 1,
    },
    {
      question:
        "¿Qué teoría del color explica cómo el cerebro procesa los colores opuestos?",
      options: [
        "Teoría tricromática",
        "Teoría del color oponente",
        "Teoría de la absorción",
        "Teoría espectral",
      ],
      correct: 1,
    },
  ];
  
  let currentQuestion = 0;
  let  timeLeft = 20;
  let  timer;
  let selectedOption = -1;
  let  gameOver_trivia = false;
  let  score = 0;
  let bandera_trivia = true;


//FUNCIONES
function preload(){
    imgs_paletas.push(loadImage('../img/cine1.jpg'));
    imgs_paletas.push(loadImage('../img/pelicula2.jpg'));
    imgs_paletas.push(loadImage('../img/cine1.png'));
}

function setup() {
  createCanvas(800, 400);
  windowResized()
  updateSelectedPalette();
  cols = floor(width / w);
  rows = floor(height / w);
}

function draw() {
  if (gameState === "startScreen") {
    drawStartScreen();
  } else if (gameState === "paletteSelection") {
    drawPaletteSelection();
  } else if (gameState === "labyrinth") {
    drawLabyrinth();
  } else if (gameState === "questions") {
    drawQuestions();
  }
}

function drawStartScreen() {
  background(50);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("COLOR GAME", width / 2, height / 3);

  textSize(20);
  text("Haz clic para empezar", width / 2, height / 2);

  fill(100, 200, 255);
  rect(width / 2 - 50, height / 2 + 40, 100, 40, 10);
  fill(0);
  textSize(18);
  text("START", width / 2, height / 2 + 65);
}


function updateSelectedPalette() {
  selectedPalette = colorModeIndex === 0 ? paleta_CMYK : colorModeIndex === 1 ? paleta_RGB : paleta_RYB;
}

function drawPaletteSelection() {
  background(colorModeIndex === 0 ? 0 : 255);
  let textColor = colorModeIndex === 0 ? 255 : 0;

  let t = millis() * 0.002;
  let positions = [
    { x: width / 4 + 50 * sin(t), y: height / 2 + 30 * cos(t * 1.1), size: 40 + 10 * sin(t * 2) },
    { x: width / 2 + 50 * cos(t * 1.2), y: height / 2 + 30 * sin(t * 1.3), size: 40 + 15 * sin(t * 3 + PI / 3) },
    { x: (3 * width) / 4 + 50 * sin(t * 1.5), y: height / 2 + 30 * cos(t * 1.5), size: 40 + 20 * sin(t * 4 + PI / 2) }
  ];

  for (let i = 0; i < 3; i++) {
    fill(...selectedPalette[i]); // Desestructurar el array para evitar error de color
    ellipse(positions[i].x, positions[i].y, positions[i].size * 2);
  }

  fill(textColor);
  textSize(20);
  textAlign(CENTER);
  text("Haz clic para cambiar la paleta. Presiona ENTER para continuar.", width / 2, height - 20);
}

function drawLabyrinth() {
  // Fondo animado con la paleta seleccionada
  let c =imgs_paletas[colorModeIndex].get(3,frameCount%400);
  background(c[0],c[1],c[2]);
  bgColorStep += 0.02;

  if (!gameStarted) {
    timer_lab = 60;
    lives = 3;
    gameState = "startScreen";
    return;
  }

  for (let cell of grid) {
    cell.show();
  }

  ball.update();
  ball.show();

  fill(255);
  textSize(16);
  text(`Tiempo: ${timer_lab}s`, 50, 20);
  text(`Vidas: ${lives}`, 40, 40);

  if (ball.reachedGoal()) {
    gameState = "questions";
    bandera_trivia = true;
  }

  if (ball.touchesWall()) {
    lives--;
    if (lives <= 0) {
      gameOver('Perdiste: Sin vidas');
    } else {
      ball.reset();
    }
  }
}

function generateMaze() {
  grid = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      grid.push(new Cell(i, j));
    }
  }
  current = grid[0];
  stack = [];
  while (true) {
    current.visited = true;
    let next = current.checkNeighbors();
    if (next) {
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
  mazeReady = true;
}

function removeWalls(current, next) {
  let x = current.i - next.i;
  if (x === 1) {
    current.walls[3] = false;
    next.walls[1] = false;
  } else if (x === -1) {
    current.walls[1] = false;
    next.walls[3] = false;
  }
  let y = current.j - next.j;
  if (y === 1) {
    current.walls[0] = false;
    next.walls[2] = false;
  } else if (y === -1) {
    current.walls[2] = false;
    next.walls[0] = false;
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) {
    return -1; // Fuera de rango
  }
  return i + j * cols;
}

function gameOver(message) {
    clearInterval(interval);
  gameStarted = false;
  alert(message);
}

class Ball {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = w / 2;
    this.y = w / 2;
    this.color = color(255); // Ahora la bola siempre es blanca
    moveX = 0; // 🔹 Asegura que la bola no se mueva al inicio
    moveY = 0;
  }
  update() {
    this.x += moveX;
    this.y += moveY;
  }
  show() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, 20);
  }

  touchesWall() {
    let i = floor(this.x / w);
    let j = floor(this.y / w);
    let cell = grid[index(i, j)];
    if (cell) {
      let x = i * w;
      let y = j * w;
      if (cell.walls[0] && this.y - 10 < y) return true;
      if (cell.walls[1] && this.x + 10 > x + w) return true;
      if (cell.walls[2] && this.y + 10 > y + w) return true;
      if (cell.walls[3] && this.x - 10 < x) return true;
    }
    return false;
  }
  reachedGoal() {
    return this.x > width - w && this.y > height - w;
  }
}

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
  }
  checkNeighbors() {
    let neighbors = [];
    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];
    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);
    return neighbors.length > 0 ? random(neighbors) : undefined;
  }
  show() {
    let x = this.i * w;
    let y = this.j * w;
    stroke(255);
    if (this.walls[0]) line(x, y, x + w, y);
    if (this.walls[1]) line(x + w, y, x + w, y + w);
    if (this.walls[2]) line(x + w, y + w, x, y + w);
    if (this.walls[3]) line(x, y + w, x, y);
    if (this.visited) {
      noStroke();
      fill(0, 0, 255, 100);
      rect(x, y, w, w);
    }
  }
}
  function drawQuestions() {
    background("black");
    fill(255);
    textAlign(CENTER);
    if(bandera_trivia){
      textSize(20);
      text('Ahora pondremos a prueba tus conocimientos del color!', 400, 200);
      fill('grey')
       textSize(15);
      text('Presiona ENTER para continuar', 400, 240);
      return;
    }
    !gameOver_trivia
      ? (displayQuestion(), displayTimer(), displayOptions(), displayScore())
      : displayGameOver();
  }

  function displayQuestion() {
    textSize(16);
    text(questions[currentQuestion].question, width / 2, 80);
  }
  
  function displayOptions() {
    textSize(14);
    for (let i = 0; i < questions[currentQuestion].options.length; i++) {
      let y = 140 + i * 40;
      fill(
        selectedOption === i
          ? i === questions[currentQuestion].correct
            ? "green"
            : "red"
          : "blue"
      );
      rect(250, y, 300, 30, 10);
      fill(255);
      text(questions[currentQuestion].options[i], 400, y + 20);
    }
  }
  
  function displayTimer() {
    textSize(16);
    fill(255, 204, 0);
    text(`Tiempo: ${timeLeft}s`, width / 2, 30);
  }
  
  function displayScore() {
    textSize(16);
    fill(255);
    text(`Puntaje: ${score}/${questions.length}`, width / 2, height - 30);
  }
  
  function displayGameOver() {
    textSize(20);
    text(
      `¡Fin del juego! Puntaje: ${score}/${questions.length}`,
      width / 2,
      height / 2
    );
  }
  
  function countdown() {
    if (!gameOver_trivia && --timeLeft <= 0) {
        gameOver_trivia = true;
      clearInterval(timer);
    }
  }
    //EVENTOS
  function mousePressed() {
    if (gameState === "startScreen" && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 40 && mouseY < height / 2 + 80) {
      gameState = "paletteSelection";
    } else if (gameState === "paletteSelection") {
      colorModeIndex = (colorModeIndex + 1) % 3;
      updateSelectedPalette();
    } else if (gameState === "questions"){
        if (gameOver_trivia) return;
  for (let i = 0; i < questions[currentQuestion].options.length; i++) {
    let y = 140 + i * 40;
    if (mouseX > 250 && mouseX < 550 && mouseY > y && mouseY < y + 30) {
      selectedOption = i;
      if (i === questions[currentQuestion].correct) score++;
      setTimeout(() => {
        currentQuestion++;
        currentQuestion >= questions.length
          ? ((gameOver_trivia = true), clearInterval(timer))
          : ((timeLeft = 20), (selectedOption = -1));
      }, 500);
    }
  }
    }
  }
  function keyPressed() {
    if (gameState === "paletteSelection" && keyCode === ENTER ) {
      gameState = "labyrinth";
      
      generateMaze();  // Aseguramos que el laberinto se genera al comenzar
      ball = new Ball();  // Inicializamos la bola en el laberinto
      gameStarted = true;  // Marcar el inicio del juego
      clearInterval(interval);
      interval = setInterval(() => {
          if (timer_lab > 0) {
              timer_lab--;
          } else {
              gameOver('Perdiste: Se acabó el tiempo');
          }
      }, 1000);
    }
    else if (gameState === "labyrinth"){
  
      if (keyCode === LEFT_ARROW) {
          moveX = -2;
          moveY = 0;
      } else if (keyCode === RIGHT_ARROW) {
          moveX = 2;
          moveY = 0;
      } else if (keyCode === UP_ARROW) {
          moveX = 0;
          moveY = -2;
      } else if (keyCode === DOWN_ARROW) {
          moveX = 0;
          moveY = 2;
      }
    } else if (gameState === "questions") {
        if(bandera_trivia && keyCode === ENTER){
            bandera_trivia = false;
            timer = setInterval(countdown, 1000);
          }
    }
  }
  function windowResized() {

    let cnv = document.querySelector("#defaultCanvas0");
    let dvv = document.querySelector(".container-canvas");
    let dvvFin = window.getComputedStyle(dvv);
  
    cnv.style.width = dvvFin.width;
    cnv.style.height = dvvFin.height;
  }
  document.addEventListener("keydown", function(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});