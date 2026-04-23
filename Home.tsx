import { Link } from 'react-router-dom';
import { Calendar, Search, ShieldCheck, Clock, MapPin, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { INDIAN_DOCTORS } from '../constants';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,#ebf4ff_0%,#ffffff_100%)]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
              <span>Trusted by 10,000+ Patients in India</span>
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Your Health, <br />
              <span className="text-blue-600">Our Priority.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Book appointments with India's top-rated doctors in seconds. 
              Find specialists in your city and manage your health journey with ease.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/find-doctors"
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center space-x-2 active:scale-95"
              >
                <Search className="w-5 h-5" />
                <span>Find a Doctor</span>
              </Link>
              <Link
                to="/my-appointments"
                className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all flex items-center space-x-2 active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                <span>My Bookings</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://picsum.photos/seed/medical/800/600"
                alt="Medical Care"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-8 -right-8 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 z-20 hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Instant Booking</p>
                  <p className="text-xs text-gray-500">24/7 Availability</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 z-20 hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-2xl">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Top Rated</p>
                  <p className="text-xs text-gray-500">4.8+ Avg Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Top Specialists</h2>
            <p className="text-gray-500 text-lg">Highly experienced doctors near you</p>
          </div>
          <Link to="/find-doctors" className="text-blue-600 font-bold hover:underline">View All Doctors &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {INDIAN_DOCTORS.slice(0, 4).map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group"
            >
              <div className="relative mb-6">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full aspect-square object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                  <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span className="text-xs font-bold text-gray-900">{doctor.rating}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium text-sm">{doctor.specialization}</p>
                </div>
                <div className="flex items-center text-gray-500 text-sm space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{doctor.city}, {doctor.state}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{doctor.experience}YRS EXP</span>
                  <Link
                    to="/find-doctors"
                    className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
