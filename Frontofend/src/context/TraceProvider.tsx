import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClients';

export const TraceProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('yolo_token');
    
    if (!token) {
      if (location.pathname !== '/login') {
        console.warn("Trace skipped: No token yet.");
      }
      return;
    }

    const recordTrace = async () => {
      try {
        await axiosClient.post('/trace/log', {
          action: "VIEW_PAGE",
          module: location.pathname.split('/').filter(Boolean).pop()?.toUpperCase() || "DASHBOARD",
          details: `Admin navigated to ${location.pathname}`
        });
      } catch (err) {
        console.error("Audit Trace Failed:", err);
      }
    };

    recordTrace();
  }, [location.pathname]); 

  return <>{children}</>;
};