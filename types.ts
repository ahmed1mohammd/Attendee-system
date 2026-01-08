
export interface Student {
  id: string;
  name: string;
  phone: string;
  groupId: string;
  qrCode: string;
}

export interface Group {
  id: string;
  name: string;
  schedule: string[]; // e.g., ["الأحد", "الثلاثاء"]
  lecturePrice: number;
}

export interface Attendance {
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
  maxScore: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  score: number;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  description: string;
}
