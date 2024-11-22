import axios from 'axios';

const createQuestionSlice = (set, get) => ({
  updateQuestion: async (questionId, questionData) => {
    try {
      await axios.put(`/api/question/${questionId}`, questionData);
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  archiveQuestion: async (questionId) => {
    try {
      await axios.put(`/api/question/${questionId}/archive`);
    } catch (error) {
      console.error('Error archiving question:', error);
      throw error;
    }
  }
});

export default createQuestionSlice; 