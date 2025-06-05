import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/login`, { email, password })
      .then((data) => {
        console.log(data.data)
        // Store user info in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('roll', JSON.stringify(data.data.user.roll));
        localStorage.setItem('user', JSON.stringify(data.data.user.username));
        localStorage.setItem('userId', data.data.user.userId);
        //Navigate based on user role
        if (data.data.user.roll !== 'admin') {
          navigate('/cook/dashboard');
        } else {
          navigate('/admin/home');
        }
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "An unknown error occurred";
        setMsg(message)

      });
  };

  return (

    <div className="flex flex-col justify-center items-center min-h-screen bg-green-100 p-4">
      {/* Title Card */}
      <div className="w-full max-w-md bg-green-200 rounded-t-xl shadow-lg p-4 flex justify-center items-center">
        <h2 className="text-3xl font-extrabold text-green-700">Welcome Back!</h2>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-md bg-white rounded-b-xl shadow-2xl p-8 animate-fade-in-up transition-all -mt-2">
        <h1 className="text-2xl text-center font-bold mb-6 text-blue-500">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email:</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 bg-transparent rounded-lg outline-none font-thin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Password:</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 bg-transparent rounded-lg outline-none font-thin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex justify-between items-center">

            <button type='submit' class="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-green-300/80 font-medium text-black transition-all duration-300 hover:w-32">
              <div class="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3  group-hover:opacity-100">Login</div>
              <div class="absolute right-3.5">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
                  <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
              </div>
            </button>
          </div>
        </form>
        <div className="text-center mt-5 text-red-600 font-medium min-h-[24px]">
          {msg}
        </div>
      </div>
      {/* Fade-in animation style */}
      <style>{`
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(40px);}
      100% { opacity: 1; transform: translateY(0);}
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  `}</style>
    </div>

  );
}

export default Login;
