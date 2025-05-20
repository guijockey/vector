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

// Al cargar
initialize();
actualizarIndicadores();