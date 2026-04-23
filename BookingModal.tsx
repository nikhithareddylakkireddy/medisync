import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Doctor } from '../types';
import { format, addDays } from 'date-fns';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import toast from 'react-hot-toast';

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export default function BookingModal({ doctor, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Pre-fill user data
  useEffect(() => {
    if (auth.currentUser) {
      setPatientName(auth.currentUser.displayName || '');
      setPatientEmail(auth.currentUser.email || '');
    }
  }, []);

  // Auto-advance when both date and time are selected
  useEffect(() => {
    if (selectedDate && selectedTime && step === 1) {
      const timer = setTimeout(() => setStep(2), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedDate, selectedTime, step]);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !patientName || !patientEmail) {
      toast.error('Please fill all fields');
      return;
    }

    setIsBooking(true);
    const path = 'appointments';
    try {
      await addDoc(collection(db, path), {
        patientName,
        patientEmail,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: selectedDate,
        time: selectedTime,
        status: 'Pending',
        createdAt: serverTimestamp(),
        userId: auth.currentUser?.uid || 'anonymous'
      });
      
      // Immediate feedback
      setStep(3);
      toast.success('Appointment requested successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          {/* Sidebar */}
          <div className="md:col-span-2 bg-blue-600 p-8 text-white space-y-8">
            <div className="space-y-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 object-cover rounded-3xl border-4 border-white/20 shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-2xl font-bold">{doctor.name}</h3>
                <p className="text-blue-100 font-medium">{doctor.specialization}</p>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-4 h-4 text-blue-200" />
                <span>{selectedDate ? format(new Date(selectedDate), 'MMM d, yyyy') : 'Select Date'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-blue-200" />
                <span>{selectedTime || 'Select Time'}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 p-8 bg-white overflow-y-auto max-h-[80vh]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Select Schedule</h2>
                    <p className="text-gray-500 text-sm">Choose your preferred date and time</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Dates</label>
                    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                      {dates.map((date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isSelected = selectedDate === dateStr;
                        return (
                          <button
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`flex flex-col items-center min-w-[70px] p-4 rounded-2xl transition-all ${
                              isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase opacity-70">{format(date, 'EEE')}</span>
                            <span className="text-lg font-bold">{format(date, 'd')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Slots</label>
                    <div className="grid grid-cols-3 gap-3">
                      {doctor.availability.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-xl text-sm font-bold transition-all ${
                              isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep(2)}
                      className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <span>Continue to Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
                    <p className="text-gray-500 text-sm">Please provide your contact information</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Back
                    </button>
                    <button
                      disabled={isBooking || !patientName || !patientEmail}
                      onClick={handleBooking}
                      className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Booking...</span>
                        </>
                      ) : (
                        <span>Confirm Booking</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                >
                  <div className="bg-green-100 p-6 rounded-full">
                    <CheckCircle2 className="w-16 h-16 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Booking Requested!</h2>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      Your appointment with {doctor.name} has been requested. You will receive an email once the admin confirms it.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
