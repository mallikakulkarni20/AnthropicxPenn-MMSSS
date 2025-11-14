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
            {
                "id": "sec-1",
                "order": 1,
                "text": "An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. It consists of a finite set of well-defined instructions that can be executed in a specific order to achieve a desired result. Think of it as a recipe in cooking - each step must be clear and unambiguous so that anyone following it will get the same result."
            },
            {
                "id": "sec-2",
                "order": 2,
                "text": "Running time analysis helps us understand how the execution time of an algorithm grows as the input size increases. Big-O notation provides an upper bound on the growth rate of an algorithm's time complexity. For example, if an algorithm has O(n) time complexity, doubling the input size will roughly double the running time."
            },
            {
                "id": "sec-3",
                "order": 3,
                "text": "Common time complexities include: O(1) for constant time (accessing an array element), O(log n) for logarithmic time (binary search), O(n) for linear time (linear search), O(n log n) for linearithmic time (merge sort), and O(n²) for quadratic time (nested loops). Understanding these helps you choose the right algorithm for your problem."
            },
            {
                "id": "sec-4",
                "order": 4,
                "text": "When analyzing algorithms, we typically focus on the worst-case scenario to ensure our algorithm performs acceptably even under the most challenging conditions. This gives us a guarantee about the maximum time or space an algorithm will require. However, average-case and best-case analysis can also be useful depending on the application."
            },
        ],
    }
]

# Sections (kept for backward compatibility - sections are now embedded in lectures)
sections: List[Dict[str, Any]] = []

# Student feedback (Reaction)
reactions: List[Dict[str, Any]] = [
    {
        "id": "react-1",
        "lectureId": "lec1-v1",
        "sectionId": "sec-2",
        "userId": "student-1",
        "addressed": False,
        "type": "confused",
        "comment": "I don't understand how Big-O notation relates to actual running time. Can you explain with more examples?",
        "createdAt": "2025-11-14T10:30:00Z"
    },
    {
        "id": "react-2",
        "lectureId": "lec1-v1",
        "sectionId": "sec-2",
        "userId": "student-1",
        "addressed": False,
        "type": "confused",
        "comment": "The doubling example is confusing. What if the input size triples?",
        "createdAt": "2025-11-14T10:35:00Z"
    },
    {
        "id": "react-3",
        "lectureId": "lec1-v1",
        "sectionId": "sec-3",
        "userId": "student-1",
        "addressed": False,
        "type": "typo",
        "comment": "Should O(n²) be written as O(n^2)?",
        "createdAt": "2025-11-14T10:40:00Z"
    },
    {
        "id": "react-4",
        "lectureId": "lec1-v1",
        "sectionId": "sec-3",
        "userId": "student-1",
        "addressed": False,
        "type": "confused",
        "comment": "Can you provide more concrete examples for each time complexity? The descriptions are too abstract.",
        "createdAt": "2025-11-14T10:45:00Z"
    },
    {
        "id": "react-5",
        "lectureId": "lec1-v1",
        "sectionId": "sec-4",
        "userId": "student-1",
        "addressed": False,
        "type": "confused",
        "comment": "Why do we focus on worst-case? Wouldn't average-case be more practical?",
        "createdAt": "2025-11-14T10:50:00Z"
    }
]

# AI suggestions for sections
# Structure: { id, lectureId, sectionId, originalText, suggestedText, status, createdAt }
suggestions: List[Dict[str, Any]] = []

# Approved section updates waiting to be published
# Each entry: { "lectureId": str, "sectionId": str, "suggestedText": str, "suggestionId": str }
approved_section_updates: List[Dict[str, Any]] = []
