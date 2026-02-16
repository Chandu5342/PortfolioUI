import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-center flex items-center gap-2">
            Made with{" "}
            <Heart
              className="w-4 h-4 text-primary fill-primary"
              aria-label="love"
            />{" "}
            by{" "}
            <span className="gradient-text font-semibold hover:underline cursor-pointer">
              Chandu Karri
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 Chandu Karri. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
