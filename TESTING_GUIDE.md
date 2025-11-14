# Testing Guide - Student Frontend

## Quick Start

### 1. Start the Backend

```bash
cd backend
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### 2. Start the Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v... ready in ...ms

  ➜  Local:   http://localhost:8080/
```

## Test Scenarios

### Scenario 1: View Student Dashboard

1. Open browser to `http://localhost:8080/student`
2. **Expected Results:**
   - Page loads with "fAIry" header
   - Shows "My Lectures" heading
   - Displays one lecture card: "Intro to Algorithms"
   - Card shows "Version 1"
   - Card has "Open Lecture" button

### Scenario 2: Open a Lecture

1. From dashboard, click "Open Lecture"
2. **Expected Results:**
   - Navigates to `/student/lecture/lec1-v1`
   - Header shows "Intro to Algorithms" with "v1" badge
   - "Back" button in top left
   - Main content area shows 4 sections of text:
     - Section 1: About algorithms
     - Section 2: About running time and Big-O
     - Section 3: About time complexities
     - Section 4: About worst-case analysis
   - Right sidebar shows "Your Comments (0)"
   - No comment form visible yet

### Scenario 3: Select a Section

1. Click on any section of text
2. **Expected Results:**
   - Selected section highlights with blue border and light blue background
   - Comment form appears below the content
   - Form shows three reaction buttons:
     - "Typo" (with thumbs up icon)
     - "Confused" (with frown icon)
     - "Calculation Error" (with thumbs down icon)
   - Text area for optional comment
   - "Submit Feedback" button (disabled until reaction selected)

### Scenario 4: Submit Feedback (Minimal)

1. With a section selected, click "Typo" button
2. **Expected Results:**
   - Typo button highlights (fills with primary color)
   - Submit button becomes enabled

3. Click "Submit Feedback"
4. **Expected Results:**
   - Button shows "Submitting..." with spinner
   - Toast notification appears: "Success - Your feedback has been submitted!"
   - Comment form disappears
   - Section deselects
   - Right sidebar updates to "Your Comments (1)"
   - New comment card appears showing:
     - Green thumbs up icon
     - "Typo" badge
     - Timestamp
     - No comment text (since we didn't add one)

### Scenario 5: Submit Feedback with Comment

1. Click on a different section
2. Click "Confused" button
3. Type in text area: "This section could use more examples"
4. Click "Submit Feedback"
5. **Expected Results:**
   - Success toast appears
   - Sidebar shows "Your Comments (2)"
   - New comment shows:
     - Yellow frown icon
     - "Confused" badge
     - Comment text: "This section could use more examples"
     - Timestamp

### Scenario 6: Submit Calculation Error

1. Click on another section
2. Click "Calculation Error" button
3. Type: "The time complexity calculation seems off"
4. Submit
5. **Expected Results:**
   - Sidebar shows "Your Comments (3)"
   - Comment shows red thumbs down icon
   - "Calculation Error" badge
   - Your comment text

### Scenario 7: View All Comments

Check the right sidebar:
- Should show all 3 comments
- Most recent at top
- Each with appropriate icon and badge
- Each with timestamp
- None should show "Resolved" badge yet (since teacher hasn't addressed them)

### Scenario 8: Navigate Back

1. Click "Back" button in top left
2. **Expected Results:**
   - Returns to dashboard at `/student`
   - Lecture card still shows "Intro to Algorithms"

### Scenario 9: Refresh and Persistence

1. While on lecture view, refresh the page (F5 or Cmd+R)
2. **Expected Results:**
   - Page reloads
   - All your comments still appear (they're stored in backend)
   - Can submit more feedback

## API Verification

You can test the backend directly using curl:

### Get Recent Lectures
```bash
curl http://localhost:5000/api/student/student-1/lectures/recent
```

Expected:
```json
[
  {
    "id": "lec1-v1",
    "title": "Intro to Algorithms",
    "baseLectureId": "lec1",
    "version": 1,
    "courseId": "course-1"
  }
]
```

### Get Lecture Content
```bash
curl http://localhost:5000/api/lectures/lec1-v1
```

Should return full lecture with sections array.

### Get User Comments
```bash
curl http://localhost:5000/api/student/student-1/lectures/lec1-v1/comments
```

Should return array of your submitted reactions.

### Submit Reaction
```bash
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "student-1",
    "lectureId": "lec1-v1",
    "sectionId": "sec-1",
    "type": "typo",
    "comment": "Test comment"
  }'
```

Should return the created reaction object with an ID.

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Make sure Flask and flask_cors are installed: `pip install -r requirements.txt`

### Frontend won't start
- Check if port 8080 is already in use
- Make sure dependencies are installed: `npm install`

### "Failed to fetch lectures" error
- Verify backend is running on http://localhost:5000
- Check browser console for CORS errors
- Verify CORS is enabled in `backend/app.py`

### Comments not appearing
- Check browser console for errors
- Verify the API endpoint is correct: `/api/student/student-1/lectures/{lectureId}/comments`
- Use browser DevTools Network tab to see API responses

### Submit button stays disabled
- Make sure you've selected a reaction type (Typo, Confused, or Calculation Error)
- The comment text is optional, but reaction type is required

## Browser Console

Open browser DevTools (F12) and check Console tab:
- Should not see any errors in red
- May see some logs about API calls
- If you see CORS errors, backend CORS is not enabled properly

## Expected Database State

After testing, check backend console. The in-memory data store should contain:
- Original lecture: lec1-v1
- Multiple reactions in the reactions array
- Each reaction has: id, lectureId, sectionId, userId, type, comment, createdAt, addressed: false

## Testing Resolved Comments

To test the "resolved" feature:

1. Submit some feedback
2. In backend, manually mark a reaction as addressed:
   - Edit `backend/models/data_store.py`
   - In the reactions array, find your reaction
   - Change `"addressed": False` to `"addressed": True`
3. Refresh the lecture view
4. **Expected:** That comment now shows:
   - Green background
   - "Resolved" badge with checkmark icon

## Performance Notes

- Initial load should be < 1 second with mock data
- API calls complete in < 100ms locally
- No visible lag when submitting feedback
- Smooth transitions when selecting sections

## Success Criteria

✅ Can view dashboard with lecture cards
✅ Can open a lecture and see all sections
✅ Can select sections (visual feedback)
✅ Can choose reaction types
✅ Can add optional comments
✅ Can submit feedback successfully
✅ Comments appear immediately after submission
✅ Comments persist across page refreshes
✅ Resolved comments show different styling
✅ No console errors
✅ Proper loading and error states
✅ Toast notifications for success/error

All of these should work flawlessly!

