import React, { useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { PencilFill, TrashFill, Plus } from "react-bootstrap-icons";
import ModalFormularioProducto from "./ModalFormularioProducto";

const ModalProductos = ({ show, onHide, productos, nombreTienda, idTienda, refrescarProductos }) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const handleAbrirFormulario = (producto) => {
    setModoEdicion(!!producto);
    setProductoSeleccionado(producto);
    setShowFormModal(true);
  };

  const handleGuardarProducto = async (nuevoProducto) => {
    try {

      const id = idTienda._id

      nuevoProducto.id_artesano = id; // Asegurarse de que el producto tenga la referencia a la tienda

      console.log("Nuevo producto a guardar:", nuevoProducto);

      // 1. Guardar producto en la colección
      const response = await fetch("https://conecarte-8olx.onrender.com/productos/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoProducto)
      });

      const productoCreado = await response.json();

      

      // 2. Asociar el producto a la tienda
      await fetch(`https://conecarte-8olx.onrender.com/vendedores/vendedores/agregar-producto/`+id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_producto: productoCreado._id
        })
      });

      // 3. Actualizar lista de productos
      refrescarProductos();

    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };
  const handleBorrar = async (producto) => {
    try {
      const response = await fetch(`https://conecarte-8olx.onrender.com/productos/productos/${producto._id}/${idTienda._id}`, {
        method: "DELETE"
      });

      const data = await response.json();
      console.log("Producto eliminado:", data);

      refrescarProductos();

      // Aquí podrías actualizar el estado para que desaparezca de la vista
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Productos de {nombreTienda}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered hover responsive className="text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay productos registrados para esta tienda.</td>
                </tr>
              ) : (
                productos.map((producto, index) => (
                  <tr key={producto._id || index}>
                    <td>{index + 1}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>${parseFloat(producto.precio).toFixed(2)}</td>
                    <td>{producto.cantidad}</td>
                    <td>{producto.ubicacion}</td>
                    <td>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAbrirFormulario(producto)}
                      >
                        <PencilFill />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleBorrar(producto)}>
                        <TrashFill />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Button
          variant="primary"
          className="rounded-circle position-absolute"
          style={{
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            padding: '0',
          }}
          onClick={() => handleAbrirFormulario()}
        >
          <Plus size={24} />
        </Button>
      </Modal>

      <ModalFormularioProducto
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        refrescarProductos={refrescarProductos}
        onGuardar={handleGuardarProducto}
        producto={productoSeleccionado}
        modoEdicion={modoEdicion}
        idTienda={idTienda}
      />
    </>
  );
};

export default ModalProductos;
