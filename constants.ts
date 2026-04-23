import { Doctor, LocationData } from './types';

export const ADMIN_EMAIL = 'nikhithareddylakkireddy@gmail.com';

export const INDIAN_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiologist',
    experience: 15,
    rating: 4.8,
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor1/400/400'
  },
  {
    id: '2',
    name: 'Dr. Anjali Sharma',
    specialization: 'Pediatrician',
    experience: 8,
    rating: 4.6,
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    availability: ['09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '02:30 PM', '03:30 PM', '04:30 PM'],
    image: 'https://picsum.photos/seed/doctor2/400/400'
  },
  {
    id: '3',
    name: 'Dr. S. Venkatesh',
    specialization: 'Orthopedic Surgeon',
    experience: 20,
    rating: 4.9,
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    availability: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'],
    image: 'https://picsum.photos/seed/doctor3/400/400'
  },
  {
    id: '4',
    name: 'Dr. Priya Reddy',
    specialization: 'Dermatologist',
    experience: 12,
    rating: 4.7,
    city: 'Tirupati',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'],
    image: 'https://picsum.photos/seed/doctor4/400/400'
  },
  {
    id: '5',
    name: 'Dr. Amit Shah',
    specialization: 'Neurologist',
    experience: 18,
    rating: 4.5,
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    image: 'https://picsum.photos/seed/doctor5/400/400'
  },
  {
    id: '6',
    name: 'Dr. Neha Gupta',
    specialization: 'Gynecologist',
    experience: 10,
    rating: 4.4,
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor6/400/400'
  },
  {
    id: '7',
    name: 'Dr. Vikram Rao',
    specialization: 'General Physician',
    experience: 14,
    rating: 4.3,
    city: 'Nellore',
    district: 'SPSR Nellore',
    state: 'Andhra Pradesh',
    availability: ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '03:30 PM', '04:30 PM', '05:30 PM'],
    image: 'https://picsum.photos/seed/doctor7/400/400'
  },
  {
    id: '8',
    name: 'Dr. Suresh Babu',
    specialization: 'Cardiologist',
    experience: 22,
    rating: 4.9,
    city: 'Vijayawada',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor8/400/400'
  },
  {
    id: '9',
    name: 'Dr. Kavitha Rani',
    specialization: 'Pediatrician',
    experience: 11,
    rating: 4.7,
    city: 'Warangal',
    district: 'Warangal Urban',
    state: 'Telangana',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor9/400/400'
  },
  {
    id: '10',
    name: 'Dr. Manoj Tiwari',
    specialization: 'Orthopedic Surgeon',
    experience: 16,
    rating: 4.6,
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    image: 'https://picsum.photos/seed/doctor10/400/400'
  },
  {
    id: '11',
    name: 'Dr. Sunita Deshmukh',
    specialization: 'Dermatologist',
    experience: 9,
    rating: 4.5,
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    availability: ['11:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor11/400/400'
  },
  {
    id: '12',
    name: 'Dr. Arvind Swamy',
    specialization: 'Neurologist',
    experience: 25,
    rating: 5.0,
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor12/400/400'
  },
  {
    id: '13',
    name: 'Dr. Deepa Nair',
    specialization: 'Gynecologist',
    experience: 13,
    rating: 4.8,
    city: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    image: 'https://picsum.photos/seed/doctor13/400/400'
  },
  {
    id: '14',
    name: 'Dr. Rahul Verma',
    specialization: 'General Physician',
    experience: 7,
    rating: 4.2,
    city: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    availability: ['08:00 AM', '09:00 AM', '10:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'],
    image: 'https://picsum.photos/seed/doctor14/400/400'
  },
  {
    id: '15',
    name: 'Dr. Meenakshi Iyer',
    specialization: 'Ophthalmologist',
    experience: 19,
    rating: 4.7,
    city: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor15/400/400'
  },
  {
    id: '16',
    name: 'Dr. Sanjay Mehra',
    specialization: 'Psychiatrist',
    experience: 21,
    rating: 4.6,
    city: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    availability: ['11:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'],
    image: 'https://picsum.photos/seed/doctor16/400/400'
  },
  {
    id: '17',
    name: 'Dr. Shalini Singh',
    specialization: 'Endocrinologist',
    experience: 14,
    rating: 4.8,
    city: 'Gurgaon',
    district: 'Gurugram',
    state: 'Haryana',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    image: 'https://picsum.photos/seed/doctor17/400/400'
  },
  {
    id: '18',
    name: 'Dr. Pradeep Kumar',
    specialization: 'Urologist',
    experience: 17,
    rating: 4.5,
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor18/400/400'
  },
  {
    id: '19',
    name: 'Dr. Lakshmi Prasanna',
    specialization: 'ENT Specialist',
    experience: 11,
    rating: 4.4,
    city: 'Guntur',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    image: 'https://picsum.photos/seed/doctor19/400/400'
  },
  {
    id: '20',
    name: 'Dr. Harish Rao',
    specialization: 'Dentist',
    experience: 9,
    rating: 4.3,
    city: 'Nizamabad',
    district: 'Nizamabad',
    state: 'Telangana',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'],
    image: 'https://picsum.photos/seed/doctor20/400/400'
  },
  {
    id: '21',
    name: 'Dr. Ramesh Babu',
    specialization: 'Cardiologist',
    experience: 18,
    rating: 4.9,
    city: 'Tirupati',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor21/400/400'
  },
  {
    id: '22',
    name: 'Dr. Sravani',
    specialization: 'Pediatrician',
    experience: 10,
    rating: 4.7,
    city: 'Kadapa',
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor22/400/400'
  },
  {
    id: '23',
    name: 'Dr. Kishore',
    specialization: 'Orthopedic Surgeon',
    experience: 15,
    rating: 4.6,
    city: 'Proddatur',
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    availability: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    image: 'https://picsum.photos/seed/doctor23/400/400'
  },
  {
    id: '24',
    name: 'Dr. Madhavi',
    specialization: 'Gynecologist',
    experience: 12,
    rating: 4.8,
    city: 'Tirupati',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    availability: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor24/400/400'
  },
  {
    id: '25',
    name: 'Dr. Venkat',
    specialization: 'General Physician',
    experience: 14,
    rating: 4.5,
    city: 'Kadapa',
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    availability: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'],
    image: 'https://picsum.photos/seed/doctor25/400/400'
  },
  {
    id: '26',
    name: 'Dr. Swapna',
    specialization: 'Dermatologist',
    experience: 8,
    rating: 4.4,
    city: 'Proddatur',
    district: 'YSR Kadapa',
    state: 'Andhra Pradesh',
    availability: ['11:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM'],
    image: 'https://picsum.photos/seed/doctor26/400/400'
  }
];

