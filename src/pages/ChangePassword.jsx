import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

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

const ChangePassword = ({ onPasswordChanged }) => {
  const [formData, setFormData] = useState({
    temporaryPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const userName = localStorage.getItem('userName');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.temporaryPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Todos los campos son requeridos');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5151/api/Auth/ChangePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          temporaryPassword: formData.temporaryPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Notificar al componente padre que la contraseña fue cambiada
        setTimeout(() => {
          if (onPasswordChanged) {
            onPasswordChanged();
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setError('Error de conexión. Por favor, verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Cambiar Contraseña</h2>
          <p className="text-gray-600 mt-2">Por favor, ingresa tu contraseña temporal y una nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message="¡Contraseña cambiada exitosamente! Redirigiendo..." />}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Temporal</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showTempPassword ? 'text' : 'password'}
                name="temporaryPassword"
                value={formData.temporaryPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowTempPassword(!showTempPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showTempPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Cambiando contraseña...
              </>
            ) : (
              'Cambiar Contraseña'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;