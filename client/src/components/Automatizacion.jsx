import { useState } from 'react'
import { MdOutlineAutoFixHigh } from "react-icons/md";
function Automatizacion() {
  return (
    <>
      <div className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-blue-600 dark:border-gray-800 dark:bg-gray-800 dark:shadow-none border-blue-400 md:p-7 xl:p-10" >
              <svg
                className="hi-outline hi-rectangle-stack mb-5 inline-block h-12 w-12 text-limpiolux-600 dark:text-limpiolux-500"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <MdOutlineAutoFixHigh style={{ fontSize: "45px" }} />
              </svg>
              <h4 className="mb-2 text-lg font-bold">
                2. Automatización de Mensajes
              </h4>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                El Automatizador de Mensajes permite enviar a ciertos números un
                mensaje de forma masiva, el lapso de tiempo del mensaje a cada
                número es de 15 sec.
              </p>
            </div>
    </>
  )
}

export default Automatizacion;