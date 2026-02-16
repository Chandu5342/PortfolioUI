import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ExternalLink, Plus, Edit, Trash2 } from "lucide-react";
import CodingProfileEditModal from "./CodingProfileEditModal";
import { codingProfilesAPI } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

// Platform logos and colors
const platformConfig = {
  LeetCode: {
    logo: "https://leetcode.com/static/images/favicon.png",
    color: "from-yellow-500 to-orange-500",
    defaultIcon: "fa-solid fa-code"
  },
  CodeChef: {
    logo: "https://www.codechef.com/misc/favicon.ico",
    color: "from-blue-500 to-cyan-500",
    defaultIcon: "fa-solid fa-code"
  },
  HackerRank: {
    logo: "https://www.hackerrank.com/favicon.ico",
    color: "from-green-500 to-emerald-500",
    defaultIcon: "fa-solid fa-code"
  },
  GeeksforGeeks: {
    logo: "https://media.geeksforgeeks.org/gfg-gg-logo.svg",
    color: "from-purple-500 to-pink-500",
    defaultIcon: "fa-solid fa-code"
  }
};

const CodingProfiles = ({ isEditMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [editingProfile, setEditingProfile] = useState(null);
  const { toast } = useToast();

  // Fetch coding profiles from API
  const { data: profilesData = [], isLoading, refetch } = useQuery({
    queryKey: ['codingProfiles'],
    queryFn: async () => {
      try {
        const response = await codingProfilesAPI.getAll();
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Failed to fetch coding profiles:', error);
        return [];
      }
    },
  });

  // Sort profiles by newest date (updatedAt or createdAt) descending
  const sortedProfiles = [...profilesData].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bDate - aDate;
  });

  const handleSaveProfile = async (formData) => {
    try {
      if (editingProfile && editingProfile._id) {
        // Update existing profile by platform
        await codingProfilesAPI.update(editingProfile.platform, formData);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        await codingProfilesAPI.create(formData);
        toast({
          title: "Success",
          description: "Profile created successfully",
        });
      }
      setEditingProfile(null);
      await refetch();
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProfile = async (platform) => {
    try {
      await codingProfilesAPI.delete(platform);
      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });
      setEditingProfile(null);
      await refetch();
    } catch (error) {
      console.error('Failed to delete profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete profile",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setEditingProfile({
      platform: "",
      username: "",
      profileUrl: "",
      stats: {
        solved: 0,
        contests: 0,
        rating: 0,
        badges: 0
      }
    });
  };

  return (
    <section id="coding-profiles" className="py-20 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Coding & <span className="gradient-text">Problem Solving</span>
            </h2>
            {isEditMode && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={handleAddNew}
              >
                <Plus className="w-4 h-4" />
                Add Profile
              </Button>
            )}
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mb-12" />

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading coding profiles...</p>
            </div>
          ) : profilesData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No coding profiles yet. {isEditMode && "Click 'Add Profile' to get started!"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProfiles.map((profile, index) => (
                <motion.div
                  key={profile._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative"
                >
                  {isEditMode && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => setEditingProfile(profile)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7"
                        onClick={() => handleDeleteProfile(profile.platform)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <Card className="glass-card h-full hover:shadow-lg transition-all">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-background/50 rounded-lg p-2">
                        <img
                          src={profile.iconUrl || platformConfig[profile.platform]?.logo}
                          alt={`${profile.platform} logo`}
                          className="object-contain h-full w-full"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/64?text=" + profile.platform;
                          }}
                        />
                      </div>
                      <CardTitle className="text-lg">{profile.platform}</CardTitle>
                      <CardDescription>@{profile.username}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {profile.stats?.solved !== undefined && (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Problems Solved</p>
                          <p className="text-xl font-bold text-primary">{profile.stats.solved}</p>
                        </div>
                      )}
                      {profile.stats?.contests !== undefined && (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Contests</p>
                          <p className="text-lg font-semibold">{profile.stats.contests}</p>
                        </div>
                      )}
                      <div className="text-center border-t pt-3">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-2xl font-bold text-primary">
                          {profile.stats?.rating || 0}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 group/btn hover:scale-105 transition-all"
                        onClick={() => window.open(profile.profileUrl, "_blank")}
                      >
                        View Profile
                        <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:rotate-45 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {editingProfile && (
        <CodingProfileEditModal
          isOpen={!!editingProfile}
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSave={handleSaveProfile}
          onDelete={editingProfile._id ? () => handleDeleteProfile(editingProfile.platform) : undefined}
        />
      )}
    </section>
  );
};

export default CodingProfiles;
