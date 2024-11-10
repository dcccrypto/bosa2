# Deployment Checklist

## Backend (Heroku)
- [ ] Set environment variables in Heroku dashboard
  - SOLANA_RPC_URL
  - SOLANA_TRACKER_API_KEY
  - TOKEN_ADDRESS
  - FOUNDER_ADDRESS
  - ALLOWED_ORIGINS
  - NODE_ENV=production
  - HELIUS_API_KEY
- [ ] Run `npm run deploy:backend`
- [ ] Verify health check endpoint
- [ ] Monitor logs: `heroku logs --tail`

## Frontend (Vercel)
- [ ] Set environment variables in Vercel dashboard
  - NEXT_PUBLIC_API_URL
- [ ] Run `npm run deploy:frontend`
- [ ] Verify API connectivity
- [ ] Check console for errors
- [ ] Test all functionality 