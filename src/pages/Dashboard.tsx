import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import UserProfile from "@/components/UserProfile";

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);

  // Get completed sessions from Supabase for current week
  const [weeklyCompletedSessions, setWeeklyCompletedSessions] = useState([]);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchCompletedSessions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setWeeklyCompletedSessions([]);
        return;
      }

      // Get current week range
      const now = new Date();
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });

      // Fetch all completed sessions for this user
      const { data: sessions, error } = await supabase
        .from('schedule')
        .select(`
          *,
          subjects (
            name,
            priority
          )
        `)
        .eq('user_id', user.id)
        .eq('completed', true);

      if (!sessions) {
        setWeeklyCompletedSessions([]);
        return;
      }

      // Filter for current week
      const completedThisWeek = sessions.filter(session =>
        isWithinInterval(parseISO(session.date), { start, end })
      );
      setWeeklyCompletedSessions(completedThisWeek);
    };

    fetchCompletedSessions();
  }, []);

  // For weekly overview, show unique subjects (name and priority only)
  const uniqueSubjectsThisWeek = [];
  const seenSubjects = new Set();
  for (const session of weeklyCompletedSessions) {
    const key = session.subjects?.name + '|' + session.subjects?.priority;
    if (!seenSubjects.has(key)) {
      seenSubjects.add(key);
      uniqueSubjectsThisWeek.push({
        subject: session.subjects?.name,
        priority: session.subjects?.priority
      });
    }
  }
  const weeklyOverview = uniqueSubjectsThisWeek;
  const completedSubjects = uniqueSubjectsThisWeek;
  const incompleteSubjects = [];


  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch schedule
      const { data: scheduleData } = await supabase
        .from('schedule')
        .select(`*, subjects (estimated_hours)`)
        .eq('user_id', user.id);
      setSchedule(scheduleData || []);

      // Fetch subjects
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id);
      setSubjects(subjectsData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoadingProfile(true);
      console.log("Fetching user and profile...");

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        console.log("No user found. Setting profile to null.");
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      let { data: profileData, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        console.log("Profile not found for user, creating new profile...");

        const { data: newProfileData, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: '',
              avatar_url: null,
              study_goal: '',
              preferred_time: ''
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating new profile:", insertError.message);
          setProfile(null);
        } else {
          console.log("New profile created:", newProfileData);
          setProfile(newProfileData);
        }
      } else if (fetchError) {
        console.error("Error fetching profile:", fetchError);

        setProfile(null);
      } else {
        setProfile(profileData);
      }
      setLoadingProfile(false);
    };
    fetchUserAndProfile();
  }, []);

  // Calculate stats
  const now = new Date()
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const sessionsThisWeek = schedule.filter(session =>
    isWithinInterval(parseISO(session.date), { start, end })
  );

  // รวมเฉพาะ unique subject
  const uniqueSubjects = {};
  sessionsThisWeek.forEach(s => {
    if (s.subject_id && !uniqueSubjects[s.subject_id]) {
      uniqueSubjects[s.subject_id] = s.subject_estimated_hours || 0;
    }
  });
  const totalHours = (Object.values(uniqueSubjects) as number[]).reduce((sum, h) => sum + h, 0);

  const completedSubjectsThisWeek = sessionsThisWeek
    .filter(s => s.completed)
    .map(s => s.subjects?.name)
    .filter((name, idx, arr) => name && arr.indexOf(name) === idx);

  const completedCount = completedSubjectsThisWeek.length;

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorative elements */}
      <div className="absolute">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4 flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile</h1>
          </div>
          <Link to="/schedule">
            <Button variant="outline" size="sm" className="hover:bg-white/20 dark:hover:bg-gray-800/20 border-gray-300 dark:border-gray-600">
              <ArrowRight className="h-4 w-4 mr-2" />
              View Full Schedule
            </Button>
          </Link>
        </div>

        {/* Profile Only */}
        <div className="max-w-3xl mx-auto">
          {loadingProfile ? (
            <div>Loading profile...</div>
          ) : user && profile ? (
            <UserProfile user={user} profile={profile} setProfile={setProfile} />
          ) : (
            <div>No profile found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;