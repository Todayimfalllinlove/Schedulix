import { Navigate } from "react-router-dom"
import { useSession } from "@/lib/useSession" 

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { session, loading } = useSession()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-500 text-lg">
        <i className="fas fa-spinner fa-spin mr-2"></i> Permission Checking...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute
