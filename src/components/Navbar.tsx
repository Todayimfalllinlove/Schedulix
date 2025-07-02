import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => setProfile(data));
    } else {
      setProfile(null);
    }
  }, [session?.user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/auth");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/pomodoros", label: "Pomodoros" },
    { path: "/add-subject", label: "Add Subject" },
    { path: "/schedule", label: "Schedule" },
  ];

  return (
    <nav className="backdrop-blur bg-background/80 shadow-lg border-b border-border rounded-b-xl sticky top-0 z-30 transition-all">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group transition-transform hover:scale-105">
            <img src="/Img/logo.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
            <span
              className="text-lg md:text-xl font-bold group-hover:text-blue-700 transition-colors"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Schedulix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-1.5 text-sm md:text-base font-medium transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400/50
                  ${location.pathname === item.path
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-muted-foreground hover:text-blue-600 hover:bg-muted"}
                `}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                )}
              </Link>
            ))}
            <ThemeToggle />
            {session ? (
              <Link to="/dashboard">
                <Avatar className="ml-2 cursor-pointer h-8 w-8 md:h-9 md:w-9 border-2 border-blue-400">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg" } className="object-cover w-full h-full" />
                  <AvatarFallback>
                    {profile?.full_name
                      ? profile.full_name.split(' ').map(n => n[0]).join('')
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="ml-2 bg-green-500 text-white text-sm md:text-base">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            {session ? (
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-blue-400 mx-2 my-2 cursor-pointer">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} className="object-cover w-full h-full" />
                  <AvatarFallback>
                    {profile?.full_name
                      ? profile.full_name.split(' ').map(n => n[0]).join('')
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-sm md:text-base font-medium rounded-ful transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="border-t bg-background rounded-b-xl shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-sm md:text-base font-medium rounded-full transition-all
                    ${location.pathname === item.path
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow"
                      : "text-muted-foreground hover:text-blue-600 hover:bg-muted"}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
