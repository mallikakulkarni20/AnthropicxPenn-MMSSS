from flask import Blueprint, request, jsonify

from services.suggestions_service import generate_suggestions_for_lecture
from services.lectures_service import get_lecture

ai_bp = Blueprint("ai", __name__)


# Not in the original list, but this is where you plug Claude:
# body: { "lectureId": "lec1-v1" }
@ai_bp.post("/ai/generate-suggestions")
def generate_suggestions():
    data = request.get_json(force=True)
    lecture_id = data.get("lectureId")

    lecture = get_lecture(lecture_id)
    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404

    created = generate_suggestions_for_lecture(lecture_id, min_reactions=2)
    return jsonify({"createdSuggestions": created})
