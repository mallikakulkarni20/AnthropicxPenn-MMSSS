from flask import Blueprint, jsonify

from models.data_store import lectures
from services.lectures_service import get_lecture, create_new_lecture_version
from services.reactions_service import (
    get_reactions_for_lecture,
    mark_reactions_addressed_for_section,
)
from services.suggestions_service import get_suggestion_by_id
from models.data_store import suggestions  # to keep list in sync

teacher_bp = Blueprint("teacher", __name__)


# getLectureAll —> gets all lectures and versions for this teacher
@teacher_bp.get("/teacher/<teacher_id>/lectures")
def get_lecture_all(teacher_id):
    teacher_lectures = [
        {
            "id": lec["id"],
            "baseLectureId": lec["baseLectureId"],
            "version": lec["version"],
            "isCurrent": lec["isCurrent"],
            "title": lec["title"],
            "courseId": lec["courseId"],
        }
        for lec in lectures
        if lec["teacherId"] == teacher_id
    ]
    return jsonify(teacher_lectures)


# getCommentbyLect —> all reactions + suggestions for a lecture
@teacher_bp.get("/teacher/<teacher_id>/lectures/<lecture_id>/comments")
def get_comments_by_lecture_teacher(teacher_id, lecture_id):
    lecture = get_lecture(lecture_id)
    if not lecture or lecture["teacherId"] != teacher_id:
        return jsonify({"error": "Lecture not found for this teacher"}), 404

    lecture_reactions = get_reactions_for_lecture(lecture_id)
    lecture_suggestions = [
        s for s in suggestions if s["lectureId"] == lecture_id
    ]
    return jsonify(
        {"reactions": lecture_reactions, "suggestions": lecture_suggestions}
    )


# approveSuggestion —> update section text and mark comments addressed
@teacher_bp.post("/teacher/suggestions/<suggestion_id>/approve")
def approve_suggestion(suggestion_id):
    suggestion = get_suggestion_by_id(suggestion_id)
    if not suggestion:
        return jsonify({"error": "Suggestion not found"}), 404

    lecture = get_lecture(suggestion["lectureId"])
    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404

    new_lecture = create_new_lecture_version(
        lecture,
        suggestion["sectionId"],
        suggestion["suggestedText"],
    )

    # update suggestion record
    suggestion["status"] = "accepted"
    suggestion["lectureId"] = new_lecture["id"]

    # mark all reactions on that section as addressed
    mark_reactions_addressed_for_section(lecture["id"], suggestion["sectionId"])

    return jsonify({"suggestion": suggestion, "newLecture": new_lecture})


# rejectSuggestion —> mark suggestion rejected, mark comments addressed
@teacher_bp.post("/teacher/suggestions/<suggestion_id>/reject")
def reject_suggestion(suggestion_id):
    suggestion = get_suggestion_by_id(suggestion_id)
    if not suggestion:
        return jsonify({"error": "Suggestion not found"}), 404

    lecture = get_lecture(suggestion["lectureId"])
    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404

    suggestion["status"] = "rejected"
    mark_reactions_addressed_for_section(
        suggestion["lectureId"], suggestion["sectionId"]
    )

    return jsonify({"suggestion": suggestion})