export const LOCATION_DATA: LocationData = {
  'Telangana': {
    'Hyderabad': ['Hyderabad', 'Secunderabad'],
    'Warangal Urban': ['Warangal'],
    'Nizamabad': ['Nizamabad']
  },
  'Andhra Pradesh': {
    'Chittoor': ['Tirupati', 'Chittoor'],
    'SPSR Nellore': ['Nellore', 'Kavali'],
    'Krishna': ['Vijayawada'],
    'Visakhapatnam': ['Visakhapatnam'],
    'Guntur': ['Guntur'],
    'YSR Kadapa': ['Kadapa', 'Proddatur']
  },
  'Tamil Nadu': {
    'Chennai': ['Chennai', 'Tambaram'],
    'Coimbatore': ['Coimbatore']
  },
  'Karnataka': {
    'Bangalore Urban': ['Bangalore']
  },
  'Maharashtra': {
    'Mumbai City': ['Mumbai'],
    'Pune': ['Pune']
  },
  'Delhi': {
    'New Delhi': ['Delhi']
  },
  'Uttar Pradesh': {
    'Lucknow': ['Lucknow']
  },
  'Kerala': {
    'Ernakulam': ['Kochi']
  },
  'Rajasthan': {
    'Jaipur': ['Jaipur']
  },
  'West Bengal': {
    'Kolkata': ['Kolkata']
  },
  'Haryana': {
    'Gurugram': ['Gurgaon']
  }
};
