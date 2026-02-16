import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export const ProjectEditModal = ({
  project,
  isOpen,
  onClose,
  onSave,
  onDelete,
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    tech: [],
    image: "",
    liveUrl: "",
    githubUrl: "",
    category: categories && categories.length > 0 ? categories[0] : "Projects",
    features: [],
    links: [],
  });

  const [techInput, setTechInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [customLinks, setCustomLinks] = useState([]);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        tech: project.tech || project.technologies || [],
        features: project.features || [],
        links: project.links || [],
        // map backend github field to githubUrl used by form
        githubUrl: project.github || project.githubUrl || '',
      });

      setTechInput((project.tech || project.technologies || []).join(", "));
      setFeaturesInput((project.features || []).join(", "));
      setCustomLinks(project.links || []);
    } else {
      setFormData({
        id: Date.now().toString(),
        title: "",
        description: "",
        tech: [],
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
        liveUrl: "",
        githubUrl: "",
        category:
          categories && categories.length > 0 ? categories[0] : "Projects",
        features: [],
        links: [],
      });

      setTechInput("");
      setFeaturesInput("");
      setCustomLinks([]);
    }
  }, [project, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const tech = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    // Map form fields to API/backend expected shape
    const payload = {
      // keep id/_id if present
      ...(formData._id ? { _id: formData._id } : {}),
      title: formData.title,
      description: formData.description,
      image: formData.image,
      liveUrl: formData.liveUrl,
      // backend model expects `technologies` and `github`
      technologies: tech,
      github: formData.githubUrl || formData.github || '',
      // Optional extras (category, features, links) can be sent too
      category: formData.category,
      features,
      links: customLinks,
    };

    onSave(payload);

    onClose();
  };

  const handleAddLink = () => {
    setCustomLinks([...customLinks, { label: "", url: "" }]);
  };

  const handleRemoveLink = (index) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index, field, value) => {
    const updated = [...customLinks];
    updated[index] = { ...updated[index], [field]: value };
    setCustomLinks(updated);
  };

  const handleDelete = () => {
    if (onDelete && project) {
      const id = project._id || project.id || project.id;
      onDelete(id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 bg-card border-2 border-border shadow-2xl rounded-lg">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {project ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="grid gap-4 py-4 px-6 overflow-y-auto flex-1">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., E-commerce Platform"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your project..."
                rows={4}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories &&
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tech">
                Technologies (comma-separated)
              </Label>
              <Input
                id="tech"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="e.g., React.js, Node.js, MongoDB"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="features">
                Features (comma-separated)
              </Label>
              <Input
                id="features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="e.g., User Authentication, Payment Integration"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, liveUrl: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Custom Links</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddLink}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </Button>
              </div>

              {customLinks.map((link, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    placeholder="Label (e.g., Video Demo)"
                    value={link.label || ""}
                    onChange={(e) =>
                      handleLinkChange(index, "label", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="URL"
                    value={link.url || ""}
                    onChange={(e) =>
                      handleLinkChange(index, "url", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveLink(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border flex gap-3 justify-end">
            {onDelete && project && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
