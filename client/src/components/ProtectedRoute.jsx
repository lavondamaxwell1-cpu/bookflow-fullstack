import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { isAdmin, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-lg">
          <p className="font-bold text-slate-700">Checking login...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
