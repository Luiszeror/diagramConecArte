// components/ModalBuzon.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Form } from 'react-bootstrap';

const ModalBuzon = ({ show, onHide, conversaciones = [] }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [mensajesPorUsuario, setMensajesPorUsuario] = useState([]);

  useEffect(() => {
    setMensajesPorUsuario(conversaciones);
  }, [conversaciones]);

  const abrirChat = (usuario) => {
    setSelectedUser(usuario);
  };

  const enviarMensaje = () => {
    if (newMessage.trim() !== '') {
      const actualizado = mensajesPorUsuario.map((conv) =>
        conv.user === selectedUser.user
          ? { ...conv, mensajes: [...conv.mensajes, { emisor: true, texto: newMessage }] }
          : conv
      );
      setMensajesPorUsuario(actualizado);
      setNewMessage('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Mis Conversaciones</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white d-flex" style={{ minHeight: '300px' }}>
        <div className="w-25 border-end pe-2">
          <ListGroup variant="flush">
            {mensajesPorUsuario.map((conv, i) => (
              <ListGroup.Item
                key={i}
                onClick={() => abrirChat(conv)}
                className="bg-secondary text-white mb-2 rounded"
                style={{ cursor: 'pointer' }}
              >
                {conv.user}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <div className="w-75 ps-3 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '300px' }}>
            {selectedUser ? (
              selectedUser.mensajes.map((msg, i) => (
                <div
                  key={i}
                  className={`d-flex ${msg.emisor ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                >
                  <div
                    className={`p-2 rounded ${
                      msg.emisor ? 'bg-primary text-white' : 'bg-light text-dark'
                    }`}
                    style={{ maxWidth: '75%' }}
                  >
                    {msg.texto}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Selecciona una conversación.</p>
            )}
          </div>

          {selectedUser && (
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="success" className="ms-2" onClick={enviarMensaje}>
                Enviar
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalBuzon;
