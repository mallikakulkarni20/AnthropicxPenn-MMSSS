# Demo Cheat Sheet 📋

## 🚀 Quick Start Commands

```bash
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend
cd frontend && npm run dev

# Browser
http://localhost:5173/teacher
```

---

## 📍 Demo Flow (3 minutes)

| Step | URL | Action | What to Say |
|------|-----|--------|-------------|
| 1 | `/teacher` | Show dashboard | "Teachers see all lectures and versions" |
| 2 | Click "View" | Open lecture | "Let's see what students are saying" |
| 3 | Wait 2s | Auto-generation | "System detected 5 comments, AI analyzing..." |
| 4 | Scroll | Show git-diff | "Red = remove, Green = add - just like Git" |
| 5 | Sidebar | Point to comments | "Students confused about Big-O notation" |
| 6 | Click "Approve" | Accept suggestion | "I like this improvement" |
| 7 | Click more | Approve others | "Approving remaining changes" |
| 8 | Top-right | Show publish btn | "Now I can publish the new version" |
| 9 | Click publish | Create v2 | "New version created with improvements!" |

---

## 🎨 Visual Elements to Highlight

### Badges
- 🟡 "5 Comments - Action Needed" (yellow)
- 🟣 "AI Suggestion" (purple)  
- 🔵 "3 Pending" (blue)
- 🟢 "✓ Ready to publish!" (green)

### Diff Boxes
- 🔴 Red box: "- Remove" with strikethrough
- 🟢 Green box: "+ Add" with bold text

### Buttons
- 🟢 "Approve Change" (green)
- 🔴 "Reject Change" (red outline)
- 🟣 "Publish New Version" (purple gradient)

---

## 💬 Key Talking Points

### 30-second version
> "AI reads student feedback, suggests improvements, teachers review in a git-diff style, approve changes, publish new version. Feedback loop complete!"

### 1-minute version
> "Students submit feedback on confusing lecture content. When there are more than 3 comments, our system automatically calls Claude AI to analyze all the feedback and generate specific text improvements. Teachers see a beautiful git-diff style interface showing old vs new text, can approve or reject each change, then publish a new lecture version with all improvements. Students see their feedback actually made a difference."

### 2-minute version
> "We're solving a real problem in education: students give feedback but teachers don't have time to process it all and update materials. Our platform uses Claude AI to bridge that gap. Here's how it works:
> 
> 1. **Student submits feedback** - They can flag typos, confusion, or errors
> 2. **System detects volume** - When > 3 comments, auto-generates suggestions
> 3. **AI analyzes everything** - Claude reads all feedback and lecture content
> 4. **Generates improvements** - Specific text revisions addressing concerns
> 5. **Teacher reviews** - Git-diff style shows exactly what will change
> 6. **Teacher decides** - Approve good changes, reject bad ones
> 7. **Publish new version** - One click creates improved lecture
> 8. **Students benefit** - See better content and know feedback mattered
> 
> The key innovation is the git-diff UI - familiar, clear, professional."

---

## 🎯 Data Reference

### Mock Data in System
- **1 lecture**: "Intro to Algorithms" (lec1-v1)
- **4 sections**: Algorithm definition, Big-O, time complexities, worst-case
- **5 reactions**: 2 on sec-2, 2 on sec-3, 1 on sec-4
- **0 suggestions**: Will be generated on page load

### Expected After Demo
- **2 lectures**: lec1-v1 (old), lec1-v2 (new)
- **3 suggestions**: Status "accepted"
- **5 reactions**: All marked "addressed"

---

## 🐛 Emergency Fixes

### "No suggestions appear"
```bash
# Check backend logs
# Look for API errors
# Verify Claude API key
export API_KEY="your-key-here"
python app.py
```

### "Backend won't start"
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### "Frontend shows errors"
```bash
cd frontend
npm install
npm run dev
```

### "Suggestions generated but not showing"
- Refresh page
- Check browser console (F12)
- Check Network tab for API errors

---

## 🎤 Questions & Answers

**Q: How does the AI know what to improve?**
> A: We send Claude the full lecture context, all sections, and categorized student feedback (typos, confusion, errors). Claude generates specific revisions addressing each concern.

