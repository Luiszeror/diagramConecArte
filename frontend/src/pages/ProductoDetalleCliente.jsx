import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './ProductoDetalle.css';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reseñas, setReseñas] = useState([]);
  const [nuevaReseña, setNuevaReseña] = useState({ calificacion: 0, comentario: '' });
  const [actualizarReseñas, setActualizarReseñas] = useState(false);

  const id_usuario = localStorage.getItem('id_usuario');

  useEffect(() => {
    fetch(`https://conecarte-8olx.onrender.com/productos/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error(err));

    fetch(`https://conecarte-8olx.onrender.com/resenas/resenas/producto/${id}`)
      .then(res => res.json())
      .then(data => setReseñas(data))
      .catch(err => console.error(err));
  }, [id, actualizarReseñas]);

  const añadirAlCarrito = async () => {
    if (!id_usuario) {
      setMensaje('Debes iniciar sesión para añadir productos al carrito.');
      return;
    }

    try {
      const res = await fetch('https://conecarte-8olx.onrender.com/carritos/carritos/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario,
          id_producto: id,
          cantidad: parseInt(cantidad)
        })
      });

      const data = await res.json();
      setMensaje(res.ok ? 'Producto añadido al carrito' : data.mensaje || 'Error al añadir al carrito');
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      setMensaje('Error de red');
    }
  };

  const enviarReseña = async () => {
    if (!id_usuario) {
      setMensaje("Debes iniciar sesión para comentar.");
      return;
    }

    try {
      const res = await fetch("https://conecarte-8olx.onrender.com/resenas/resenas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario,
          id_producto: id,
          calificacion: nuevaReseña.calificacion,
          comentario: nuevaReseña.comentario
        })
      });

      const data = await res.json();

      if (res.ok) {
        setReseñas(prev => [...prev, {
          ...nuevaReseña,
          id_usuario,
          fecha: new Date().toISOString().split("T")[0]
        }]);
        setNuevaReseña({ calificacion: 0, comentario: "" });
        setMensaje("¡Reseña enviada con éxito!");
        setActualizarReseñas(prev => !prev);
      } else {
        setMensaje(data.mensaje || "Error al enviar la reseña.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error de red al enviar la reseña.");
    }
  };

  if (!producto) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="producto-detalle-fondo position-relative">
      <div className="overlay" style={{ paddingTop: '110px' }}>
        <div className="producto-detalle-layout">
          <div className="producto-detalle-info card shadow-lg p-4 bg-light">
            <div className="card-body">
              <h2 className="card-title text-primary mb-3">{producto.nombre}</h2>
              <p className="card-text">{producto.descripcion}</p>
              <p><strong>Ubicación:</strong> {producto.ubicacion}</p>
              <p><strong>Disponibles:</strong> {producto.cantidad} unidades</p>

              <div className="mb-3 d-flex flex-column align-items-center">
                <label className="form-label"><strong>Cantidad:</strong></label>
                <input
                  type="number"
                  min="1"
                  max={producto.cantidad}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="form-control cantidad-input"
                  style={{ maxWidth: '120px' }}
                />
              </div>

              <h4 className="text-success"><strong>Precio:</strong> ${producto.precio}</h4>

              <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3">
                <button className="btn btn-primary" onClick={añadirAlCarrito}>
                  Añadir al Carrito
                </button>

                <button className="btn btn-outline-dark" onClick={() => setMostrarModal(true)}>
                  Ver Reseñas
                </button>

                <button
                  className="btn btn-secondary d-flex align-items-center"
                  onClick={() => navigate('/perfil')}
                  title="Ir al perfil"
                >
                  <FaUserCircle size={20} className="me-1" />
                  Perfil
                </button>
              </div>

              {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Reseñas */}
      {mostrarModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reseñas del producto</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                {reseñas.map((r, index) => (
                  <div key={index} className="border-bottom pb-2 mb-2">
                    <p><strong>{r.nombre_usuario || "Usuario"}</strong> - {r.fecha}</p>
                    <p>{'⭐'.repeat(r.calificacion)} ({r.calificacion}/5)</p>
                    <p>{r.comentario}</p>
                  </div>
                ))}

                <h5 className="mt-4">Agregar Reseña</h5>
                <div className="form-group mt-2">
                  <label>Calificación (1 a 5):</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="form-control"
                    value={nuevaReseña.calificacion}
                    onChange={(e) =>
                      setNuevaReseña(prev => ({
                        ...prev,
                        calificacion: parseInt(e.target.value)
                      }))
                    }
                  />
                </div>
                <div className="form-group mt-2">
                  <label>Comentario:</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={nuevaReseña.comentario}
                    onChange={(e) =>
                      setNuevaReseña(prev => ({
                        ...prev,
                        comentario: e.target.value
                      }))
                    }
                  />
                </div>
                <button className="btn btn-success mt-2" onClick={enviarReseña}>
                  Enviar Reseña
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
