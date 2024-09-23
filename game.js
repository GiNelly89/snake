let canvas = document.getElementById("my-canvas");
let context = canvas.getContext("2d");

canvas.height = 480;
canvas.width = 480;

let rows = 20; //* größe des Rasters
let cols = 20;
let snake = [
  {
    x: 19, //* startposition der schlange
    y: 3,
  },
];

let food;
let cellWidth = canvas.width / cols; //* breite der schlange
let cellHeight = canvas.height / rows; //* höhe der schlange
let direction = "LEFT"; //* laufrichtung
let foodCollected = false; //* schlange isst und wächst
let score = 0; //* Punkestand
let speedIncrease = 0; //* Geschwindigkeit erhöhen

//? Äpfel
let redApple = new Image();
redApple.src = "./redapple.png";
let greenApple = new Image();
greenApple.src = "./greenapple.png";
let goldenApple = new Image();
goldenApple.src = "./goldapple.png";

placeFood();
setInterval(gameLoop, 300 - speedIncrease); //* Geschwindigkeit anpassen
document.addEventListener("keydown", keyDown); //* steuerung
draw();

function draw() {
  //* spiel zeichnen
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.height, canvas.width);
  context.fillStyle = "white";

  snake.forEach((part) => add(part.x, part.y)); //* die schlange läuft jetzt


  if (food) {
    //* food zeichnen
    if (food.type === "red" || food.type === "green") {
      context.drawImage(
        food.type === "red" ? redApple : greenApple,
        food.x * cellWidth,
        food.y * cellHeight,
        cellWidth,
        cellHeight
      );
    } else if (food.type === "golden") {
      context.drawImage(
        goldenApple,
        food.x * cellWidth,
        food.y * cellHeight,
        cellWidth,
        cellHeight
      );
    }
  }

  //* Punktestand anzeigen
  document.getElementById("score").innerText = "Score: " + score;

  requestAnimationFrame(draw); //* fortsetzen des spiels
}

function testGameOver() {
  //* ende des spiels, wenn....
  let firstPart = snake[0]; //* stelle null der schlange
  let otherParts = snake.slice(1); //* schlange ohne stelle null
  let duplicatePart = otherParts.find(
    //* ermitteln wann die x und y koordinaten von first demselben wert von other entsprechen
    (part) => part.x == firstPart.x && part.y == firstPart.y
  );
  //*1. Schlange läuft gegen die Wand
  if (
    snake[0].x < 0 || //* entweder ist x kleiner als 0
    snake[0].x > cols - 1 || //* oder x ist größer als 19 entweder links raus oder rechts raus (spalten)
    snake[0].y < 0 || //* entweder ist y kleiner als 0
    snake[0].y > rows - 1 || //* oder y ist größer als 19 entweder oben oder unten raus (zeilen)
    duplicatePart //* neustart
  ) {
    //* 2. Schlange beißt sich selbst => wenn 1 teil der schlange den koordinaten den anderen teilen der schlange entspricht
    placeFood(); //* auch hier spawned neues food
    snake = [
      //* neustart
      {
        x: 19,
        y: 3,
      },
    ];
    direction = "LEFT";
    score = 0; //* Punkte zurücksetzen
    speedIncrease = 0; //*  Geschwindigkeit zurücksetzen
  }
}

function placeFood() {
  //* food random erscheinen lassen
  let randomX = Math.floor(Math.random() * cols);
  let randomY = Math.floor(Math.random() * rows); //* zufällige zahl * 20, abrunden, ergebnis wird zugewiesen

  let randomFood = Math.random();
  if (randomFood < 0.1) {
    //* 10% Chance für gold. Apfel
    food = { x: randomX, y: randomY, type: "golden" };
  } else {
    food = {
      x: randomX,
      y: randomY,
      type: Math.random() < 0.5 ? "red" : "green",
    }; //* 50% Chance für rot oder grün Apfel
  }

  // food = { x: randomX, y: randomY }; //* x ist jetzt zufälliges x usw mit y = erscheint jetzt immer zufällig
}

function add(x, y) {
  context.fillRect(
    //* gesamte Höhe und Breite eines Vierecks
    x * cellWidth,
    y * cellHeight,
    cellWidth - 1,
    cellHeight - 1
  );
}

function shiftSnake() {
  //* bewegung der Schlange updaten - beginnend vom obersten, deshalb i-- und i= snake.length
  for (let i = snake.length - 1; i > 0; i--) {
    //* der nullte teile der schlange läuft von links nach links
    const part = snake[i]; //* 2. stück
    const lastPart = snake[i - 1]; //* 1. stück
    part.x = lastPart.x; //*  wert vom 1 zum 2 wert für x
    part.y = lastPart.y; //* wert vom 1 zum 2 wert für y
  }
}

function gameLoop() {
  //* spielberechnung
  testGameOver();
  if (foodCollected) {
    //* schlange soll beim einsammeln, wachsen
    snake = [
      {
        x: snake[0].x,
        y: snake[0].y,
      },
      ...snake,
    ];

    if (food.type === "golden") {
      score += 10; //* 10p für gold
      speedIncrease += 1; //* speed um 1 ms erhöhen
    } else {
      score += 5; //* 5p für normale äpfel
    }
    foodCollected = false; //* damit sie nicht pro schritt nach dem ersten einsammeln weiter wächst
    placeFood();
  }
  shiftSnake(); //* schlange updaten

  if (direction == "LEFT") {
    //* geht sie nach links, 1 abziehen
    snake[0].x--;
  }
  if (direction == "RIGHT") {
    //* geht sie nach rechts, 1 drauf
    snake[0].x++;
  }
  if (direction == "UP") {
    snake[0].y--;
  }
  if (direction == "DOWN") {
    snake[0].y++;
  }

  if (snake[0].x == food.x && snake[0].y == food.y) {
    //* food wird eingesammelt, das 0.Teil wird in die gewählte Richtung verschoben
    foodCollected = true; //* wenn food eingesammelt
    // placeFood(); //* dann spawned ein neues
  }
}

function keyDown(e) {
  if (e.keyCode == 37) {
    direction = "LEFT";
  }
  if (e.keyCode == 38) {
    direction = "UP";
  }
  if (e.keyCode == 39) {
    direction = "RIGHT";
  }
  if (e.keyCode == 40) {
    direction = "DOWN";
  }
}
