import add from '../src/ops/add';
import Logger from '../src/logger';

// const gemfile = `
//     source 'http://rubygems.org'
//     gem 'rails'
//     gem 'nokogiri'
//     gem 'httparty'
//     `

// TODO and inject is false
describe('add', () => {
  it('should return "skipped" if skip_if has value ', async () => {
    expect(
      await add(
        {
          attributes: {
            skip_if: 'true',
          },
          body: 'this should be skipped',
        },
        {},
        {
          logger: new Logger(console.log),
          debug: false,
          helpers: {},
          createPrompter: () => require('enquirer'),
          exec: () => undefined,
          cwd: process.cwd(),
        },
      ),
    ).toMatchSnapshot({ timing: expect.any(Number) });
  });
});
