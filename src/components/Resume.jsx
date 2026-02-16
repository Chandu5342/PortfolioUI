import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Briefcase, GraduationCap, Award, Plus } from "lucide-react";
import { ResumeEditModal } from "./ResumeEditModal";

const Resume = ({ isEditMode, codingProfiles = [] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [experience, setExperience] = useState([
    {
      id: "1",
      type: "experience",
      title: "Full Stack Developer Intern",
      company: "Sampath Software Solutions",
      period: "Jan 2024 - Jun 2024",
      description: [
        "Developed enterprise-level applications using .NET Blazor and MAUI frameworks",
        "Created inventory management and payroll systems with comprehensive reporting features",
        "Collaborated with senior developers to implement best practices and coding standards",
        "Participated in code reviews and contributed to system architecture decisions",
      ],
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: "1",
      type: "education",
      degree: "Bachelor of Technology in Computer Science",
      institution: "Vignan's Institute of Information Technology",
      period: "2021 - 2025",
      gpa: "8.5/10",
      highlights: [
        "Specialization in Web Technologies and Software Engineering",
        "Active member of coding club and tech societies",
        "Participated in multiple hackathons and coding competitions",
      ],
    },
  ]);

  const [certifications, setCertifications] = useState([
    {
      id: "1",
      type: "certification",
      name: "Full Stack Web Development",
      issuer: "Coursera",
      date: "2023",
      description: ["Comprehensive course covering MERN stack development"],
    },
    {
      id: "2",
      type: "certification",
      name: "Microsoft Certified: Azure Fundamentals",
      issuer: "Microsoft",
      date: "2024",
      description: ["Cloud computing fundamentals and Azure services"],
    },
    {
      id: "3",
      type: "certification",
      name: "React - The Complete Guide",
      issuer: "Udemy",
      date: "2023",
      description: ["Advanced React concepts, hooks, and state management"],
    },
  ]);

  const [editingItem, setEditingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [currentTab, setCurrentTab] = useState("experience");

  const handleSaveItem = (item) => {
    if (item.type === "experience") {
      setExperience(isAddingItem ? [...experience, item] : experience.map(e => e.id === item.id ? item : e));
    } else if (item.type === "education") {
      setEducation(isAddingItem ? [...education, item] : education.map(e => e.id === item.id ? item : e));
    } else if (item.type === "certification") {
      setCertifications(isAddingItem ? [...certifications, item] : certifications.map(c => c.id === item.id ? item : c));
    }
    setEditingItem(null);
    setIsAddingItem(false);
  };

  const handleDeleteItem = (id, type) => {
    if (type === "experience") setExperience(experience.filter(e => e.id !== id));
    else if (type === "education") setEducation(education.filter(e => e.id !== id));
    else if (type === "certification") setCertifications(certifications.filter(c => c.id !== id));
  };

  const handleAddNew = () => {
    setIsAddingItem(true);
    const typeMap = {
      experience: "experience",
      education: "education",
      certifications: "certification",
    };
    setEditingItem({ id: Date.now().toString(), type: typeMap[currentTab] });
  };

  return (
    <section id="resume" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              My <span className="gradient-text">Resume</span>
            </h2>

            {isEditMode && (
              <Button size="sm" variant="outline" className="gap-2" onClick={handleAddNew}>
                <Plus className="w-4 h-4" /> Add New
              </Button>
            )}
          </div>

          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mb-12" />

          <Tabs defaultValue="experience" className="w-full" onValueChange={setCurrentTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="experience" className="gap-2">
                <Briefcase className="w-4 h-4" /> Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="gap-2">
                <GraduationCap className="w-4 h-4" /> Education
              </TabsTrigger>
              <TabsTrigger value="certifications" className="gap-2">
                <Award className="w-4 h-4" /> Certificates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="experience">
              {experience.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="glass-card p-6 rounded-lg relative"
                >
                  {isEditMode && (
                    <Button size="icon" variant="ghost" className="absolute top-0 right-0 h-8 w-8" onClick={() => setEditingItem(exp)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="glass-card p-3 rounded-lg">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{exp.title}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                      <ul className="list-none space-y-1">
                        {exp.description.map((item, i) => (
                          <li key={i} className="text-muted-foreground flex gap-2">
                            <span className="text-primary mt-1">▹</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="education">
              {education.map((edu) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="glass-card p-6 rounded-lg relative"
                >
                  {isEditMode && (
                    <Button size="icon" variant="ghost" className="absolute top-0 right-0 h-8 w-8" onClick={() => setEditingItem(edu)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="glass-card p-3 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        <span>{edu.period}</span> • <span>GPA: {edu.gpa}</span>
                      </div>
                      <ul className="list-none space-y-1">
                        {edu.highlights.map((item, i) => (
                          <li key={i} className="text-muted-foreground flex gap-2">
                            <span className="text-primary mt-1">▹</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="certifications">
              {certifications.map((cert) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="glass-card p-6 rounded-lg relative"
                >
                  {isEditMode && (
                    <Button size="icon" variant="ghost" className="absolute top-0 right-0 h-8 w-8" onClick={() => setEditingItem(cert)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="glass-card p-3 rounded-lg">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{cert.name}</h3>
                      <p className="text-muted-foreground">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground">{cert.date}</p>
                      <p className="text-muted-foreground">{cert.description[0]}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ResumeEditModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => {
          setEditingItem(null);
          setIsAddingItem(false);
        }}
        onSave={handleSaveItem}
        onDelete={(id) => handleDeleteItem(id, editingItem?.type)}
        itemType={currentTab === "certifications" ? "certification" : currentTab}
      />
    </section>
  );
};

export default Resume;
