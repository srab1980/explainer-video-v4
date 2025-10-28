# Deployment Instructions for StoryVid Storyboard Creator

## Quick Deploy to Vercel (Recommended - 5 minutes)

Vercel is the recommended platform as it's built by the Next.js team and offers zero-configuration deployment.

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project**:
   ```bash
   cd /workspace/storyvid-storyboard
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select "yes" to link to existing project or create new
   - Wait for deployment (usually < 2 minutes)
   - You'll receive a live URL like: `https://storyvid-storyboard-xyz.vercel.app`

4. **Set Environment Variable**:
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Paste your OpenAI API key when prompted

5. **Redeploy with environment variable**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import from Git or upload the `/workspace/storyvid-storyboard` directory
4. Vercel auto-detects Next.js settings
5. Add environment variable:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
6. Click "Deploy"
7. Wait 1-2 minutes for deployment
8. Access your live URL

## Alternative: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Navigate and login:
   ```bash
   cd /workspace/storyvid-storyboard
   netlify login
   ```

3. Initialize:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

5. Set environment variable in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add `OPENAI_API_KEY` with your key

## Current Local Status

✅ **Production build completed successfully**
✅ **Running locally on**: http://localhost:3000
✅ **All features tested and working**
✅ **Ready for deployment**

## Environment Variables Required

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Post-Deployment Checklist

After deploying to Vercel/Netlify, verify:
- [ ] Page loads correctly
- [ ] AI generation works (test with a script)
- [ ] Scene timeline displays
- [ ] Preview canvas shows animations
- [ ] Scene editor opens and functions
- [ ] Auto-save indicator appears

## Troubleshooting

**If AI generation fails after deployment:**
- Verify `OPENAI_API_KEY` is set in environment variables
- Check the API key is valid and has credits
- Review deployment logs for errors

**If build fails:**
- Ensure Node.js version >= 18 on deployment platform
- Check all dependencies are in package.json
- Verify `.env.local` is not accidentally committed (it should be in .gitignore)

## Technical Details

- **Framework**: Next.js 14.2.0
- **Runtime**: Node.js 18+
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Start Command**: `pnpm start`
