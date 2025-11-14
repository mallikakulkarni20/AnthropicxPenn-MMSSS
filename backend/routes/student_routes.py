from flask import Blueprint, request, jsonify

from models.data_store import courses, enrollments, lectures
from services.lectures_service import get_lecture, get_section
from services.reactions_service import (
    get_reactions_by_user_and_lecture,
    create_reaction,
)

student_bp = Blueprint("student", __name__)


# getLecture —> gets most recent lecture (current versions) for student
@student_bp.get("/student/<user_id>/lectures/recent")
def get_recent_lectures(user_id):
    enrolled_courses = {
        e["courseId"] for e in enrollments if e["userId"] == user_id
    }

    current_lectures = [
        {
            "id": lec["id"],
            "title": lec["title"],
            "baseLectureId": lec["baseLectureId"],
            "version": lec["version"],
            "courseId": lec["courseId"],
        }
        for lec in lectures
        if lec["courseId"] in enrolled_courses and lec["isCurrent"]
    ]
    return jsonify(current_lectures)


# getCommentsByLecID (and userID)
@student_bp.get("/student/<user_id>/lectures/<lecture_id>/comments")
def get_comments_by_lecture(user_id, lecture_id):
    lecture = get_lecture(lecture_id)
    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404

    user_reactions = get_reactions_by_user_and_lecture(user_id, lecture_id)
    return jsonify(user_reactions)


# send Reaction —> section, lecture, reaction info
@student_bp.post("/reactions")
def send_reaction():
    data = request.get_json(force=True)
    user_id = data.get("userId")
    lecture_id = data.get("lectureId")
    section_id = data.get("sectionId")
    rtype = data.get("type")
    comment = data.get("comment", "")

    if rtype not in ["typo", "confused", "calculation_error"]:
        return jsonify({"error": "Invalid reaction type"}), 400

    lecture = get_lecture(lecture_id)
    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404

    section = get_section(lecture, section_id)
    if not section:
        return jsonify({"error": "Section not found"}), 404

    reaction = create_reaction(user_id, lecture_id, section_id, rtype, comment)
    return jsonify(reaction), 201
