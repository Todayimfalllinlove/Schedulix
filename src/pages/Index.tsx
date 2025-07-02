import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Target, ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="absolute">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Smart Study Planning Made Easy
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create personalized study schedules automatically based on your subjects,
            available time, and priorities. Study smarter, not harder.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Target className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white">Smart Scheduling</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">AI-powered scheduling based on your priorities and deadlines</p>
          </Card>
          <Card className="p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Clock className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white">Time Optimization</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">Make the most of your available study hours</p>
          </Card>
          <Card className="p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Calendar className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white">Flexible Planning</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">Adapt to your changing schedule and priorities</p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/add-subject">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Planning Your Studies
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-6">
            Free to use • Takes 5 minutes
          </p>
        </div>

      </div>
    </div>
  );
};

export default Index;
