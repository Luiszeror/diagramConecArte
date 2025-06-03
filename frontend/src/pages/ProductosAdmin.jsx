import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import './FormAdmin.css';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vendedores, setVendedores] = useState([]);
  const [imagen, setImagenPreview] = useState(null);

  const handleImagenChange = async (e) => {

    setImagenPreview(e.target.files[0]);

  };


  const obtenerTiendas = async () => {
    try {
      const response = await fetch("https://conecarte-8olx.onrender.com/vendedores/vendedores");
      const data = await response.json();
      setVendedores(data);
    } catch (err) {
      console.error("Error al obtener vendedores:", err);
    }
  };

  const obtenerProductos = async () => {
    try {
      const response = await fetch("https://conecarte-8olx.onrender.com/productos/productos");
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerTiendas();
  }, []);

  const abrirModal = (producto = null) => {
    if (producto) {
      setProductoSeleccionado({ ...producto });
    } else {
      setProductoSeleccionado({
        id_artesano: '',
        nombre: '',
        descripcion: '',
        precio: 0,
        cantidad: 0,
        ubicacion: '',
        fecha_creacion: new Date().toISOString().split('T')[0],
        id_categoria: ''
      });
    }
    setShowModal(true);
  };

  const handleGuardar = async () => {
    try {
      let imageData = productoSeleccionado.image;

      // Si hay una nueva imagen y una imagen anterior, eliminar la anterior
      if (imagen && productoSeleccionado?.image?.id) {
        await fetch(`https://conecarte-ciq4.onrender.com/imagenes/${productoSeleccionado.image.id}`, {
          method: "DELETE"
        });
      }

      // Subir nueva imagen si hay
      if (imagen) {
        const data = new FormData();
        data.append("image", imagen);
        data.append("id_artesano", productoSeleccionado.id_artesano);

        const res = await fetch(`https://conecarte-ciq4.onrender.com/imagenes/${productoSeleccionado.id_artesano}`, {
          method: "POST",
          body: data
        });

        const json = await res.json();
        imageData = json?.data;
      }

      const esNuevo = !productoSeleccionado._id;
      const url = `https://conecarte-8olx.onrender.com/productos/productos${esNuevo ? '' : `/${productoSeleccionado._id}`}`;
      const metodo = esNuevo ? "POST" : "PUT";

      const productoFinal = {
        ...productoSeleccionado,
        fecha_creacion: new Date(),
        image: imageData
      };

      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoFinal),
      });

      if (!response.ok) {
        throw new Error(`Error al ${esNuevo ? 'crear' : 'actualizar'} el producto`);
      }

      const productoGuardado = await response.json();

      if (esNuevo && productoSeleccionado.id_artesano) {
        await fetch(`https://conecarte-8olx.onrender.com/vendedores/vendedores/agregar-producto/${productoSeleccionado.id_artesano}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id_producto: productoGuardado._id
          })
        });
      }

      await obtenerProductos();
      setShowModal(false);
      setProductoSeleccionado(null);
      setImagenPreview(null);

    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };



  const handleEliminar = async (producto) => {
    if (window.confirm("¿Deseas eliminar este producto?")) {
      try {
        // 1. Eliminar producto de la colección general
        const response = await fetch(`https://conecarte-8olx.onrender.com/productos/productos/${producto._id}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }

        // 2. Quitar la referencia del producto en la tienda
        await fetch(`https://conecarte-8olx.onrender.com/vendedores/vendedores/eliminar-producto/${producto.id_artesano}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id_producto: producto._id
          })
        });

        await obtenerProductos();

      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoSeleccionado((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "cantidad" ? parseInt(value) : value
    }));
  };

  const esNuevoProducto = productoSeleccionado && !productoSeleccionado._id;


  const mapaVendedores = useMemo(() => {
    const map = {};
    vendedores.forEach(v => {
      map[v._id] = v.nombre_tienda;
    });
    return map;
  }, [vendedores]);

  return (
    <div className="admin-overlay">
      <div className="container admin-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="admin-title">Gestión de Productos</h2>
          <Button variant="success" onClick={() => abrirModal()}>
            + Agregar Producto
          </Button>
        </div>
        <Table striped bordered hover responsive variant="dark" className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Ubicación</th>
              <th>Fecha Creación</th>
              <th>ID Artesano</th>
              <th>Categoría</th>
              <th>Imagen</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto._id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.ubicacion}</td>
                <td>{producto.fecha_creacion}</td>
                <td>{mapaVendedores[producto.id_artesano] || 'Desconocido'}</td>
                <td>{producto.id_categoria}</td>
                <td>
                  {producto.image?.url ? (
                    <img
                      src={producto.image.url}
                      alt={producto.nombre}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModal(producto)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleEliminar(producto)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {productoSeleccionado?.nombre ? "Editar Producto" : "Agregar Producto"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {productoSeleccionado && (
              <Form>
                <Form.Group className="mt-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={productoSeleccionado.nombre}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="descripcion"
                    value={productoSeleccionado.descripcion}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={productoSeleccionado.precio}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="cantidad"
                    value={productoSeleccionado.cantidad}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    name="ubicacion"
                    value={productoSeleccionado.ubicacion}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Fecha de Creación</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_creacion"
                    value={productoSeleccionado.fecha_creacion}
                    onChange={handleChange}
                  />
                </Form.Group>
                {esNuevoProducto && (
                  <Form.Group>
                    <Form.Label>Seleccionar Tienda</Form.Label>
                    <Form.Select
                      name="id_artesano"
                      value={productoSeleccionado.id_artesano || ''}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una tienda...</option>
                      {vendedores.map((usuario) => (
                        <option key={usuario._id} value={usuario._id}>
                          {usuario.nombre_tienda}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                <Form.Group className="mt-2">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control
                    type="text"
                    name="id_categoria"
                    value={productoSeleccionado.id_categoria}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                    <Form.Label>Imagen del Producto</Form.Label>
                    <Form.Control type="file" onChange={handleImagenChange} />
                  </Form.Group>
                  {(imagen || productoSeleccionado?.image?.url) && (
                    <div className="text-center mt-2">
                      <img
                        src={imagen || productoSeleccionado.image.url}
                        alt="Vista previa"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </div>
                  )}
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* Botón flotante de inicio */}
            <Link to="/panelAdmin" className="btn-home-float" title="Volver al inicio">
              <FaHome size={24} />
            </Link>
    </div>
  );
}

export default ProductosAdmin;
