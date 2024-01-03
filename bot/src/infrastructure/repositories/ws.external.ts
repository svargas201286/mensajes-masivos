import express from "express";
import { Client, LocalAuth } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import LeadExternal from "../../domain/lead-external.repository";
import qrCodeTerminal from "qrcode-terminal";
import cors from "cors";
import axios from "axios";

class WsTransporter extends Client implements LeadExternal {
  private status = false;
  private app: express.Application;
  private readonly appUrl = "http://localhost:3050"; // Add this line
  private senderNumber: string | null = null;  // Nueva línea para almacenar el número del emisor

  private startLogoutTimer() {
    setInterval(async () => {
      const isLogged = await this.checkAppStatus();
      if (isLogged) {
        console.log("Realizando logout automáticamente...");

        try {
          // Enviar solicitud POST a http://localhost:3050/logout
          await axios.post(`${this.appUrl}/logout`);
          await this.reinitializeWsTransporter(); // Reinciar la aplicación después del logout
          
          console.log("Logout exitoso");
        } catch (error) {
          console.error("Error durante el logout o reinicio:", error);
        }
      }
    }, 30 * 60 * 1000); // 2 minutos en milisegundos
  }

  private async checkAppStatus() {
    try {
      const response = await axios.get(`${this.appUrl}/login`); // Use this.appUrl
      return response.status === 200 && response.data.status === true;
    } catch (error) {
      return false;
    }
  }

  constructor() {
    super({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          "--disable-setuid-sandbox",
          "--unhandled-rejections=strict",
        ],
      },
    });
    this.startLogoutTimer();

    this.app = express();
    this.app.use(cors());

    console.log("Iniciando....");

    this.initializeWsTransporter();

    this.on("ready", () => {
      this.status = true;
      this.senderNumber = this.info.me.user; // Almacena el número del emisor
      console.log("LOGIN_SUCCESS");
      console.log("Número del emisor:", this.senderNumber);  // Imprime el número del emisor
    });

    this.on("auth_failure", async () => {
      this.status = false;
      console.log("LOGIN_FAIL");

      try {
        // Reiniciar la sesión en caso de autenticación fallida
        await this.reinitializeWsTransporter();
      } catch (error) {
        console.error("Error al reiniciar la sesión:", error);
      }
    });

    this.on("disconnected", async (reason) => {
      this.status = false;
      console.log(`Se ha desconectado. Razón: ${reason}`);
      console.log("Intentando reconectar...");

      try {
        // Reconectar en caso de desconexión
        await this.reinitializeWsTransporter();
      } catch (error) {
        console.error("Error al intentar reconectar:", error);
      }
    });

    this.on("qr", (qr) => {
      console.log("Escanea el código QR que está en la carpeta tmp");
      this.generateImageAndPrintToConsole(qr);
    });

    this.setupEndpoints();
  }

  private async initializeWsTransporter() {
    // Inicializar el cliente de WhatsApp
    try {
      await super.initialize();
    } catch (error) {
      console.error("Error al inicializar el cliente de WhatsApp:", error);
      throw error;
    }
  }

  private async reinitializeWsTransporter() {
    // Reiniciar el cliente de WhatsApp
    try {
      // Destruction should happen first
      await super.destroy();

      // Initialize again
      await this.initializeWsTransporter();
    } catch (error) {
      console.error("Error al reiniciar el cliente de WhatsApp:", error);

      // Check if the error is related to a closed connection
      if (
        error instanceof Error &&
        error.message.includes("Protocol error (Network.getResponseBody): Target closed.")
      ) {
        // Handle the closed connection error
        console.log("El WebSocket se cerró inesperadamente. Volviendo a intentar...");
        await this.reinitializeWsTransporter();
      } else {
        // Throw the error if it's not the specific closed connection error
        throw error;
      }
    }
  }

  private setupEndpoints() {
    this.app.get("/qr", (req, res) => {
      const path = `${process.cwd()}/tmp/qr.svg`;
      res.sendFile(path);
    });

    this.app.get("/login", (req, res) => {
      res.json({
        status: this.status,
        phoneNumber: this.senderNumber,  // Agrega el número del emisor a la respuesta
      });
    });

    this.app.post("/logout", async (req, res) => {
      await this.logout();
      console.log("Logout initiated");
    
      // Simular un Ctrl+C para reiniciar la aplicación
      process.kill(process.pid, "SIGINT");
    
      res.json({ status: "Logout initiated" });
    });

    this.app.listen(3050, () => {
      console.log("Servidor Express iniciado en http://localhost:3050");
    });
  }

  async sendMsg(lead: { message: string; phone: string }): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
      const { message, phone } = lead;
      const response = await this.sendMessage(`${phone}@c.us`, message);
      return { id: response.id.id };
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  async logout() {
    try {
      await super.logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  async destroyClient() {
    try {
      await super.destroy();
      console.log("Client destroyed");
    } catch (error) {
      console.error("Error during client destruction:", error);
    }
  }


  getStatus(): boolean {
    return this.status;
  }

  private generateImageAndPrintToConsole = (base64: string) => {
    const path = `${process.cwd()}/tmp`;
    let qr_svg = imageQr(base64, { type: "svg", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));

    qrCodeTerminal.generate(base64, { small: true });

    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡`);
    console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR ⚡`);
    console.log(`⚡ Puedes ver el QR en: http://localhost:3050/qr ⚡`);
    console.log(`⚡ Estado de inicio de sesión en: http://localhost:3050/login ⚡`);
  };
}

export default WsTransporter;
