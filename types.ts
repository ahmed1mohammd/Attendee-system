
export interface Student {
  id: string;
  name: string;
  phone: string;
  groupId: string;
  qrCode: string;
  isPaid: boolean;
  attendanceCount: number;
}

export interface Group {
  id: string;
  name: string;
  days: string[];
  time: string;
  price: number;
  studentCount: number;
}

export interface Exam {
  id: string;
  name: string;
  groupId: string;
  date: string;
  maxScore: number;
}

export interface Transaction {
  id: string;
  studentName: string;
  amount: number;
  date: string;
  groupName: string;
}
