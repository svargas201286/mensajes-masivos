import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  const permisosData = JSON.parse(localStorage.getItem('permisos'));
  const tienePermisos = permisosData && permisosData.tienePermisos;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            tienePermisos ? (
              // Redirige a /home si tiene permisos
              <Navigate to="/home" replace />
            ) : (
              // Muestra el componente Login si no tiene permisos
              <Login />
            )
          }
        />
        <Route
          path="/home"
          element={
            tienePermisos ? (
              // Muestra el componente Nav si tiene permisos
              <Home />
            ) : (
              // Redirige a / si no tiene permisos
              <Navigate to="/" replace />
            )
          }
        />
        {/* Agrega más rutas privadas según sea necesario */}
      </Routes>
    </Router>
  );
};

export default App;
