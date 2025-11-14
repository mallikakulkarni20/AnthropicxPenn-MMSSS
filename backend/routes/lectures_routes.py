from flask import Blueprint, request, jsonify

from services.lectures_service import get_lecture, create_base_lecture

lectures_bp = Blueprint("lectures", __name__)


# getLecContent —> get lecture with ID
@lectures_bp.get("/lectures/<lecture_id>")
def get_lecture_content(lecture_id):
    lecture = get_lecture(lecture_id)
    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404
    return jsonify(lecture)


# OPTIONAL: upload/create new lecture (version 1) – useful for teacher UI.
# body: { title, sections: [text1, text2, ...], teacherId, courseId }
@lectures_bp.post("/lectures")
def create_lecture():
    data = request.get_json(force=True)
    title = data.get("title")
    sections = data.get("sections", [])
    teacher_id = data.get("teacherId")
    course_id = data.get("courseId")

    if not title or not sections or not teacher_id or not course_id:
        return jsonify({"error": "Missing fields"}), 400

    lecture = create_base_lecture(title, sections, teacher_id, course_id)
    return jsonify(lecture), 201
