# ✅ Verification Checklist - Student Frontend

Use this checklist to verify everything is working before your demo.

## Pre-Demo Setup (5 minutes)

### Backend
- [ ] Terminal 1 open
- [ ] `cd backend` executed
- [ ] `python app.py` running
- [ ] See "Running on http://127.0.0.1:5000" message
- [ ] No errors in terminal

### Frontend
- [ ] Terminal 2 open
- [ ] `cd frontend` executed
- [ ] `npm run dev` running
- [ ] See "Local: http://localhost:8080/" message
- [ ] No errors in terminal

### Browser
- [ ] Open http://localhost:8080/student
- [ ] Page loads without errors
- [ ] Open Developer Tools (F12)
- [ ] Console tab shows no errors (no red text)

## Functional Testing (2 minutes)

### Dashboard
- [ ] "fAIry" logo visible in header
- [ ] "My Lectures" heading visible
- [ ] At least one lecture card showing
- [ ] Lecture shows "Intro to Algorithms"
- [ ] Version badge shows "v1"
- [ ] "Open Lecture" button clickable

### Lecture View
- [ ] Click "Open Lecture" navigates successfully
- [ ] URL changes to `/student/lecture/lec1-v1`
- [ ] Lecture title in header
- [ ] 4 sections of text visible
- [ ] "Back" button in top left
- [ ] Sidebar shows "Your Comments (0)"

### Section Selection
- [ ] Click on first section
- [ ] Section highlights with blue border
- [ ] Comment form appears below
- [ ] Three buttons visible: Typo, Confused, Calculation Error
- [ ] Text area visible
- [ ] Submit button visible

### Feedback Submission
- [ ] Click "Typo" button
- [ ] Typo button highlights
- [ ] Submit button becomes enabled
- [ ] Click "Submit Feedback"
- [ ] "Submitting..." appears briefly
- [ ] Success toast notification appears
- [ ] Comment form disappears
- [ ] Sidebar updates to "Your Comments (1)"
- [ ] New comment card appears in sidebar
- [ ] Comment shows green thumbs up icon
- [ ] Comment shows "Typo" badge

### Multiple Comments
- [ ] Select different section
- [ ] Click "Confused" button
- [ ] Type comment: "Test comment"
- [ ] Submit feedback
- [ ] Sidebar shows "Your Comments (2)"
- [ ] Both comments visible
- [ ] Most recent comment at top

### Navigation
- [ ] Click "Back" button
- [ ] Returns to dashboard
- [ ] Navigate back to lecture
- [ ] Comments still visible (persisted)

## API Verification (Optional)

Run these curl commands to verify backend:

```bash
# Test 1: Get lectures
curl http://localhost:5000/api/student/student-1/lectures/recent
# Expected: JSON array with lecture object

# Test 2: Get lecture content
curl http://localhost:5000/api/lectures/lec1-v1
# Expected: JSON object with sections array

# Test 3: Get user comments (after submitting some)
curl http://localhost:5000/api/student/student-1/lectures/lec1-v1/comments
# Expected: JSON array with your reactions

# Test 4: Submit reaction
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -d '{"userId":"student-1","lectureId":"lec1-v1","sectionId":"sec-1","type":"typo","comment":"API test"}'
# Expected: JSON object with created reaction
```

- [ ] All curl commands return valid JSON
- [ ] No error messages in responses

## Browser Console Checks

Open DevTools → Console tab:

- [ ] No red error messages
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] No failed network requests

Open DevTools → Network tab:

- [ ] `/api/student/student-1/lectures/recent` - Status 200
- [ ] `/api/lectures/lec1-v1` - Status 200
- [ ] `/api/student/student-1/lectures/lec1-v1/comments` - Status 200
- [ ] `/api/reactions` (POST) - Status 201

## Visual Checks

### Styling
- [ ] Clean, modern UI
- [ ] Proper spacing and alignment
- [ ] Icons rendering correctly
- [ ] Colors appropriate (blue for primary, green for success)
- [ ] Fonts readable
- [ ] No layout shifts

### Responsive Design
- [ ] Resize browser window
- [ ] Layout adapts gracefully
- [ ] No horizontal scrolling
- [ ] Mobile view (< 768px) works

### Interactions
- [ ] Hover effects on buttons
- [ ] Cursor changes to pointer on clickable items
- [ ] Smooth transitions
- [ ] Loading spinners appear during API calls
- [ ] Disabled states clearly visible

## Edge Cases

### Empty States
- [ ] If backend is down, shows error message
- [ ] If no lectures, shows "No lectures available"
- [ ] If no comments, shows "No comments yet"

### Form Validation
- [ ] Can't submit without selecting reaction type
- [ ] Can submit without comment text (it's optional)
- [ ] Submit button disabled during submission
- [ ] Can't double-submit

### Data Persistence
- [ ] Refresh page (F5)
- [ ] Comments still visible
- [ ] Data persists in backend

## Resolved Comments Feature

To test resolved comments:

1. Submit a comment
2. In backend terminal, stop server (Ctrl+C)
3. Edit `backend/models/data_store.py`
4. Find your reaction in reactions array
5. Change `"addressed": False` to `"addressed": True`
6. Save file
7. Restart backend: `python app.py`
8. Refresh browser

- [ ] Comment now shows green background
- [ ] "Resolved" badge visible with checkmark
- [ ] Different from unresolved comments

## Performance Checks

- [ ] Dashboard loads in < 2 seconds
- [ ] Lecture view loads in < 2 seconds
- [ ] Submit feedback completes in < 1 second
- [ ] No noticeable lag or freezing
- [ ] Smooth scrolling in comments sidebar

## Demo Readiness

### Data
- [ ] At least one lecture available
- [ ] Lecture has multiple sections (4)
- [ ] No old test data cluttering the view

### Terminals
- [ ] Backend terminal visible and running
- [ ] Frontend terminal visible and running
- [ ] No error messages in either

### Browser
- [ ] Full screen mode ready
- [ ] Bookmarks bar hidden (for clean demo)
- [ ] Only relevant tab open
- [ ] Console closed (open if you want to show no errors)

### Talking Points Ready
- [ ] Can explain student feedback workflow
- [ ] Can explain three reaction types
- [ ] Can show resolved comments feature
- [ ] Can explain how it helps teachers

## Final Check

- [ ] Everything on this checklist is ✅
- [ ] You can demo the full flow in < 2 minutes
- [ ] You're confident it will work during presentation

## If Something Fails

### Backend Issues
1. Check port 5000 is available: `lsof -i :5000`
2. Kill existing process if needed
3. Restart: `python app.py`
4. Check for Python errors

### Frontend Issues
1. Check port 8080 is available: `lsof -i :8080`
2. Kill existing process if needed
3. Restart: `npm run dev`
4. Check for compilation errors

### CORS Issues
1. Verify `backend/app.py` has `CORS(app)` uncommented
2. Restart backend
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

### No Data Issues
1. Check `backend/models/data_store.py` has lecture data
2. Verify student-1 is enrolled in course-1
3. Verify lecture has `isCurrent: True`

## Success Criteria

✅ All checkboxes ticked
✅ Can complete full demo flow without errors
✅ Looks professional and polished
✅ Fast and responsive
✅ Ready to impress judges!

---

**Time to complete checklist: 5-7 minutes**

**Good luck with your hackathon presentation! 🚀**

