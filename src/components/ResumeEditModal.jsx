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

export const ResumeEditModal = ({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
  itemType = "experience",
}) => {
  const [formData, setFormData] = useState({
    id: "",
    type: itemType,
  });

  const [listInput, setListInput] = useState("");

  useEffect(() => {
    if (item) {
      setFormData(item);
      if (item.description) {
        setListInput(item.description.join("\n"));
      } else if (item.highlights) {
        setListInput(item.highlights.join("\n"));
      }
    } else {
      setFormData({
        id: Date.now().toString(),
        type: itemType,
      });
      setListInput("");
    }
  }, [item, itemType]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const listItems = listInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const updatedData = { ...formData };

    if (formData.type === "experience") {
      updatedData.description = listItems;
    } else if (formData.type === "education") {
      updatedData.highlights = listItems;
    } else if (formData.type === "certification") {
      updatedData.highlights = listItems;
    }

    onSave(updatedData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && item) {
      onDelete(item.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 bg-card border-2 border-border shadow-2xl rounded-lg">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {item ? "Edit" : "Add"}{" "}
            {formData.type === "experience"
              ? "Experience"
              : formData.type === "education"
              ? "Education"
              : "Certification"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
          {formData.type === "experience" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Full Stack Developer"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g., Tech Corp"
                  required
                />
              </div>
            </>
          )}

          {formData.type === "education" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={formData.degree || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  placeholder="e.g., B.Tech in Computer Science"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                  placeholder="e.g., University Name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  value={formData.gpa || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, gpa: e.target.value })
                  }
                  placeholder="e.g., 8.5/10"
                />
              </div>
            </>
          )}

          {formData.type === "certification" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Certification Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., AWS Certified Developer"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="issuer">Issuer</Label>
                <Input
                  id="issuer"
                  value={formData.issuer || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, issuer: e.target.value })
                  }
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={(formData.description && formData.description[0]) || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: [e.target.value],
                    })
                  }
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="period">
              {formData.type === "certification" ? "Date" : "Period"}
            </Label>
            <Input
              id="period"
              value={
                formData.type === "certification"
                  ? formData.date || ""
                  : formData.period || ""
              }
              onChange={(e) =>
                formData.type === "certification"
                  ? setFormData({ ...formData, date: e.target.value })
                  : setFormData({ ...formData, period: e.target.value })
              }
              placeholder={
                formData.type === "certification"
                  ? "e.g., 2024"
                  : "e.g., Jan 2024 - Present"
              }
              required
            />
          </div>

          {formData.type !== "certification" && (
            <div className="grid gap-2">
              <Label htmlFor="list">
                {formData.type === "experience"
                  ? "Responsibilities (one per line)"
                  : "Highlights (one per line)"}
              </Label>
              <Textarea
                id="list"
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                placeholder="Enter each item on a new line..."
                rows={6}
                required
              />
            </div>
          )}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border flex gap-3 justify-end">
            {onDelete && item && (
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
