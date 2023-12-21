import { useState } from "react";
import { AiOutlineQrcode } from "react-icons/ai";
import { MdOutlineAutoFixHigh, MdOutlineAutoGraph } from "react-icons/md";
import EstadoWhatsapp from "./EstadoWhatsapp";
import Automatizacion from "./Automatizacion";
import Estadisticas from "./Estadisticas";

function Options() {
  const [isLogged, setIsLogged] = useState(true);

  return (
    <>
      <div className="">
        <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <EstadoWhatsapp setIsLogged={setIsLogged} isLogged={isLogged}/>
            <Automatizacion isLogged={isLogged}/>
            <Estadisticas/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Options;
