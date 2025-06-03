import React, { useState } from 'react';
import './RegisterUser.css';
import registroFondo from '../assets/registro.webp';

export default function RegisterUser() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [username, setUsername] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [genero, setGenero] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [documento, setDocumento] = useState('');
  const [celular, setCelular] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('usuario');
  const fechaCreacion = new Date().toISOString();
  const [validated, setValidated] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      nombre,
      apellido,
      correo,
      contraseña,
      tipo_usuario: tipoUsuario,
      username,
      fecha_nacimiento: fechaNacimiento,
      departamento,
      ciudad,
      direccion,
      genero,
      tipo_documento: tipoDocumento,
      documento,
      celular,
      fecha_creacion: fechaCreacion,
    };

    try {
      const response = await fetch('https://conecarte-8olx.onrender.com/usuarios/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Registro exitoso');
      } else {
        const errorData = await response.json();
        if (errorData?.mensaje?.includes('El nombre de usuario ya existe')) {
          setUsernameError(true);
        } else {
          alert(errorData.mensaje || 'Error al registrar usuario');
        }
      }
    } catch (error) {
      alert('No se pudo conectar al servidor');
    }

    setValidated(true);
  };

  return (
    <div
      className="register-background"
     
    >

        <div className="form-wrapper" style={{ paddingTop: '140px' }}>
          <div className="form-container">
            <h2 className="mb-4 text-black text-center" >
              Registro Usuario
            </h2>
            <form
              onSubmit={handleSubmit}
              className={`needs-validation ${validated ? 'was-validated' : ''}`}
              noValidate
            >
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input type="text" className="form-control" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su nombre.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="text" className="form-control" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su apellido.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="email" className="form-control" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su correo electrónico.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="password" className="form-control" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su contraseña.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="text" className={`form-control ${usernameError ? 'is-invalid' : ''}`} placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value); setUsernameError(false); }} required />
                  <div className="invalid-feedback">
                    {usernameError ? 'El nombre de usuario ya está en uso' : 'Por favor ingrese su nombre de usuario.'}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="date" className="form-control" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su fecha de nacimiento.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="text" className="form-control" placeholder="Departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su departamento.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="text" className="form-control" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su ciudad.</div>
                </div>
                <div className="col-12 mb-3">
                  <input type="text" className="form-control" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su dirección.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <select className="form-select" value={genero} onChange={(e) => setGenero(e.target.value)} required>
                    <option value="">Selecciona Género</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <div className="invalid-feedback">Por favor seleccione su género.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <select className="form-select" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} required>
                    <option value="">Selecciona Tipo Documento</option>
                    <option value="T.I">T.I</option>
                    <option value="C.C">C.C</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                  <div className="invalid-feedback">Por favor seleccione su tipo de documento.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="number" className="form-control" placeholder="Documento" value={documento} onChange={(e) => setDocumento(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su número de documento.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <input type="number" className="form-control" placeholder="Celular" value={celular} onChange={(e) => setCelular(e.target.value)} required />
                  <div className="invalid-feedback">Por favor ingrese su número de celular.</div>
                </div>
                <div className="col-12 mb-4">
                  <select className="form-select" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)} required>
                    <option value="usuario">Usuario</option>
                    <option value="vendedor">Vendedor</option>
                  </select>
                  <div className="invalid-feedback">Por favor seleccione el tipo de usuario.</div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100">Registrarse</button>
            </form>
          </div>
        </div>
      </div>
    
  );
}
