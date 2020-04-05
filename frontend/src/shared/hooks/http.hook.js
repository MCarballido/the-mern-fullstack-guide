import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, method = "GET", body = null, headers = {}) => {
    setIsLoading(true);

    const httpAbortCtrller = new AbortController(); // this is an API supported in modern browsers
    activeHttpRequests.current.push(httpAbortCtrller);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrller.signal
        // this basically links the abort controller with this request in order to cancel it
        // later in case the request is still ongoing when the calling component is unmounting,
        // which might cause a state update once the request is finished
      });

      const responseData = await response.json();

      // we remove the controller which was used for this request that just completed
      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrls => reqCtrls !== httpAbortCtrller
      );

      if (!response.ok) throw new Error(responseData.message);

      setIsLoading(false);
      return responseData;
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  // this returns a function that is executed as a cleanup function before the next time this useEffect
  // is called or before the component unmounts (since there is no dependency it will execute when the
  // component unmounts)
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrller => abortCtrller.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
