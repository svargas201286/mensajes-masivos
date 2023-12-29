const { exec } = require("child_process");
const axios = require("axios");

const appUrl = "http://localhost:3050/login"; // Cambia esto según la URL de tu aplicación

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
  exec("npm run dev", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al reiniciar la aplicación: ${error.message}`);
    } else {
      console.log(`Aplicación reiniciada: ${stdout}`);
    }
  });
};

const monitorApp = async () => {
  const isAppRunning = await checkAppStatus();

  if (!isAppRunning) {
    restartApp();
  }

  // Verificar el estado cada 1 minuto (ajusta según sea necesario)
  setTimeout(monitorApp, 6000);
};

monitorApp();
