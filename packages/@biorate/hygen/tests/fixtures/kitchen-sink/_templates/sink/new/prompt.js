// Kitchen-sink prompt hook.
// The runner tests pass `--author` on the CLI so enquirer never prompts
// (the test runner has no TTY). The `default` keeps the hook usable interactively.
module.exports = {
  async prompt({ prompter, args }) {
    if (args.author) {
      return {};
    }
    return prompter.prompt([
      {
        type: 'input',
        name: 'author',
        message: 'Author?',
        default: 'llevkin',
      },
    ]);
  },
};
