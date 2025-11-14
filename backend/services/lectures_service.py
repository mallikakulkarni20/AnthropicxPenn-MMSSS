from typing import Optional, Dict, Any, List

from models.data_store import lectures
from utils.id_utils import new_uuid


def get_lecture(lecture_id: str) -> Optional[Dict[str, Any]]:
    return next((lec for lec in lectures if lec["id"] == lecture_id), None)


def get_section(lecture: Dict[str, Any], section_id: str) -> Optional[Dict[str, Any]]:
    if not lecture:
        return None
    return next((s for s in lecture["sections"] if s["id"] == section_id), None)


def create_base_lecture(title: str,
                        sections_texts: List[str],
                        teacher_id: str,
                        course_id: str) -> Dict[str, Any]:
    base_id = new_uuid()
    lecture_id = f"{base_id}-v1"
    section_objs = [
        {"id": new_uuid(), "order": i + 1, "text": text}
        for i, text in enumerate(sections_texts)
    ]

    lecture = {
        "id": lecture_id,
        "baseLectureId": base_id,
        "version": 1,
        "isCurrent": True,
        "title": title,
        "teacherId": teacher_id,
        "courseId": course_id,
        "sections": section_objs,
    }
    lectures.append(lecture)
    return lecture


def create_new_lecture_version(old_lecture: Dict[str, Any],
                               section_id: str,
                               new_text: str) -> Dict[str, Any]:
    """Clone old lecture into a new version with updated section text."""
    old_lecture["isCurrent"] = False
    base_id = old_lecture["baseLectureId"]
    new_version = old_lecture["version"] + 1
    new_lecture_id = f"{base_id}-v{new_version}"

    new_sections = []
    for s in old_lecture["sections"]:
        if s["id"] == section_id:
            new_sections.append({"id": s["id"], "order": s["order"], "text": new_text})
        else:
            new_sections.append(dict(s))

    new_lecture = {
        **old_lecture,
        "id": new_lecture_id,
        "version": new_version,
        "isCurrent": True,
        "sections": new_sections,
    }
    lectures.append(new_lecture)
    return new_lecture


def create_new_lecture_version_with_multiple_sections(
    old_lecture: Dict[str, Any],
    section_updates: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Clone old lecture into a new version with multiple sections updated.
    
    Args:
        old_lecture: The current lecture to clone
        section_updates: List of dicts with "sectionId" and "suggestedText" keys
    
    Returns:
        The new lecture version with all sections updated
    """
    old_lecture["isCurrent"] = False
    base_id = old_lecture["baseLectureId"]
    new_version = old_lecture["version"] + 1
    new_lecture_id = f"{base_id}-v{new_version}"

    # Create a map of sectionId -> new text for quick lookup
    updates_map = {update["sectionId"]: update["suggestedText"] for update in section_updates}

    new_sections = []
    for s in old_lecture["sections"]:
        if s["id"] in updates_map:
            new_sections.append({
                "id": s["id"],
                "order": s["order"],
                "text": updates_map[s["id"]]
            })
        else:
            new_sections.append(dict(s))

    new_lecture = {
        **old_lecture,
        "id": new_lecture_id,
        "version": new_version,
        "isCurrent": True,
        "sections": new_sections,
    }
    lectures.append(new_lecture)
    return new_lecture
    
