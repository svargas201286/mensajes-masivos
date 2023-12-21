import express from "express";
import { Client, LocalAuth } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import LeadExternal from "../../domain/lead-external.repository";
import qrCodeTerminal from "qrcode-terminal";
import cors from "cors";

class WsTransporter extends Client implements LeadExternal {
  private status = false;
  private app: express.Application;

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

    this.app = express();
    this.app.use(cors());

    console.log("Iniciando....");

    this.initializeWsTransporter();

    this.on("ready", () => {
      this.status = true;
      console.log("LOGIN_SUCCESS");
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

      // Adding a delay before re-initialization
      await new Promise((resolve) => setTimeout(resolve, 5000));

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
      res.json({ status: this.status });
    });

    this.app.listen(3000, () => {
      console.log("Servidor Express iniciado en http://localhost:3000");
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
    console.log(`⚡ Puedes ver el QR en: http://localhost:3000/qr ⚡`);
    console.log(`⚡ Estado de inicio de sesión en: http://localhost:3000/login ⚡`);
  };
}

export default WsTransporter;
