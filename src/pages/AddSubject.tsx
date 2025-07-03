import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';

const AddSubject = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    estimatedHours: "",
    priority: "",
    deadline: ""
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id);
      setSubjects(subjectsData || []);
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.estimatedHours || !formData.priority || !formData.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const { error } = await supabase.from('subjects').insert([
      {
        user_id: user.id,
        name: formData.name,
        estimated_hours: parseInt(formData.estimatedHours),
        priority: formData.priority,
        deadline: formData.deadline,
      }
    ]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Subject Added",
      description: `${formData.name} has been added to your study plan`,
    });
    navigate("/available-time");
  };

  const handleContinue = () => {
    if (subjects.length === 0) {
      toast({
        title: "No Subjects Added",
        description: "Please add at least one subject before continuing",
        variant: "destructive"
      });
      return;
    }
    navigate("/available-time");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">

        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/" className="mr-4 hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="hover:bg-white/20 dark:hover:bg-gray-800/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3 flex items-center justify-center shadow-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Add Your Subjects</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Add Subject Form */}
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Add New Subject</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subject Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Mathematics, Biology, History"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estimated Study Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="e.g., 20"
                  min="1"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  className="h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Priority Level</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;
