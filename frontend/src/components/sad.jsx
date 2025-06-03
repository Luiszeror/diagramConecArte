import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalFormularioProducto = ({ show, onHide, onGuardar, producto, modoEdicion, refrescarProductos }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    ubicacion: "",
    id_categoria: ""
  });

  const [imagen, setImagen] = useState(null); // imagen seleccionada

  useEffect(() => {
    if (modoEdicion && producto) {
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio || "",
        cantidad: producto.cantidad || "",
        ubicacion: producto.ubicacion || "",
        id_categoria: producto.id_categoria || ""
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        cantidad: "",
        ubicacion: "",
        id_categoria: ""
      });
    }
    setImagen(null); // Reiniciar imagen al abrir modal
  }, [modoEdicion, producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const id_usuario = localStorage.getItem("id_usuario");

  const handleSubmit = async () => {
    let imageData = null;

    if (imagen) {
      try {
        const data = new FormData();
        data.append("image", imagen);
        data.append("id_artesano", producto?.id_artesano || "default-artesano"); // Modifica según tu lógica

        const res = await fetch("https://conecarte-ciq4.onrender.com/imagenes/"+id_usuario, {
          method: "POST",
          body: data
        });

        const json = await res.json();
        imageData = json;
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }

    if (!modoEdicion) {
      const nuevoProducto = {
        ...formData,
        id_artesano: producto?.id_artesano || "default-artesano",
        fecha_creacion: new Date(),
        image: imageData
      };

      onGuardar(nuevoProducto);
      onHide();
    } else {
      const id = producto._id;

      await fetch(`https://conecarte-8olx.onrender.com/productos/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id_artesano: producto.id_artesano,
          fecha_creacion: new Date(),
          image: imageData || producto.image // mantener imagen previa si no se sube una nueva
        })
      });

      refrescarProductos();
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control name="descripcion" value={formData.descripcion} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control name="precio" type="number" value={formData.precio} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control name="cantidad" type="number" value={formData.cantidad} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control name="id_categoria" value={formData.id_categoria} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {!imagen && modoEdicion && producto?.image?.url && (
              <div className="text-center mt-3">
                <p>Imagen actual:</p>
                <img
                  src={producto.image.url}
                  alt="Imagen actual"
                  style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalFormularioProducto;
