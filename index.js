let solvedNumbers = {}

let currentMode;
let currentLength = 4;
let currentNumber = 0;
let numbersShown = false;
let numberCounter = 0;

function setup() {
  manageSessionStorage();
  changeMode(undefined, true);
}

function changeMode(mode = "bindec", init) {
  if (currentMode != mode) {
    currentMode = mode;
    nextNumber();
    showNumbers(false, init);
  }
  if (!init) {
    getHTML("mode-decbin").classList.toggle("mode-button-active");
    getHTML("mode-bindec").classList.toggle("mode-button-active");
  }
}

function changeNumberLength() {
  slider = getHTML("number-length");
  currentLength = slider.value;
  perc = Math.round(((slider.value-4)/(slider.max-4))*100);
  slider.style.background = `linear-gradient(to right, mediumseagreen ${perc}%, rgb(168, 255, 209) ${perc}%, rgb(168, 255, 209) 100%)`;
  getHTML("number-length-counter").innerHTML = currentLength;
  nextNumber();
}

function toBinary(num) {
  return num.toString(2).padStart(currentLength, "0");
}

function nextNumber() {
  getHTML("number-input").value = "";
  currentNumber = (currentNumber + 1 + Math.floor(Math.random() * ((2 ** currentLength) - 1))) % (2 ** currentLength);
  getHTML("number-chosen").innerHTML = currentMode == "decbin" ? currentNumber : toBinary(currentNumber);
}

function checkNumber() {
  let userNumber = getHTML("number-input").value;
  console.log(userNumber);
  let isCorrect = (currentMode == "decbin") ? userNumber == toBinary(currentNumber) : Number(userNumber) == currentNumber;
  if (isCorrect) {
    solvedNumbers[currentMode].push((currentMode == "decbin") ? toBinary(currentNumber) : currentNumber);
    numberCounter++;
    getHTML("number-counter").innerHTML = numberCounter;
    nextNumber();
    showNumbers(numbersShown);
    manageSessionStorage(true);
  }
  setInputStyle(isCorrect);
}

function showNumbers(show, init) {
  numbersShown = show ?? !numbersShown;
  getHTML("words-solved").style.display = numbersShown ? "block" : "none";
  getHTML("solved-decbin").innerHTML = solvedNumbers["decbin"].length ? solvedNumbers["decbin"].join("<br>") : "Zatím nic";
  getHTML("solved-bindec").innerHTML = solvedNumbers["bindec"].length ? solvedNumbers["bindec"].join("<br>") : "Zatím nic";
  if (!init) {
    if (numbersShown) getHTML("number-history").classList.add("list-button-active")
    else getHTML("number-history").classList.remove("list-button-active")
  }
}

function setInputStyle(isCorrect) {
  let inp = getHTML("number-input");
  let cStyle = isCorrect ? "correct-word" : "incorrect-word";
  inp.classList.toggle(cStyle);
  if (isCorrect) inp.placeholder = "Správně!";
  setTimeout(_ => {
    inp.classList.toggle(cStyle);
    inp.placeholder = "Tvoje řešení";
  }, 1500)
}

function manageSessionStorage(save) {
  if (save) {
    sessionStorage.setItem("solvedNumbers", JSON.stringify(solvedNumbers));
  }
  else {
    solvedNumbers = JSON.parse(sessionStorage.getItem("solvedNumbers")) ?? {decbin: [], bindec: []};
    numberCounter = solvedNumbers.decbin.length + solvedNumbers.bindec.length;
    setTimeout(_ => {
      getHTML("number-counter").innerHTML = numberCounter;
    });
  }
}

function getHTML(id) {
  return document.getElementById(id);
}