**Q: Can teachers edit the AI suggestions?**
> A: Currently they can approve or reject. For production, we'd add inline editing.

**Q: What if the AI suggestion is wrong?**
> A: Teachers review every change - nothing is automatically published. They can reject bad suggestions.

**Q: How do students know their feedback was used?**
> A: Reactions are marked "addressed" and they see "Resolved" badges in their view. Plus they see the actual improvements in the new version.

**Q: Does this work for non-text content?**
> A: Currently text-only, but could extend to code snippets, math equations, even images with the right AI models.

**Q: What about privacy?**
> A: Feedback is anonymous to the AI. We only send the text, not student identities.

**Q: Can this scale?**
> A: Yes! The AI can process hundreds of comments. For production, we'd add caching and async processing.

**Q: What's the cost?**
> A: Claude API costs ~$0.01 per lecture improvement. Very affordable for institutions.

---

## 🏆 Judge Appeal Points

### Technical Innovation
- Novel UI: Git-diff for education
- Smart automation: > 3 trigger
- Real-time state management
- RESTful API design

### Real Impact
- Saves teacher time
- Improves student outcomes
- Closes feedback loop
- Scalable solution

### Execution Quality
- Polished UI/UX
- Complete workflow
- Error handling
- Production-ready architecture

### Agentic AI Track
- Autonomous trigger (> 3)
- Contextual analysis (full lecture)
- Action-oriented (specific revisions)
- Human-in-the-loop (teacher approval)

---

## ⏱️ Timing Guide

| Duration | What to Show |
|----------|--------------|
| **30 sec** | Dashboard → Click lecture → Auto-generation starts |
| **1 min** | One git-diff example, approve one change |
| **2 min** | Full flow: dashboard → auto-gen → review → approve → publish |
| **3 min** | Full flow + sidebar comments + status tracking |
| **5 min** | Everything + Q&A about how AI works |

---

## 📊 Metrics to Mention

- **5 reactions** → **3 AI suggestions** (60% sections improved)
- **< 5 seconds** to generate suggestions
- **0 clicks** to start generation (automatic)
- **2 clicks** per suggestion (approve/reject)
- **1 click** to publish new version
- **100% teacher control** (review everything)

---

## 🎬 Opening Lines

### Option 1 (Problem-focused)
> "Raise your hand if you've ever left feedback for a professor and wondered if they even read it. That's what we're solving."

### Option 2 (Demo-focused)
> "Watch what happens when a teacher opens a lecture that students are confused about..."

### Option 3 (Impact-focused)
> "We're using AI to help teachers improve courses based on what students actually say is confusing."

---

## 🎊 Closing Lines

### Option 1 (Future-focused)
> "Imagine every lecture continuously improving based on real student needs. That's the future we're building."

### Option 2 (Impact-focused)
> "Students get better content. Teachers save time. Everyone wins. That's the power of AI in education."

### Option 3 (Call-to-action)
> "We'd love to hear your thoughts - especially from any educators in the audience!"

---

## 🔑 Keyboard Shortcuts (for you)

- **F12**: Open browser console (if errors)
- **Cmd+R**: Refresh page
- **Cmd+Shift+R**: Hard refresh
- **Cmd+T**: New tab
- **Cmd+W**: Close tab
- **Cmd+Tab**: Switch apps

---

## ✅ Pre-Demo Checklist

- [ ] Backend running (check terminal)
- [ ] Frontend running (check terminal)
- [ ] Browser at `/teacher`
- [ ] Network is stable
- [ ] Backup tab open (in case)
- [ ] Notes printed/visible
- [ ] Water nearby
- [ ] Smile 😊

---

**You've got this! Break a leg! 🎭**

---

## 🆘 Panic Button

If something breaks during demo:

1. **Stay calm** - smile and acknowledge it
2. **Say**: "Let me show you the backup flow"
3. **Switch to screenshots** (if you prepared them)
4. **Or**: Walk through the code/architecture instead
5. **Remember**: Judges care about problem-solving, not perfect demos

**Deep breath. You know your project. You've got this. 💪**

