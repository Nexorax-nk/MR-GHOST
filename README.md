# 🤖 MR-GHOST

**AI-Powered PR Review System with Institutional Memory**

MR-GHOST (Memory Review - Guardian of Historical Organizational Software Traditions) is an intelligent PR review bot that prevents teams from repeating past architectural mistakes by maintaining an institutional memory bank of decisions.

![MR-GHOST Banner](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge) ![Python](https://img.shields.io/badge/Python-3.11+-green?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple?style=for-the-badge)

## 🎯 Problem Statement

Teams often repeat past mistakes because:
- 📚 Architectural decisions get lost in old PRs and Slack threads
- 🔄 New developers don't know the "why" behind code patterns
- ⚠️ Traditional git conflicts only catch syntax issues, not semantic violations
- 💬 Institutional knowledge lives in people's heads, not in systems

## ✨ Solution

MR-GHOST acts as your team's memory guardian:
- 🧠 **Semantic Conflict Detection**: Analyzes PRs against past architectural decisions using GPT-4
- 💾 **Memory Bank**: Stores team decisions with context, reasoning, and severity
- 💬 **Ask Bob**: Conversational AI that answers questions about past decisions
- 🚨 **Automated Reviews**: Flags violations before they reach production

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   GitHub    │─────▶│   Frontend   │─────▶│   Backend   │
│     PR      │      │  (Next.js)   │      │  (FastAPI)  │
└─────────────┘      └──────────────┘      └─────────────┘
                            │                      │
                            │                      ▼
                            │              ┌─────────────┐
                            │              │  OpenAI     │
                            │              │  GPT-4      │
                            │              └─────────────┘
                            │                      │
                            ▼                      ▼
                     ┌──────────────────────────────┐
                     │     Memory Bank (JSON)       │
                     └──────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Add your OpenAI API key to .env
# OPENAI_API_KEY=your_key_here

# Run the server
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎮 Usage

### 1. **Analyze a PR**
- Open the main page
- Click "Run IBM Bob Analysis"
- Bob will check the PR diff against your memory bank
- View any conflicts detected

### 2. **Extract Decisions**
- Go to Memory Bank page
- Click "Extract from Merged PR"
- Paste PR diff and discussion
- Bob extracts and saves the decision

### 3. **Ask Questions**
- Use the "Ask Bob" chat box
- Ask about past decisions
- Get answers with memory citations

## 📁 Project Structure

```
MR-GHOST/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── bob.py               # AI logic (OpenAI integration)
│   ├── memory.py            # Memory bank operations
│   ├── team_decisions.json  # Memory storage
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Main PR page
│   │   │   ├── memory/page.tsx    # Memory bank page
│   │   │   └── layout.tsx         # Root layout
│   │   └── components/
│   │       ├── GhostComment.tsx   # Bob's review comment
│   │       ├── ConflictCard.tsx   # Conflict display
│   │       ├── AskGhost.tsx       # Chat interface
│   │       ├── MemoryCard.tsx     # Memory display
│   │       └── ExtractMemoryModal.tsx  # Extraction UI
│   └── package.json
└── README.md
```

## 🎨 Features

### ✅ Implemented
- [x] Semantic PR analysis using GPT-4
- [x] Memory bank with CRUD operations
- [x] Conversational AI (Ask Bob)
- [x] Beautiful GitHub-inspired UI
- [x] Toast notifications
- [x] Memory extraction workflow
- [x] Error handling and logging
- [x] Demo mode for presentations

### 🚧 Future Enhancements
- [ ] GitHub webhook integration
- [ ] Multi-repository support
- [ ] Advanced filtering and search
- [ ] Memory versioning
- [ ] Team collaboration features
- [ ] Analytics dashboard

## 🛠️ Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- OpenAI API - GPT-4 for semantic analysis
- Python-dotenv - Environment management

**Frontend:**
- Next.js 16 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Sonner - Toast notifications
- Lucide React - Icons

## 🎭 Demo Mode

For presentations without an API key:

1. Set `DEMO_MODE=true` in `backend/.env`
2. Bob will use mock data instead of calling OpenAI
3. Perfect for demos and testing

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze` | POST | Analyze PR diff for conflicts |
| `/extract` | POST | Extract decision from merged PR |
| `/ask` | POST | Ask Bob a question |
| `/memories` | GET | Get all memories |
| `/health` | GET | Health check |

## 🤝 Contributing

This is a hackathon project! Contributions welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

- Built with ❤️ for hackathons
- Powered by OpenAI GPT-4
- Inspired by the need for better institutional memory in software teams

## 📧 Contact

Have questions? Found a bug? Want to collaborate?

- Open an issue on GitHub
- Star the repo if you find it useful! ⭐

---

**Made with 🤖 by developers who are tired of repeating mistakes**