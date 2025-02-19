import React from 'react';
import Router from './component/router/index';
// import Registration from './Pages/employeeRegister/index';
import { AuthProvider } from './Context/Authentication/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
