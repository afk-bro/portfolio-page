# Personal Portfolio Website

A production-ready personal portfolio website designed to clearly communicate professional identity, technical capability, and project experience to hiring managers and recruiters.

## Overview

This portfolio emphasizes clarity, credibility, and signal over novelty. It presents selected work through concise case studies backed by concrete implementation details and quality signals (testing, CI, architecture decisions).

### Target Audiences

- **Primary**: Technical hiring managers evaluating engineering candidates
- **Secondary**: Recruiters screening for technical fit and communication ability
- **Tertiary**: Potential collaborators and open-source community members

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Validation**: Zod (schema validation)
- **Icons**: Lucide React
- **Package Manager**: pnpm (preferred) or npm
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio_page
   ```

2. Run the setup script:
   ```bash
   ./init.sh
   ```

   Or manually install dependencies:
   ```bash
   pnpm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
portfolio_page/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── projects/          # Projects pages
│   │   ├── page.tsx       # Projects index
│   │   └── [slug]/        # Individual project pages
│   ├── about/             # About page
│   ├── resume/            # Resume page
│   └── contact/           # Contact page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── sections/         # Page sections
├── lib/                  # Utility functions
├── data/                 # Content data files
│   ├── projects.ts       # Project data
│   ├── skills.ts         # Skills data
│   └── metadata.ts       # Site metadata
├── public/               # Static assets
│   ├── images/          # Images
│   └── resume/          # Resume files
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |

## Features

### Core Pages

- **Homepage**: Hero section, proof strip, featured projects, skills overview
- **Projects**: Filterable grid, individual case study pages
- **About**: Professional narrative, career timeline, working style
- **Resume**: PDF viewer, multi-format downloads
- **Contact**: Contact form, social links, response expectations

### Key Functionality

- 🌓 Dark/Light mode with system preference detection
- 📱 Fully responsive design (mobile-first)
- ♿ WCAG 2.1 AA accessibility compliance
- 🔍 SEO optimized with OpenGraph metadata
- ⚡ Performance optimized (Lighthouse 90+)
- 🔐 Security headers configured

## Content Management

Content is managed through TypeScript data files in the `/data` directory:

- `projects.ts` - Project case studies
- `skills.ts` - Technical skills with proficiency levels
- `metadata.ts` - Site-wide metadata and configuration

All data is validated using Zod schemas for type safety.

## Customization

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | Yes |
| `NEXT_PUBLIC_ANALYTICS_KEY` | Analytics key | No |
| `CONTACT_EMAIL` | Public contact email | No |

### Theming

Colors and design tokens are configured in `tailwind.config.ts`.

## Testing

Feature tests are defined in `feature_list.json`. This file contains comprehensive test cases covering:

- Functional requirements (navigation, forms, interactions)
- Style requirements (responsive design, accessibility, theming)
- Performance benchmarks
- SEO compliance

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy!

### Manual Deployment

```bash
pnpm build
pnpm start
```

## Contributing

This is a personal portfolio project. Feel free to use it as inspiration for your own portfolio.

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with ❤️ using Next.js and Tailwind CSS
