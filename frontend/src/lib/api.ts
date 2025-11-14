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
}

// API functions
export const api = {
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
};

