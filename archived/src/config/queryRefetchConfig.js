export const queryRefetchConfig = {
  pipeline_status: [
    {
      path: ["/query"],
      methods: [
        "CREATE_PIPELINE_STATUS",
        "UPDATE_PIPELINE_STATUS",
        "DELETE_PIPELINE_STATUS",
      ],
    },
  ],
  pipeline: [
    {
      path: ["/query"],
      methods: ["CREATE_PIPELINE", "UPDATE_PIPELINE", "DELETE_PIPELINE"],
    },
  ],
};
