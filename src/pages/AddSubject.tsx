
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AddSubject = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    estimatedHours: "",
    priority: "",
    deadline: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.estimatedHours || !formData.priority || !formData.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newSubject = {
      id: Date.now(),
      ...formData,
      estimatedHours: parseInt(formData.estimatedHours)
    };

    setSubjects(prev => [...prev, newSubject]);
    setFormData({ name: "", estimatedHours: "", priority: "", deadline: "" });
    
    toast({
      title: "Subject Added",
      description: `${formData.name} has been added to your study plan`,
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Add Your Subjects</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add Subject Form */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Add New Subject</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Mathematics, Biology, History"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="hours">Estimated Study Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="e.g., 20"
                  min="1"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </form>
          </Card>

          {/* Added Subjects */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Your Subjects ({subjects.length})</h2>
            {subjects.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>No subjects added yet</p>
                <p className="text-sm">Add your first subject to get started</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {subjects.map((subject) => (
                  <div key={subject.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{subject.name}</h3>
                        <p className="text-sm text-gray-600">
                          {subject.estimatedHours} hours • {subject.priority} priority
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(subject.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subject.priority === 'high' ? 'bg-red-100 text-red-800' :
                        subject.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {subject.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {subjects.length > 0 && (
              <Button onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-700">
                Continue to Available Time
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;
