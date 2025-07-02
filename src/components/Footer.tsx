import { Heart, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border backdrop-blur shadow-inner">
      <div className="container mx-auto px-4 max-w-5xl p-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="/Img/logo.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
          <span className="font-semibold text-base md:text-lg text-foreground">Schedulix</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 text-xs md:text-sm">
          <span className="text-muted-foreground flex items-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1 animate-pulse" /> for students
          </span>
          <span className="text-muted-foreground flex items-center font-medium">
            By <span className="text-blue-600 ml-1">Ta2wall</span>
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <a href="https://github.com/Todayimfalllinlove" target="_blank" rel="noopener noreferrer" aria-label="Github">
            <Github className="h-6 w-6 text-muted-foreground hover:text-blue-600 transition-colors" />
          </a>
          <a href="https://www.linkedin.com/in/me/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6 text-muted-foreground hover:text-blue-600 transition-colors" />
          </a>
        </div>
        <div className="text-[10px] md:text-xs text-muted-foreground mt-2 md:mt-0">
          © 2025 Schedulix. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
