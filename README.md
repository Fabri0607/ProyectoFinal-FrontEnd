<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
</head>
<body>

  <h1>Inventario Ventas - Frontend</h1>

  <p><strong>Repositorio del Backend:</strong> <a href="https://github.com/Fabri0607/ProyectoFinalFundamentosWeb">ProyectoFinalFundamentosWeb</a></p>

  <h2>📋 Descripción General</h2>
  <p>
    Aplicación web construida con React para la gestión de productos, ventas, inventario y reportes empresariales,
    orientada a pequeñas y medianas empresas. Integra control de acceso basado en roles y permite la operación en tiempo real
    mediante comunicación con un API REST.
  </p>

  <h2>🎯 Propósito y Alcance</h2>
  <p>
    Este sistema brinda una interfaz completa para la administración de productos, procesamiento de ventas,
    seguimiento de inventario y generación de reportes. Está especialmente dirigido a mercados hispanohablantes
    y soporta múltiples tipos de usuario con diferentes niveles de acceso.
  </p>

  <h2>🏗️ Arquitectura del Sistema</h2>
  <ul>
    <li><strong>Estructura Modular en React:</strong> separación clara entre lógica de negocio, autenticación y presentación.</li>
    <li><strong>Componentes Clave:</strong> 
      <ul>
        <li>Productos.jsx, Ventas.jsx, VentaDetalle.jsx</li>
        <li>Reportes.jsx, Movimientos.jsx, Parametros.jsx</li>
        <li>UserManagement.jsx, Sidebar.jsx, Home.jsx</li>
        <li>Formulario de productos, ventas y parámetros</li>
        <li>ErrorBoundary, Pagination, servicios y utilidades</li>
      </ul>
    </li>
    <li><strong>Comunicación:</strong> API backend en <code>localhost:5151</code></li>
    <li><strong>Almacenamiento local:</strong> Uso de <code>localStorage</code> y <code>sessionStorage</code></li>
  </ul>

  <h2>⚙️ Tecnologías Utilizadas</h2>
  <table border="1" cellpadding="8">
    <thead>
      <tr><th>Categoría</th><th>Tecnología</th></tr>
    </thead>
    <tbody>
      <tr><td>Framework</td><td>React 19.1.0 + Vite 6.3.5</td></tr>
      <tr><td>Estilo UI</td><td>Tailwind CSS 3.4.13</td></tr>
      <tr><td>Routing</td><td>react-router-dom 7.6.0</td></tr>
      <tr><td>Formularios</td><td>Formik 2.4.6 + Yup 1.6.1</td></tr>
      <tr><td>API / HTTP</td><td>Axios 1.9.0</td></tr>
      <tr><td>Visualización</td><td>Recharts 2.15.3</td></tr>
      <tr><td>Notificaciones</td><td>react-hot-toast 2.5.2</td></tr>
      <tr><td>Íconos</td><td>Lucide React, React Icons</td></tr>
      <tr><td>Dev Tools</td><td>Eslint, Autoprefixer, PostCSS</td></tr>
    </tbody>
  </table>

  <h2>🧩 Funcionalidades Principales</h2>
  <ul>
    <li><strong>Gestión de Productos:</strong> CRUD, validación, stock, y seguimiento de movimientos.</li>
    <li><strong>Gestión de Ventas:</strong> Registro de transacciones, historial, y detalles de cada venta.</li>
    <li><strong>Gestión de Inventario:</strong> Movimiento en tiempo real, auditorías y monitoreo.</li>
    <li><strong>Reportes y Análisis:</strong> Dashboard con reportes de ventas e inventario, exportaciones.</li>
    <li><strong>Gestión de Usuarios:</strong> Administración de cuentas, perfiles y roles.</li>
    <li><strong>Configuración del Sistema:</strong> Administración de parámetros, reglas y categorías.</li>
  </ul>

  <h2>🔐 Autenticación y Control de Acceso</h2>
  <p>Sistema de autenticación basado en roles con persistencia en el navegador.</p>
  <ul>
    <li><strong>Roles:</strong> 
      <ul>
        <li>Administrador: acceso total.</li>
        <li>Colaborador: productos, ventas y reportes.</li>
        <li>Vendedor: ventas, movimientos y reportes.</li>
      </ul>
    </li>
    <li>Autenticación basada en token y almacenamiento en <code>localStorage</code></li>
    <li>Forzado de cambio de contraseña para usuarios nuevos</li>
    <li>Rutas protegidas según el rol asignado</li>
  </ul>

  <h2>📤 Exportación de Datos</h2>
  <ul>
    <li>Exportación de reportes en formatos: Excel, PDF, CSV, y JSON.</li>
    <li>Funciones reutilizables para exportación y formato de moneda.</li>
    <li>Integrado con múltiples secciones del sistema.</li>
  </ul>

  <h2>🎯 Usuarios Objetivo y Casos de Uso</h2>
  <ul>
    <li>Empresas PYME en Latinoamérica.</li>
    <li>Requieren control de inventario, gestión de ventas, reportes y exportación de datos.</li>
    <li>Interfaz en español adaptada al formato monetario local.</li>
    <li>Soporta múltiples usuarios con diferentes niveles de acceso.</li>
  </ul>
  
  <h2>🚀 Configuración Inicial</h2>
  <ol>
    <li>Clonar el repositorio.</li>
    <li>Instalar dependencias con <code>npm install</code>.</li>
    <li>Actualizar la URL del backend en <code>api.js</code>.</li>
    <li>Ejecutar <code>npm run dev</code> para iniciar el servidor.</li>
    <li>Acceder a la aplicación en <code>http://localhost:5173</code> (según configuración).</li>
  </ol>
  
  <hr>
  <p>Desarrollado por: <strong>Fabricio Alfaro Arce</strong>, Nahum Mora, Juan Rodríguez y Yehudy Moreira | Curso: Fundamentos de Programación Web</p>

</body>
</html>
