
/**
 * محرك الطلبات المركزي (API Service)
 * يتم استخدامه للتعامل مع خادم الـ Backend
 */

const API_BASE_URL = 'https://api.yourschool.com/v1'; // استبدله برابط السيرفر الحقيقي

interface RequestOptions extends RequestInit {
  body?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('auth_token'); // جلب التوكن من التخزين المحلي
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // معالجة استجابة السيرفر
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // إذا كانت الاستجابة فارغة (مثل 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// تصدير الكائن النهائي للاستخدام المباشر
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'PUT', body }),
    
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
