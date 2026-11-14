class Hooks {
  prompt() {}

  beforeAll() {}
}

export const params = [
  { name: 'label', type: 'string', required: true, message: 'Component name?' },
  { name: 'count', type: 'number' },
];

export default Hooks;
