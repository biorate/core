module.exports = {
  transforms: {
    // prepend a marker line — proves a single transform rewrites the body before write
    prettier: (content) => `// prettier-run\n${content}`,
    // drop a leading license comment — chained after prettier, sees its output
    stripLicense: (content) => content.replace(/^\/\/ license.*\n/, ''),
    // a real async transform that also observes the run locals (`name`)
    upperAsync: async (content, locals) => {
      await new Promise((r) => setTimeout(r, 5));
      return `${content.trim()}::${String(locals.name)}`;
    },
    // a transform that always throws, for the keep-going failure path
    boom: () => {
      throw new Error('transform boom');
    },
  },
};
