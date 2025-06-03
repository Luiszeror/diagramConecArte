import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./panelUser.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart, FaEnvelope } from 'react-icons/fa';

import ModalBuzon from '../components/ModalBuzon';

function PanelUser() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showBuzon, setShowBuzon] = useState(false);

  const id_usuario = localStorage.getItem('id_usuario');

  const conversaciones = [
    {
      user: 'cliente_juan',
      mensajes: [
        { emisor: false, texto: 'Hola, estoy interesado en tu producto.' },
        { emisor: true, texto: '¡Perfecto! ¿Cuál te gusta?' }
      ]
    },
    {
      user: 'comprador_maria',
      mensajes: [
        { emisor: true, texto: 'Hola, ¿necesitas ayuda?' },
        { emisor: false, texto: 'Sí, ¿qué colores tienes?' }
      ]
    }
  ];

  useEffect(() => {
    fetch("https://conecarte-8olx.onrender.com/productos/productos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener productos");
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p className="text-center mt-5">Cargando productos...</p>;
  if (error) return <p className="text-danger text-center mt-5">Error: {error}</p>;

  return (
    <div className="panel-user-fondo">
      <div className="container mt-5" style={{ paddingTop: '50px' }}>
        <div className="grid-container">
          {productos.map((producto) => (
            <Link to={`/producto1/${producto._id}`} key={producto._id} className="card-link">
              <div className="card h-100">
                <img src={producto.imagen} alt={producto.nombre} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text precio-rojo">{"$" + producto.precio}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Botón flotante del carrito */}
      <button
        className="btn btn-warning carrito-flotante"
        onClick={() => navigate("/pasarela")}
        style={{ zIndex: 1050 }}
      >
        <FaShoppingCart size={24} />
      </button>

      {/* Botón del buzón */}
      <button
  className="btn btn-primary position-fixed d-flex align-items-center justify-content-center"
  style={{ bottom: '90px', right: '20px', zIndex: 1050, width: '50px', height: '50px', borderRadius: '50%' }}
  onClick={() => setShowBuzon(true)}
  title="Buzón de mensajes"
>
  <FaEnvelope size={20} />
</button>

      {/* Modal del buzón */}
      <ModalBuzon
        show={showBuzon}
        onHide={() => setShowBuzon(false)}
        conversaciones={conversaciones}
      />
    </div>
  );
}

export default PanelUser;
