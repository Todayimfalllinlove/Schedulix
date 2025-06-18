
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, BookOpen, CheckCircle2, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

const Schedule = () => {
  // Mock data for demonstration - now with state management
  const [schedule, setSchedule] = useState([
    {
      day: "Monday",
      date: "2024-06-19",
      sessions: [
        { id: 1, subject: "Mathematics", time: "09:00 - 11:00", priority: "high", completed: false },
        { id: 2, subject: "Biology", time: "14:00 - 16:00", priority: "medium", completed: true }
      ]
    },
    {
      day: "Tuesday", 
      date: "2024-06-20",
      sessions: [
        { id: 3, subject: "History", time: "10:00 - 12:00", priority: "low", completed: false },
        { id: 4, subject: "Mathematics", time: "15:00 - 17:00", priority: "high", completed: false }
      ]
    },
    {
      day: "Wednesday",
      date: "2024-06-21", 
      sessions: [
        { id: 5, subject: "Biology", time: "09:00 - 11:00", priority: "medium", completed: false },
        { id: 6, subject: "Mathematics", time: "13:00 - 15:00", priority: "high", completed: false }
      ]
    }
  ]);

  const [editingSession, setEditingSession] = useState<number | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const toggleSessionComplete = (dayIndex: number, sessionId: number) => {
    setSchedule(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? {
              ...day,
              sessions: day.sessions.map(session =>
                session.id === sessionId 
                  ? { ...session, completed: !session.completed }
                  : session
              )
            }
          : day
      )
    );
  };

  const deleteSession = (dayIndex: number, sessionId: number) => {
    setSchedule(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? {
              ...day,
              sessions: day.sessions.filter(session => session.id !== sessionId)
            }
          : day
      )
    );
  };

  const editSession = (dayIndex: number, sessionId: number, newSubject: string) => {
    setSchedule(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? {
              ...day,
              sessions: day.sessions.map(session =>
                session.id === sessionId 
                  ? { ...session, subject: newSubject }
                  : session
              )
            }
          : day
      )
    );
    setEditingSession(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/available-time" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Daily Study Schedule</h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <Button variant="outline" size="sm">Edit Subjects</Button>
            <Button variant="outline" size="sm">Adjust Time</Button>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {schedule.map((day, dayIndex) => (
            <Card key={day.day} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{day.day}</h3>
                  <p className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {day.sessions.length} study session{day.sessions.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-3">
                {day.sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        {editingSession === session.id ? (
                          <input
                            type="text"
                            defaultValue={session.subject}
                            className="font-medium border rounded px-2 py-1"
                            onBlur={(e) => editSession(dayIndex, session.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                editSession(dayIndex, session.id, e.currentTarget.value);
                              }
                              if (e.key === 'Escape') {
                                setEditingSession(null);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <span className={`font-medium ${session.completed ? 'line-through text-gray-500' : ''}`}>
                            {session.subject}
                          </span>
                        )}
                      </div>
                      <Badge className={getPriorityColor(session.priority)}>
                        {session.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSession(session.id)}
                          disabled={editingSession === session.id}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSession(dayIndex, session.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={session.completed ? "default" : "outline"}
                          size="sm"
                          className={session.completed ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => toggleSessionComplete(dayIndex, session.id)}
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
          ))}
        </div>

        {/* Quick Summary */}
        <Card className="p-6 mt-8 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {schedule.reduce((acc, day) => acc + day.sessions.filter(s => s.completed).length, 0)}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">
                {schedule.reduce((acc, day) => acc + day.sessions.filter(s => !s.completed).length, 0)}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">33%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
