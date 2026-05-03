# 🚀 MR-GHOST Setup Guide

Quick setup guide for getting MR-GHOST running in under 5 minutes!

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd MR-GHOST
```

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
```

**Edit `.env` and add your OpenAI API key:**
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

**Start the backend:**
```bash
uvicorn main:app --reload
```

✅ Backend running at http://localhost:8000

## Step 3: Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at http://localhost:3000

## Step 4: Test It Out!

1. Open http://localhost:3000 in your browser
2. Click "Run IBM Bob Analysis"
3. See Bob detect conflicts!
4. Try the "Ask Bob" chat
5. Go to Memory Bank and extract a new decision

## 🎭 Demo Mode (No API Key Required)

If you don't have an OpenAI API key yet:

1. Edit `backend/.env`:
   ```env
   DEMO_MODE=true
   ```

2. Restart the backend server

3. Bob will use mock data - perfect for demos!

## 🐛 Troubleshooting

### Backend won't start
- Make sure Python 3.11+ is installed: `python --version`
- Check if virtual environment is activated
- Try: `pip install --upgrade pip` then reinstall requirements

### Frontend won't start
- Make sure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Try: `npm cache clean --force`

### CORS errors
- Make sure backend is running on port 8000
- Check that frontend is on port 3000
- Restart both servers

### OpenAI API errors
- Verify your API key is correct in `.env`
- Check you have credits: https://platform.openai.com/usage
- Try demo mode if you don't have a key

## 📝 Quick Commands Reference

**Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Install new Python package:**
```bash
cd backend
venv\Scripts\activate
pip install package-name
pip freeze > requirements.txt
```

**Install new npm package:**
```bash
cd frontend
npm install package-name
```

## 🎉 You're All Set!

Now you can:
- ✅ Analyze PRs for conflicts
- ✅ Extract decisions from merged PRs
- ✅ Ask Bob questions about past decisions
- ✅ Build your team's institutional memory

Happy coding! 🚀