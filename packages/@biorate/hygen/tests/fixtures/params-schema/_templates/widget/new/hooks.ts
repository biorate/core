class Hooks {
  static params = [
    { name: 'label', type: 'string', required: true, message: 'Component name?' },
    { name: 'count', type: 'number' },
  ];

  prompt() {}

  beforeAll() {}
}

export default Hooks;
