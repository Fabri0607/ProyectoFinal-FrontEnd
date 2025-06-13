import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit, Loader2, AlertCircle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';

const ErrorMessage = ({ message }) => (
  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
    <AlertCircle className="w-5 h-5" />
    <span className="text-sm">{message}</span>
  </div>
);

const SuccessMessage = ({ message }) => (
  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
    <CheckCircle className="w-5 h-5" />
    <span className="text-sm">{message}</span>
  </div>
);

// Function to generate a secure random password
const generateSecurePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(array[i] % charset.length);
  }
  
  // Ensure at least one of each required character type
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()]/.test(password);
  
  if (!(hasUpper && hasLower && hasNumber && hasSpecial)) {
    return generateSecurePassword(); // Recursively try again if requirements not met
  }
  
  return password;
};

const EditUserModal = ({ user, onClose, onSave }) => {
  const [editUser, setEditUser] = useState({
    userName: user.userName,
    email: user.email,
    role: user.role,
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editUser.userName || !editUser.email || !editUser.role) {
      setError('Los campos nombre de usuario, correo y rol son obligatorios');
      return;
    }

    if (editUser.password && editUser.password !== editUser.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Only include password in the payload if it's been set
      const payload = {
        userName: editUser.userName,
        email: editUser.email,
        role: editUser.role,
        ...(editUser.password && { password: editUser.password })
      };
      await onSave(user.id, payload);
      onClose();
      toast.success('Usuario actualizado exitosamente');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Editar Usuario</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <input
              type="text"
              name="userName"
              value={editUser.userName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Usuario"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={editUser.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="correo@ejemplo.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              name="role"
              value={editUser.role}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              <option value="Colaborador">Colaborador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña (opcional)</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={editUser.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg pr-12"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña (opcional)</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={editUser.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg pr-12"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
                  Actualizando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userName: '',
    email: '',
    password: generateSecurePassword(), // Generate password automatically
    role: 'Colaborador'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Auth/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.userName || !newUser.email || !newUser.role) {
      setError('Los campos nombre de usuario, correo y rol son obligatorios');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/Auth/register', newUser);
      setSuccess(true);
      setNewUser({ 
        userName: '', 
        email: '', 
        password: generateSecurePassword(), // Generate new password for next user
        role: 'Colaborador' 
      });
      fetchUsers();
      toast.success('Usuario creado exitosamente');
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await api.delete(`/Auth/users/${userId}`);
        fetchUsers();
        toast.success('Usuario eliminado');
      } catch (error) {
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSaveEdit = async (userId, updatedUser) => {
    try {
      await api.put(`/Auth/users/${userId}`, updatedUser);
      fetchUsers();
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Gestión de Usuarios</h1>

      {/* Formulario para crear usuario */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Crear Nuevo Usuario</h2>
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message="Usuario creado exitosamente" />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <input
              type="text"
              name="userName"
              value={newUser.userName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Usuario"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="correo@ejemplo.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              <option value="Colaborador">Colaborador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
                Creando...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 inline mr-2" />
                Crear Usuario
              </>
            )}
          </button>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Lista de Usuarios</h2>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-600 text-center">No hay usuarios registrados</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-50 text-gray-800 font-semibold border-b border-gray-200">
                    <th className="p-4 min-w-[150px]">Usuario</th>
                    <th className="p-4 min-w-[200px]">Correo</th>
                    <th className="p-4 min-w-[100px]">Rol</th>
                    <th className="p-4 min-w-[100px] rounded-tr-lg">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-600">{user.userName}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-600">{user.role}</td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)} 
                          className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={users.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
      {/* Modal para editar usuario */}
      {editingUser && (
        <EditUserModal 
          user={editingUser}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default UserManagement;