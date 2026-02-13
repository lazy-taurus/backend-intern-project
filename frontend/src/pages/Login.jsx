import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during authentication');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
        {/* LEFT SIDE - BRANDING */}
        <div className="hidden lg:flex w-1/2 bg-blue-900 text-white flex-col justify-center px-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 opacity-90"></div>
            <div className="relative z-10">
                <h1 className="text-5xl font-bold mb-6 tracking-tight">Master Your Workflow.</h1>
                <p className="text-xl text-blue-100 max-w-lg leading-relaxed">
                    Experience the next generation of task management. 
                    Secure, scalable, and beautifully simple.
                </p>
            </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isLogin ? 'Welcome Back' : 'Join the Platform'}
                </h2>
                <p className="text-gray-500 mb-8">
                    {isLogin ? 'Enter your credentials to access your workspace.' : 'Create your account to start managing your tasks.'}
                </p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-100 flex items-center gap-2">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Work Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-gray-500 hover:text-blue-600 font-medium transition"
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have an ID? Login'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;