
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AvailableTime = () => {
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState({
    monday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    tuesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    wednesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    thursday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    friday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    saturday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    sunday: { enabled: false, startTime: "09:00", endTime: "17:00" }
  });

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ];

  const toggleDay = (day: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const updateTime = (day: string, field: string, value: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleContinue = () => {
    const enabledDays = Object.values(timeSlots).filter(slot => slot.enabled);
    if (enabledDays.length === 0) {
      toast({
        title: "No Time Selected",
        description: "Please select at least one day with available study time",
        variant: "destructive"
      });
      return;
    }
    navigate("/schedule");
  };

  const getTotalHours = () => {
    return Object.values(timeSlots).reduce((total, slot) => {
      if (!slot.enabled) return total;
      const start = new Date(`2000-01-01 ${slot.startTime}`);
      const end = new Date(`2000-01-01 ${slot.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + Math.max(0, hours);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/add-subject" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Set Your Available Time</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Weekly Schedule</h2>
              <div className="text-sm text-gray-600">
                Total: <span className="font-medium text-blue-600">{getTotalHours().toFixed(1)} hours/week</span>
              </div>
            </div>

            <div className="space-y-4">
              {days.map((day) => (
                <div key={day.key} className="flex items-center space-x-4 p-4 border rounded-lg bg-white">
                  <div className="flex items-center space-x-3 min-w-[120px]">
                    <Switch
                      checked={timeSlots[day.key].enabled}
                      onCheckedChange={() => toggleDay(day.key)}
                    />
                    <Label className="font-medium">{day.label}</Label>
                  </div>

                  {timeSlots[day.key].enabled && (
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`${day.key}-start`} className="text-sm">From:</Label>
                        <Input
                          id={`${day.key}-start`}
                          type="time"
                          value={timeSlots[day.key].startTime}
                          onChange={(e) => updateTime(day.key, "startTime", e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`${day.key}-end`} className="text-sm">To:</Label>
                        <Input
                          id={`${day.key}-end`}
                          type="time"
                          value={timeSlots[day.key].endTime}
                          onChange={(e) => updateTime(day.key, "endTime", e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {(() => {
                          const start = new Date(`2000-01-01 ${timeSlots[day.key].startTime}`);
                          const end = new Date(`2000-01-01 ${timeSlots[day.key].endTime}`);
                          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                          return `${Math.max(0, hours).toFixed(1)}h`;
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center">
            <Button onClick={handleContinue} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Generate My Study Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableTime;
