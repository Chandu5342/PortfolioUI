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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SkillEditModal = ({
  skill,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    proficiency: 50,
    category: "Frontend",
    icon: "fa-solid fa-code",
  });

  useEffect(() => {
    if (skill && skill._id) {
      setFormData({
        name: skill.name || "",
        proficiency: skill.proficiency || 50,
        category: skill.category || "Frontend",
        icon: skill.icon || "fa-solid fa-code",
      });
    } else {
      setFormData({
        name: "",
        proficiency: 50,
        category: "Frontend",
        icon: "fa-solid fa-code",
      });
    }
  }, [skill, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill name",
        variant: "destructive"
      });
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {skill && skill._id ? "Edit Skill" : "Add New Skill"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid gap-4 py-4 px-6 overflow-y-auto flex-1">
            <div className="grid gap-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., React.js"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="proficiency">Progress Level (%)</Label>
              <Input
                id="proficiency"
                type="number"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={(e) =>
                  setFormData({ ...formData, proficiency: parseInt(e.target.value) || 0 })
                }
                placeholder="e.g., 85"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Programming Languages">Programming Languages</SelectItem>
                  <SelectItem value="Tools & Technologies">Tools & Technologies</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Icon (Font Awesome or URL)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="e.g., fa-brands fa-react or https://example.com/icon.png"
                required
              />
              <p className="text-xs text-muted-foreground mb-2">
                Font Awesome: "fa-brands fa-react", "fa-solid fa-code" | Or paste image URL
              </p>
              
              {/* Icon Preview */}
              {formData.icon && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {formData.icon.startsWith('http') ? (
                      <img
                        src={formData.icon}
                        alt="Icon preview"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <i className={`${formData.icon} text-lg text-primary`} />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">Preview</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            {onDelete && skill && skill._id && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDelete(skill._id)}
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
