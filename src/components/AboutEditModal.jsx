import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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

const defaultData = {
  title: "",
  description: "",
  image: "",
  experience: "",
  education: []
};

export const AboutEditModal = ({ about, isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (about && about._id) {
      setFormData({
        title: about.title || "",
        description: about.description || "",
        image: about.image || "",
        experience: about.experience || "",
        education: about.education || []
      });
    } else {
      setFormData(defaultData);
    }
  }, [about, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit About Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid gap-4 py-4 px-6 overflow-y-auto flex-1">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Full Stack Developer"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (use double line breaks for paragraphs)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Tell about yourself... Press Enter twice to create a new paragraph."
                className="min-h-40 font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground">
                💡 Tip: Press Enter twice (create a blank line) to separate paragraphs
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                placeholder="e.g., 5+ years"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
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
