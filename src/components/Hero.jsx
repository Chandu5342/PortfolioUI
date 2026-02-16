import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import { ResumeLinkEditModal } from "./ResumeLinkEditModal";

const Hero = ({ isEditMode = false }) => {
  const [resumeLink, setResumeLink] = useState("#");
  const [isEditingResume, setIsEditingResume] = useState(false);

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:chandu@example.com", label: "Email" },
  ];

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Hi, I'm <span className="gradient-text">Chandu Karri</span>
        </motion.h1>

        <motion.div
          className="text-2xl md:text-3xl text-muted-foreground mb-6 h-12 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <TypeAnimation
            sequence={[
              "Full Stack Developer",
              2000,
              "DSA Enthusiast",
              2000,
              "Problem Solver",
              2000,
              "Open Source Contributor",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>

        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Building modern web applications with React, Node.js, and .NET Blazor.
          Passionate about creating elegant solutions to complex problems.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button
            size="lg"
            className="gap-2 group"
            onClick={() =>
              isEditMode ? setIsEditingResume(true) : window.open(resumeLink, "_blank")
            }
          >
            {isEditMode ? (
              <Edit className="w-5 h-5" />
            ) : (
              <Download className="w-5 h-5 group-hover:animate-bounce" />
            )}
            {isEditMode ? "Edit Resume Link" : "Download Resume"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => handleScroll("projects")}
          >
            View Projects
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleScroll("contact")}
          >
            Hire Me
          </Button>
        </motion.div>

        <motion.div className="flex justify-center gap-4">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-3 rounded-full hover:bg-primary/20 transition-all hover:scale-110"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <Icon className="w-6 h-6 text-primary" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      <ResumeLinkEditModal
        isOpen={isEditingResume}
        onClose={() => setIsEditingResume(false)}
        onSave={setResumeLink}
        currentLink={resumeLink}
      />
    </section>
  );
};

export default Hero;
