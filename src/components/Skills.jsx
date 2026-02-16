import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { SkillEditModal } from "./SkillEditModal";
import { skillsAPI } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

const Skills = ({ isEditMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const { toast } = useToast();

  // Fetch skills from API
  const { data: skillsData = [], isLoading, refetch } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      try {
        const response = await skillsAPI.getAll();
        // Handle the flat array of skills returned by the API
        if (Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        return [];
      }
    },
  });

  const handleAddSkill = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleEditSkill = (skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (formData) => {
    try {
      if (selectedSkill && selectedSkill._id) {
        await skillsAPI.update(selectedSkill._id, formData);
        toast({
          title: "Success",
          description: "Skill updated successfully",
        });
      } else {
        await skillsAPI.create(formData);
        toast({
          title: "Success",
          description: "Skill created successfully",
        });
      }
      setIsModalOpen(false);
      await refetch();
    } catch (error) {
      console.error('Failed to save skill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save skill",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await skillsAPI.delete(skillId);
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
      setIsModalOpen(false);
      await refetch();
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive"
      });
    }
  };

  const categories = ["Frontend", "Backend", "Programming Languages", "Tools & Technologies", "Database"];

  // Sort skills by newest date (updatedAt or createdAt) descending
  const sortedSkills = [...skillsData].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bDate - aDate;
  });

  // Group skills by category for display (preserve sorted order)
  const groupedSkills = categories.reduce((acc, category) => {
    acc[category] = sortedSkills.filter((skill) => skill.category === category);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              My <span className="gradient-text">Skills</span>
            </h2>

            {isEditMode && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={handleAddSkill}
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </Button>
            )}
          </div>

          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mb-12" />

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading skills...</p>
            </div>
          ) : skillsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No skills data available</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {categories.map((category, categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {groupedSkills[category]?.map((skill, index) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          delay: categoryIndex * 0.1 + index * 0.05,
                          duration: 0.2,
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="glass-card p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
                      >
                        {isEditMode && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleEditSkill(skill)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                        <div className="text-primary text-5xl">
                          {skill.icon && (
                            skill.icon.trim().startsWith('<') ? (
                              <span
                                className="flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: skill.icon }}
                              />
                            ) : /^https?:\/\//i.test(skill.icon) ? (
                              <img
                                src={skill.icon}
                                alt={skill.name}
                                className="h-12 w-12 object-contain"
                              />
                            ) : (
                              <i className={skill.icon}></i>
                            )
                          )}
                        </div>
                        <h4 className="font-semibold text-center text-sm">
                          {skill.name}
                        </h4>
                        <span className="text-primary font-bold text-lg">
                          {skill.proficiency}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <SkillEditModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSkill}
        onDelete={handleDeleteSkill}
      />
    </section>
  );
};

export default Skills;
