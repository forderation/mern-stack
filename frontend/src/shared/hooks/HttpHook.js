import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [loadingState, setLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (aHR) => aHR !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message);
        setLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { loadingState, error, sendRequest, clearError };
};
