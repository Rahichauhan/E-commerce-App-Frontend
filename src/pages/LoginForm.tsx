import { useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
type MyProps = {
        setSuccessMessage: (value:SetStateAction<string>)=> void;
        setErrorMessage: (value:SetStateAction<string>)=> void;
    }
const LoginForm: React.FC<MyProps> = ({setSuccessMessage,setErrorMessage}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMode, setLoginMode] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

  const handleSubmit = async (url:URL, formData:Object) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
        console.log(JSON.stringify(formData))
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Operation successful!');

        //
        localStorage.setItem("login","true");
        localStorage.setItem("jwt",data.data);
        localStorage.setItem("useremail",email);
        const response2 = await fetch(new URL(`http://localhost:8090/user/get-user-info?email=${email}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.data}`,
        }
      });

      if(response2.ok){
        const mydata = await response2.json();
        localStorage.setItem("uid",mydata.data.id)
        console.log(mydata.data)
      }else{
        console.log(await response2.json());
      }

        //
        console.log('Server Response:', data);
        if (data.data) {
          console.log('JWT Token received:', data.data);
        }
        navigate("/home", { replace: true });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'An error occurred.');
        console.error('Server Error:', errorData);
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Fetch Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

    const onSubmit = (e:any) => {
      e.preventDefault();
      const url = loginMode === 'user' ? 'http://localhost:8090/login-user' : 'http://localhost:8090/login-admin';
      handleSubmit(new URL(url), { email, password });
    };

    return (
      <form onSubmit={onSubmit} className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-7 text-center">
          {loginMode === 'user' ? 'User Login' : 'Admin Login'}
        </h2>

        <div className="flex justify-center mb-6 bg-gray-100 rounded-full p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setLoginMode('user')}
            className={`flex-1 py-2 px-4 rounded-full text-center text-lg font-medium transition duration-300 ease-in-out ${
              loginMode === 'user'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setLoginMode('admin')}
            className={`flex-1 py-2 px-4 rounded-full text-center text-lg font-medium transition duration-300 ease-in-out ${
              loginMode === 'admin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="login-email">
            Email Address
          </label>
          <input
            type="email"
            id="login-email"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-3 focus:ring-blue-400 transition duration-200 ease-in-out"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="login-password">
            Password
          </label>
          <input
            type="password"
            id="login-password"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 mb-3 leading-tight focus:outline-none focus:ring-3 focus:ring-blue-400 transition duration-200 ease-in-out"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`w-full ${loginMode === 'user' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 shadow-lg`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : `Login as ${loginMode === 'user' ? 'User' : 'Admin'}`}
          </button>
        </div>
      </form>
    );
  };

  export default LoginForm;