const createBotSlice = (set) => ({
  context: [],
  addBotContext: (newContext) => {
    console.log("Adding context:", newContext);
    set((state) => ({ context: [...state.context, newContext] }));
  },
  removeBotContext: (contextToRemove) => {
    console.log("Removing context:", contextToRemove);
    set((state) => ({
      context: state.context.filter((context) => context !== contextToRemove),
    }));
  },
});

export default createBotSlice;
