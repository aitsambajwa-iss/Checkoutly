# Checkoutly Setup Guide

## Overview
Checkoutly is an AI-powered conversational commerce platform built with Next.js 14, featuring a Cloudflare Worker backend that integrates with n8n workflows for intelligent chat processing.

## Architecture
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Worker for chat processing and PII sanitization
- **Workflows**: n8n for AI chat logic and business processes
- **Database**: Supabase for secure token storage and audit logs

## Prerequisites
- Node.js 18+ and npm
- Cloudflare account
- Supabase account
- n8n instance (cloud or self-hosted)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.local` and update with your values:
```env
# Update with your deployed Cloudflare Worker URL
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=https://your-worker.your-subdomain.workers.dev

# Update with your Supabase project details
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# n8n webhook for fallback/testing
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://semiepically-interprotoplasmic-duane.ngrok-free.dev/webhook/product-lookup
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Full Deployment Setup

### Step 1: Deploy Cloudflare Worker
See `CLOUDFLARE_WORKER_DEPLOYMENT.md` for detailed instructions.

### Step 2: Configure Supabase
1. Create a new Supabase project
2. Run the SQL commands from the deployment guide to create tables
3. Update environment variables with your Supabase credentials

### Step 3: Configure n8n Workflows
Set up workflows with these webhook endpoints:
- Product lookup: `/webhook/product-lookup`
- Order status: `/webhook/order-status`
- Process return: `/webhook/process-return`
- Process payment: `/webhook/process-payment`
- Customer info: `/webhook/get-customer-info`

**Your ngrok URLs**:
- `https://semiepically-interprotoplasmic-duane.ngrok-free.dev/webhook/product-lookup`
- `https://semiepically-interprotoplasmic-duane.ngrok-free.dev/webhook/order-status`
- `https://semiepically-interprotoplasmic-duane.ngrok-free.dev/webhook/process-return`
- `https://semiepically-interprotoplasmic-duane.ngrok-free.dev/webhook/process-payment`
- `https://semiepically-interprotoplasmic-duane.ngrok-free.dev/webhook/get-customer-info`

### Step 4: Deploy Next.js Application
Deploy to Vercel, Netlify, or your preferred platform:
```bash
npm run build
```

## Features

### Conversational Commerce
- Natural language product browsing
- Intelligent order processing
- Secure payment handling with PII tokenization
- Order tracking and customer support

### Security & Privacy
- Automatic PII detection and tokenization
- Secure token storage in Supabase
- Audit logging for compliance
- PCI-compliant payment processing

### AI Integration
- n8n workflow routing based on message content
- Context-aware responses
- Multi-step conversation flows
- Human-in-the-loop moderation

## Project Structure
```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ChatWidget-Simple.tsx  # Main chat interface
│   ├── Demo.tsx           # Demo section
│   ├── Features.tsx       # Features section
│   ├── Hero.tsx           # Hero section
│   ├── Navbar.tsx         # Navigation
│   └── ProductGrid.tsx    # Product display
├── lib/                   # Utilities and types
│   ├── n8n.ts            # Cloudflare Worker integration
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── cloudflare-worker-updated.js  # Worker code
└── CLOUDFLARE_WORKER_DEPLOYMENT.md  # Deployment guide
```

## Development Workflow

### Testing Chat Functionality
1. Start the development server
2. Navigate to the demo section
3. Click on products or type messages
4. Messages are routed through the Cloudflare Worker to n8n

### Adding New Workflows
1. Create new n8n workflow with webhook trigger
2. Update `determineWorkflow()` function in the Cloudflare Worker
3. Add routing logic based on message content
4. Test the integration

### Customizing the UI
- Update CSS variables in `app/globals.css` for theming
- Modify components in the `components/` directory
- Add new sections by creating components and importing in `app/page.tsx`

## Troubleshooting

### Chat Not Working
1. Check Cloudflare Worker deployment and environment variables
2. Verify n8n webhooks are accessible
3. Check browser console for errors
4. Ensure Supabase credentials are correct

### Build Errors
1. Run `npm run build` to check for TypeScript errors
2. Ensure all dependencies are installed
3. Check that environment variables are set

### Styling Issues
1. Verify Tailwind CSS is working: `npm run dev`
2. Check CSS variable definitions in `globals.css`
3. Ensure responsive breakpoints are correct

## Next Steps
1. Set up monitoring for the Cloudflare Worker
2. Configure additional n8n workflows for your business logic
3. Add user authentication if needed
4. Set up analytics and conversion tracking
5. Implement additional payment methods
6. Add multi-language support

## Support
For issues and questions:
1. Check the troubleshooting section
2. Review Cloudflare Worker logs: `wrangler tail`
3. Check n8n workflow execution logs
4. Verify Supabase table structure and permissions

## Security Considerations
- Never expose Supabase service role keys in frontend code
- Use environment variables for all sensitive configuration
- Regularly audit token storage and cleanup old tokens
- Monitor for unusual chat patterns or potential abuse
- Keep dependencies updated for security patches