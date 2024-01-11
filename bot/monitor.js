const { exec } = require("child_process");
const axios = require("axios");

const appUrl = "https://whatsapp.limpiolux.com:7131/login"; // Cambia esto según la URL de tu aplicación

const checkAppStatus = async () => {
  try {
    const response = await axios.get(appUrl);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const restartApp = () => {
  console.log("La aplicación no responde. Reiniciando...");

  const child = exec("npm run dev");

  // Redirigir la salida estándar y de error al proceso actual
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  // Manejar eventos de cierre y error del proceso secundario
  child.on("close", (code) => {
    console.log(`Aplicación cerrada con código de salida ${code}`);
  });

  child.on("error", (error) => {
    console.error(`Error al reiniciar la aplicación: ${error.message}`);
  });
};

const monitorApp = async () => {
  const isAppRunning = await checkAppStatus();

  if (!isAppRunning) {
    restartApp();
  }

  // Verificar el estado cada 1 minuto (ajusta según sea necesario)
  setTimeout(monitorApp, 60000);
};

monitorApp();
