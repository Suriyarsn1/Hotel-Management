import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
   

  // Handle registration 
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      setError('Passwords do not match');
      return;
    }
    if (role === '') {
      setError('Please select role');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/register`, { email, password, username, role });
      setError('Successfully Registered');
      setTimeout(() => navigate('/user/login'), 1000);
    } catch (err) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-green-custom p-8 animate-fade-in-up transition-all">
        <h1 className="text-3xl text-center font-extrabold mb-8 text-[#328E6E] drop-shadow">Registration Form</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Username input */}
          <div>
            <label className="block mb-1 font-semibold text-[#328E6E]">User Name</label>
            <input
              type="text"
              className="w-full p-3 border border-[#90C67C] bg-transparent rounded-lg outline-none font-thin focus:ring-2 focus:ring-[#67AE6E] transition"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          {/* Email input */}
          <div>
            <label className="block mb-1 font-semibold text-[#328E6E]">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-[#90C67C] bg-transparent rounded-lg outline-none font-thin focus:ring-2 focus:ring-[#67AE6E] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          {/* Password input */}
          <div>
            <label className="block mb-1 font-semibold text-[#328E6E]">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-[#90C67C] bg-transparent rounded-lg outline-none font-thin focus:ring-2 focus:ring-[#67AE6E] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {/* Confirm password input */}
          <div>
            <label className="block mb-1 font-semibold text-[#328E6E]">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 border border-[#90C67C] bg-transparent rounded-lg outline-none font-thin focus:ring-2 focus:ring-[#67AE6E] transition"
              value={cpassword}
              onChange={(e) => setcPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {/* Role Confirmation */}
          <div>
            <label className="block mb-1 font-semibold text-[#328E6E]">Role</label>
            <select
              className="w-full p-3 border border-[#90C67C] bg-transparent rounded-lg outline-none font-thin focus:ring-2 focus:ring-[#67AE6E] transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">- Select Role -</option>
              <option value="admin">Admin</option>
              <option value="cook">Cook</option>
            </select>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="w-full px-5 py-3 bg-gradient-to-r from-[#328E6E] to-[#67AE6E] text-white font-bold rounded-full shadow-green-custom hover:scale-105 hover:shadow-lg transition-all duration-300 animate-pulse"
          >
            Register
          </button>
          {/* Error or success message */}
          {error && (
            <p className={`text-center mt-2 text-base ${error.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
              {error}
            </p>
          )}
        </form>
      </div>
      {/* Custom shadow and animation styles */}
      <style>{`
        .shadow-green-custom {
          box-shadow: 0 8px 32px 0 rgba(50, 142, 110, 0.18), 0 1.5px 8px 0 rgba(103, 174, 110, 0.10);
        }
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

export default Register;
