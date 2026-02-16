import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

export const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold gradient-text pr-8">
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Project Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          {/* Project Description */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-primary">📝 Summary</h3>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          {/* Features (only show if provided) */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">💡 Key Features</h3>
              <ul className="space-y-2">
                {project.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <span className="text-primary mt-1 font-bold">✓</span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-primary">🧰 Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {(project.technologies || project.tech || []).map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium hover:bg-primary/20 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            {(project.liveUrl || project.live) && (
              <Button
                size="lg"
                className="gap-2 group flex-1 hover:scale-105 transition-all"
                onClick={() => window.open(project.liveUrl || project.live, "_blank")}
              >
                <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                Live Demo
              </Button>
            )}
            {(project.github || project.githubUrl) && (
              <Button
                size="lg"
                variant="outline"
                className="gap-2 flex-1 hover:scale-105 transition-all"
                onClick={() => window.open(project.github || project.githubUrl, "_blank")}
              >
                <Github className="w-5 h-5" />
                View Code
              </Button>
            )}
          </div>

          {/* Custom Links */}
          {project.links && project.links.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">🔗 Additional Links</h3>
              <div className="flex flex-wrap gap-3">
                {project.links.map((link, index) => (
                  <Button
                    key={index}
                    size="lg"
                    variant="outline"
                    className="gap-2 hover:scale-105 transition-all"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {link.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
