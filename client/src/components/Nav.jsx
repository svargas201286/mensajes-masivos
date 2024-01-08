import React, { useState, useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuItem, NavbarMenu, NavbarMenuToggle} from "@nextui-org/react";
import { AiOutlineLogout } from "react-icons/ai";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const initialPermissions = JSON.parse(localStorage.getItem('permisos')) || { tienePermisos: true };
  const [tienePermisos, setTienePermisos] = useState(initialPermissions.tienePermisos);

  // Actualiza el localStorage cuando cambia el estado
  useEffect(() => {
    localStorage.setItem('permisos', JSON.stringify({ tienePermisos }));
  }, [tienePermisos]);

  const handleLogout = () => {
    // Eliminar los valores de las variables
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    // Establecer tienePermisos en false
    setTienePermisos(false);

    // Redirigir a la página "/"
    window.location.href = "/";
  };

  const menuItems = [
    "Inicio",
  ];


  return (
    <>
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
    <NavbarContent>
    <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      <NavbarBrand>
        <a href="/home">
        <img src="/limpiolux-icon.svg"  width={100}/>
        </a>
      </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Inicio
          </Link>
        </NavbarItem>
      </NavbarContent>      
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} onClick={handleLogout} color="danger" href="#" variant="flat">
            <AiOutlineLogout/>

            Salir
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
          <NavbarMenuItem key="1">
            <Link
              color="primary"
              className="w-full"
              href="/home"
              size="lg"
            >
              Inicio
            </Link>
          </NavbarMenuItem>
      </NavbarMenu>
      
    </Navbar>    
    </>
  );
}

export default Nav;
