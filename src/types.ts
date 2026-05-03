export interface PrescriptionInfo {
  medicineName: string;
  dosage: string;
  timing: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  instructions: string;
  simplifiedInstructions: string;
  warnings: string[];
  ageWarnings?: string;
  genderWarnings?: string;
}

export interface MedicineReminder {
  id: string;
  medicineName: string;
  time: string; // ISO string or HH:mm
  instructions: string;
  taken: boolean;
}

export interface UserSettings {
  age?: number;
  gender?: 'male' | 'female' | 'other';
}
