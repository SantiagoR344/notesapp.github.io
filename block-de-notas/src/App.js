import React, { useState, useEffect } from 'react';
import Navbar from '../src/components/Navbar/Navbar';
import Sidebar from '../src/components/Sidebar/Sidebar';
import NoteEditor from '../src/components/NoteEditor/NoteEditor';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import fondo from './assets/home-image.jpeg';

// Componente de la página de inicio (HomePage)
function HomePage({ setShowLogin }) {
  return (
    <div 
      className="w-full h-screen text-white" 
      style={{
        backgroundImage: `url('${fondo}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <header className="w-full py-4 bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Block de Notas</h1>
          <nav className="space-x-4">
            <a href="#features" className="hover:text-gray-400">Características</a>
            <a href="#about" className="hover:text-gray-400">Sobre Nosotros</a>
            <button 
              onClick={() => setShowLogin(true)} 
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white">
              Iniciar Sesión / Registrarse
            </button>
          </nav>
        </div>
      </header>
      <main className="text-center mt-40  bg-gray-900 bg-opacity-50 p-20 rounded-lg ">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a tu Block de Notas</h1>
        <p className="text-lg mb-4">
          Este es un simple y eficiente block de notas donde puedes almacenar, editar, y gestionar todas tus notas de forma rápida y sencilla.
        </p>
        <p className="text-lg">
          ¡Inicia sesión o regístrate para empezar a utilizar todas las funciones!
        </p>
      </main>
    </div>
  );
}

function App() {
  const [notes, setNotes] = useState([]);  // Aseguramos que notes siempre es un array
  const [authToken, setAuthToken] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // Estado para mostrar login o home
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre login y registro

  // Estado para manejar el modo edición
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Obtener las notas del backend
  useEffect(() => {
    const fetchNotes = async () => {
      if (authToken) {
        try {
          const res = await fetch('http://localhost:5000/api/notes', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          if (!res.ok) {
            throw new Error('Error al obtener las notas');
          }
          const data = await res.json();
          setNotes(data);
        } catch (error) {
          console.error('Error al obtener las notas:', error);
          setNotes([]);  
        }
      }
    };
    fetchNotes();
  }, [authToken]);

  // Función para añadir una nueva nota
  const addNote = async (title, content) => {
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,  
        },
        body: JSON.stringify({ title, content }),
      });

      const newNote = await res.json();  
      setNotes([...notes, newNote]);  
    } catch (error) {
      console.error('Error al guardar la nota:', error);
    }
  };

  // Función para eliminar una nota
  const deleteNote = async (noteId) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,  
        },
      });

      setNotes(notes.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    }
  };

  // Función para actualizar una nota
  const updateNote = async (noteId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      const updatedNote = await res.json();
      setNotes(notes.map(note => note._id === noteId ? updatedNote : note));
      setEditNoteId(null);  
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  };

  // Guardar el token en localStorage cuando se inicie sesión
  const handleLogin = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);
  };

  // Cargar el token desde localStorage cuando la página se recargue
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken'); 
  };

  return (
    <div className="App h-screen flex">
      {!authToken ? (
        <>
          {!showLogin ? (
            <HomePage setShowLogin={setShowLogin} />
          ) : (
            <div className="w-full p-8">
              {isRegistering ? (
                <>
                  <Register setIsRegistering={setIsRegistering} setShowLogin={setShowLogin} />
                </>
              ) : (
                <>
                  <Login setAuthToken={handleLogin} />
                  <p className="mt-4 text-center">
                    ¿No tienes cuenta?{' '}
                    <button 
                      className="text-blue-500" 
                      onClick={() => setIsRegistering(true)} 
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <Sidebar />
          <div className="flex-1">
            <Navbar authToken={authToken} handleLogout={handleLogout} />
            <NoteEditor addNote={addNote} />
            <div className="notes-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl p-4">
              {notes.map((note) => (
                <div key={note._id} className="note bg-white rounded-lg shadow-lg p-4">
                  {editNoteId === note._id ? (
                    <div>
                      <input 
                        type="text" 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)} 
                        className="w-full px-2 py-1 border rounded" 
                        placeholder="Editar título" 
                      />
                      <textarea 
                        value={editContent} 
                        onChange={(e) => setEditContent(e.target.value)} 
                        className="w-full px-2 py-1 border rounded mt-2" 
                        placeholder="Editar contenido" 
                      />
                      <button 
                        onClick={() => updateNote(note._id)}  
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 mr-2"
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-700">{note.title}</h3>
                      <p className="text-gray-500">{note.content}</p>
                      <span className="text-gray-400 text-sm block mt-2">{note.date}</span>

                      <button 
                        onClick={() => { 
                          setEditNoteId(note._id); 
                          setEditTitle(note.title); 
                          setEditContent(note.content); 
                        }}  
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 mr-2"
                      >
                        Editar
                      </button>

                      <button 
                        onClick={() => deleteNote(note._id)}  
                        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;









// import React, { useState, useEffect } from 'react';
// import Navbar from '../src/components/Navbar/Navbar';
// import Sidebar from '../src/components/Sidebar/Sidebar';
// import NoteEditor from '../src/components/NoteEditor/NoteEditor';
// import Register from './components/Register/Register';
// import Login from './components/Login/Login';

// function App() {
//   const [notes, setNotes] = useState([]);  // Aseguramos que notes siempre es un array
//   const [authToken, setAuthToken] = useState(null);
//   const [showLogin, setShowLogin] = useState(false);

//   // Estado para manejar el modo edición
//   const [editNoteId, setEditNoteId] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editContent, setEditContent] = useState('');

//   // Obtener las notas del backend
//   useEffect(() => {
//     const fetchNotes = async () => {
//       if (authToken) {
//         try {
//           const res = await fetch('http://localhost:5000/api/notes', {
//             headers: {
//               'Authorization': `Bearer ${authToken}`
//             }
//           });
//           if (!res.ok) {
//             throw new Error('Error al obtener las notas');
//           }
//           const data = await res.json();
//           setNotes(data);
//         } catch (error) {
//           console.error('Error al obtener las notas:', error);
//           setNotes([]);  // Si hay un error, asegura que notes sigue siendo un array
//         }
//       }
//     };
//     fetchNotes();
//   }, [authToken]);

//   // Función para añadir una nueva nota
//   const addNote = async (title, content) => {
//     try {
//       const res = await fetch('http://localhost:5000/api/notes', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,  // Incluir el token de autenticación
//         },
//         body: JSON.stringify({ title, content }),
//       });

//       const newNote = await res.json();  // Obtener la respuesta con la nueva nota desde el backend
//       setNotes([...notes, newNote]);  // Actualiza el estado con la nota guardada en MongoDB
//     } catch (error) {
//       console.error('Error al guardar la nota:', error);
//     }
//   };

//   // Función para eliminar una nota
//   const deleteNote = async (noteId) => {
//     try {
//       await fetch(`http://localhost:5000/api/notes/${noteId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${authToken}`,  // Incluir el token de autenticación
//         },
//       });

//       // Actualizar el estado local eliminando la nota borrada
//       setNotes(notes.filter(note => note._id !== noteId));
//     } catch (error) {
//       console.error('Error al eliminar la nota:', error);
//     }
//   };

//   // Función para actualizar una nota
//   const updateNote = async (noteId) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,
//         },
//         body: JSON.stringify({ title: editTitle, content: editContent }),
//       });

//       const updatedNote = await res.json();
      
//       // Actualizar el estado local con la nota editada
//       setNotes(notes.map(note => note._id === noteId ? updatedNote : note));
      
//       setEditNoteId(null);  // Salir del modo edición
//     } catch (error) {
//       console.error('Error al actualizar la nota:', error);
//     }
//   };

//   // Guardar el token en localStorage cuando se inicie sesión
//   const handleLogin = (token) => {
//     setAuthToken(token);
//     localStorage.setItem('authToken', token);
//   };

//   // Cargar el token desde localStorage cuando la página se recargue
//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       setAuthToken(token);
//     }
//   }, []);

//   // Función para cerrar sesión
//   const handleLogout = () => {
//     setAuthToken(null);
//     localStorage.removeItem('authToken'); // Elimina el token del localStorage
//   };

//   return (
//     <div className="App h-screen flex">
//       {!authToken ? (
//         <div className="w-full p-8">
//           {showLogin ? (
//             <>
//               <Login setAuthToken={handleLogin} />
//               <p className="mt-4 text-center">
//                 ¿No tienes cuenta?{' '}
//                 <button className="text-blue-500" onClick={() => setShowLogin(false)}>
//                   Regístrate aquí
//                 </button>
//               </p>
//             </>
//           ) : (
//             <>
//               <Register />
//               <p className="mt-4 text-center">
//                 ¿Ya tienes una cuenta?{' '}
//                 <button className="text-blue-500" onClick={() => setShowLogin(true)}>
//                   Inicia sesión aquí
//                 </button>
//               </p>
//             </>
//           )}
//         </div>
//       ) : (
//         <>
//           <Sidebar />
//           <div className="flex-1">
//             <Navbar />
//             {/* Agregar botón de cerrar sesión */}
//             <div className="flex justify-end p-4">
//               <button onClick={handleLogout} className="text-red-500 bg-gray-200 px-4 py-2 rounded-lg">
//                 Cerrar sesión
//               </button>
//             </div>
//             <NoteEditor addNote={addNote} />
//             <div className="notes-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl p-4">
//               {notes.map((note) => (
//                 <div key={note._id} className="note bg-white rounded-lg shadow-lg p-4">
//                   {editNoteId === note._id ? (
//                     <div>
//                       <input 
//                         type="text" 
//                         value={editTitle} 
//                         onChange={(e) => setEditTitle(e.target.value)} 
//                         className="w-full px-2 py-1 border rounded" 
//                         placeholder="Editar título" 
//                       />
//                       <textarea 
//                         value={editContent} 
//                         onChange={(e) => setEditContent(e.target.value)} 
//                         className="w-full px-2 py-1 border rounded mt-2" 
//                         placeholder="Editar contenido" 
//                       />
//                       <button 
//                         onClick={() => updateNote(note._id)}  // Guardar los cambios
//                         className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 mr-2"
//                       >
//                         Guardar
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <h3 className="text-lg font-semibold text-gray-700">{note.title}</h3>
//                       <p className="text-gray-500">{note.content}</p>
//                       <span className="text-gray-400 text-sm block mt-2">{note.date}</span>

//                       {/* Botón para editar la nota */}
//                       <button 
//                         onClick={() => { 
//                           setEditNoteId(note._id); 
//                           setEditTitle(note.title); 
//                           setEditContent(note.content); 
//                         }}  
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 mr-2"
//                       >
//                         Editar
//                       </button>

//                       {/* Botón para eliminar la nota */}
//                       <button 
//                         onClick={() => deleteNote(note._id)}  
//                         className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
//                       >
//                         Eliminar
//                       </button>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default App;
