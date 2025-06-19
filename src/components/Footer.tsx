
import { BookOpen, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-foreground">Auto Study Planner</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Create personalized study schedules automatically. Study smarter, not harder.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a href="/add-subject" className="block text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                Add Subject
              </a>
              <a href="/available-time" className="block text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                Set Available Time
              </a>
              <a href="/schedule" className="block text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                View Schedule
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Features
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Smart Scheduling</p>
              <p className="text-sm text-muted-foreground">Time Optimization</p>
              <p className="text-sm text-muted-foreground">Flexible Planning</p>
              <p className="text-sm text-muted-foreground">Priority Management</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Auto Study Planner. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground flex items-center">
                Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for students
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
