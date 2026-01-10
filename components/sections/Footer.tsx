import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteMetadata } from "@/data/metadata";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-gradient-to-b from-dark-surface to-[#000000] border-t border-transparent"
      style={{
        borderImage: "linear-gradient(90deg, #F5A623, #06B6D4) 1",
      }}
    >
      <div className="container-content py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand and Copyright */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-lg font-bold text-[#F5F5F5] hover:text-gold-400 transition-colors"
            >
              Portfolio
            </Link>
            <p className="mt-1 text-sm text-[#707070]">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={siteMetadata.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-glow p-2 rounded-lg text-[#707070] hover:text-gold-400 hover:scale-110 transition-all duration-200"
              aria-label="GitHub profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={siteMetadata.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-glow p-2 rounded-lg text-[#707070] hover:text-gold-400 hover:scale-110 transition-all duration-200"
              aria-label="LinkedIn profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${siteMetadata.email}`}
              className="social-link-glow p-2 rounded-lg text-[#707070] hover:text-gold-400 hover:scale-110 transition-all duration-200"
              aria-label="Send email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
