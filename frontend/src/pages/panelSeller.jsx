import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './PanelSeller.css';
import ModalBuzon from '../components/ModalBuzon'; // nuevo import

function PanelSeller() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showBuzon, setShowBuzon] = useState(false); // stado del modal
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

  const navigate = useNavigate();

  const id_usuario = localStorage.getItem("id_usuario");

  useEffect(() => {
    const obtenerTiendas = async () => {
      try {
        const response = await fetch('https://conecarte-8olx.onrender.com/vendedores/vendedores/tiendas/' + id_usuario);
        const data = await response.json();

        console.log("Respuesta del backend:", data);

        if (Array.isArray(data)) {
          for (const tienda of data) {

            try {
              let response = await fetch(`https://conecarte-8olx.onrender.com/vendedores/vendedores/productos/${tienda._id}`);
              let productos = await response.json();

              let dataProductos = [];

              for (const id of productos.productos) {
                try {
                  const response = await fetch(`https://conecarte-8olx.onrender.com/productos/productos/${id}`);
                  const productoData = await response.json();
                  dataProductos.push(productoData);
                } catch (error) {
                  console.error('Error al obtener el producto:', error);
                }
              }

              setProductos(dataProductos);
              setCargando(false);
            } catch (error) {
              console.error('Error al obtener los productos de la tienda:', error);
              setCargando(false);
            }
          }
        } else {
          setProductos([]); // o puedes mostrar un mensaje "sin tiendas"
          console.warn("La respuesta no fue un arreglo:", data);
        }
      } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        setProductos([]); // previene que sea undefined en caso de error
      }
    };

    obtenerTiendas();
  
  });

  if (cargando) return <p className="text-center mt-5 text-white">Cargando productos...</p>;
  if (error) return <p className="text-danger text-center mt-5">Error: {error}</p>;

  return (
    <div className="panel-seller-overlay">
      <div className="container mt-5">
        <h1 className="text-white text-center mb-4">Bienvenido Vendedor</h1>
        <div className="grid-container">
          {productos.map((producto) => (
            <Link to={`/producto/${producto._id}`} key={producto._id} className="card-link">
              <div className="card">
                <img src={producto.image?.url} alt={producto.nombre} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text precio-rojo">${producto.precio}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <button className="btn btn-primary buzon-btn" onClick={() => setShowBuzon(true)}>Buzón</button>

      {/* Modal Buzón */}
          <ModalBuzon
            show={showBuzon}
            onHide={() => setShowBuzon(false)}
            conversaciones={conversaciones}
          />    </div>
  );
}

export default PanelSeller;
