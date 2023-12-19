import { useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9292/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: formData.email,
          contraseña: formData.password,
        }),
      });

      if (response.ok) {
        localStorage.setItem('permisos', JSON.stringify({ tienePermisos: true }));
        window.location.reload();
      } else {
        // Si la solicitud no fue exitosa, mostrar un mensaje de error
        setLoginError("Credenciales incorrectas. Por favor, revisa tus datos.");
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      setLoginError(
        "Se produjo un error al intentar iniciar sesión. Por favor, inténtalo nuevamente."
      );
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex justify-center h-screen">
          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <div className="flex justify-center mx-auto">
                  <img
                    className="w-auto h-7 sm:h-8"
                    src="limpiolux-icon.svg"
                    alt="Logo Grupo Limpiolux"
                  />
                </div>

                <p className="mt-3 text-gray-500 dark:text-gray-300">
                  Entrá en tu cuenta
                </p>
              </div>

              <div className="mt-8">
                <form onSubmit={handleLogin}>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Direccíon de Mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@limpiolux.com.ar"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-600 dark:text-gray-200">
                        Contraseña
                      </label>
                      <a
                        href="#"
                        className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
                      >
                        ¿Contraseña olvidada?
                      </a>
                    </div>

                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Escribe tu contraseña"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <button type="submit" className="w-full flex items-center justify-center px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                      <AiOutlineLogin style={{ marginRight: "5px" }} />
                      Entrar
                    </button>
                  </div>
                </form>

                <p className="mt-6 text-sm text-center text-gray-400">
                  ¿Todavía no tienes cuenta?{" "}
                  <a
                    href="#"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline"
                  >
                    Envíanos un mensaje
                  </a>
                  .
                </p>
                {loginError && (
                  <p className="mt-4 text-sm text-center text-red-500">
                    {loginError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
