let currentPhrase = "";
let keyTimings = [];
let keyDownTimestamps = {};

const targetPhraseElement = document.getElementById("target-phrase");
const inputArea = document.getElementById("input-area");
const nextPhraseButton = document.getElementById("next-phrase");
const dataOutput = document.getElementById("data-output");

function initialize() {
  currentPhrase = getRandomPhrase();
  targetPhraseElement.textContent = currentPhrase;
  inputArea.value = "";
  keyTimings = [];
  keyDownTimestamps = {};
  dataOutput.textContent = "";
}

inputArea.addEventListener("keydown", (event) => {
  const key = event.key;
  const timestamp = performance.now();
  keyDownTimestamps[key] = timestamp;
});

inputArea.addEventListener("keyup", (event) => {
  const key = event.key;
  const timestamp = performance.now();
  const downTimestamp = keyDownTimestamps[key];
  if (downTimestamp) {
    const duration = timestamp - downTimestamp;
    keyTimings.push({
      key: key,
      down: downTimestamp,
      up: timestamp,
      duration: duration
    });
    delete keyDownTimestamps[key];
  }
});

nextPhraseButton.addEventListener("click", () => {
  const inputText = inputArea.value;
  if (inputText === currentPhrase) {
    const vectorData = processKeyTimings(keyTimings);
    displayData(vectorData);
    saveData(vectorData);
    initialize();
  } else {
    alert("La frase escrita no coincide. Por favor, inténtalo de nuevo.");
  }
});

function processKeyTimings(timings) {
  const vectors = [];
  for (let i = 1; i < timings.length; i++) {
    const prev = timings[i - 1];
    const current = timings[i];
    const interval = current.down - prev.up;
    vectors.push({
      from: prev.key,
      to: current.key,
      interval: interval
    });
  }
  return vectors;
}

function displayData(data) {
  dataOutput.textContent = JSON.stringify(data, null, 2);
}

function saveData(data) {
  const existingData = JSON.parse(localStorage.getItem("vectorData")) || [];
  existingData.push(data);
  localStorage.setItem("vectorData", JSON.stringify(existingData));
}
