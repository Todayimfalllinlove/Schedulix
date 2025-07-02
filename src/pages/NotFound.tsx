import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorative elements */}
      <div className="absolute">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center relative">
        <Card className="p-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl max-w-md mx-4">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                404
              </h1>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Page not found
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <span className="font-medium">Attempted URL:</span> {location.pathname}
            </div>

            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 mt-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <Home className="w-5 h-5 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <div className="absolute bottom-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 ScheduleFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
