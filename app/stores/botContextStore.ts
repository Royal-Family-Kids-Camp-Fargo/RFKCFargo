let context: string[] = [];

export const botContextStore = {
  getContext: () => context,
  addContext: (ctx: string) => {
    context.push(ctx);
  },
  removeContext: (ctx: string) => {
    context = context.filter(c => c !== ctx);
  },
  clearContext: () => {
    context = [];
  },
};
