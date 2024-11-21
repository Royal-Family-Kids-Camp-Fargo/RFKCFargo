import axios from "axios";

// look at all forms, get information for one form by id
const createFormSlice = (set, get) => ({
    allForms: [], // list of forms (id, name)
    currentForm: null, // All details for a given form
    // GET all my forms
    fetchForms: async () => {
        try {
            const { data } = await axios.get('/api/form');
            console.log('list of available forms', data);
            set({ allForms: data })
        } catch (error) {
            console.error('Error grabbing list of forms.', error);
        }
    },
    // GET a single form by id
    fetchFormById: async (formId) => {
        try { 
            const { data } = await axios.get(`/api/form/${formId}/all`);
            console.log(`Fetched form by id ${formId}`, data);
            set({ currentForm: data });
        } catch (error) {
            console.error('Error grabbing form by ID.', error);
        }
    }
    // Admin functionality go here? delete, edit, post
});

export default createFormSlice;