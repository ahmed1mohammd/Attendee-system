
const BASE_URL = 'https://api.yoursystem.com/v1';

// Mock Data Storage for Demo
const MOCK_DATA: Record<string, any> = {
  '/auth/me': { id: '1', username: 'admin', name: 'المهندس المشرف', role: 'Admin', phone: '0100000000' },
  '/dashboard/stats': {
    studentsCount: 156,
    groupsCount: 8,
    totalIncome: 12450,
    examsCount: 24,
    recentPayments: [
      { id: '1', studentName: 'أحمد محمد علي', amount: 150, groupName: 'مجموعة العباقرة (A1)', date: '2024-05-20' },
      { id: '2', studentName: 'سارة محمود', amount: 200, groupName: 'مجموعة التميز (B2)', date: '2024-05-20' },
      { id: '3', studentName: 'ياسين حسن', amount: 150, groupName: 'مجموعة العباقرة (A1)', date: '2024-05-19' },
    ]
  },
  '/groups': [
    { id: 'g1', name: 'مجموعة العباقرة (A1)', price: 150, days: ['الأحد', 'الثلاثاء'], time: '04:00 م' },
    { id: 'g2', name: 'مجموعة التميز (B2)', price: 200, days: ['الاثنين', 'الخميس'], time: '06:00 م' },
  ],
  '/students': [
    { id: 's1', name: 'أحمد محمد علي', phone: '01012345678', groupId: 'g1', qrCode: 'STU-9921', isPaid: true, attendanceCount: 5 },
    { id: 's2', name: 'سارة محمود ذكي', phone: '01298765432', groupId: 'g2', qrCode: 'STU-8832', isPaid: false, attendanceCount: 2 },
    { id: 's3', name: 'ياسين حسن كمال', phone: '01155667788', groupId: 'g1', qrCode: 'STU-7743', isPaid: true, attendanceCount: 8 },
  ],
  '/payments': [
    { id: 'p1', studentId: 's1', studentName: 'أحمد محمد علي', groupId: 'g1', amount: 150, date: '2024-05-20', groupName: 'مجموعة العباقرة (A1)' },
    { id: 'p2', studentId: 's2', studentName: 'سارة محمود ذكي', groupId: 'g2', amount: 200, date: '2024-05-20', groupName: 'مجموعة التميز (B2)' },
    { id: 'p3', studentId: 's3', studentName: 'ياسين حسن كمال', groupId: 'g1', amount: 150, date: '2024-05-20', groupName: 'مجموعة العباقرة (A1)' },
    { id: 'p4', studentId: 's1', studentName: 'أحمد محمد علي', groupId: 'g1', amount: 150, date: '2024-05-18', groupName: 'مجموعة العباقرة (A1)' },
  ],
  '/payments/stats': { daily: 1450, weekly: 12850, monthly: 48000 },
  '/payments/group-summaries': [
    { groupId: 'g1', groupName: 'مجموعة العباقرة (A1)', sessionIncome: 450, weeklyIncome: 3150, monthlyIncome: 12600 },
    { groupId: 'g2', groupName: 'مجموعة التميز (B2)', sessionIncome: 800, weeklyIncome: 5600, monthlyIncome: 22400 },
    { groupId: 'g3', groupName: 'مجموعة الأوائل (C3)', sessionIncome: 200, weeklyIncome: 4100, monthlyIncome: 13000 },
  ],
  '/exams': [
    { id: 'e1', name: 'امتحان شهر أكتوبر', groupId: 'g1', maxScore: 50, date: '2023-10-20', scores: {} },
    { id: 'e2', name: 'اختبار مفاجئ 1', groupId: 'g2', maxScore: 20, date: '2023-10-22', scores: {} },
  ],
  '/users': [
    { id: '1', username: 'admin', name: 'المهندس المشرف', role: 'Admin', phone: '0100000000' },
    { id: '2', username: 'manager1', name: 'أستاذ محمد', role: 'Manager', phone: '0120000000' },
  ]
};

export class ApiClient {
  private static getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private static async handleResponse(response: Response, path: string) {
    if (!response.ok) {
      const cleanPath = path.split('?')[0];
      if (MOCK_DATA[cleanPath] || MOCK_DATA[path]) {
        return MOCK_DATA[cleanPath] || MOCK_DATA[path];
      }
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '#/login';
      }
      const error = await response.json().catch(() => ({ message: 'Unexpected Error' }));
      throw new Error(error.message || 'API Request Failed');
    }
    return response.status === 204 ? null : response.json();
  }

  static async get<T>(path: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response, path);
    } catch (e) {
      const cleanPath = path.split('?')[0];
      if (MOCK_DATA[cleanPath] || MOCK_DATA[path]) return MOCK_DATA[cleanPath] || MOCK_DATA[path];
      throw e;
    }
  }

  static async post<T>(path: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response, path);
    } catch (e) {
      return { id: 'mock-' + Date.now(), ...data } as T;
    }
  }

  static async put<T>(path: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response, path);
    } catch (e) {
      return data as T;
    }
  }

  static async delete(path: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      await this.handleResponse(response, path);
    } catch (e) {
      console.log(`Mock DELETE to ${path}`);
    }
  }
}
