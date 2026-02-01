import api from "@/lib/api";

export type SuggestionStatus = "OPEN" | "ADDRESSED" | "IGNORED";

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  status: SuggestionStatus;
  design_version: number;
  addressed_at?: string;
  addressed_in_version?: number;
}

export interface DesignVersion {
  id: number;
  version_number: number;
  content: string;
  created_at: string;
  maturity_score: number;
  suggestions_count: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: "DRAFT" | "IN_PROGRESS" | "ANALYZED";
  created_at: string;
  maturity_score: number;
  maturity_reason?: string;
  design_details?: {
    content: string;
    version: number;
  };
  suggestions?: Suggestion[];
}

export interface AnalysisResult {
  project_id: number;
  design_version: number;
  suggestions_count: number;
  suggestions: Suggestion[];
  message: string;
  maturity_score: number;
  maturity_reason?: string;
  newly_addressed_count: number;
}

export interface ProjectEvolution {
  project_id: number;
  current_version: number;
  current_maturity_score: number;
  versions: DesignVersion[];
  progress_summary: string;
}

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get("/projects");
    return response.data;
  },

  create: async (data: {
    title: string;
    description: string;
    design_content: string;
  }): Promise<Project> => {
    const response = await api.post("/projects", data);
    return response.data;
  },

  getById: async (id: string | number): Promise<Project> => {
    const response = await api.get(`/projects/${id}/full`);
    return response.data;
  },

  updateDesign: async (id: string | number, content: string): Promise<Project> => {
    const response = await api.put(`/projects/${id}/design`, { content });
    return response.data;
  },

  // New: Get project evolution history
  getEvolution: async (id: string | number): Promise<ProjectEvolution> => {
    const response = await api.get(`/analysis/${id}/evolution`);
    return response.data;
  },

  // New: Trigger analysis and get enhanced results
  analyze: async (id: string | number): Promise<AnalysisResult> => {
    const response = await api.post(`/analysis/${id}`);
    return response.data;
  },

  // New: Update suggestion status manually
  updateSuggestionStatus: async (
    suggestionId: number, 
    status: SuggestionStatus
  ): Promise<Suggestion> => {
    const response = await api.patch(`/analysis/suggestions/${suggestionId}/status`, { status });
    return response.data;
  },

  // New: Get suggestions with optional status filter
  getSuggestions: async (
    projectId: string | number, 
    statusFilter?: SuggestionStatus
  ): Promise<Suggestion[]> => {
    const params = statusFilter ? { status_filter: statusFilter } : {};
    const response = await api.get(`/analysis/${projectId}/suggestions`, { params });
    return response.data;
  },
};

