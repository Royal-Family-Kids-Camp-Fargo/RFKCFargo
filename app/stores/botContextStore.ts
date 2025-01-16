let context: string[] = [];

export const botContextStore = {
  getContext: () => context,
  addContext: (ctx: string) => {
    context.push(ctx);
    console.log("Context added:", ctx);
  },
  removeContext: (ctx: string) => {
    context = context.filter((c) => c !== ctx);
    console.log("Context removed:", ctx);
  },
  clearContext: () => {
    context = [];
  },
};
