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
const progresoBarra = document.getElementById("barra-progreso");
const progresoTexto = document.getElementById("porcentaje-progreso");
const seguridadTexto = document.getElementById("nivel-seguridad");
const terminarBtn = document.getElementById("terminar-entrenamiento");

const muestrasRecomendadas = 30;

function getMuestrasGuardadas() {
  const datos = JSON.parse(localStorage.getItem("vectorData")) || [];
  return datos;
}

function calcularVariabilidad(datos) {
  const intervalos = datos.flatMap(muestra => muestra.map(p => p.interval));
  const media = intervalos.reduce((a, b) => a + b, 0) / intervalos.length;
  const variabilidad = intervalos.reduce((sum, i) => sum + Math.abs(i - media), 0) / intervalos.length;
  return Math.min(100, Math.floor(variabilidad)); // escala simplificada
}

function actualizarIndicadores() {
  const datos = getMuestrasGuardadas();
  const total = datos.length;
  const progreso = Math.min(100, Math.floor((total / muestrasRecomendadas) * 100));
  progresoBarra.value = progreso;
  progresoTexto.textContent = `${progreso}%`;

  const variabilidad = calcularVariabilidad(datos);
  const seguridad = Math.max(0, Math.min(100, progreso - variabilidad));
  seguridadTexto.textContent = `${seguridad}%`;

  return seguridad;
}

terminarBtn.addEventListener("click", () => {
  const seguridad = actualizarIndicadores();
  const confirmado = confirm(`Vas a finalizar el entrenamiento con un nivel de seguridad estimado del ${seguridad}%. ¿Deseas continuar?`);
  if (confirmado) {
    alert("Entrenamiento finalizado. Tu perfil ha sido guardado.");
    // Aquí luego podrás enviar los datos al servidor o continuar al login
    localStorage.setItem("vectorFinalizado", "true");
  }
});

nextPhraseButton.addEventListener("click", () => {
  const inputText = inputArea.value;
  if (inputText === currentPhrase) {
    const vectorData = processKeyTimings(keyTimings);
    displayData(vectorData);
    saveData(vectorData);
    initialize();
    actualizarIndicadores();
  } else {
    alert("La frase escrita no coincide. Por favor, inténtalo de nuevo.");
  }
});

nivelSeguridad = min(100, Math.floor(100 * muestras / muestrasRecomendadas) - variabilidadMedia);

// Al cargar
initialize();
actualizarIndicadores();
