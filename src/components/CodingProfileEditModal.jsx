import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const CodingProfileEditModal = ({ profile, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    platform: "",
    username: "",
    profileUrl: "",
    iconUrl: "",
    stats: {
      solved: 0,
      contests: 0,
      rating: 0,
      badges: 0,
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        platform: profile.platform || "",
        username: profile.username || "",
        profileUrl: profile.profileUrl || "",
        iconUrl: profile.iconUrl || "",
        stats: {
          solved: profile.stats?.solved || 0,
          contests: profile.stats?.contests || 0,
          rating: profile.stats?.rating || 0,
          badges: profile.stats?.badges || 0,
        },
      });
    } else {
      setFormData({
        platform: "",
        username: "",
        profileUrl: "",
        iconUrl: "",
        stats: {
          solved: 0,
          contests: 0,
          rating: 0,
          badges: 0,
        },
      });
    }
  }, [profile, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const platforms = ["LeetCode", "CodeChef", "HackerRank", "GeeksforGeeks"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {profile?._id ? "Edit Coding Profile" : "Add New Coding Profile"}
          </DialogTitle>
          <DialogDescription>
            {profile?._id
              ? "Update your coding profile details"
              : "Add a new coding platform profile"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username / Handle</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Your username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileUrl">Profile URL</Label>
              <Input
                id="profileUrl"
                value={formData.profileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, profileUrl: e.target.value })
                }
                placeholder="https://..."
                type="url"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconUrl">Platform Icon URL</Label>
              <Input
                id="iconUrl"
                value={formData.iconUrl}
                onChange={(e) =>
                  setFormData({ ...formData, iconUrl: e.target.value })
                }
                placeholder="https://example.com/icon.png"
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                Paste the URL of the platform's logo/icon
              </p>
              
              {/* Icon Preview */}
              {formData.iconUrl && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border">
                  <div className="w-12 h-12 flex items-center justify-center bg-background rounded">
                    <img
                      src={formData.iconUrl}
                      alt="Platform icon preview"
                      className="h-full w-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">Icon Preview</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="solved">Problems Solved</Label>
                <Input
                  id="solved"
                  type="number"
                  min="0"
                  value={formData.stats.solved}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: {
                        ...formData.stats,
                        solved: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contests">Contests</Label>
                <Input
                  id="contests"
                  type="number"
                  min="0"
                  value={formData.stats.contests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: {
                        ...formData.stats,
                        contests: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  value={formData.stats.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: {
                        ...formData.stats,
                        rating: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badges">Badges</Label>
                <Input
                  id="badges"
                  type="number"
                  min="0"
                  value={formData.stats.badges}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: {
                        ...formData.stats,
                        badges: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            {onDelete && profile?._id && (
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

export default CodingProfileEditModal;
