import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
      <div className="text-center space-y-4 mb-8">
        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
          <LogIn className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500">Sign in to book your appointment</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
        </button>
      </form>

      <p className="text-center mt-8 text-sm text-gray-500">
        Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
