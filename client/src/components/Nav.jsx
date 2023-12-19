import React, { useState, useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuItem, NavbarMenu, NavbarMenuToggle} from "@nextui-org/react";
import { AiOutlineLogout } from "react-icons/ai";

function Nav() {
  // Lee el estado inicial desde localStorage o establece el valor predeterminado como true
  const initialPermissions = JSON.parse(localStorage.getItem('permisos')) || { tienePermisos: true };
  const [tienePermisos, setTienePermisos] = useState(initialPermissions.tienePermisos);

  // Actualiza el localStorage cuando cambia el estado
  useEffect(() => {
    localStorage.setItem('permisos', JSON.stringify({ tienePermisos }));
  }, [tienePermisos]);

  const handleLogout = () => {
    setTienePermisos(false);
    // Redirigir a la página "/"
    window.location.href = "/";
  };


  return (
    <>
    <Navbar isBordered>

      <NavbarBrand>
        <a href="/home">
        <img src="/limpiolux-icon.svg"  width={100}/>
        </a>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} onClick={handleLogout} color="danger" href="#" variant="flat">
            <AiOutlineLogout/>

            Salir
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>    </>
  );
}

export default Nav;
