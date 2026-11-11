import injector from '../src/ops/injector';
import { InjectionAnchorNotFoundError, TemplateConfigError } from '../src/errors';

const gemfile = `
    source 'http://rubygems.org'
    gem 'rails'
    gem 'nokogiri'
    gem 'httparty'

    `;
describe('injector', () => {
  it('before rails', () => {
    expect(
      injector(
        {
          attributes: {
            before: "gem 'rails'",
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('after rails', () => {
    expect(
      injector(
        {
          attributes: {
            after: "gem 'rails'",
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('prepend top of file', () => {
    expect(
      injector(
        {
          attributes: {
            prepend: true,
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('append bottom of file', () => {
    expect(
      injector(
        {
          attributes: {
            append: true,
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('at_index 2 (below "source")', () => {
    expect(
      injector(
        {
          attributes: {
            at_line: 2,
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('skip_if "source" exists', () => {
    expect(
      injector(
        {
          attributes: {
            skip_if: 'source',
            after: "gem 'rails'",
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('if eof_last is false remove empty line from the end of injection body', () => {
    expect(
      injector(
        {
          attributes: {
            after: "gem 'rails'",
            eof_last: false,
          },
          body: "    gem 'kamikaze' # added by hygen\n",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('if eof_last is true insert empty line to injection body', () => {
    expect(
      injector(
        {
          attributes: {
            after: "gem 'rails'",
            eof_last: true,
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('correctly interpret multi-line after regex', () => {
    expect(
      injector(
        {
          attributes: {
            after: "rails[a-z\\:\\/\\.'\\s]*giri",
            eof_last: false,
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('correctly interpret multi-line before regex', () => {
    expect(
      injector(
        {
          attributes: {
            before: "rails[a-z\\:\\/\\.'\\s]*giri",
            eof_last: false,
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });
  it('correctly interpret multi-line skip_if regex', () => {
    expect(
      injector(
        {
          attributes: {
            skip_if: "rails[a-z\\:\\/\\.'\\s]*giri",
            after: "gem 'rails'",
          },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      ),
    ).toMatchSnapshot();
  });

  // Captures upstream bug #404: an unfound `before` anchor was a silent no-op — the
  // content was returned unchanged and nothing was thrown. The fix throws an
  // InjectionAnchorNotFoundError instead, and this expectation flipped.
  it('anchor not found throws InjectionAnchorNotFoundError (bug #404 fixed)', () => {
    const content = 'line1\nline2\nline3\n';
    expect(() =>
      injector(
        {
          attributes: { before: 'NO_SUCH_ANCHOR' },
          body: '    gem kamikaze',
        },
        content,
        'sink/config.js',
      ),
    ).toThrow(InjectionAnchorNotFoundError);
  });

  describe('replace (5.2)', () => {
    it('replaces the first anchor match and preserves the rest of the file', () => {
      const content = `{\n  "name": "sink",\n  "version": "1.0.0",\n  "main": "index.js"\n}\n`;
      const result = injector(
        {
          attributes: { replace: true, after: '"version": ".*"' },
          // `$` in the body must be treated literally (not as a replacer token).
          body: '"version": "2.0.0",',
        },
        content,
        'sink/package.json',
      );
      expect(result).toContain('"version": "2.0.0",');
      expect(result).not.toContain('"version": "1.0.0"');
      expect(result).toContain('"name": "sink"');
      expect(result).toContain('"main": "index.js"');
    });

    it('throws TemplateConfigError when inject and replace are both true', () => {
      expect(() =>
        injector(
          {
            attributes: { inject: true, replace: true, after: '"version": ".*"' },
            body: 'boom',
          },
          '{"version": "1.0.0"}',
          'sink/package.json',
        ),
      ).toThrow(TemplateConfigError);
    });

    it('throws TemplateConfigError for unsupported anchors (prepend/append/at_line)', () => {
      expect(() =>
        injector(
          {
            attributes: { replace: true, prepend: true },
            body: 'boom',
          },
          'line1',
          'sink/config.js',
        ),
      ).toThrow(TemplateConfigError);
    });

    it('throws InjectionAnchorNotFoundError when no fragment matches', () => {
      expect(() =>
        injector(
          {
            attributes: { replace: true, after: 'NO_MATCH' },
            body: 'boom',
          },
          'line1\nline2\n',
          'sink/config.js',
        ),
      ).toThrow(InjectionAnchorNotFoundError);
    });
  });

  describe('skip_if_not (5.3)', () => {
    it('inverts skip_if: with the text present and skip_if_not, injection runs', () => {
      const result = injector(
        {
          attributes: { skip_if: 'rails', skip_if_not: true, after: "gem 'rails'" },
          body: "    gem 'kamikaze' # added by hygen",
        },
        gemfile,
      );
      expect(result).toContain("gem 'kamikaze' # added by hygen");
    });

    it('inverts skip_if: with the text present and no skip_if_not, injection is skipped', () => {
      expect(
        injector(
          {
            attributes: { skip_if: 'rails', after: "gem 'rails'" },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toBe(gemfile);
    });

    it('inverts skip_if: with the text absent and skip_if_not, injection is skipped', () => {
      const content = 'line1\nline2\n';
      expect(
        injector(
          {
            attributes: { skip_if: 'NO_MATCH', skip_if_not: true, append: true },
            body: 'append-me',
          },
          content,
        ),
      ).toBe(content);
    });
  });
});
