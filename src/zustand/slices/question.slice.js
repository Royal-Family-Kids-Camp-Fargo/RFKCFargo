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
  },

  createQuestion: async (questionData) => {
    // Validate required fields
    if (!questionData.section_id || !questionData.question || !questionData.answer_type || !questionData.order) {
      throw new Error('Missing required fields: section_id, question, answer_type, and order are required');
    }

    try {
      await axios.post('/api/question', {
        question: questionData.question,
        description: questionData.description || '',
        answer_type: questionData.answer_type,
        order: questionData.order,
        section_id: questionData.section_id,
        required: questionData.required || false,
        multiple_choice_options: questionData.multiple_choice_options || []
      });
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }
});

export default createQuestionSlice; 