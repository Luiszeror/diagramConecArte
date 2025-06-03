import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import './FormAdmin.css';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function UsuariosAdmin() {

  const [usuarios, setUsuarios] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [usuarioEditado, setUsuarioEditado] = useState(null);

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch("https://conecarte-8olx.onrender.com/usuarios/usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []); // ← Ejecutar solo al montar el componente

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditado({ ...usuario });
    setShowEditModal(true);
  };
  const abrirModalNuevo = () => {
    setUsuarioEditado({
      nombre: '',
      apellido: '',
      correo: '',
      contraseña: '',
      tipo_usuario: 'usuario',
      username: '',
      fecha_nacimiento: '',
      departamento: '',
      ciudad: '',
      direccion: '',
      genero: '',
      tipo_documento: '',
      documento: '',
      celular: '',
      fecha_creacion: new Date().toISOString().split('T')[0],
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const guardarCambios = async () => {
    const esNuevo = !usuarios.some(u => u._id === usuarioEditado._id);

    try {
      const url = `https://conecarte-8olx.onrender.com/usuarios/usuarios${esNuevo ? '' : `/${usuarioEditado._id}`}`;
      const metodo = esNuevo ? "POST" : "PUT";

      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioEditado),
      });


      if (!response.ok) {
        throw new Error(`Error al ${esNuevo ? 'crear' : 'actualizar'} el usuario`);
      }

      await obtenerUsuarios();
      setShowEditModal(false);
      setUsuarioEditado(null);

    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const response = await fetch(`https://conecarte-8olx.onrender.com/usuarios/usuarios/${id}`, {
          method: "DELETE"
        });

        const data = await response.json();
        console.log("Usuario eliminado:", data);

        // Aquí podrías actualizar el estado para que desaparezca de la vista
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    }
  };

  return (
    <div className="admin-overlay">
      <div className="container admin-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="admin-title">Gestión de Usuarios</h2>
          <Button variant="success" onClick={abrirModalNuevo}>+ Agregar Usuario</Button>
        </div>

        <Table className="admin-table" striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Username</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.correo}</td>
                <td>{u.username}</td>
                <td>{u.tipo_usuario}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => abrirModalEdicion(u)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => eliminarUsuario(u._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{usuarioEditado?.nombre ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[
              ['nombre', 'Nombre'],
              ['apellido', 'Apellido'],
              ['correo', 'Correo'],
              ['contraseña', 'Contraseña'],
              ['username', 'Username'],
              ['fecha_nacimiento', 'Fecha de Nacimiento', 'date'],
              ['departamento', 'Departamento'],
              ['ciudad', 'Ciudad'],
              ['direccion', 'Dirección'],
              ['genero', 'Género'],
              ['tipo_documento', 'Tipo de Documento'],
              ['documento', 'Número de Documento'],
              ['celular', 'Celular'],
              ['fecha_creacion', 'Fecha de Creación', 'date'],
            ].map(([name, label, type = 'text']) => (
              <Form.Group key={name} className="mb-2">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  name={name}
                  value={usuarioEditado?.[name] || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-2">
              <Form.Label>Tipo de Usuario</Form.Label>
              <Form.Control
                as="select"
                name="tipo_usuario"
                value={usuarioEditado?.tipo_usuario}
                onChange={handleInputChange}
              >
                <option value="usuario">Usuario</option>
                <option value="vendedor">Vendedor</option>
                <option value="administrador">Administrador</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarCambios}>Guardar</Button>
        </Modal.Footer>
      </Modal>
      {/* Botón flotante de inicio */}
      <Link to="/panelAdmin" className="btn-home-float" title="Volver al inicio">
        <FaHome size={24} />
      </Link>
    </div>
  );
}

export default UsuariosAdmin;
