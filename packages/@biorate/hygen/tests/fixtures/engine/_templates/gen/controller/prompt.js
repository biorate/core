module.exports = {
  async prompt({ prompter }) {
    return prompter.prompt([{ type: 'input', name: 'name', message: 'Name?' }]);
  },
};
