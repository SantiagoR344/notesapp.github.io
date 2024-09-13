import React, { useState } from 'react';

function Register({ setIsRegistering, setShowLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        setMessage('Registro exitoso, redirigiendo a la página de inicio de sesión...');
        setTimeout(() => {
          setIsRegistering(false); // Regresar a la pantalla de inicio de sesión
          setShowLogin(true); // Mostrar el formulario de inicio de sesión
        }, 2000); // Redirigir después de 2 segundos
      } else {
        setMessage('Error en el registro');
      }
    } catch (error) {
      setMessage('Error en el registro');
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      <form onSubmit={handleRegister}>
        <label className="block mb-2">Usuario</label>
        <input
          type="text"
          className="w-full p-2 mb-4 text-black rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="block mb-2">Correo</label>
        <input
          type="email"
          className="w-full p-2 mb-4 text-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block mb-2">Contraseña</label>
        <input
          type="password"
          className="w-full p-2 mb-4 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded text-white font-bold"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;









