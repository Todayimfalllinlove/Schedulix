
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Auto Study Planner</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create personalized study schedules automatically based on your subjects, 
            available time, and priorities. Study smarter, not harder.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-gray-600">AI-powered scheduling based on your priorities and deadlines</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Time Optimization</h3>
            <p className="text-gray-600">Make the most of your available study hours</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Flexible Planning</h3>
            <p className="text-gray-600">Adapt to your changing schedule and priorities</p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/add-subject">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Start Planning Your Studies
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No account needed • Free to use • Takes 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
