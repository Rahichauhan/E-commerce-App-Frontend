import { useState, type SetStateAction } from "react";
type MyProps = {
        setSuccessMessage: (value:SetStateAction<string>)=> void;
        setErrorMessage: (value:SetStateAction<string>)=> void;
    }
const RegisterForm : React.FC<MyProps> = ({setSuccessMessage,setErrorMessage}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

   

    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (url:URL, formData:Object) => {
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
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
                console.log('Server Response:', data);
                if (data.token) {
                    console.log('JWT Token received:', data.token);
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message.join(". ") || 'An error occurred.');
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

        handleSubmit(new URL('http://localhost:8090/register-user'), {
            firstName,
            lastName,
            email,
            phone,
            password,
        });
    };

    return (
        <form onSubmit={onSubmit} className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-7 text-center">User Registration</h2>
            <div className="mb-5">
                <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="first-name">
                    First Name
                </label>
                <input
                    type="text"
                    id="first-name"
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 ease-in-out"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                />
            </div>
            <div className="mb-5">
                <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="last-name">
                    Last Name
                </label>
                <input
                    type="text"
                    id="last-name"
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 ease-in-out"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                />
            </div>
            <div className="mb-5">
                <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="register-email">
                    Email Address
                </label>
                <input
                    type="email"
                    id="register-email"
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 ease-in-out"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
            </div>
            <div className="mb-5">
                <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="phone">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 ease-in-out"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="register-password">
                    Password
                </label>
                <input
                    type="password"
                    id="register-password"
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 mb-3 leading-tight focus:outline-none focus:ring-3 focus:ring-green-400 transition duration-200 ease-in-out"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </div>
        </form>
    );
};


export default RegisterForm;