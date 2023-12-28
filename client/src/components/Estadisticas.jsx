import { useState, useEffect } from "react";
import { MdOutlineAutoGraph } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { TbClick } from "react-icons/tb";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { BarList, Bold, Card, Flex, Text, Title } from "@tremor/react";

function Estadisticas({ setIsLogged, isLogged }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async (rangoDias) => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`https://localhost:7129/obtener-mensajes?rangoDias=${rangoDias}`);
        if (response.ok) {
          const mensajes = await response.json();
          const totalMensajes = mensajes
            .filter((mensaje) => mensaje.idUser === Number(userId))
            .reduce((acc, mensaje) => acc + mensaje.totalDeMensajes, 0);

          return { name: `Ultimos ${rangoDias} días`, value: totalMensajes };
        } else {
          console.error("Error al obtener mensajes");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    const fetchAllData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch("https://localhost:7129/obtener-mensajes");
        if (response.ok) {
          const mensajes = await response.json();
          const totalMensajes = mensajes
            .filter((mensaje) => mensaje.idUser === Number(userId))
            .reduce((acc, mensaje) => acc + mensaje.totalDeMensajes, 0);

          return { name: "Todos", value: totalMensajes };
        } else {
          console.error("Error al obtener mensajes");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    Promise.all([fetchAllData(), fetchData(30), fetchData(7)]).then((results) => {
      setData(results);
    });
  }, []);


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
          <MdOutlineAutoGraph style={{ fontSize: "45px" }} />
        </svg>
        <h4 className="mb-2 text-lg font-bold">3. Estadísticas</h4>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          Ya una vez enviado los mensajes de forma masiva se puede ver en esta
          sección de "Estadísticas" para exportalos y hacer un informe posteriormente.
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
        </Button>        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                Estadísticas
                </ModalHeader>
                <ModalBody>
                  {isLogged ? (
                    <>
<Card className="max-w-lg">
    <Title>Tus mensajes enviados</Title>
    <Flex className="mt-4">
      <Text>
        <Bold>Tiempo</Bold>
      </Text>
      <Text>
        <Bold>Mensajes</Bold>
      </Text>
    </Flex>
    <BarList data={data} className="mt-2" />
  </Card>                    </>
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
                    </div>                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default Estadisticas;
