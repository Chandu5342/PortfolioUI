import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import CodingProfiles from "@/components/CodingProfiles";
import Projects from "@/components/Projects";
import LearningPlanner from "@/components/LearningPlanner";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminModal from "@/components/AdminModal";
import { getAuthToken } from "@/config/api";

const Index = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Check if user has valid token on mount
  useEffect(() => {
    const token = getAuthToken();
    setIsEditMode(!!token);
  }, []);

  const handleAdminClick = () => {
    if (isEditMode) {
      setIsEditMode(false);
      localStorage.removeItem('authToken');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsEditMode(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onAdminClick={handleAdminClick} isEditMode={isEditMode} />
      <Hero isEditMode={isEditMode} />
      <About isEditMode={isEditMode} />
      <Skills isEditMode={isEditMode} />
      <CodingProfiles isEditMode={isEditMode} />
      <Projects isEditMode={isEditMode} />
      <LearningPlanner isEditMode={isEditMode} />
      <Resume isEditMode={isEditMode} />
      <Contact />
      <Footer />
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
};

export default Index;




