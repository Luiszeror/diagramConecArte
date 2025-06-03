import React from 'react';
import './PanelAdmin.css';
import fondo from '../assets/pendiente5.webp';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function PanelAdmin() {
  return (
    <div className="admin-container" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="overlay d-flex justify-content-center align-items-center">
        <div className="container bg-dark bg-opacity-75 p-5 rounded text-white">
          <h1 className="text-center mb-4">Bienvenido, Administrador</h1>
          <p className="text-center mb-5">Administra el sistema desde este panel</p>

          <div className="d-flex flex-column align-items-center gap-4 mb-4">
            <Link to="/admin-usuarios" className="w-100" style={{ maxWidth: 400 }}>
              <Button variant="primary" className="w-100">Usuarios</Button>
            </Link>
            <Link to="/admin-vendedores" className="w-100" style={{ maxWidth: 400 }}>
              <Button variant="warning" className="w-100 text-dark">Tiendas</Button>
            </Link>
            <Link to="/admin-productos" className="w-100" style={{ maxWidth: 400 }}>
              <Button variant="success" className="w-100">Productos</Button>
            </Link>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default PanelAdmin;
