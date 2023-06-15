const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Ingrese un dato: ', (dato) => {
  console.log('El dato ingresado es: ' + dato);
  rl.close();
});