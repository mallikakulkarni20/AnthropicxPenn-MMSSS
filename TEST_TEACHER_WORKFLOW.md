# Quick Test Guide - Teacher Workflow 🧪

## Prerequisites
- Backend running: `cd backend && python app.py`
- Frontend running: `cd frontend && npm run dev`
- Both servers should be running without errors

---

## 🎬 Demo Script (5 minutes)

### Step 1: Teacher Dashboard (30 seconds)
**URL**: http://localhost:5173/teacher

**What to show**:
- List of all lectures with versions
- "Intro to Algorithms" lecture with version info
- Click "View" button on the lecture

**What to say**:
> "As a teacher, I can see all my lectures and their versions. Let's open the Intro to Algorithms lecture to see what students are saying."

---

### Step 2: Auto-Generation Trigger (1 minute)
**URL**: http://localhost:5173/teacher/lecture/lec1-v1

**What to show**:
- Page loads with lecture content
- Top-right shows: "5 Comments - Action Needed" badge
- After ~2 seconds, see "Generating Suggestions..." badge
- Toast notification: "AI Suggestions Generated"
- Sections transform to show git-diff style

**What to say**:
> "The system detected more than 3 student comments, so it automatically called Claude AI to analyze the feedback and generate improvement suggestions. Notice how the AI is now processing all the student concerns."

---

### Step 3: Review Git-Diff Display (1.5 minutes)
**What to show**:
- Scroll to section with AI suggestion
- Point out the red "Remove" box with original text
- Point out the green "Add" box with improved text
- Show the student comments in the right sidebar
- Show the "X comments" badge on sections

**What to say**:
> "Here's where the magic happens. The interface shows me exactly what will change - just like Git version control. The red shows what will be removed, and the green shows the AI's improved version that addresses student concerns. I can see the students were confused about Big-O notation, and the AI has added more examples and clearer explanations."

---

### Step 4: Approve Suggestions (1 minute)
**What to show**:
- Click "Approve Change" on first suggestion
- Show loading spinner
- Show status updates: "1 Accepted, X Pending"
- Show student feedback marked as "Addressed"
- Click "Approve Change" on remaining suggestions

**What to say**:
> "I like these improvements, so I'll approve them. Each approval updates the status in real-time. Notice how the student feedback is automatically marked as addressed - they'll know their concerns were heard."

---

### Step 5: Publish New Version (1 minute)
**What to show**:
- Point to the blue status card: "0 Pending, X Accepted, Y Rejected"
- Show the purple "Publish New Version" button appear
- Click the button
- Show toast: "Version Published - X improvement(s)!"
- Return to dashboard
- Show new version in the lecture list

**What to say**:
> "Once I've reviewed all suggestions, I can publish a new version. This creates v2 of the lecture with all my approved changes. Students will now see the improved content, and the feedback loop is complete."

---

## 🐛 Troubleshooting

### Issue: No suggestions appear
**Check**:
- Backend is running (`python app.py` in backend folder)
- Check backend logs for errors
- Verify Claude API key is set in `.env`
- Check browser console for API errors

**Fix**:
```bash
# In backend folder
export API_KEY="your-claude-api-key"
python app.py
```

### Issue: "Generating Suggestions..." never finishes
**Check**:
- Backend logs for API errors
- Claude API rate limits
- Network connection

**Fix**: Click "Generate AI Suggestions" button manually

### Issue: Lecture content is blank
**Check**:
- `backend/models/data_store.py` has section content
- Backend restarted after data changes

**Fix**: Restart backend

### Issue: Comments don't show
**Check**:
- `reactions` list in data_store.py has entries
- `lectureId` matches in reactions

**Fix**: Check data_store.py line 61-112

---

## 🎯 Key Features to Highlight

### 1. Smart Automation
- Detects high feedback volume (> 3 comments)
- Auto-generates suggestions without manual trigger
- Saves teacher time

### 2. Clear Visual Design
- Git-diff style familiar to developers
- Color-coded for quick understanding
- Professional appearance

### 3. Full Control
- Teachers review every change
- Can approve or reject individually
- No blind automation

### 4. Feedback Loop
- Student comments drive improvements
- Students see when feedback is addressed
- Creates engagement

### 5. Version Control
- All versions preserved
- Can see lecture evolution
- Easy rollback if needed

---

## 📊 Expected Data After Testing

### After approving 3 suggestions and publishing:

**Lectures Table**:
```
lec1-v1 (isCurrent: false, version: 1)  ← Original
lec1-v2 (isCurrent: true, version: 2)   ← New with improvements
```

**Suggestions Table**:
```
3 suggestions with status: "accepted"
0 suggestions with status: "pending"
```

**Reactions Table**:
```
All 5 reactions with addressed: true
```

---

## 🎤 Demo Talking Points

### For Technical Audience
- "We're using Claude's Sonnet 4 model for high-quality text generation"
- "The prompt engineering includes full lecture context and categorized feedback"
- "Real-time state management with React hooks"
- "RESTful API design with Flask blueprints"

### For Non-Technical Audience
- "AI reads all student feedback and suggests improvements"
- "Teachers have full control - they review every change"
- "Students see their feedback actually matters"
- "Improves lecture quality over time"

### For Judges
- "Solves real problem: lecture quality improvement"
- "Novel UI: git-diff for education content"
- "Complete workflow: feedback → AI → approval → publishing"
- "Scalable: works for any number of lectures and students"

---

## ⏱️ Quick 2-Minute Version

If you're short on time:

1. **Open teacher view** (10 sec)
2. **Click lecture** → auto-generation starts (30 sec)
3. **Show one git-diff** → explain red/green (30 sec)
4. **Approve one change** (20 sec)
5. **Show publish button** (10 sec)
6. **Wrap up**: "And that's how AI helps teachers improve content based on student feedback!" (20 sec)

---

## 🔥 Wow Moments

### 1. Automatic Generation
When the page loads and automatically starts generating suggestions without clicking anything - shows intelligent system

### 2. Git-Diff UI
The familiar red/green split view makes the change review intuitive and professional

### 3. Real-Time Updates
Every action immediately reflects in the UI - no page refreshes

### 4. Complete Loop
From student feedback → AI analysis → teacher approval → new version - showing the full product vision

---

## 📸 Screenshot Opportunities

1. Dashboard with multiple lectures
2. "5 Comments - Action Needed" badge
3. Git-diff display (red vs green)
4. Status card with numbers
5. "Publish New Version" button
6. Success toast notification
7. New version in dashboard

---

Good luck with your demo! 🎉

