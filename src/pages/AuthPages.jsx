import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

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

const AuthPages = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({
    userName: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const API_BASE_URL = 'http://localhost:5151/api';

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    if (loginError) setLoginError('');
  };

  const handleLoginSubmit = async () => {
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: loginData.userName,
          password: loginData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token.token);
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('roles', JSON.stringify(data.roles));

        setLoginSuccess(true);

        if (onLogin && data.token) {
          onLogin({
            token: data.token.token,
            expiration: data.token.expiration,
            userName: data.userName,
            roles: data.roles
          });
        }

        setTimeout(() => {
          setLoginSuccess(false);
        }, 2000);
      } else {
        const errorText = await response.text();
        let errorMessage = 'Error en el inicio de sesión';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        setLoginError(errorMessage);
      }
    } catch (error) {
      setLoginError('Error de conexión. Por favor, verifica que el servidor esté funcionando.');
      console.error('Error de login:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-600 mt-2">Bienvenido de vuelta</p>
        </div>

        <div className="space-y-6">
          {loginError && <ErrorMessage message={loginError} />}
          {loginSuccess && <SuccessMessage message="¡Login exitoso! Redirigiendo..." />}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="userName"
                value={loginData.userName}
                onChange={handleLoginChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="tu_usuario"
                required
                disabled={loginLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
                disabled={loginLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loginLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                disabled={loginLoading}
              />
              <span className="ml-2 text-sm text-gray-600">Recordarme</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="button"
            onClick={handleLoginSubmit}
            disabled={loginLoading || !loginData.userName || !loginData.password}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loginLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;