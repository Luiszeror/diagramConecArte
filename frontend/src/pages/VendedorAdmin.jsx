import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import './FormAdmin.css';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function VendedorAdmin() {

  const [vendedores, setVendedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [vendedorEditando, setVendedorEditando] = useState(null);
  const [usuariosVendedores, setUsuariosVendedores] = useState([]);


  const obtenerTiendas = async () => {
    try {
      const response = await fetch("https://conecarte-8olx.onrender.com/vendedores/vendedores");
      const data = await response.json();
      setVendedores(data);
    } catch (err) {
      console.error("Error al obtener vendedores:", err);
    }
  };

  const obtenerVendedores = async () => {
    try {
      const response = await fetch("https://conecarte-8olx.onrender.com/usuarios/usuarios/");
      const data = await response.json();

      const vendedores = data.filter((u) => u.tipo_usuario === "vendedor");
      setUsuariosVendedores(vendedores);
    } catch (err) {
      console.error("Error al obtener vendedores:", err);
    }
  };

  useEffect(() => {
      obtenerTiendas();
      obtenerVendedores();
  }, []);

  const abrirModalNuevo = () => {
    setVendedorEditando({
      nombre_tienda: '',
      descripcion_tienda: '',
      categorias: [],
      experiencia: 0,
      redes_sociales: [],
      productos: [],
      fecha_registro: new Date().toISOString().split('T')[0],
      id_usuario: '',
    });
    setShowModal(true);
  };

  const abrirModalEdicion = (vendedor) => {
    setVendedorEditando({ ...vendedor });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendedorEditando((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    const esNuevo = !vendedores.some(v => v._id === vendedorEditando._id);

    try {
      const url = `https://conecarte-8olx.onrender.com/vendedores/vendedores${esNuevo ? '' : `/${vendedorEditando._id}`}`;
      const metodo = esNuevo ? "POST" : "PUT";

      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendedorEditando),
      });


      if (!response.ok) {
        throw new Error(`Error al ${esNuevo ? 'crear' : 'actualizar'} el usuario`);
      }

      await obtenerTiendas();
      setShowModal(false);
      setVendedorEditando(null);

    } catch (error) {
      console.error("Error al guardar el vendedor:", error);
    }
  };

  const eliminarVendedor = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este vendedor?')) {
      try {
        const response = await fetch(`https://conecarte-8olx.onrender.com/vendedores/vendedores/${id}`, {
          method: "DELETE"
        });

        const data = await response.json();
        console.log("Vendedor eliminado:", data);

        // Aquí podrías actualizar el estado para que desaparezca de la vista
      } catch (error) {
        console.error("Error al eliminar el vendedor:", error);
      }
      setVendedores((prev) => prev.filter((u) => u._id !== id));
    }
  };

  return (
    <div className="admin-overlay">
      <div className="container admin-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="admin-title">Gestión de Tiendas</h2>
          <Button variant="success" onClick={abrirModalNuevo}>
            + Agregar Vendedor
          </Button>
        </div>

        <Table className="admin-table" striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>Nombre Tienda</th>
              <th>Descripción</th>
              <th>Categorías</th>
              <th>Redes Sociales</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((v) => (
              <tr key={v._id}>
                <td>{v.nombre_tienda}</td>
                <td>{v.descripcion_tienda}</td>
                <td>{v.categorias.join(', ')}</td>
                <td>{v.redes_sociales.join(', ')}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => abrirModalEdicion(v)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => eliminarVendedor(v._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {vendedorEditando?.nombre_tienda ? 'Editar Vendedor' : 'Agregar Vendedor'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre Tienda</Form.Label>
              <Form.Control
                name="nombre_tienda"
                value={vendedorEditando?.nombre_tienda || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                name="descripcion_tienda"
                value={vendedorEditando?.descripcion_tienda || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Categorías (separadas por coma)</Form.Label>
              <Form.Control
                name="categorias"
                value={vendedorEditando?.categorias?.join(', ') || ''}
                onChange={(e) =>
                  setVendedorEditando((prev) => ({
                    ...prev,
                    categorias: e.target.value.split(',').map((c) => c.trim()),
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Experiencia (años)</Form.Label>
              <Form.Control
                type="number"
                name="experiencia"
                value={vendedorEditando?.experiencia || 0}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Redes Sociales (separadas por coma)</Form.Label>
              <Form.Control
                name="redes_sociales"
                value={vendedorEditando?.redes_sociales?.join(', ') || ''}
                onChange={(e) =>
                  setVendedorEditando((prev) => ({
                    ...prev,
                    redes_sociales: e.target.value.split(',').map((r) => r.trim()),
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha de Registro</Form.Label>
              <Form.Control
                type="date"
                name="fecha_registro"
                value={vendedorEditando?.fecha_registro || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Seleccionar Usuario Vendedor</Form.Label>
              <Form.Select
                name="id_usuario"
                value={vendedorEditando?.id_usuario || ''}
                onChange={handleChange}
              >
                <option value="">Selecciona un vendedor...</option>
                {usuariosVendedores.map((usuario) => (
                  <option key={usuario._id} value={usuario._id}>
                    {usuario.nombre} ({usuario.correo})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Botón flotante de inicio */}
            <Link to="/panelAdmin" className="btn-home-float" title="Volver al inicio">
              <FaHome size={24} />
            </Link>
    </div>
  );
}

export default VendedorAdmin;
