from typing import List, Dict, Any
from utils.id_utils import new_uuid
from utils.time_utils import now_iso
# Simple in-memory "DB" for the hackathon.


# Users
users: List[Dict[str, Any]] = [
    {"id": "student-1", "name": "Alice", "role": "student"},
    {"id": "teacher-1", "name": "Prof. Smith", "role": "teacher"},
]

# Courses and enrollment
courses: List[Dict[str, Any]] = [
    {"id": "course-1", "name": "CIS 101", "teacherId": "teacher-1"},
]

enrollments: List[Dict[str, Any]] = [
    {"userId": "student-1", "courseId": "course-1"},
]

# Lectures – each entry is a version of a lecture
lectures: List[Dict[str, Any]] = [
    {
        "id": "lec1-v1",
        "baseLectureId": "lec1",   # logical group for all versions
        "version": 1,
        "isCurrent": True,
        "title": "Intro to Algorithms",
        "teacherId": "teacher-1",
        "courseId": "course-1",
        "sections": [
            {"id": "sec-1"},
            {"id": "sec-2"},
        ],
    }
]

#Keeping track of sections
sections: List[Dict[str, Any]] = [{
    "id": "sec-1",
    "lectureId": "lec1-v1",
    "order": 1,
    "text": "What is an algorithm?",
    "reactions": [{
        "id": "reaction-1",
    }],
}]

# Student feedback (Reaction)
reactions: List[Dict[str, Any]] = [{
    "id": "reaction-1",
    "lectureId": "lec1-v1",
    "sectionId": "sec-1",
    "userId": "student-1",
    "type": "typo",
    "createdAt": "2025-01-01T00:00:00Z",
    "comment": "",
    "addressed": False,
}]

#

# AI suggestions for sections
suggestions: List[Dict[str, Any]] = [{
    "id": new_uuid(),
    "lectureId": "lecture_id",
    "sectionId": "section_id",
    "oldText": "old_section_text",         # NEW
    "suggestedText": "suggested_text",     # UPDATED
    "status": "pending",
    "createdAt": now_iso(),
}]

# Approved section updates waiting to be published
# Each entry: { "lectureId": str, "sectionId": str, "suggestedText": str, "suggestionId": str }
approved_section_updates: List[Dict[str, Any]] = []
