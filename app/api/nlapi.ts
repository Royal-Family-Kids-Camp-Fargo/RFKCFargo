const nlapiBaseUrl = import.meta.env.VITE_NLAPI_BASE_URL;
const nlapiApiKey = import.meta.env.VITE_NLAPI_API_KEY;

const sendNlapiRequest = async (
  authToken: string,
  userInput: string,
  context: any[],
  threadId: string | null,
  options: any
) => {
  const response = await fetch(`${nlapiBaseUrl}/nlapi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`, // Pass the user's auth token
      'nlapi-key': nlapiApiKey,
    },
    // Transforming the data to snake case for the NLAPI
    body: JSON.stringify({
      user_input: userInput,
      context: context || [], // Optional context
      thread_id: threadId || null, // Optional thread ID
      options: {
        stream: options?.stream || false,
      },
    }),
  });

  return response;
};

export default sendNlapiRequest;
