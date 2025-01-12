const sendNlapiRequest = async (
  authToken,
  userInput,
  context,
  threadId,
  options
) => {
  const response = await fetch("https://api.nlapi.io/nlapi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, // Pass the user's auth token
      "nlapi-key": import.meta.env.VITE_NLAPI_API_KEY,
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
