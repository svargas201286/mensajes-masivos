import { useState } from "react";
import Nav from "../components/Nav";
import { FaPeopleGroup } from "react-icons/fa6";
import { GoLaw } from "react-icons/go";
import { Link } from "@nextui-org/react";
import { MdOutlineSecurity } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { GrConfigure } from "react-icons/gr";
import { FiInbox } from "react-icons/fi";

function Home() {
  return (
    <>
      <Nav />
            {/*
                    <section class="bg-white dark:bg-gray-900">
                    <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-48">
                      <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                        <div>
                          <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <FaPeopleGroup style={{ color: "#0075A9" }} />
                          </div>
                          <h3 class="mb-2 text-xl font-bold dark:text-white">
                            Mensajes Masivos
                          </h3>
                          <p class="text-gray-500 dark:text-gray-400 text-justify">
                            Envia mensajes másivos a vario números a la vez con tan solo un
                            mensaje con administración y paneles sencillos. Bot creado para
                            el area de RRHH.
                          </p>
                          <Link style={{ marginTop: "7px" }} href="/mensajesmasivos">
                            Ir a seccion
                          </Link>
                        </div>
                        <div>
                          <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <GoLaw style={{ color: "#0075A9" }} />
                          </div>
                          <h3 class="mb-2 text-xl font-bold dark:text-white">Legales</h3>
                          <p class="text-gray-500 dark:text-gray-400 text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                            aliquet aliquet urna, et consequat nisl pharetra a. Vestibulum
                            vel laoreet erat.
                          </p>
                          <Link
                            style={{ marginTop: "7px" }}
                            href="/mensajesmasivos"
                            isDisabled
                          >
                            Ir a seccion
                          </Link>
                        </div>
                        <div>
                          <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <MdOutlineSecurity style={{ color: "#0075A9" }} />
                          </div>
                          <h3 class="mb-2 text-xl font-bold dark:text-white">
                            Seguridad e Higiene
                          </h3>
                          <p class="text-gray-500 dark:text-gray-400 text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                            aliquet aliquet urna, et consequat nisl pharetra a. Vestibulum
                            vel laoreet erat.
                          </p>
                          <Link
                            style={{ marginTop: "7px" }}
                            href="/mensajesmasivos"
                            isDisabled
                          >
                            Ir a seccion
                          </Link>
                        </div>
                        <div>
                          <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <TbMoneybag style={{ color: "#0075A9" }} />
                          </div>
                          <h3 class="mb-2 text-xl font-bold dark:text-white">Finanzas</h3>
                          <p class="text-gray-500 dark:text-gray-400 text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                            aliquet aliquet urna, et consequat nisl pharetra a. Vestibulum
                            vel laoreet erat.
                          </p>
                          <Link
                            style={{ marginTop: "7px" }}
                            href="/mensajesmasivos"
                            isDisabled
                          >
                            Ir a seccion
                          </Link>
                        </div>
                        <div>
                          <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <GrConfigure style={{ color: "#0075A9" }} />
                          </div>
                          <h3 class="mb-2 text-xl font-bold dark:text-white">
                            Operaciones
                          </h3>
                          <p class="text-gray-500 dark:text-gray-400 text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                            aliquet aliquet urna, et consequat nisl pharetra a. Vestibulum
                            vel laoreet erat.
                          </p>
                          <Link
                            style={{ marginTop: "7px" }}
                            href="/mensajesmasivos"
                            isDisabled
                          >
                            Ir a seccion
                          </Link>
                        </div>
                        <div>
                          <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <FiInbox style={{ color: "#0075A9" }} />
                          </div>
                          <h3 class="mb-2 text-xl font-bold dark:text-white">
                            Dist Master
                          </h3>
                          <p class="text-gray-500 dark:text-gray-400 text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                            aliquet aliquet urna, et consequat nisl pharetra a. Vestibulum
                            vel laoreet erat.
                          </p>
                          <Link
                            style={{ marginTop: "7px" }}
                            href="/mensajesmasivos"
                            isDisabled
                          >
                            Ir a seccion
                          </Link>
                        </div>                
                      </div>
                    </div>
                  </section>
            */}
    </>
  );
}

export default Home;
