import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { ADMIN_EMAIL } from '../constants';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Appointment } from '../types';
import { CheckCircle2, XCircle, Clock4, Mail, User, Calendar, Clock, Loader2, Search, Filter, ShieldAlert, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [user, setUser] = useState(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setLoading(false);
    });

    if (!user || user.email !== ADMIN_EMAIL) {
      setLoading(false);
      return () => unsubscribeAuth();
    }

    const path = 'appointments';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
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

  const updateStatus = async (appointment: Appointment, newStatus: 'Confirmed' | 'Cancelled') => {
    const path = `appointments/${appointment.id}`;
    try {
      await updateDoc(doc(db, 'appointments', appointment.id), { status: newStatus });
      
      // Send Email Notification
      const emailText = newStatus === 'Confirmed' 
        ? `Dear ${appointment.patientName},\n\nYour appointment with ${appointment.doctorName} on ${appointment.date} at ${appointment.time} has been CONFIRMED.\n\nThank you for choosing MediSync Book.`
        : `Dear ${appointment.patientName},\n\nWe regret to inform you that your appointment with ${appointment.doctorName} on ${appointment.date} at ${appointment.time} has been CANCELLED.\n\nPlease contact us for further assistance.`;

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: appointment.patientEmail,
          subject: `Appointment ${newStatus} - MediSync Book`,
          text: emailText
        })
      });

      toast.success(`Appointment ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const filteredAppointments = appointments.filter(app => filterStatus === 'All' || app.status === filterStatus);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center space-y-8">
        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <LogIn className="w-12 h-12 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Admin Sign In</h2>
          <p className="text-gray-500 max-w-xs mx-auto">Please sign in with an administrator account to access this dashboard.</p>
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

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center space-y-8">
        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 max-w-xs mx-auto">You do not have administrative privileges to view this page.</p>
        </div>
        <Link
          to="/"
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all inline-flex items-center space-x-2"
        >
          Return Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 text-lg">Manage all patient appointments and schedules</p>
        </div>

        <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {['All', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                filterStatus === status ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-xl">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Patient</p>
                      <h3 className="text-lg font-bold text-gray-900">{appointment.patientName}</h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium truncate max-w-[200px]">{appointment.patientEmail}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-50 p-2 rounded-xl">
                      <Clock4 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Doctor</p>
                      <h3 className="text-lg font-bold text-gray-900">{appointment.doctorName}</h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm font-medium text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(appointment.date), 'MMM d, yyyy')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className={cn(
                    "px-6 py-3 rounded-2xl border flex items-center space-x-2 font-bold text-sm",
                    appointment.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                    appointment.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                    'bg-orange-50 text-orange-700 border-orange-100'
                  )}>
                    {appointment.status === 'Confirmed' ? <CheckCircle2 className="w-5 h-5" /> :
                     appointment.status === 'Cancelled' ? <XCircle className="w-5 h-5" /> :
                     <Clock4 className="w-5 h-5" />}
                    <span>{appointment.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  {appointment.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(appointment, 'Confirmed')}
                        className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(appointment, 'Cancelled')}
                        className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status !== 'Pending' && (
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Action Completed</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAppointments.length === 0 && (
          <div className="py-24 text-center space-y-4 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">No Appointments Found</h3>
            <p className="text-gray-500">No appointments match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
