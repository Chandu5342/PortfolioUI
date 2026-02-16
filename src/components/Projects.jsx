import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink, Plus, Settings, X } from "lucide-react";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { ProjectEditModal } from "./ProjectEditModal";
import { projectsAPI } from "@/config/api";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Projects = ({ isEditMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Fetch all projects from API
  const { data: projectsData = [], isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const response = await projectsAPI.getAll();
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
      }
    },
  });

  const { toast } = useToast();
  
  // Category management state
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('projectCategories');
    return saved ? JSON.parse(saved) : ['Projects', 'Mini Projects'];
  });

  const [activeTab, setActiveTab] = useState(categories[0] || 'Projects');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);

  // Project management state
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Category management handlers
  const saveCategoriesToStorage = (updatedCategories) => {
    localStorage.setItem('projectCategories', JSON.stringify(updatedCategories));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      const updated = [...categories, newCategoryName.trim()];
      setCategories(updated);
      saveCategoriesToStorage(updated);
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
    }
  };

  const handleEditCategory = (index) => {
    setEditingCategoryIndex(index);
    setNewCategoryName(categories[index]);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (editingCategoryIndex !== null && newCategoryName.trim()) {
      const updated = [...categories];
      const oldCategory = updated[editingCategoryIndex];
      updated[editingCategoryIndex] = newCategoryName.trim();
      setCategories(updated);
      saveCategoriesToStorage(updated);

      // Update projects with the old category name
      refetch();

      setNewCategoryName('');
      setEditingCategoryIndex(null);
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = (index) => {
    const categoryToDelete = categories[index];
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    saveCategoriesToStorage(updated);
    
    // Switch tab if the deleted category is active
    if (activeTab === categoryToDelete) {
      setActiveTab(updated[0] || 'Projects');
    }
  };

  // Project management handlers
  const handleAddProject = () => {
    setEditingProject(null);
    setIsAddingProject(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsAddingProject(false);
  };

  const handleSaveProject = async (formData) => {
    try {
      if (editingProject && editingProject._id) {
        await projectsAPI.update(editingProject._id, formData);
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        await projectsAPI.create(formData);
        toast({ title: 'Success', description: 'Project created successfully' });
      }
      setIsAddingProject(false);
      setEditingProject(null);
      await refetch();
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save project', variant: 'destructive' });
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectsAPI.delete(projectId);
      toast({ title: 'Success', description: 'Project deleted successfully' });
      setIsAddingProject(false);
      setEditingProject(null);
      await refetch();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({ title: 'Error', description: error.message || 'Failed to delete project', variant: 'destructive' });
    }
  };

  // Filter projects by category
  const getProjectsByCategory = (category) => {
    return projectsData.filter((project) => {
      const projectCategory = project.category || categories[0];
      return projectCategory === category;
    });
  };

  // Sort projects by rank (desc) then by newest date
  const sortProjectsByRank = (projects) => {
    return [...projects].sort((a, b) => {
      const rankA = typeof a.rank === 'number' ? a.rank : 0;
      const rankB = typeof b.rank === 'number' ? b.rank : 0;
      if (rankB !== rankA) return rankB - rankA;
      const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bDate - aDate;
    });
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              My <span className="gradient-text">Projects</span>
            </h2>
            {isEditMode && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setEditingCategoryIndex(null);
                    setNewCategoryName('');
                    setIsCategoryModalOpen(true);
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Manage Tabs
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={handleAddProject}
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              </div>
            )}
          </div>

          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mb-12" />

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab List */}
              <TabsList className="mb-8 w-full justify-center flex flex-wrap gap-2 h-auto bg-transparent p-0">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab Contents */}
              {categories.map((category) => {
                const categoryProjects = getProjectsByCategory(category);
                const sortedCategoryProjects = sortProjectsByRank(categoryProjects);

                return (
                  <TabsContent key={category} value={category}>
                    {sortedCategoryProjects.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No projects in this category yet.</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedCategoryProjects.map((project, index) => (
                          <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                            onClick={() => {
                              setSelectedProject(project);
                              setIsDetailOpen(true);
                            }}
                          >
                            {/* Image Container */}
                            <div className="relative overflow-hidden h-56">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content */}
                            <div className="p-6 relative">
                              {isEditMode && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute top-2 right-2 h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditProject(project);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}

                              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                {project.title}
                              </h3>

                              <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                                {project.description}
                              </p>

                              {/* Tech Stack */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies?.slice(0, 3).map((tech) => (
                                  <span
                                    key={tech}
                                    className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.technologies?.length > 3 && (
                                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                                    +{project.technologies.length - 3}
                                  </span>
                                )}
                              </div>

                              {/* View Details Button */}
                              <Button
                                size="sm"
                                className="w-full gap-2 group/btn hover:scale-105 transition-all"
                              >
                                <ExternalLink className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                                View Details
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <ProjectEditModal
        project={editingProject || undefined}
        isOpen={isAddingProject || !!editingProject}
        onClose={() => {
          setEditingProject(null);
          setIsAddingProject(false);
        }}
        onSave={handleSaveProject}
        onDelete={editingProject ? (id) => handleDeleteProject(id) : undefined}
        categories={categories}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProject(null);
        }}
      />

      {/* Category Management Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategoryIndex !== null ? 'Edit Tab' : 'Manage Tabs'}
            </DialogTitle>
          </DialogHeader>

          {editingCategoryIndex === null ? (
            <div className="space-y-6">
              {/* Add New Tab */}
              <div className="space-y-3">
                <Label className="text-base">Add New Tab</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Personal Projects"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <Button onClick={handleAddCategory}>Add</Button>
                </div>
              </div>

              {/* Existing Tabs */}
              <div className="space-y-3">
                <Label className="text-base">Existing Tabs</Label>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={category} className="flex items-center justify-between p-3 rounded-md border border-border">
                      <span className="font-medium">{category}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCategory(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(index)}
                          disabled={categories.length === 1}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="tab-name">Tab Name</Label>
                <Input
                  id="tab-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter tab name"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
                />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCategoryIndex(null);
                    setNewCategoryName('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory}>Save</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
