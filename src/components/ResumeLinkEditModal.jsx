import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export const ResumeLinkEditModal = ({ isOpen, onClose, onSave, currentLink }) => {
  const [link, setLink] = useState(currentLink);

  useEffect(() => {
    setLink(currentLink);
  }, [currentLink]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(link);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md flex flex-col p-0 bg-card border-2 border-border shadow-2xl rounded-lg">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit Resume Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label htmlFor="resumeLink">Resume URL</Label>
              <Input
                id="resumeLink"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://drive.google.com/your-resume-link"
                required
              />
              <p className="text-xs text-muted-foreground">
                Paste the public link to your resume (Google Drive, Dropbox, etc.)
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
