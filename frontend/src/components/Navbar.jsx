import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import './Navbar.css'; // Estilos personalizados

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/">ConectArte</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* No autenticado */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register-user">Registro Usuario</Link>
                </li>
              </>
            )}

            {/* Usuario vendedor */}
            {user?.tipo_usuario === "vendedor" && (
              <>
              <li className="nav-item">
                  <Link className="nav-link" to="/mistiendas">Mis Tiendas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register-seller">Registrar Tienda</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/movimientos">Movimientos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/panelSeller">Ver Productos</Link>
                </li>
              </>
            )}

            {/* Usuario normal */}
            {user?.tipo_usuario === "usuario" && (
              <li className="nav-item">
                <Link className="nav-link" to="/panelUser">Ver Productos</Link>
              </li>
            )}

            {/* Mostrar "Perfil" si NO es admin */}
            {user && user.email !== "andres@admin.com" && (
              <li className="nav-item">
                <Link className="nav-link" to="/perfil">Perfil</Link>
              </li>
            )}

            {/* Usuario administrador */}
            {user && user.email === "andres@admin.com" && (
              <li className="nav-item">
                <Link className="nav-link" to="/panelAdmin">Editar</Link>
              </li>
            )}

            {/* Todos los logueados pueden cerrar sesión */}
            {user && (
              <li className="nav-item d-flex align-items-center">
                <button className="btn btn-outline-warning ms-3" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
