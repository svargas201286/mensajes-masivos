import express from "express";
import { Client, LocalAuth } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import LeadExternal from "../../domain/lead-external.repository";
import qrCodeTerminal from "qrcode-terminal";

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

    // Crear una instancia de Express
    this.app = express();

    console.log("Iniciando....");

    this.initialize();

    this.on("ready", () => {
      this.status = true;
      console.log("LOGIN_SUCCESS");
    });

    this.on("auth_failure", () => {
      this.status = false;
      console.log("LOGIN_FAIL");
    });

    this.on("qr", (qr) => {
      console.log("Escanea el código QR que está en la carpeta tmp");
      this.generateImageAndPrintToConsole(qr);
    });

    // Configurar un endpoint para mostrar el QR
    this.setupEndpoint();
  }

  private setupEndpoint() {
    this.app.get("/qr", (req, res) => {
      // Leer el archivo QR desde el sistema de archivos
      const path = `${process.cwd()}/tmp/qr.svg`;
      res.sendFile(path);
    });

    // Iniciar el servidor Express en el puerto 3000 (o el puerto que desees)
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

    // Imprimir el QR en la consola usando qrcode-terminal
    qrCodeTerminal.generate(base64, { small: true });

    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡`);
    console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR ⚡`);
    console.log(`⚡ Puedes ver el QR en: http://localhost:3000/qr ⚡`);
  };
}

export default WsTransporter;
