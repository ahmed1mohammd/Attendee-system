
import { useState, useCallback } from 'react';

/**
 * هوك مخصص لإدارة طلبات الـ API داخل المكونات
 * يوفر حالات التحميل والخطأ بشكل تلقائي
 */

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall;
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, []);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null })
  };
}
