from flask import Blueprint, request, jsonify

from services.suggestions_service import generate_suggestions_for_lecture
from services.lectures_service import get_section, get_lecture

ai_bp = Blueprint("ai", __name__)


# Not in the original list, but this is where you plug Claude:
# body: { "lectureId": "lec1-v1" }
@ai_bp.post("/ai/generate-suggestions")
def generate_suggestions():
    # pass in lecture id plus list of all relavent section id
    data = request.get_json(force=True)
    lecture_id = data.get("lectureId")
    lecture = get_lecture(lecture_id)

    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404
    
    sections = []
    for id in data.get("sectionIds"):
        sections.append(get_section(id))

    if not sections: 
        return jsonify({"error": "Section not found"}), 404
    

    created = generate_suggestions_for_lecture(lecture, sections)
    return jsonify({"createdSuggestions": created})
