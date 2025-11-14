from flask import Blueprint, request, jsonify

from services.suggestions_service import generate_suggestions_for_section
from services.lectures_service import get_section, get_lecture

ai_bp = Blueprint("ai", __name__)


# Not in the original list, but this is where you plug Claude:
# body: { "lectureId": "lec1-v1" }
@ai_bp.post("/ai/generate-suggestions")
def generate_suggestions():
    data = request.get_json(force=True)
    section_id = data.get("sectionId")

    section = get_section(section_id)

    if not section: 
        return jsonify({"error": "Section not found"}), 404
    
    lecture = get_lecture(section["lectureId"])

    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404

    created = generate_suggestions_for_section(section, lecture)
    return jsonify({"createdSuggestions": created})
