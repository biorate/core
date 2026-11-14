module.exports = {
  params({ args }) {
    return { fromLegacy: args.name ?? 'none' };
  },
};
