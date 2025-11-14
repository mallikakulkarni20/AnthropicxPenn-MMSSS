// API client for backend communication
const API_BASE_URL = "http://localhost:5000/api";

// Types matching backend data model
export interface Section {
  id: string;
  order: number;
  text: string;
}

export interface Lecture {
  id: string;
  baseLectureId: string;
  version: number;
  isCurrent: boolean;
  title: string;
  teacherId: string;
  courseId: string;
  sections: Section[];
}

export interface Reaction {
  id: string;
  lectureId: string;
  sectionId: string;
  userId: string;
  addressed: boolean;
  type: "typo" | "confused" | "calculation_error";
  comment: string;
  createdAt: string;
}

export interface LectureListItem {
  id: string;
  title: string;
  baseLectureId: string;
  version: number;
  courseId: string;
  isCurrent?: boolean;
}

export interface Suggestion {
  id: string;
  lectureId: string;
  sectionId: string;
  originalText?: string;
  suggestedText: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface LectureCommentsResponse {
  reactions: Reaction[];
  suggestions: Suggestion[];
}

// API functions
export const api = {
  // ========== Student APIs ==========
  
  // Get all recent lectures for a student
  async getRecentLectures(userId: string): Promise<LectureListItem[]> {
    const response = await fetch(`${API_BASE_URL}/student/${userId}/lectures/recent`);
    if (!response.ok) throw new Error("Failed to fetch lectures");
    return response.json();
  },

  // Get full lecture content by ID
  async getLecture(lectureId: string): Promise<Lecture> {
    const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}`);
    if (!response.ok) throw new Error("Failed to fetch lecture");
    return response.json();
  },

  // Get all comments by a user for a specific lecture
  async getUserComments(userId: string, lectureId: string): Promise<Reaction[]> {
    const response = await fetch(
      `${API_BASE_URL}/student/${userId}/lectures/${lectureId}/comments`
    );
    if (!response.ok) throw new Error("Failed to fetch comments");
    return response.json();
  },

  // Submit a reaction/feedback
  async submitReaction(data: {
    userId: string;
    lectureId: string;
    sectionId: string;
    type: "typo" | "confused" | "calculation_error";
    comment: string;
  }): Promise<Reaction> {
    const response = await fetch(`${API_BASE_URL}/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to submit reaction");
    return response.json();
  },

  // ========== Teacher APIs ==========
  
  // Get all lectures (all versions) for a teacher
  async getTeacherLectures(teacherId: string): Promise<LectureListItem[]> {
    const response = await fetch(`${API_BASE_URL}/teacher/${teacherId}/lectures`);
    if (!response.ok) throw new Error("Failed to fetch teacher lectures");
    return response.json();
  },

  // Get all reactions and suggestions for a lecture (teacher view)
  async getLectureCommentsForTeacher(
    teacherId: string,
    lectureId: string
  ): Promise<LectureCommentsResponse> {
    const response = await fetch(
      `${API_BASE_URL}/teacher/${teacherId}/lectures/${lectureId}/comments`
    );
    if (!response.ok) throw new Error("Failed to fetch lecture comments");
    return response.json();
  },

  // Approve a suggestion
  async approveSuggestion(suggestionId: string): Promise<{
    suggestion: Suggestion;
    newLecture: Lecture;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/teacher/suggestions/${suggestionId}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to approve suggestion");
    return response.json();
  },

  // Reject a suggestion
  async rejectSuggestion(suggestionId: string): Promise<{ suggestion: Suggestion }> {
    const response = await fetch(
      `${API_BASE_URL}/teacher/suggestions/${suggestionId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to reject suggestion");
    return response.json();
  },

  // Generate AI suggestions for a lecture
  async generateSuggestions(lectureId: string): Promise<{ createdSuggestions: Suggestion[] }> {
    const response = await fetch(`${API_BASE_URL}/ai/generate-suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lectureId }),
    });
    if (!response.ok) throw new Error("Failed to generate suggestions");
    return response.json();
  },
};

