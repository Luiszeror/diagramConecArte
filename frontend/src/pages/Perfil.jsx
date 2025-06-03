import React, { useState, useEffect } from 'react';
import './Perfil.css';
import { FaUserCircle, FaEdit, FaSave } from 'react-icons/fa';
import ModalBuzon from '../components/ModalBuzon';
import 'bootstrap/dist/css/bootstrap.min.css';

function Perfil() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const id_usuario = localStorage.getItem('id_usuario');

  useEffect(() => {
    if (id_usuario) {
      fetch(`https://conecarte-8olx.onrender.com/usuarios/usuarios/${id_usuario}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setFormData(data); // copiamos para editar sin afectar `user`
        })
        .catch(err => console.error('Error al obtener usuario:', err));
    }
  }, [id_usuario]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`https://conecarte-8olx.onrender.com/usuarios/usuarios/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error('Error al actualizar usuario');
      }
    } catch (err) {
      console.error('Error en el guardado:', err);
    }
  };

  if (!user) {
    return (
      <div className="overlay">
        <h3 className="text-white">No has iniciado sesión.</h3>
      </div>
    );
  }

  return (
    <div className="perfil-container" style={{ paddingTop: '120px' }}>
      
        <div className="card perfil-card shadow-lg mx-auto" >
          <div className="card-body text-center" >
            <FaUserCircle size={100} className="text-secondary mb-4" />
            <h4 className="text-white">Perfil de Usuario</h4>
            <button
              className="btn btn-outline-light btn-sm float-end"
              onClick={() => setIsEditing(!isEditing)}
              title="Editar Perfil"
            >
              <FaEdit /> Editar
            </button>
            <hr className="bg-light" />

            <div className="row text-white text-start mt-4 px-3">
              <div className="col-md-6 mb-3">
                <p><strong>Nombre:</strong> {
                  isEditing
                    ? <input name="nombre" value={formData.nombre} onChange={handleChange} />
                    : user.nombre
                }</p>

                <p><strong>Apellido:</strong> {
                  isEditing
                    ? <input name="apellido" value={formData.apellido} onChange={handleChange} />
                    : user.apellido
                }</p>

                <p><strong>Correo:</strong> {user.correo}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Tipo de Usuario:</strong> {user.tipo_usuario}</p>

                <p><strong>Fecha de Nacimiento:</strong> {
                  isEditing
                    ? <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
                    : user.fecha_nacimiento
                }</p>
              </div>

              <div className="col-md-6 mb-3">
                <p><strong>Departamento:</strong> {
                  isEditing
                    ? <input name="departamento" value={formData.departamento} onChange={handleChange} />
                    : user.departamento
                }</p>

                <p><strong>Ciudad:</strong> {
                  isEditing
                    ? <input name="ciudad" value={formData.ciudad} onChange={handleChange} />
                    : user.ciudad
                }</p>

                <p><strong>Dirección:</strong> {
                  isEditing
                    ? <input name="direccion" value={formData.direccion} onChange={handleChange} />
                    : user.direccion
                }</p>

                <p><strong>Género:</strong> {
                  isEditing
                    ? <select name="genero" value={formData.genero} onChange={handleChange}>
                        <option value="">Selecciona</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    : user.genero
                }</p>

                <p><strong>Tipo de Documento:</strong> {user.tipo_documento}</p>
                <p><strong>Documento:</strong> {user.documento}</p>

                <p><strong>Celular:</strong> {
                  isEditing
                    ? <input name="celular" value={formData.celular} onChange={handleChange} />
                    : user.celular
                }</p>
              </div>
            </div>

            {isEditing && (
              <button className="btn btn-success mt-3" onClick={handleSave}>
                <FaSave /> Guardar Cambios
              </button>
            )}
          </div>
        
      </div>

      <button
        className="btn btn-warning buzon-float-button"
        onClick={() => setShowChat(true)}
        title="Ver Conversaciones"
      >
        💬
      </button>

      <ModalBuzon
        show={showChat}
        onHide={() => setShowChat(false)}
        conversaciones={[
          {
            user: 'usuario123',
            mensajes: [
              { emisor: true, texto: 'Hola, ¿cómo estás?' },
              { emisor: false, texto: 'Bien, gracias. ¿Y tú?' },
              { emisor: true, texto: 'Muy bien, gracias.' }
            ]
          }
        ]}
      />
    </div>
  );
}

export default Perfil;
