import React, { useEffect, useState } from "react";
import WompiPago from "../components/WompiPago";
import "./panelUser.css"; // reutilizando estilos

function CarritoUsuario() {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const id_usuario = localStorage.getItem("id_usuario");

  const eliminarProducto = async (id_producto) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto del carrito?");
    if (!confirmar) return;

    try {
      const response = await fetch(`https://conecarte-8olx.onrender.com/carritos/carritos/${id_usuario}/${id_producto}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("No se pudo eliminar el producto");

      const res = await fetch(`https://conecarte-8olx.onrender.com/carritos/carritos/usuario/${id_usuario}`);
      if (!res.ok) throw new Error("No se pudo obtener el carrito actualizado");

      const data = await res.json();
      setCarrito(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!id_usuario) {
      setError("Usuario no autenticado");
      setCargando(false);
      return;
    }

    fetch(`https://conecarte-8olx.onrender.com/carritos/carritos/usuario/${id_usuario}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener el carrito");
        return res.json();
      })
      .then((data) => {
        setCarrito(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id_usuario]);

  if (cargando) return <p className="text-center mt-5">Cargando carrito...</p>;
  if (error) return <p className="text-danger text-center mt-5">Error: {error}</p>;
  if (!carrito) return <p className="text-center mt-5">No hay carrito disponible.</p>;

  return (
    <div className="panel-user-fondo">
      <div className="overlay">
        <div className="container">
          <h2 className="titulo-carrito text-center mb-4">Carrito de Compras</h2>
          <div className="grid-container">
            {Array.isArray(carrito.productosCom) && Array.isArray(carrito.productos) && carrito.productosCom.map((producto) => {
              const detalle = carrito.productos.find(p => p.id_producto === producto._id);
              return (
                <div className="card position-relative" key={producto._id}>
                  <button
                    className="btn btn-danger position-absolute top-0 end-0 m-2"
                    onClick={() => eliminarProducto(producto._id)}
                    title="Eliminar"
                  >
                    ×
                  </button>
                  <img src={producto.imagen} alt={producto.nombre} />
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">{producto.descripcion}</p>
                    <p><strong>Cantidad:</strong> {detalle?.cantidad ?? "?"}</p>
                    <p className="precio-rojo">Precio: ${producto.precio}</p>
                  </div>
                </div>
              );
            })}

          </div>

          <h3 className="total-carrito text-end mt-4">Total: ${carrito.total}</h3>
          <div className="d-flex justify-content-center mt-4">
            <WompiPago pasarelaDePago={{ total: carrito.total }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarritoUsuario;
