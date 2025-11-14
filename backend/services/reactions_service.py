from typing import List, Dict, Any

from models.data_store import reactions, sections
from utils.id_utils import new_uuid
from utils.time_utils import now_iso


def create_reaction(user_id: str,
                    lecture_id: str,
                    section_id: str,
                    rtype: str,
                    comment: str) -> Dict[str, Any]:
    reaction = {
        "id": new_uuid(),
        "lectureId": lecture_id,
        "sectionId": section_id,
        "userId": user_id,
        "addressed": False,
        "type": rtype,
        "comment": comment or "",
        "createdAt": now_iso(),
    }
    reactions.append(reaction)
    return reaction


def get_reactions_by_user_and_lecture(user_id: str,
                                      lecture_id: str) -> List[Dict[str, Any]]:
    return [
        r for r in reactions
        if r["lectureId"] == lecture_id and r["userId"] == user_id
    ]


def get_reactions_for_lecture(lecture_id: str) -> List[Dict[str, Any]]:
    return [r for r in reactions if r["lectureId"] == lecture_id]


def get_reactions_for_section(section_id: str) -> List[Dict[str, Any]]:
    return [
        r for r in reactions
        if r["sectionId"] == section_id
    ]


def mark_reactions_addressed_for_section(lecture_id: str, section_id: str) -> None:
    for r in reactions:
        if r["lectureId"] == lecture_id and r["sectionId"] == section_id:
            r["addressed"] = True
