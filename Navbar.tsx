import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, User, LayoutDashboard, Calendar, LogOut, LogIn, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../firebase';
import { ADMIN_EMAIL } from '../constants';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      if (error.code === 'auth/popup-blocked') {
        toast.error('Sign-in popup was blocked. Please allow popups for this site.', { duration: 5000 });
      } else if (error.code === 'auth/cancelled-popup-request') {
        // This usually happens if multiple requests are made, which we now prevent with isSigningIn
        toast.error('Sign-in request was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in window was closed before completion.');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out.');
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Stethoscope },
    { name: 'Find Doctors', path: '/find-doctors', icon: Calendar },
    { name: 'My Appointments', path: '/my-appointments', icon: User },
    { name: 'Admin', path: '/admin', icon: LayoutDashboard, adminOnly: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || (user && user.email === ADMIN_EMAIL));

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">MediSync<span className="text-blue-600">Book</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">
                    {user.displayName?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className={cn(
                  "bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 flex items-center space-x-2",
                  isSigningIn && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSigningIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>{isSigningIn ? 'Signing In...' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
