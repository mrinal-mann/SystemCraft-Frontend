import api from "@/lib/api";

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: "DRAFT" | "IN_PROGRESS" | "ANALYZED";
  created_at: string;
  design_details?: {
    content: string;
  };
  suggestions?: Suggestion[];
}

export const projectService = {
  getAll: async () => {
    const response = await api.get("/projects");
    return response.data;
  },

  create: async (data: {
    title: string;
    description: string;
    design_content: string;
  }) => {
    const response = await api.post("/projects", data);
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/projects/${id}/full`);
    return response.data;
  },

  updateDesign: async (id: string | number, content: string) => {
    const response = await api.put(`/projects/${id}/design`, { content });
    return response.data;
  },
};
