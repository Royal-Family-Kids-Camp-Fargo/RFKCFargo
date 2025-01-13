const createBotSlice = (set: any) => ({
  context: [],
  addBotContext: (newContext: any) => {
    console.log("Adding context:", newContext);
    set((state: any) => ({ context: [...state.context, newContext] }));
  },
  removeBotContext: (contextToRemove: any) => {
    console.log("Removing context:", contextToRemove);
    set((state: any) => ({
      context: state.context.filter(
        (context: any) => context !== contextToRemove
      ),
    }));
  },
});

export default createBotSlice;
