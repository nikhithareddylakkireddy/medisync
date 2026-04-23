export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  city: string;
  district: string;
  state: string;
  availability: string[];
  image: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface LocationData {
  [state: string]: {
    [district: string]: string[];
  };
}
