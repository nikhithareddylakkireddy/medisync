import { useState, useMemo } from 'react';
import { Search, MapPin, Star, Filter, Calendar, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INDIAN_DOCTORS, LOCATION_DATA } from '../constants';
import { cn } from '../lib/utils';
import BookingModal from '../components/BookingModal';
import { Doctor } from '../types';

export default function FindDoctors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'none'>('none');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const states = Object.keys(LOCATION_DATA);
  const districts = selectedState ? Object.keys(LOCATION_DATA[selectedState]) : [];
  const cities = selectedDistrict ? LOCATION_DATA[selectedState][selectedDistrict] : [];

  const filteredDoctors = useMemo(() => {
    let result = INDIAN_DOCTORS.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = !selectedState || doctor.state === selectedState;
      const matchesDistrict = !selectedDistrict || doctor.district === selectedDistrict;
      const matchesCity = !selectedCity || doctor.city === selectedCity;
      
      return matchesSearch && matchesState && matchesDistrict && matchesCity;
    });

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'experience') {
      result = [...result].sort((a, b) => b.experience - a.experience);
    }

    return result;
  }, [searchQuery, selectedState, selectedDistrict, selectedCity, sortBy]);

  const clearFilters = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCity('');
    setSearchQuery('');
    setSortBy('none');
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header & Search */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Find Your Doctor</h1>
          <p className="text-gray-500 text-lg">Search by name, specialization, or location</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('');
                setSelectedCity('');
              }}
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium appearance-none cursor-pointer"
            >
              <option value="">Select State</option>
              {states.map(state => <option key={state} value={state}>{state}</option>)}
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedCity('');
              }}
              disabled={!selectedState}
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select District</option>
              {districts.map(district => <option key={district} value={district}>{district}</option>)}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select City</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="lg:col-span-4 flex items-center space-x-4 pt-4 border-t border-gray-50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <Filter className="w-3 h-3 mr-2" /> Sort By:
            </span>
            <div className="flex space-x-2">
              {[
                { id: 'none', label: 'Default' },
                { id: 'rating', label: 'Top Rated' },
                { id: 'experience', label: 'Most Experienced' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                    sortBy === option.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(selectedState || searchQuery) && (
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Showing {filteredDoctors.length} Doctors
            </p>
            <button
              onClick={clearFilters}
              className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 object-cover rounded-3xl shadow-md group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-xl shadow-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-2xl flex items-center space-x-1.5">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="text-sm font-extrabold text-orange-700">{doctor.rating}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mt-1">{doctor.specialization}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 text-sm font-medium space-x-3">
                    <div className="bg-gray-100 p-2 rounded-xl">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <span>{doctor.city}, {doctor.state}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm font-medium space-x-3">
                    <div className="bg-gray-100 p-2 rounded-xl">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <span>{doctor.experience} Years Experience</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center space-x-2 group-hover:shadow-xl group-hover:shadow-blue-100 active:scale-95"
                >
                  <span>Book Appointment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredDoctors.length === 0 && (
          <div className="col-span-full py-24 text-center space-y-4">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No Doctors Found</h3>
            <p className="text-gray-500">Try adjusting your search or location filters</p>
            <button onClick={clearFilters} className="text-blue-600 font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
