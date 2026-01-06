import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="section min-h-[60vh] flex items-center justify-center">
      <div className="container-content text-center">
        {/* 404 Display */}
        <div className="text-[120px] md:text-[180px] font-bold text-neutral-200 dark:text-neutral-800 leading-none select-none">
          404
        </div>

        {/* Message */}
        <h1 className="text-h2 text-neutral-900 dark:text-neutral-50 mb-4 -mt-8">
          Page Not Found
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              View Projects
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/projects"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              About
            </Link>
            <Link
              href="/resume"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Resume
            </Link>
            <Link
              href="/contact"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
