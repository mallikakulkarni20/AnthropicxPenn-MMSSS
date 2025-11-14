# fAIry - AI-Powered Lecture Feedback Platform

AI Project for the Anthropic x Penn Hackathon!

A platform that allows students to provide feedback on lecture content and uses Claude AI to aggregate suggestions and help professors improve their materials.

## Features

- **Student View**: Browse lectures, provide feedback (typos, confusion, calculation errors), and track which comments have been resolved
- **Teacher View**: View all lecture versions, review student feedback, generate AI suggestions, and approve/reject changes to create new versions
- **AI-Powered Suggestions**: Automatically generate improved content based on student feedback patterns
- **Version Control**: Track different versions of lectures as they evolve based on student feedback

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

## Usage

### Student Workflow

1. Login and view your enrolled courses
2. Select a lecture to view its content
3. Click on any section of the lecture
4. Choose a feedback type (Typo, Confused, or Calculation Error)
5. Optionally add a comment
6. Submit feedback
7. Track your comments and see which ones have been resolved

### Teacher Workflow

1. Login to view all your lectures
2. Click on a lecture to see all versions
3. View student feedback organized by section
4. Use AI suggestions to generate improved content
5. Accept or reject suggested changes
6. Publish new versions of lectures

## Data Model

- **Lecture**: Contains title, version, sections, and metadata
- **Section**: Individual chunks of lecture content
- **Reaction**: Student feedback on specific sections
- **Suggestion**: AI-generated improvements based on reactions

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Flask, Python
- **AI**: Claude API (Anthropic)
