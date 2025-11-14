from typing import Optional, List, Dict, Any
import anthropic
import re, json, os
from dotenv import load_dotenv
from models.data_store import suggestions, lectures, sections
from utils.id_utils import new_uuid
from utils.time_utils import now_iso
from services.lectures_service import get_lecture
from services.reactions_service import get_reactions_for_section

load_dotenv()
MY_KEY = os.getenv('API_KEY')
client = anthropic.Anthropic(api_key=MY_KEY)

def get_suggestion_by_id(suggestion_id: str) -> Optional[Dict[str, Any]]:
    return next((s for s in suggestions if s["id"] == suggestion_id), None)


def build_prompt(lecture: Any, section: Any, reactions: List[Any]):
    typos = [r for r in reactions if r['type'] == 'typo']
    confusions = [r for r in reactions if r['type'] == 'confused']
    calc_errors = [r for r in reactions if r['type'] == 'calculation_error']

    prompt_parts = [
        "You are helping a professor improve their lecture content based on student feedback.\n\n",
        f"LECTURE TITLE: {lecture['title']}\n\n",
        f"SECTION TO REVISE (Section):\n{section['text']}\n\n"
    ]

    prompt_parts.append("STUDENT FEEDBACK ON THIS SECTION:\n\n")
    if typos:
        prompt_parts.append(f"Typo Reports ({len(typos)}):\n")
        for i, r in enumerate(typos, 1):
            if (r['comment']):
                prompt_parts.append(f"{i}. {r['comment']}\n")
        prompt_parts.append("\n")
    
    if confusions:
        prompt_parts.append(f"Confusion Reports ({len(confusions)}):\n")
        for i, r in enumerate(confusions, 1):
            if (r['comment']):
                prompt_parts.append(f"{i}. {r['comment']}\n")
        prompt_parts.append("\n")
    
    if calc_errors:
        prompt_parts.append(f"Calculation Error Reports ({len(calc_errors)}):\n")
        for i, r in enumerate(calc_errors, 1):
            if (r['comment']):
                prompt_parts.append(f"{i}. {r['comment']}\n")
        prompt_parts.append("\n")
    
    prompt_parts.append("""TASK:
        Revise ONLY target section based on student feedback and respond back with the text that should replace that section. Respond in JSON format:

        {
            "revisedText": "The complete revised section text here"
        }

        Return ONLY valid JSON, no other text.""")
    
    return "".join(prompt_parts)

def generate_suggestions_for_section(lecture: Any,
                                     target_section: Any
                                     ) -> List[Dict[str, Any]]:
    """Simple heuristic: if a section has >= min_reactions, create a suggestion."""
    if not lecture:
        return []

    
    sec_reactions = get_reactions_for_section(target_section["id"])
    if len(sec_reactions) == 0:
        return None
    prompt = build_prompt(lecture, target_section, sec_reactions)
    
    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        suggestion = message.content[0].text
        cleaned = re.sub(r'```json\n?', '', suggestion)
        cleaned = re.sub(r'```\n?', '', cleaned).strip()
        result = json.loads(cleaned)

        suggestion = {
            "id": new_uuid(),
            "lectureId": lecture["id"],
            "sectionId": target_section["id"],
            "originalText": target_section["text"],
            "suggestedText": result["revisedText"],
            "status": "pending",
            "createdAt": now_iso()
        }
        return suggestion
    except(json.JSONDecodeError, KeyError) as e:
        print(f"Error generating suggestion: {e}")
        return None
