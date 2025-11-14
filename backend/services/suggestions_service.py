from typing import Optional, List, Dict, Any

from models.data_store import suggestions
from utils.id_utils import new_uuid
from utils.time_utils import now_iso
from services.lectures_service import get_lecture
from services.reactions_service import get_reactions_for_section


def get_suggestion_by_id(suggestion_id: str) -> Optional[Dict[str, Any]]:
    return next((s for s in suggestions if s["id"] == suggestion_id), None)


def create_suggestion(lecture_id: str,
                      section_id: str,
                      suggested_text: str) -> Dict[str, Any]:
    suggestion = {
        "id": new_uuid(),
        "lectureId": lecture_id,
        "sectionId": section_id,
        "suggestedText": suggested_text,
        "status": "pending",
        "createdAt": now_iso(),
    }
    suggestions.append(suggestion)
    return suggestion


def generate_suggestions_for_lecture(lecture_id: str,
                                     min_reactions: int = 2
                                     ) -> List[Dict[str, Any]]:
    """Simple heuristic: if a section has >= min_reactions, create a suggestion."""
    lecture = get_lecture(lecture_id)
    if not lecture:
        return []

    created = []
    for section in lecture["sections"]:
        sec_reactions = get_reactions_for_section(lecture_id, section["id"])
        if len(sec_reactions) >= min_reactions:
            sug_text = (
                "[AI SUGGESTED UPDATE] " + section["text"] +
                " (Clarify this section based on student feedback.)"
            )
            created.append(create_suggestion(lecture_id, section["id"], sug_text))
    return created
