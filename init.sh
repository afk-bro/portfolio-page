#!/bin/bash

# Portfolio Website - Development Environment Setup Script
# This script sets up the development environment for the portfolio website.

set -e  # Exit on any error

echo "=========================================="
echo "Portfolio Website - Environment Setup"
echo "=========================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✓ Node.js $(node -v) detected"

# Check for package manager (prefer pnpm, fallback to npm)
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo "✓ Using pnpm as package manager"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo "✓ Using npm as package manager"
else
    echo "Error: No package manager found. Please install pnpm or npm."
    exit 1
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
$PKG_MANAGER install

# Check for .env.local file
if [ ! -f ".env.local" ]; then
    echo ""
    echo "Creating .env.local from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✓ Created .env.local (please update with your values)"
    else
        echo "# Environment Variables" > .env.local
        echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
        echo "# NEXT_PUBLIC_ANALYTICS_KEY=" >> .env.local
        echo "# CONTACT_EMAIL=" >> .env.local
        echo "✓ Created basic .env.local"
    fi
fi

# Run type check
echo ""
echo "Running TypeScript type check..."
$PKG_MANAGER run typecheck 2>/dev/null || echo "Note: typecheck script not yet configured"

# Run linting
echo ""
echo "Running ESLint..."
$PKG_MANAGER run lint 2>/dev/null || echo "Note: lint script not yet configured"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the development server, run:"
echo ""
echo "  $PKG_MANAGER dev"
echo ""
echo "The site will be available at:"
echo "  http://localhost:3000"
echo ""
echo "Other useful commands:"
echo "  $PKG_MANAGER build     - Build for production"
echo "  $PKG_MANAGER start     - Start production server"
echo "  $PKG_MANAGER lint      - Run ESLint"
echo "  $PKG_MANAGER typecheck - Run TypeScript checks"
echo ""
echo "=========================================="

# Optionally start the dev server
if [ "$1" == "--start" ]; then
    echo "Starting development server..."
    $PKG_MANAGER dev
fi
