# ⚡ Quick Start - Student Frontend

## 30 Second Setup

### Terminal 1 - Backend
```bash
cd backend
python app.py
```

### Terminal 2 - Frontend  
```bash
cd frontend
npm run dev
```

### Open Browser
```
http://localhost:8080/student
```

## That's It! 🎉

### Student Workflow
1. See lectures on dashboard
2. Click to open a lecture
3. Click on any section
4. Choose reaction type (Typo/Confused/Calculation Error)
5. Optionally add comment
6. Submit feedback
7. See all your comments in sidebar
8. Resolved comments show in green with checkmark

### Teacher Workflow
1. Login as teacher (see credentials below)
2. See all lectures with version history
3. Click to view any lecture version
4. Review student feedback in sidebar
5. Click "Generate AI Suggestions"
6. Review suggested improvements
7. Approve (creates new version) or Reject
8. Students automatically see the updated version

## Default User
- **Student**: `student-1` (Alice)
- **Teacher**: `teacher-1` (Prof. Smith)
- **Course**: CIS 101
- **Lecture**: "Intro to Algorithms"

## API Endpoints Working
### Student APIs
- ✅ GET `/api/student/{userId}/lectures/recent`
- ✅ GET `/api/lectures/{lectureId}`
- ✅ GET `/api/student/{userId}/lectures/{lectureId}/comments`
- ✅ POST `/api/reactions`

### Teacher APIs
- ✅ GET `/api/teacher/{teacherId}/lectures`
- ✅ GET `/api/teacher/{teacherId}/lectures/{lectureId}/comments`
- ✅ POST `/api/teacher/suggestions/{suggestionId}/approve`
- ✅ POST `/api/teacher/suggestions/{suggestionId}/reject`
- ✅ POST `/api/ai/generate-suggestions`

## Ports
- Frontend: `8080`
- Backend: `5000`

## Key Files
- **API Client**: `frontend/src/lib/api.ts`
- **Student Dashboard**: `frontend/src/pages/StudentDashboard.tsx`
- **Student Lecture View**: `frontend/src/pages/StudentLectureView.tsx`
- **Teacher Dashboard**: `frontend/src/pages/TeacherDashboard.tsx`
- **Teacher Lecture View**: `frontend/src/pages/TeacherLectureView.tsx`
- **Student Routes**: `backend/routes/student_routes.py`
- **Teacher Routes**: `backend/routes/teacher_routes.py`
- **AI Routes**: `backend/routes/ai_routes.py`
- **Data Store**: `backend/models/data_store.py`

## Troubleshooting

**"Failed to fetch"**
→ Make sure backend is running on port 5000

**"No lectures"**
→ Check that `backend/models/data_store.py` has data

**CORS errors**
→ Verify `CORS(app)` is uncommented in `backend/app.py`

## Testing Commands

Test backend directly:
```bash
# Get lectures
curl http://localhost:5000/api/student/student-1/lectures/recent

# Submit feedback
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -d '{"userId":"student-1","lectureId":"lec1-v1","sectionId":"sec-1","type":"typo","comment":"Test"}'
```

## For More Details

- Student implementation: `STUDENT_IMPLEMENTATION.md`
- Teacher implementation: `TEACHER_IMPLEMENTATION.md`
- Testing scenarios: `TESTING_GUIDE.md`
- Complete summary: `IMPLEMENTATION_COMPLETE.md`

---

**Ready to demo! All student AND teacher features working! ✨**

