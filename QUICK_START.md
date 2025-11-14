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

The student workflow is fully functional:
1. See lectures on dashboard
2. Click to open a lecture
3. Click on any section
4. Choose reaction type (Typo/Confused/Error)
5. Optionally add comment
6. Submit feedback
7. See all your comments in sidebar
8. Resolved comments show in green with checkmark

## Default Login
- User: `student-1` (Alice)
- Course: CIS 101
- Lecture: "Intro to Algorithms"

## API Endpoints Working
- ✅ GET `/api/student/{userId}/lectures/recent`
- ✅ GET `/api/lectures/{lectureId}`
- ✅ GET `/api/student/{userId}/lectures/{lectureId}/comments`
- ✅ POST `/api/reactions`

## Ports
- Frontend: `8080`
- Backend: `5000`

## Key Files
- **API Client**: `frontend/src/lib/api.ts`
- **Dashboard**: `frontend/src/pages/StudentDashboard.tsx`
- **Lecture View**: `frontend/src/pages/StudentLectureView.tsx`
- **Backend Routes**: `backend/routes/student_routes.py`
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

- Full implementation details: `STUDENT_IMPLEMENTATION.md`
- Testing scenarios: `TESTING_GUIDE.md`
- Complete summary: `IMPLEMENTATION_COMPLETE.md`

---

**Ready to demo! All student features working! ✨**

