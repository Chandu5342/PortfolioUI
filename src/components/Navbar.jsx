import { useState, useEffect } from "react";
import { Menu, X, Lock, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ onAdminClick, isEditMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "coding-profiles", label: "Coding & Problem Solving" },
    { id: "projects", label: "Projects" },
    { id: "learning", label: "Learning" },
    { id: "resume", label: "Resume" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-card py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl font-bold gradient-text hover:scale-105 transition-transform"
          >
            CK
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button
              onClick={onAdminClick}
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              className="gap-2"
            >
              <Lock className="w-4 h-4" />
              {isEditMode ? "Exit Edit" : "Admin"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left text-foreground hover:text-primary transition-colors py-2"
              >
                {link.label}
              </button>
            ))}

            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2 flex-1">
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? "Light" : "Dark"}
              </Button>

              <Button
                onClick={() => {
                  onAdminClick();
                  setIsMobileMenuOpen(false);
                }}
                variant={isEditMode ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2"
              >
                <Lock className="w-4 h-4" />
                Admin
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
