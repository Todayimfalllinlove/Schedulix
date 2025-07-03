import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, BookOpen, CheckCircle2, Edit2, Trash2, Plus, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/lib/supabaseClient";
import { isWithinInterval, parseISO, startOfWeek, endOfWeek } from 'date-fns';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('schedule')
        .select(`
          id,
          date,
          time,
          completed,
          created_at,
          updated_at,
          subjects (
            id,
            name,
            priority
          )
        `)
        .eq('user_id', user.id)
        .eq('archived', false)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (data) {
        setSchedule(data);
      } else {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedule();
    (window as any).fetchSchedule = fetchSchedule;
  }, []);


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const toggleSessionComplete = async (sessionId, completed) => {
    await supabase
      .from('schedule')
      .update({ completed: !completed })
      .eq('id', sessionId);

    if ((window as any).fetchSchedule) {
      await (window as any).fetchSchedule();
    }
  };

  const handleDeleteSession = async (id: number, subjectId: number) => {
    // ลบ session (schedule)
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    // ลบ subject ออกจาก subjects table ทันที
    await supabase.from('subjects').delete().eq('id', subjectId);

    setSchedule(prev => prev.filter(session => session.id !== id));
  };


  const getDayNameFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string provided:", dateString);
      return "Invalid Date";
    }
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const sessionsByDate = schedule.reduce((acc, session) => {
    if (!acc[session.date]) acc[session.date] = [];
    acc[session.date].push(session);
    return acc;
  }, {});

  const daysWithSessions = Object.entries(sessionsByDate);

  const totalSessions = daysWithSessions.length;
  const completedSessions = daysWithSessions.reduce(
    (total, [date, sessions]) => total + (sessions as any[]).filter(session => session.completed).length,
    0
  );
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const sessionsThisWeek = schedule.filter(session =>
    isWithinInterval(parseISO(session.date), { start, end })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      
      <div className="absolute overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-8 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-y-4 sm:gap-y-0">
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
            <Link to="/add-subject" className="hidden sm:inline-flex mr-0 sm:mr-4 w-full sm:w-auto">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto hover:bg-white/20 dark:hover:bg-gray-800/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start mt-4 sm:mt-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3 flex items-center justify-center shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center sm:text-left">Daily Study Schedule</h1>
            </div>
          </div>
        </div>

        {daysWithSessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto w-full">
            <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl w-full">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSessions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl w-full">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedSessions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl w-full">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completionRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="space-y-6 max-w-4xl mx-auto w-full">
          {daysWithSessions.length > 0 ? (
            daysWithSessions.map(([date, sessions], dayIndex) => {
              return (
                <Card key={date} className="p-4 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-y-4 sm:gap-y-0">
                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-start">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{getDayNameFromDate(date)}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right w-full sm:w-auto">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Study Sessions</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {(sessions as any[]).length}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(sessions as any[]).map((session) => (
                      <div key={session.id} className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 gap-y-4 sm:gap-y-0 ${session.completed
                        ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                        : 'bg-white/50 dark:bg-gray-700/50 hover:shadow-lg'
                        }`}>
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-start">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${session.completed
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600'
                              }`}>
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                              
                              <span className={`font-semibold text-base sm:text-lg ${session.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{session.subjects?.name || "Deleted Subject"}</span>
                            
                          </div>
                          <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(session.subjects?.priority)}`}>{session.subjects?.priority || "N/A"}</Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-end">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{session.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSession(session.id, session.subjects.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={session.completed ? "default" : "outline"}
                              size="sm"
                              className={`${session.completed
                                ? 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-800 dark:hover:bg-green-900'
                                : 'border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                } transition-all duration-200 w-full sm:w-auto`}
                              onClick={() => toggleSessionComplete(session.id, session.completed)}
                            >
                              {session.completed ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Completed
                                </>
                              ) : (
                                "Mark Complete"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl w-full">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-3xl mx-auto flex items-center justify-center shadow-lg">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">No Study Sessions</h3>
                  <p className="text-gray-600 dark:text-gray-400">All your study sessions have been completed or removed.</p>
                </div>
                <Link to="/add-subject">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 mt-4 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Subject
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default Schedule;
