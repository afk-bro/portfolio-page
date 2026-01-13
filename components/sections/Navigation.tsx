"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

/**
 * NavLink - Cream text on ocean gradient
 * Orange underline for active + hover animation
 */
function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        // Base: larger, bolder, better spacing
        "relative px-1 py-1",
        "text-[15px] font-semibold tracking-wide",
        "transition-all duration-200 ease-smooth",
        // Engraved text style - subtle shadow/highlight
        "[text-shadow:0_1px_1px_rgba(0,0,0,0.3),0_-1px_0_rgba(255,255,255,0.1)]",
        "dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_-1px_0_rgba(255,255,255,0.05)]",
        // Cream text - high contrast on blue
        isActive ? "text-sand-50" : "text-sand-100/95 hover:text-sand-50",
        // Subtle glow on hover
        "hover:[text-shadow:0_0_12px_rgba(237,174,95,0.4),0_1px_1px_rgba(0,0,0,0.3)]",
        // Dark mode
        "dark:text-sand-500/90 dark:hover:text-sand-500",
        "dark:hover:[text-shadow:0_0_16px_rgba(245,166,35,0.5),0_0_24px_rgba(6,182,212,0.2)]",
        // Underline via pseudo-element with glow
        "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:rounded-full",
        "after:transition-all after:duration-200 after:ease-smooth",
        isActive
          ? "after:w-full after:bg-bronze-500 after:shadow-[0_0_8px_rgba(237,174,95,0.5)]" // Active: bronze underline with glow
          : "after:w-0 after:bg-bronze-500 hover:after:w-full hover:after:shadow-[0_0_6px_rgba(237,174,95,0.4)]",
        // Active state glow
        isActive && "drop-shadow-[0_0_10px_rgba(237,174,95,0.3)]",
      )}
    >
      {label}
    </Link>
  );
}

/**
 * ThemeToggle - Utility toggle, de-emphasized
 * Sits on gradient - muted appearance
 */
function ThemeToggle({
  resolvedTheme,
  onToggle,
}: {
  resolvedTheme: string | undefined;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "p-2 rounded-md",
        // More visible on gradient
        "text-sand-100/90 dark:text-sand-500/90",
        "hover:text-sand-50 dark:hover:text-sand-500",
        "hover:bg-white/10 dark:hover:bg-white/5",
        "transition-all duration-180 ease-smooth",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-ocean-500",
      )}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Track scroll state for glassy effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // Check initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape key press and return focus
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  // Move focus to first menu item when menu opens
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const firstLink = mobileMenuRef.current.querySelector("a");
      if (firstLink) {
        firstLink.focus();
      }
    }
  }, [mobileMenuOpen]);

  // Trap focus within mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !mobileMenuRef.current) return;

      const focusableElements =
        mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [mobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuOpen &&
        navRef.current &&
        !navRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "h-14 md:h-16 w-full",
        "border-b transition-all duration-300",
        // Glassy effect with enhanced scroll state
        scrolled
          ? [
              "backdrop-blur-xl backdrop-saturate-150",
              "bg-ocean-500/90 dark:bg-dark-surface/85",
              "border-ocean-400/40 dark:border-white/15",
              "shadow-lg shadow-ocean-900/15 dark:shadow-black/40",
            ]
          : [
              "backdrop-blur-md",
              "bg-ocean-500/60 dark:bg-dark-surface/40",
              "border-transparent",
            ],
      )}
    >
      {/* Subtle top highlight for glass effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      {/* Right-edge bronze accent hint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-bronze-500/15 to-transparent dark:from-bronze-500/10"
      />
      <nav
        ref={navRef}
        className="relative mx-auto flex h-full max-w-content items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo - Anchors the left side of the gradient */}
          <Link
            href="/"
            className={cn(
              "text-lg font-bold tracking-tight",
              // Cream text on ocean gradient
              "text-sand-50 dark:text-sand-500",
              "hover:text-white dark:hover:text-bronze-400",
              "transition-colors duration-180",
            )}
          >
            Portfolio
          </Link>

          {/* Desktop Navigation - Better spacing */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            ))}

            {/* Theme Toggle - with extra separation */}
            <div className="ml-2">
              <ThemeToggle
                resolvedTheme={resolvedTheme}
                onToggle={toggleTheme}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />

            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-lg",
                // On gradient
                "text-sand-100/80 dark:text-sand-500/80",
                "hover:text-sand-50 dark:hover:text-sand-500",
                "transition-colors",
              )}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className={cn(
              "md:hidden py-3",
              // Solid background for dropdown - ocean blue
              "bg-ocean-500 dark:bg-ocean-800",
              "border-t border-ocean-400/50 dark:border-ocean-700/50",
            )}
          >
            <div className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-bronze-600/20 text-bronze-400 border-l-2 border-bronze-600"
                      : "text-sand-100/90 hover:text-sand-50 dark:text-sand-500/90 dark:hover:text-sand-500",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
