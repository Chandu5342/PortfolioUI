import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { AboutEditModal } from "./AboutEditModal";
import { aboutAPI } from "@/config/api";

const About = ({ isEditMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch about data from API
  const { data: aboutData = {}, isLoading, refetch } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      try {
        const response = await aboutAPI.get();
        return response.data || {};
      } catch (error) {
        console.error('Failed to fetch about data:', error);
        return {};
      }
    },
  });

  const handleSaveAbout = async (formData) => {
    try {
      if (aboutData._id) {
        await aboutAPI.update(formData);
      } else {
        await aboutAPI.create(formData);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to save about:', error);
    }
  };

  // Default data if API returns empty
  const displayData = {
    title: aboutData.title || "Full Stack Developer & Tech Enthusiast",
    description: aboutData.description || "Passionate about building innovative web solutions",
    image: aboutData.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    experience: aboutData.experience || "2+ years",
  };

  return (
    <section id="about" className="py-20 relative">
      {isEditMode && (
        <Button
          className="absolute top-4 right-4 z-10 gap-2"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Edit2 className="w-4 h-4" />
          Edit About
        </Button>
      )}

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          About <span className="gradient-text">Me</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-12" />

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading about information...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image - Left side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex justify-center md:order-1"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-2xl opacity-50" />
                  <div className="relative glass-card p-2 rounded-2xl">
                    <img
                      src={displayData.image}
                      alt="About"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Text - Right side with more padding */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-6 md:order-2 md:pl-8"
              >
                <h3 className="text-xl font-semibold">{displayData.title}</h3>
                
                <div className="space-y-4 text-justify leading-relaxed">
                  {displayData.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="glass-card p-4 rounded-lg">
                  <h4 className="text-lg font-bold">{displayData.experience}</h4>
                  <p className="text-sm text-muted-foreground">Experience</p>
                </div>
              </motion.div>
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 pt-12 border-t border-border"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-6 rounded-xl text-center"
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">10+</p>
                  <p className="text-sm md:text-base text-muted-foreground">Projects Completed</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-6 rounded-xl text-center"
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">2+</p>
                  <p className="text-sm md:text-base text-muted-foreground">Years Experience</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-6 rounded-xl text-center col-span-2 md:col-span-1"
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</p>
                  <p className="text-sm md:text-base text-muted-foreground">Passionate Developer</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {isEditMode && (
        <AboutEditModal
          about={aboutData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAbout}
        />
      )}
    </section>
  );
};

export default About;
