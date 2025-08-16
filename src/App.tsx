
import { useState } from 'react';
import LoginForm from "./pages/LoginForm.tsx";
import RegisterForm from "./pages/RegistrationForm.tsx"

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
   return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
      
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

      <div className="mb-6 w-full max-w-md text-center">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
      </div>

      {currentView === 'login' ? (
        <LoginForm  setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
      ) : (
        <RegisterForm setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
      )}

      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => setCurrentView('login')}
          className={`py-3 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md ${
            currentView === 'login'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setCurrentView('register')}
          className={`py-3 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md ${
            currentView === 'register'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default App;