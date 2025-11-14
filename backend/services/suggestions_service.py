from typing import Optional, List, Dict, Any
import anthropic
import re, json, os
from dotenv import load_dotenv
from models.data_store import suggestions, lectures, sections, reactions
from utils.id_utils import new_uuid
from utils.time_utils import now_iso
from services.lectures_service import get_lecture, get_section
from services.reactions_service import get_reactions_for_section

load_dotenv()
MY_KEY = os.getenv('API_KEY')
client = anthropic.Anthropic(api_key=MY_KEY)

def get_suggestion_by_id(suggestion_id: str) -> Optional[Dict[str, Any]]:
    return next((s for s in suggestions if s["id"] == suggestion_id), None)


def build_prompt(lecture: Any, sections_with_reactions: List[Dict[str, Any]]):
    prompt_parts = [
        "You are helping a professor improve their lecture content based on student feedback.\n\n",
        f"LECTURE TITLE: {lecture['title']}\n\n",
        "FULL LECTURE CONTENT:\n"
    ]

    for sec in lecture["sections"]:
        prompt_parts.append(f"{sec['text']}\n")
    
    prompt_parts.append("\n" + "="*80 + "\n\n")
    prompt_parts.append("HERE ARE ALL THE SECTIONS FROM THE FULL LECTURE CONTENT THAT NEED TO BE REVISED:\n\n")

    # Add all section texts for context
    for i, item in enumerate(sections_with_reactions, 1):
        section = item['section']
        prompt_parts.append(f"\n--- Section {i} (ID: {section['id']}) ---\n")
        prompt_parts.append(f"{section['text']}\n")

    prompt_parts.append("\n" + "="*80 + "\n\n")
    prompt_parts.append("STUDENT FEEDBACK BY SECTION:\n\n")

    for i, item in enumerate(sections_with_reactions, 1):
        section = item['section']
        reactions = item['reactions']
        
        if len(reactions) == 0:
            continue
            
        prompt_parts.append(f"SECTION {i} (ID: {section['id']}) FEEDBACK:\n")
        
        typos = [r for r in reactions if r['type'] == 'typo']
        confusions = [r for r in reactions if r['type'] == 'confused']
        calc_errors = [r for r in reactions if r['type'] == 'calculation_error']
        
        if typos:
            prompt_parts.append(f"  Typo Reports ({len(typos)}):\n")
            for j, r in enumerate(typos, 1):
                if r.get('comment'):
                    prompt_parts.append(f"    {j}. {r['comment']}\n")
        
        if confusions:
            prompt_parts.append(f"  Confusion Reports ({len(confusions)}):\n")
            for j, r in enumerate(confusions, 1):
                if r.get('comment'):
                    prompt_parts.append(f"    {j}. {r['comment']}\n")
        
        if calc_errors:
            prompt_parts.append(f"  Calculation Error Reports ({len(calc_errors)}):\n")
            for j, r in enumerate(calc_errors, 1):
                if r.get('comment'):
                    prompt_parts.append(f"    {j}. {r['comment']}\n")
        
        prompt_parts.append("\n")
    
    prompt_parts.append("""
        TASK:
        For each section that has feedback, provide a revised version. Return your response as a JSON array with this structure:

        {
        "revisions": [
            {
            "sectionId": "sec-1",
            "revisedText": "The complete revised text for this section"
            },
            {
            "sectionId": "sec-2",
            "revisedText": "The complete revised text for this section"
            }
        ]
        }

        Guidelines:
        1. Only revise sections that have student feedback
        2. Fix typos and calculation errors mentioned
        3. Add clarification where students are confused
        4. Maintain consistency across all sections
        5. Keep the same general structure and flow
        6. Preserve technical accuracy

        Return ONLY valid JSON, no other text.
    """)
    
    return "".join(prompt_parts)

def generate_suggestions_for_lecture(lecture: Any,
                                     sections: List[Any]
                                     ) -> List[Dict[str, Any]]:
    """Simple heuristic: if a section has >= min_reactions, create a suggestion."""
    if not lecture:
        return []

    created_suggestions = []
    sections_with_reactions = []

    for sec in sections:
        sec_reactions = get_reactions_for_section(sec["id"])
        if len(sec_reactions) == 0:
            continue
        sections_with_reactions.append({
            'section': sec,
            'reactions': sec_reactions
        })
    
    prompt = build_prompt(lecture, sections_with_reactions)
    
    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8096,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        response = message.content[0].text
        cleaned = re.sub(r'```json\n?', '', response)
        cleaned = re.sub(r'```\n?', '', cleaned).strip()
        result = json.loads(cleaned)
        revisions = result.get('revisions', [])

        for rev in revisions:
            section_id = rev['sectionId']
            section = get_section(lecture, section_id)
            revised_text = rev['revisedText']
            suggestion = {
                "id": new_uuid(),
                "lectureId": lecture["id"],
                "sectionId": section_id,
                "originalText": section["text"],
                "suggestedText": revised_text,
                "status": "pending",
                "createdAt": now_iso()
            }
            # Add to global suggestions list
            suggestions.append(suggestion)
            # Add to local return list
            created_suggestions.append(suggestion)
        return created_suggestions
    except(json.JSONDecodeError, KeyError) as e:
        print(f"Error generating suggestion: {e}")
        return []

def count_comments_by_lecture_and_section() -> Dict[str, Dict[str, int]]:
   """
   Creates a map of lectureId to a map of sectionId to the number of comments
   for that section within that lecture.
  
   Returns:
       Dict[str, Dict[str, int]]: A nested dictionary mapping lectureId -> sectionId -> count
   """
   result: Dict[str, Dict[str, int]] = {}
  
   for reaction in reactions:
       lecture_id = reaction.get("lectureId")
       section_id = reaction.get("sectionId")
      
       # Skip reactions without both lectureId and sectionId
       if not lecture_id or not section_id:
           continue
      
       # Initialize the lecture map if it doesn't exist
       if lecture_id not in result:
           result[lecture_id] = {}
      
       # Initialize the section count if it doesn't exist, then increment
       if section_id not in result[lecture_id]:
           result[lecture_id][section_id] = 0
      
       result[lecture_id][section_id] += 1
  
   return result
