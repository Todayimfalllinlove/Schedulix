import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-500 text-lg">
        <i className="fas fa-spinner fa-spin mr-2"></i> Permission Checking...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute; 