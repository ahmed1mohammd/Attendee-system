
export interface User {
  id: string;
  username: string;
  name: string;
  phone: string;
  role: 'Admin' | 'Manager';
  password?: string;
}

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
}

export interface AbsenceRecord {
  id: string;
  studentId: string;
  groupId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface Exam {
  id: string;
  name: string;
  groupId: string;
  date: string;
  maxScore: number;
  scores: Record<string, number>; // studentId -> score
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string; // تم الإضافة لدعم التجميع المالي
  amount: number;
  date: string;
  groupName: string;
}

export interface GroupFinanceSummary {
  groupId: string;
  groupName: string;
  sessionIncome: number;
  weeklyIncome: number;
  monthlyIncome: number;
}
