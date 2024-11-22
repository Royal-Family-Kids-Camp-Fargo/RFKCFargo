import axios from 'axios';

const createActionSlice = (set, get) => ({
    userActions: [],
    currentDonation: null,

    // Fetch all actions (submissions and donations) for a user
    fetchUserActions: async (userId) => {
        try {
            const { data } = await axios.get(`/api/actions/${userId}`);
            console.log('User actions:', data);
            set({ userActions: data });
        } catch (error) {
            console.error('Error fetching user actions:', error);
            set({ userActions: [] });
        }
    },

    // Donation-related actions
    createDonation: async (donationData) => {
        try {
            await axios.post('/api/actions/donation', donationData);
            // Refresh the actions list after adding
            await get().fetchUserActions(donationData.user_id);
        } catch (error) {
            console.error('Error creating donation:', error);
            throw error;
        }
    },

    updateDonation: async (donationData) => {
        try {
            await axios.put('/api/actions/donation', donationData);
            // Refresh the actions list after updating
            const userId = get().userActions.find(action => 
                action.type === 'donation' && action.id === donationData.id
            )?.user_id;
            if (userId) {
                await get().fetchUserActions(userId);
            }
        } catch (error) {
            console.error('Error updating donation:', error);
            throw error;
        }
    },

    deleteDonation: async (donationId, userId) => {
        try {
            await axios.delete(`/api/actions/donation/${donationId}`);
            // Refresh the actions list after deleting
            await get().fetchUserActions(userId);
        } catch (error) {
            console.error('Error deleting donation:', error);
            throw error;
        }
    },

    fetchDonationById: async (donationId) => {
        try {
            const { data } = await axios.get(`/api/actions/donation/${donationId}`);
            set({ currentDonation: data });
        } catch (error) {
            console.error('Error fetching donation:', error);
            set({ currentDonation: null });
        }
    },
});

export default createActionSlice; 