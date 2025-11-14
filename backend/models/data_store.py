from typing import List, Dict, Any

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
            {"id": "sec-1", "order": 1, "text": "An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. It consists of a finite set of well-defined instructions that can be executed in a specific order to achieve a desired result."},
            {"id": "sec-2", "order": 2, "text": "Running time analysis helps us understand how the execution time of an algorithm grows as the input size increases. Big-O notation provides an upper bound on the growth rate of an algorithm's time complexity."},
            {"id": "sec-3", "order": 3, "text": "Common time complexities include O(1) for constant time, O(log n) for logarithmic time, O(n) for linear time, O(n log n) for linearithmic time, and O(n²) for quadratic time."},
            {"id": "sec-4", "order": 4, "text": "When analyzing algorithms, we typically focus on the worst-case scenario to ensure our algorithm performs acceptably even under the most challenging conditions."},
        ],
    }
]

# Student feedback (Reaction)
reactions: List[Dict[str, Any]] = []

# AI suggestions for sections
suggestions: List[Dict[str, Any]] = []
