
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, BookOpen, Clock, Target } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    studyGoal: "8 hours per week",
    preferredTime: "Evening"
  });

  // Weekly overview data moved from Schedule page
  const weeklyOverview = [
    { subject: "Mathematics", totalHours: 8, completedHours: 2, priority: "high", deadline: "2024-07-01" },
    { subject: "Biology", totalHours: 6, completedHours: 2, priority: "medium", deadline: "2024-06-28" },
    { subject: "History", totalHours: 4, completedHours: 0, priority: "low", deadline: "2024-07-05" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleProfileUpdate = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <Link to="/schedule">
            <Button variant="outline" size="sm">
              View Full Schedule
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Weekly Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">This Week's Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">18</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">14</div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">22%</div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
              </div>
            </Card>

            {/* Weekly Progress Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Weekly Progress Overview</h3>
              <div className="space-y-4">
                {weeklyOverview.map((subject) => (
                  <div key={subject.subject} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{subject.subject}</h4>
                        <Badge className={getPriorityColor(subject.priority)}>
                          {subject.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Due: {new Date(subject.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                          Progress: {subject.completedHours}/{subject.totalHours} hours
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(subject.completedHours / subject.totalHours) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="font-medium text-blue-600">
                        {Math.round((subject.completedHours / subject.totalHours) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/add-subject">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium">Add Subject</h4>
                    <p className="text-sm text-gray-600">Add a new subject to study</p>
                  </Card>
                </Link>
                <Link to="/available-time">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium">Set Time</h4>
                    <p className="text-sm text-gray-600">Update your availability</p>
                  </Card>
                </Link>
                <Link to="/schedule">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium">View Schedule</h4>
                    <p className="text-sm text-gray-600">See your study plan</p>
                  </Card>
                </Link>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Information */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="flex items-center space-x-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studyGoal">Weekly Study Goal</Label>
                    <Input
                      id="studyGoal"
                      value={userProfile.studyGoal}
                      onChange={(e) => handleProfileUpdate('studyGoal', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Study Time</Label>
                    <Input
                      id="preferredTime"
                      value={userProfile.preferredTime}
                      onChange={(e) => handleProfileUpdate('preferredTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {/* Study Preferences */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Study Preferences</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Get reminded about your study sessions</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-Schedule</h4>
                      <p className="text-sm text-gray-600">Automatically generate weekly schedules</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Break Reminders</h4>
                      <p className="text-sm text-gray-600">Get notified to take breaks during study</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
