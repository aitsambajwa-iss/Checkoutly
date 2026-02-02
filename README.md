# Checkoutly - Next.js 14 Landing Page

A premium, production-ready landing page for Checkoutly - an AI-powered conversational commerce platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✨ Premium minimal design with sophisticated aesthetics
- 🎨 Electric cyan accent color theme (#00F0FF)
- 🚀 Next.js 14 with App Router
- 📱 Fully responsive design
- 🎭 Smooth animations and micro-interactions
- 💬 Integrated n8n chatbot functionality
- 🔒 TypeScript for type safety
- 🎯 Production-ready code structure

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
checkoutly/
├── app/
│   ├── layout.tsx              # Root layout with fonts & metadata
│   ├── page.tsx                # Main landing page
│   └── globals.css             # Global styles & CSS variables
├── components/
│   ├── Navbar.tsx              # Fixed navigation bar
│   ├── Hero.tsx                # Hero section with animations
│   ├── Features.tsx            # Three feature cards
│   ├── Demo.tsx                # Demo section container
│   ├── ProductGrid.tsx         # Product cards component
│   ├── ChatWidget.tsx          # Live chat widget with n8n integration
│   ├── Footer.tsx              # Footer section
│   ├── ScrollProgress.tsx      # Scroll progress indicator
│   └── ui/
│       ├── GrainOverlay.tsx    # Grain texture effect
│       └── BackgroundOrbs.tsx  # Animated background orbs
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── n8n.ts                  # n8n webhook integration
│   └── types.ts                # TypeScript interfaces
└── public/                     # Static assets
```

## n8n Integration

The chatbot is pre-configured to work with your n8n webhook:
- Default URL: `https://imranmustafa-iss.app.n8n.cloud/webhook/d717cda8-d85c-4a50-bb6e-f4da4c3590eb/chat`
- Handles streaming JSON responses
- Fallback to demo mode if webhook unavailable
- Session management for conversation continuity

## Customization

### Colors
Update CSS custom properties in `app/globals.css`:
```css
:root {
  --accent: #00F0FF; /* Electric cyan */
  --bg-primary: #0A0A0A;
  --text-primary: #FFFFFF;
}
```

### Content
- Update metadata in `app/layout.tsx`
- Modify hero content in `components/Hero.tsx`
- Add/remove features in `components/Features.tsx`
- Update products in `components/ProductGrid.tsx`

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library (ready to use)
- **n8n Integration** - Webhook-based chatbot functionality

## Performance Features

- Optimized animations using CSS transforms
- Lazy loading and code splitting
- Responsive images and fonts
- Minimal JavaScript bundle
- SEO optimized with proper metadata

## License

© 2026 Checkoutly. All rights reserved.