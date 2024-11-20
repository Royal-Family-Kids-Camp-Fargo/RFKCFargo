import axios from "axios";

const createSubmissionSlice = (set, get) => ({
    currentSubmission: null,
    fetchSubmissionById: async (submissionId) => {
        // GET submission by id
        try {
            const { data } = await axios.get(`/api/submission/${submissionId}`);
            console.log(`Submission fetched at id ${submissionId}: `, data);
            set({ currentSubmission: data });
        } catch (error) {
            console.log('Error fetching submission by id.', error);
        }
    },
    // note: call this first to get or create the current submission for a given form id
    createOrGetSubmissionByFormId: async (formId) => {
        try {
            const { data } = await axios.post('/api/submission', { form_id: formId });
            get().fetchSubmissionById(data.id);
        } catch (error) {
            console.log('Error posting/finding submission.', error);
        }
    },
    saveSubmissionProgress: async (submissionId, answers) => {
        try{
            // PUT with body like: { answers: [{answer, question_id, (optional) answer_id}]}
            await axios.put(`/api/submission/${submissionId}/update`, {answers})
            get().fetchSubmissionById(submissionId);
        } catch (error) {
            console.error(`Error updating submission`, error);
        }
    },
    finishSubmission: async (submissionId) => {
        try {
            // await saveSubmissionProgress(submissionId, answers);
            // important: dont forget to update before marking complete
            await axios.put(`/api/submission/${submissionId}/submit`);
            // fetchSubmissionById(submissionId);
            // to do: set current submission to empty when finished
        } catch (error) {
            console.log('Error completing submission.', error);
        }
    },
    deleteSubmission: async (submissionId) => {
        try {
            await axios.delete(`/api/${submissionId}`);
            console.log('Submissiion successfully deleted.');
        } catch (error) {
            console.log('Error deleting submission', error);
        }
    }

    // [x] POST create new submission 
    // [ ] PUT update submission by id and data payload
    // [x] PUT mark submission as completed
    // [x] DELETE submission by id
});

export default createSubmissionSlice;