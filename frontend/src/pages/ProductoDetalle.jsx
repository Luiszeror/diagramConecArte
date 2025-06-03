import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './ProductoDetalle.css';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [reseñas, setReseñas] = useState([]);

  const [nuevaReseña, setNuevaReseña] = useState({
    calificacion: 0,
    comentario: ""
  });

  const id_usuario = localStorage.getItem("id_usuario");

  useEffect(() => {
    fetch(`https://conecarte-8olx.onrender.com/productos/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error(err));

      fetch(`https://conecarte-8olx.onrender.com/resenas/resenas/producto/${id}`)
    .then(res => res.json())
    .then(data => setReseñas(data))
    .catch(err => console.error(err));
  }, [id]);

  const añadirAlCarrito = async () => {
    if (!id_usuario) {
      setMensaje("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    try {
      const res = await fetch("https://conecarte-8olx.onrender.com/carritos/carritos/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario,
          id_producto: id,
          cantidad: parseInt(cantidad)
        })
      });

      const data = await res.json();
      setMensaje(res.ok ? "Producto añadido al carrito" : (data.mensaje || "Error al añadir al carrito"));

    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      setMensaje("Error de red");
    }
  };


  if (!producto) return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="producto-detalle-fondo">
      <div className="overlay" style={{ paddingTop: '110px' }}>
        <div className="producto-detalle-layout">

          {/* Info del producto */}
          <div className="producto-detalle-info card shadow-lg p-4 bg-light">
            <div className="card-body">
              <h2 className="card-title text-primary mb-3">{producto.nombre}</h2>
              <p className="card-text">{producto.descripcion}</p>
              <p><strong>Ubicación:</strong> {producto.ubicacion}</p>
              <p><strong>Disponibles:</strong> {producto.cantidad} unidades</p>

              <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label className="form-label"><strong>Cantidad:</strong></label>
                <input
                  type="number"
                  min="1"
                  max={producto.cantidad}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="form-control cantidad-input"
                  style={{ maxWidth: "120px" }}
                />
              </div>

              <h4 className="text-success"><strong>Precio:</strong> ${producto.precio}</h4>


              <button className="btn btn-outline-dark mt-3 ms-2" onClick={() => setMostrarModal(true)}>
                Ver Reseñas
              </button>

              {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
            </div>
          </div>

          <button
            className="btn btn-secondary perfil-float-button"
            onClick={() => navigate("/perfil")}
            title="Ir al perfil"
          >
            <FaUserCircle size={24} />
          </button>
        </div>
      </div>

      {/* MODAL DE RESEÑAS */}
      {mostrarModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reseñas del producto</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                {reseñas.map((r, index) => (
                  <div key={index} className="border-bottom pb-2 mb-2">
                    <p><strong>{r.nombre_usuario}</strong> - {r.fecha}</p>
                    <p>{"⭐".repeat(r.calificacion)} ({r.calificacion}/5)</p>
                    <p>{r.comentario}</p>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
