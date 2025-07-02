import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Clock, Calendar, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { startOfWeek, addDays, format } from 'date-fns';

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
    { key: "monday", label: "Monday", color: "from-red-500 to-pink-600" },
    { key: "tuesday", label: "Tuesday", color: "from-orange-500 to-red-600" },
    { key: "wednesday", label: "Wednesday", color: "from-yellow-500 to-orange-600" },
    { key: "thursday", label: "Thursday", color: "from-green-500 to-emerald-600" },
    { key: "friday", label: "Friday", color: "from-blue-500 to-cyan-600" },
    { key: "saturday", label: "Saturday", color: "from-indigo-500 to-blue-600" },
    { key: "sunday", label: "Sunday", color: "from-purple-500 to-pink-600" }
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

  const handleContinue = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: subjects } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id);

    if (!subjects || subjects.length === 0) {
      toast({
        title: "No Subjects Added",
        description: "Please add at least one subject before continuing",
        variant: "destructive"
      });
      return;
    }

    const enabledDays = Object.entries(timeSlots).filter(([_, slot]) => slot.enabled);
    if (enabledDays.length === 0) {
      toast({
        title: "No Time Selected",
        description: "Please select at least one day with available study time",
        variant: "destructive"
      });
      return;
    }

    // ดึง sessions เดิมทั้งหมดของ user
    const { data: existingSessions } = await supabase
      .from('schedule')
      .select('*')
      .eq('user_id', user.id);

    // Generate sessions เฉพาะที่ยังไม่มีในตาราง
    const sessions = [];
    const dayIndexMap = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6,
    };

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday

    enabledDays.forEach(([key, slot]) => {
      const date = format(addDays(weekStart, dayIndexMap[key]), 'yyyy-MM-dd');
      subjects.forEach(subject => {
        const alreadyExists = existingSessions?.some(
          s => s.subject_id === subject.id &&
               s.date === date &&
               s.time === slot.startTime &&
               s.archived === false
        );
        if (!alreadyExists) {
          sessions.push({
            user_id: user.id,
            subject_id: subject.id,
            date,
            time: slot.startTime,
            completed: false,
            subject_name: subject.name,
            subject_estimated_hours: subject.estimated_hours,
            subject_priority: subject.priority,
            archived: false
          });
        }
      });
    });

    if (sessions.length > 0) {
      const { error } = await supabase.from('schedule').insert(sessions);
      if (error) {
        toast({
          title: "Error Generating Schedule",
          description: "There was an error generating your study schedule. Please try again later.",
          variant: "destructive"
        });
        return;
      }
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

  const [schedule, setSchedule] = useState([]);

  const fetchSchedule = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: scheduleData } = await supabase
      .from('schedule')
      .select('*')
      .eq('user_id', user.id);
    setSchedule(scheduleData || []);
  };

  const markSessionComplete = async (sessionId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('schedule')
      .update({ completed: true })
      .eq('id', sessionId)
      .eq('user_id', user.id);
    if (error) {
      toast({
        title: "Error Marking Session as Complete",
        description: "There was an error marking the session as complete. Please try again later.",
        variant: "destructive"
      });
    } else {
      fetchSchedule();
    }
  };

  const deleteSession = async (sessionId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id);
    if (error) {
      toast({
        title: "Error Deleting Session",
        description: "There was an error deleting the session. Please try again later.",
        variant: "destructive"
      });
    } else {
      fetchSchedule();
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
          <Link to="/add-subject" className="mr-4 hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="hover:bg-white/20 dark:hover:bg-gray-800/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3 flex items-center justify-center shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Set Your Available Time</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl mb-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Schedule</h2>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Available Time</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getTotalHours().toFixed(1)} hours/week
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {days.map((day) => {
                const enabled = timeSlots[day.key].enabled;
                return (
                  <div
                    key={day.key}
                    className={`flex items-center space-x-4 p-6 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 ${enabled
                        ? 'bg-white/80 dark:bg-gray-700/80 shadow-lg border-blue-200 dark:border-blue-700'
                        : 'bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    <div className="flex items-center space-x-4 min-w-[200px]">
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => toggleDay(day.key)}
                      />
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${enabled ? `bg-gradient-to-r ${day.color}` : 'bg-gray-200 dark:bg-gray-700'}`}>
                          <span className={`text-sm font-bold ${enabled ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {day.label.charAt(0)}
                          </span>
                        </div>
                        <Label className={`font-semibold ${enabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {day.label}
                        </Label>
                      </div>
                    </div>

                    {enabled && (
                      <div className="flex items-center space-x-6 flex-1">
                        <div className="flex items-center space-x-3">
                          <Label htmlFor={`${day.key}-start`} className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</Label>
                          <Input
                            id={`${day.key}-start`}
                            type="time"
                            value={timeSlots[day.key].startTime}
                            onChange={(e) => updateTime(day.key, "startTime", e.target.value)}
                            className="w-36 h-10 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Label htmlFor={`${day.key}-end`} className="text-sm font-medium text-gray-700 dark:text-gray-300">To:</Label>
                          <Input
                            id={`${day.key}-end`}
                            type="time"
                            value={timeSlots[day.key].endTime}
                            onChange={(e) => updateTime(day.key, "endTime", e.target.value)}
                            className="w-36 h-10 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
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
                );
              })}
            </div>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Create My Study Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableTime;
