import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Appointment } from '../types';
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, Clock4, Loader2, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setLoading(false);
    });

    if (!user) {
      setLoading(false);
      return () => unsubscribeAuth();
    }

    const path = 'appointments';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribe();
    };
  }, [user]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock4 className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-50 text-green-700 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-orange-50 text-orange-700 border-orange-100';
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center space-y-8">
        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <LogIn className="w-12 h-12 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Sign In Required</h2>
          <p className="text-gray-500 max-w-xs mx-auto">Please sign in to view and manage your appointments.</p>
        </div>
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className={cn(
            "bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center space-x-2 mx-auto",
            isSigningIn && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSigningIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          <span>{isSigningIn ? 'Signing In...' : 'Sign In with Google'}</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">My Appointments</h1>
        <p className="text-gray-500 text-lg">Track and manage your healthcare bookings</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-8"
            >
              <div className="flex items-center space-x-6">
                <div className="bg-blue-50 p-4 rounded-3xl">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900">{appointment.doctorName}</h3>
                  <div className="flex items-center text-gray-500 text-sm font-medium space-x-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-6 md:pt-0">
                <div className={cn(
                  "px-6 py-3 rounded-2xl border flex items-center space-x-2 font-bold text-sm",
                  getStatusStyles(appointment.status)
                )}>
                  {getStatusIcon(appointment.status)}
                  <span>{appointment.status}</span>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {appointments.length === 0 && (
          <div className="py-24 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-12 h-12 text-gray-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">No Appointments Yet</h3>
              <p className="text-gray-500 max-w-xs mx-auto">You haven't booked any appointments. Start your health journey today!</p>
            </div>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
              Find a Doctor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
