"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteMetadata } from "@/data/metadata";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function CallToAction() {
  return (
    <section className="section relative overflow-hidden">
      <div className="container-content">
        <AnimateOnScroll
          variant="fade-up"
          className="relative rounded-2xl p-8 md:p-12 text-center bg-dark-surface dark:bg-dark-surface border border-[#1a1f28]"
        >
          {/* Gradient mesh background */}
          <div
            className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none animate-gradient-drift"
            style={{
              background: `
                radial-gradient(ellipse at 30% 50%, rgba(245, 166, 35, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
              `,
            }}
          />

          <div className="relative z-10">
            <h2 className="text-h2 text-[#F5F5F5] mb-4">
              Let&apos;s Build Something{" "}
              <span className="text-gold-400">Great</span> Together
            </h2>
            <p className="text-lg text-[#A0A0A0] mb-8 max-w-2xl mx-auto">
              I&apos;m always open to discussing new projects, creative ideas,
              or opportunities to be part of your vision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="btn-primary-cta"
              >
                <Link href="/contact">
                  Get In Touch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="btn-secondary"
              >
                <a href={`mailto:${siteMetadata.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  {siteMetadata.email}
                </a>
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
