import axios from "axios";

const createSectionSlice = (set, get) => ({
  sections: [], // list of sections for a form
  currentSection: null, // details for a single section
  sectionError: null,

  // GET all sections for a form
  fetchSections: async (formId) => {
    try {
      const { data } = await axios.get(`/api/section/${formId}`);
      console.log("Sections for form", formId, ":", data);
      set({ sections: data, sectionError: null });
    } catch (error) {
      console.error("Error fetching sections:", error);
      set({ sectionError: "Failed to fetch sections" });
    }
  },

  // POST new section
  createSection: async (sectionData) => {
    try {
      const { data } = await axios.post("/api/section", sectionData);
      console.log("Created new section:", data);
      set((state) => ({
        sections: [...state.sections, data],
        sectionError: null,
      }));
      return data;
    } catch (error) {
      console.error("Error creating section:", error);
      set({ sectionError: "Failed to create section" });
      throw error;
    }
  },

  // PUT update section
  updateSection: async (sectionId, updateData) => {
    try {
      const { data } = await axios.put(`/api/section/${sectionId}`, updateData);
      console.log("Updated section:", data);
      set((state) => ({
        sections: state.sections.map((section) =>
          section.id === sectionId ? data : section
        ),
        sectionError: null,
      }));
      return data;
    } catch (error) {
      console.error("Error updating section:", error);
      set({ sectionError: "Failed to update section" });
      throw error;
    }
  },

  // DELETE section
  deleteSection: async (sectionId) => {
    try {
      await axios.delete(`/api/section/${sectionId}`);
      console.log("Deleted section:", sectionId);
      set((state) => ({
        sections: state.sections.filter((section) => section.id !== sectionId),
        sectionError: null,
      }));
    } catch (error) {
      console.error("Error deleting section:", error);
      set({ sectionError: "Failed to delete section" });
      throw error;
    }
  },

  // Clear section error
  clearSectionError: () => {
    set({ sectionError: null });
  },
});

export default createSectionSlice;
