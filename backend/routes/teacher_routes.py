from flask import Blueprint, jsonify

from models.data_store import lectures, approved_section_updates
from services.lectures_service import get_lecture, create_new_lecture_version_with_multiple_sections
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


# approveSuggestion —> add to approved list (don't create lecture yet)
@teacher_bp.post("/teacher/suggestions/<suggestion_id>/approve")
def approve_suggestion(suggestion_id):
    suggestion = get_suggestion_by_id(suggestion_id)
    if not suggestion:
        return jsonify({"error": "Suggestion not found"}), 404

    lecture = get_lecture(suggestion["lectureId"])
    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404

    # Add to approved section updates list
    approved_update = {
        "lectureId": suggestion["lectureId"],
        "sectionId": suggestion["sectionId"],
        "suggestedText": suggestion["suggestedText"],
        "suggestionId": suggestion_id,
    }
    approved_section_updates.append(approved_update)

    # update suggestion record
    suggestion["status"] = "accepted"

    return jsonify({"suggestion": suggestion, "message": "Suggestion approved and queued for publishing"})


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


# publishLecture —> create new lecture version with all approved section updates
@teacher_bp.post("/teacher/<teacher_id>/lectures/<lecture_id>/publish")
def publish_lecture(teacher_id, lecture_id):
    lecture = get_lecture(lecture_id)
    if not lecture or lecture["teacherId"] != teacher_id:
        return jsonify({"error": "Lecture not found for this teacher"}), 404

    # Get all approved section updates for this lecture
    lecture_updates = [
        update for update in approved_section_updates
        if update["lectureId"] == lecture_id
    ]

    if not lecture_updates:
        return jsonify({"error": "No approved section updates found for this lecture"}), 400

    # Prepare section updates in the format expected by the function
    section_updates = [
        {"sectionId": update["sectionId"], "suggestedText": update["suggestedText"]}
        for update in lecture_updates
    ]

    # Create new lecture version with all approved sections updated
    new_lecture = create_new_lecture_version_with_multiple_sections(
        lecture,
        section_updates
    )

    # Update all suggestions with the new lecture ID and mark reactions as addressed
    updated_suggestions = []
    for update in lecture_updates:
        suggestion = get_suggestion_by_id(update["suggestionId"])
        if suggestion:
            suggestion["lectureId"] = new_lecture["id"]
            updated_suggestions.append(suggestion)
        
        # Mark reactions as addressed for this section
        mark_reactions_addressed_for_section(lecture_id, update["sectionId"])

    # Remove the processed updates from the approved list
    approved_section_updates[:] = [
        update for update in approved_section_updates
        if update["lectureId"] != lecture_id
    ]

    return jsonify({
        "newLecture": new_lecture,
        "updatedSuggestions": updated_suggestions,
        "message": f"Published new lecture version with {len(section_updates)} section updates"
    })
