# Mensajes Masivos

Aplicación web para enviar mensajes masivos a muchos números telefonicos por Whatsapp para el area de Recursos Humanos. Esta aplicación va a automatizar una tarea repetitiva y tediosa de Recursos Humanos a la hora de enviar mensajes al personal o futuro personal que va a ingresar.

## Pasos en la Aplicación

<img src="/assets/Pasos.png" alt="Pasos de la aplicación">

La aplicación tiene 3 pasos para seguir. El primer paso es escanear el código QR para poder desbloquear el paso de Automatización y Estadisticas. El paso de Automatización tiene dos inputs, uno es para colocar los números de telefonos y el otro el mensaje a enviar. Luego en el paso de Estadisticas esta la cantidad de mensajes dividido por:

- Todos los mensajes 
- Ultimos 30 días
- Ultimos 7 días

## Estructura del proyecto

Este proyecto consta de 3 carpetas:

- Bot: Aca se encuentra la lógica de la generación del QR para loguearse en Whatsapp y tambien se puede saber mediante un endpoint si ya un celular escaneo el QR y esta logueado.
- Client: Parte visual de la aplicación web hecha con React, Vite y Tailwind.
- Server: APIs para registrarse, loguearse, crear la base de datos con el script SQL, enviar y recibir datos para estadisticas en el cliente.

Las herramientas y la estructura general del proyecto es:

<img src="/assets/Estructura.png" alt="Estructura General del Proyecto" style="height: 400px;">

## Instalación local

1. Tener instalado [Node.js](https://nodejs.org/en), [Visual Studio Code](https://code.visualstudio.com/), [Visual Studio Community](https://visualstudio.microsoft.com/es/) con .NET y por ultimo [XAMPP](https://www.apachefriends.org/es/index.html).

2. Ejecutar XAMPP e iniciar el servicio de Apache y MySQL para la base de datos con phpMyAdmin. Despues tendran que introducir el archivo "initial.sql" de la carpeta "server" en el phpMyAdmin para crear la base de datos, tablas y columnas necesarios.

3. Ejecutar el archivo "Auth.sln" en la carpeta "server" para iniciar la API, esta API ofrece endpoints para el login y estadisticas en la aplicación.

4. Ubicarse en la carpeta "client" con la terminal y ejecutar:

~~~
npm install
~~~

Despues de instalar todas las librerias ejecutar: 

~~~
npm run dev  
~~~

Esto abrirá "http://localhost:9191/" para que entremos a nuestra página web.

5. Por ultimo tendran que ubicarse en la carpeta "bot" con la terminal y ejecutar:

~~~
npm install
~~~

Despues ejecutar:

~~~
npm run dev  
~~~

