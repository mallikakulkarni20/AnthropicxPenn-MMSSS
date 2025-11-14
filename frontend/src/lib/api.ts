// API utility for backend calls
// @ts-ignore - Vite provides import.meta.env
const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      return { error: error.error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Network error" };
  }
}

// Teacher API calls
export const teacherApi = {
  // GET /api/teacher/<teacher_id>/lectures
  getLectures: (teacherId: string) =>
    apiCall(`/teacher/${teacherId}/lectures`),

  // GET /api/teacher/<teacher_id>/lectures/<lecture_id>/comments
  getLectureComments: (teacherId: string, lectureId: string) =>
    apiCall(`/teacher/${teacherId}/lectures/${lectureId}/comments`),

  // POST /api/teacher/suggestions/<suggestion_id>/approve
  approveSuggestion: (suggestionId: string) =>
    apiCall(`/teacher/suggestions/${suggestionId}/approve`, {
      method: "POST",
    }),

  // POST /api/teacher/suggestions/<suggestion_id>/reject
  rejectSuggestion: (suggestionId: string) =>
    apiCall(`/teacher/suggestions/${suggestionId}/reject`, {
      method: "POST",
    }),
};

// Lecture API calls
export const lectureApi = {
  // GET /api/lectures/<lecture_id>
  getLecture: (lectureId: string) =>
    apiCall(`/lectures/${lectureId}`),

  // POST /api/lectures
  createLecture: (data: {
    title: string;
    sections: string[];
    teacherId: string;
    courseId: string;
  }) =>
    apiCall("/lectures", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// AI API calls
export const aiApi = {
  // POST /api/ai/generate-suggestions
  generateSuggestions: (lectureId: string) =>
    apiCall("/ai/generate-suggestions", {
      method: "POST",
      body: JSON.stringify({ lectureId }),
    }),
};

// User registration interface
interface RegisteredUser {
  email: string;
  password: string;
  id: string;
  name: string;
  role: "student" | "teacher";
}

// Auth utilities
export const auth = {
  getUser: (): { id: string; name: string; role: string } | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setUser: (user: { id: string; name: string; role: string }) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  clearUser: () => {
    localStorage.removeItem("user");
  },

  isAuthenticated: (): boolean => {
    return auth.getUser() !== null;
  },

  // Get all registered users
  getRegisteredUsers: (): RegisteredUser[] => {
    const usersStr = localStorage.getItem("registeredUsers");
    if (!usersStr) return [];
    try {
      return JSON.parse(usersStr);
    } catch {
      return [];
    }
  },

  // Register a new user
  registerUser: (email: string, password: string, name: string, role: "student" | "teacher"): { success: boolean; error?: string } => {
    const registeredUsers = auth.getRegisteredUsers();
    
    // Check if user already exists
    if (registeredUsers.some(u => u.email === email)) {
      return { success: false, error: "User with this email already exists" };
    }

    // Generate user ID
    const userId = role === "student" ? `student-${Date.now()}` : `teacher-${Date.now()}`;

    // Create new user
    const newUser: RegisteredUser = {
      email,
      password, // In production, this should be hashed!
      id: userId,
      name,
      role,
    };

    // Save to localStorage
    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    return { success: true };
  },

  // Login user
  login: (email: string, password: string): { success: boolean; user?: { id: string; name: string; role: string }; error?: string } => {
    const registeredUsers = auth.getRegisteredUsers();
    
    // Find user by email
    const user = registeredUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: "User not found. Please sign up first." };
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      return { success: false, error: "Incorrect password" };
    }

    // Return user info (without password)
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };
  },
};

