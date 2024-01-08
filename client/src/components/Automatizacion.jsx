import { useState } from "react";
import React from "react";
import { MdOutlineAutoFixHigh } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import { TbClick } from "react-icons/tb";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { GrSend } from "react-icons/gr";
import { IoAdd } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";

function Automatizacion({ setIsLogged, isLogged, phoneNumber, setPhoneNumber }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [formData, setFormData] = useState({
    phone: "",
    message: "",
  });
  const [additionalNumbers, setAdditionalNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleAddNumber = () => {
    if (formData.phone.trim() !== "") {
      setAdditionalNumbers((prevNumbers) => [...prevNumbers, formData.phone]);
      setFormData({ ...formData, phone: "" });
    }
  };

  const handleSendRequest = async (phone) => {
    try {
      const formattedData = {
        phone: `549${phone}`,
        message: formData.message,
      };

      setIsLoading(true);

      const response = await fetch("http://localhost:7132/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        console.log(`Información para ${phone} enviada con éxito`);
      } else {
        console.error(
          `Error al enviar la información para ${phone} al servidor`
        );
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [sendingProgress, setSendingProgress] = useState({
    totalRequests: 0,
    currentRequest: 0,
    timeRemaining: 0,
    sending: false,
  });

  const handleSendRequests = async () => {
    // Obtén los números directamente del textarea dividido por líneas
    const numbersFromTextarea = formData.phone
      .split('\n')
      .filter((line) => line.trim() !== '');
  
    setSendingProgress((prevProgress) => ({
      ...prevProgress,
      totalRequests: numbersFromTextarea.length,
      currentRequest: 0,
      sending: true,
    }));
  
    // Almacena los números formateados para el mensaje final
    const formattedNumbers = numbersFromTextarea.map((number) => `549${number}`);
  
    for (const number of numbersFromTextarea) {
      setSendingProgress((prevProgress) => ({
        ...prevProgress,
        currentRequest: prevProgress.currentRequest + 1,
      }));
  
      await handleSendRequest(number);
  
      // Espera 8 segundos antes de la siguiente solicitud
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  
    setSendingProgress((prevProgress) => ({
      ...prevProgress,
      sending: false,
    }));
  
    // Hacer la última petición con la información consolidada
    try {
      const userId = localStorage.getItem("userId");
      const finalMessage = {
        IdUser: Number(userId),
        Numeros: formattedNumbers.join(","),
        ContenidoMensaje: formData.message,
        NumeroEmisor: phoneNumber,  // Agrega el número del emisor al objeto finalMessage
      };
  
      const finalResponse = await fetch("http://localhost:7129/enviar-mensaje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalMessage),
      });
  
      if (finalResponse.ok) {
        console.log("Mensaje final enviado con éxito");
      } else {
        console.error("Error al enviar el mensaje final");
      }
    } catch (error) {
      console.error("Error en la solicitud final:", error);
    }
  };
  
  
  const handleDeleteNumber = (index) => {
    setAdditionalNumbers((prevNumbers) =>
      prevNumbers.filter((_, i) => i !== index)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNumber();
    }
  };
  return (
    <>
      <div className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-blue-600 dark:border-gray-800 dark:bg-gray-800 dark:shadow-none border-blue-400 md:p-7 xl:p-10">
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
          mensaje de forma masiva, el lapso de tiempo del mensaje a cada número
          es de 5 sec.
        </p>

        <Button
          onPress={onOpen}
          style={{
            marginTop: "20px",
            backgroundColor: "#0075A9",
            color: "#ffffff",
          }}
        >
          <TbClick /> Abrir
        </Button>
      </div>

      <Modal
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Automatización de Mensajes
              </ModalHeader>
              <ModalBody>
                {isLogged ? (
                  <>
                    <div>
                      <label
                        for="numero"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Número telefonico (Agregar código de area. Por ejemplo:
                        11)
                      </label>
                      <div>
                      <textarea
        id="phone"
        rows="4"
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ingresa los números de teléfono, uno por línea..."
        value={formData.phone}
        onChange={handleChange}
      ></textarea>

                      </div>

                      <label
                        htmlFor="message"
                        className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Mensaje
                      </label>
                      <textarea
                        id="message"
                        rows="4"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Escribe el mensaje para enviar a los números..."
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>

                      {additionalNumbers.length > 0 && (
                        <div>
                          <label
                            htmlFor="message"
                            className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Lista de números
                          </label>{" "}
                          <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                            {additionalNumbers.map((number, index) => (
                              <li key={index}>
                                {number}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNumber(index)}
                                  className="ml-2"
                                >
                                  <Button
                                    onClick={() => handleDeleteNumber(index)}
                                    style={{ marginLeft: "-5px" }}
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    color="danger"
                                  >
                                    <MdDeleteForever />
                                  </Button>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>{" "}
                  </>
                ) : (
                  <>
                    <Chip
                      startContent={<AiFillCloseCircle size={18} />}
                      variant="faded"
                      color="warning"
                      className="ml-4"
                    >
                      No logueado
                    </Chip>
                    <div className="ml-4">
                      Por favor, ir a la sección de{" "}
                      <strong>Estado Whatsapp </strong>y escanear el código QR
                      para enviar mensajes.
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                {isLogged ? (
                  <>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cerrar
                    </Button>
                    <Button
  style={{ backgroundColor: "#0075A9", color: "#ffffff" }}
  onClick={handleSendRequests}
  disabled={isLoading || sendingProgress.sending}
  isLoading={sendingProgress.sending}
  
>
  {sendingProgress.sending ? (
       <div style={{ display: "flex", alignItems: "center" }}>

       Enviando mensajes ({sendingProgress.currentRequest}/
       {sendingProgress.totalRequests})

     </div>  ) : (
    <>
      <GrSend />
      Enviar mensajes
    </>
  )}
</Button>
                  </>
                ) : (
                  <>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cerrar
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Automatizacion;
