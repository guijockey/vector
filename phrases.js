const phrases = [
  "El rápido zorro marrón salta sobre el perro perezoso.",
  "La inteligencia artificial transformará el mundo.",
  "¿Cómo se programan los algoritmos de aprendizaje profundo?",
  "La seguridad cibernética es crucial en la era digital.",
  "Vector autentica usuarios mediante dinámicas de tipeo."
];

function getRandomPhrase() {
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index];
}
