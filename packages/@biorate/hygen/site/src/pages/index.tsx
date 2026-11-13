import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import { donations, DONATION_DISCLAIMER } from '@site/src/data/donations';
import styles from './styles.module.css';

const npmPackageUrl = 'https://www.npmjs.com/package/@biorate/hygen';
const upstreamUrl = 'https://github.com/jondot/hygen';
const pluginRepoUrl = 'https://github.com/biorate/idea-hygen-plugin';

const forkFeatures = [
  {
    title: 'Glob batch actions',
    href: '/docs/glob-batch',
    body: 'Scaffold a whole directory tree from a single template with a `glob:` pattern, `base:`/`stripExtensions:` path shaping and per-match `skipIfExists`.',
  },
  {
    title: 'Content transforms',
    href: '/docs/content-transforms',
    body: 'Post-process the rendered output before it is written or injected with a named `transforms:` namespace in the config file — prettier is the canonical use.',
  },
  {
    title: 'Conditional skip',
    href: '/docs/conditional-skip',
    body: 'A template can decide at render time whether it runs: `skip:` (EJS-rendered) skips the action when truthy, reported as a skipped status, not a failure.',
  },
  {
    title: 'Interactive picker',
    href: '/docs/interactive-picker',
    body: 'Run `hygen` with no arguments and pick a generator then an action from a two-level terminal picker; forced off in non-TTY environments.',
  },
];

const differences = [
  'Identity escaping — `<%= %>` does not HTML-escape (the EJS `escape` option is the identity), because the tool generates code, not HTML.',
  '`--version` flag — `hygen --version` / `hygen -v` prints `Hygen v<version>` and exits.',
  'Anchor-not-found error — a missing `inject` anchor fails with `InjectionAnchorNotFoundError` instead of silently no-oping.',
  'New inject options — `create_if_missing: true`, `replace: true`, and `skip_if_not: true`.',
  'Composition — action and name positionals accept comma lists; `mirror: true` writes to the path mirroring its template location.',
  '`--name` flag removed (breaking) — use the positional name; two legacy escapes (`HYGEN_LEGACY_NAME`, `legacyNameFlag`) restore the old behavior.',
  'Glob batch actions, named content transforms, conditional action skipping and an interactive generator/action picker.',
  'Error classes — `BaseError`-derived classes (`src/errors.ts`) instead of raw `Error`.',
  'Strict TypeScript / Vitest — authored in strict TypeScript, tests migrated to Vitest.',
];

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>@biorate/hygen</h1>
        <p className={styles.heroSubtitle}>
          The scalable code generator that lives in your project — a fork of{' '}
          <a href={upstreamUrl}>jondot/hygen</a> (v6.2.11, MIT) adapted to the @biorate/*
          monorepo conventions.
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--primary button--lg" to="/docs/quick-start">
            Get Started
          </Link>
          <Link className="button button--secondary button--lg" href={npmPackageUrl}>
            npm
          </Link>
        </div>
      </div>
    </header>
  );
}

function UsageExamples() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Usage examples</h2>
      <p className={styles.sectionSubtitle}>
        The same command line you already know, extended with fork-native features: glob
        batch actions, content transforms, conditional
        <span className={styles.inlineCode}> skip:</span> and the interactive picker.
      </p>

      <div className={styles.panel}>
        <h3>Glob batch — one action, a whole directory</h3>
        <CodeBlock language="yaml">{`# _templates/module/new/spec.ejs.t
---
glob: module/**/*
to: src/<%= name %>/
base: module
stripExtensions: ['.t']
---
# The glob template itself writes nothing; every match becomes its own file.
`}</CodeBlock>
        <CodeBlock language="bash">{`hygen module new billing
#       added: src/billing/service.ts
#       added: src/billing/index.ts`}</CodeBlock>
      </div>

      <div className={styles.panel}>
        <h3>Content transforms — post-process before writing</h3>
        <CodeBlock language="javascript">{`// .hygen.js
const prettier = require('prettier');
module.exports = {
  transforms: {
    prettier: (content, locals) => prettier.format(content, { parser: 'typescript' }),
  },
};`}</CodeBlock>
        <CodeBlock language="yaml">{`---
to: src/gen/<%= name %>.ts
transform: trim | prettier
---
export const <%= name %> = <%- value %>;`}</CodeBlock>
      </div>

      <div className={styles.panel}>
        <h3>Conditional skip — decide at render time</h3>
        <CodeBlock language="yaml">{`---
to: tests/<%= name %>.spec.ts
skip: <%= wantTests ? 'false' : 'no tests requested' %>
---
describe('<%= name %>', () => { /* ... */ });`}</CodeBlock>
      </div>

      <div className={styles.panel}>
        <h3>Interactive picker — no arguments, pick it live</h3>
        <CodeBlock language="bash">{`hygen
# ? Select a generator  (Use arrow keys)
#   1) mailer
#   2) module
# ? Select an action
#   1) new
# runs exactly as if you had typed: hygen <generator> <action>`}</CodeBlock>
      </div>
    </section>
  );
}

function ForkFeatures() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Fork features</h2>
      <div className={styles.featureGrid}>
        {forkFeatures.map((feature) => (
          <div key={feature.title} className={styles.featureCard}>
            <h3>
              <Link to={feature.href}>{feature.title}</Link>
            </h3>
            <p>{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Differences() {
  return (
    <section className={styles.section}>
      <h2 id="differences-from-upstream" className={styles.sectionTitle}>
        Differences from upstream
      </h2>
      <p className={styles.sectionSubtitle}>
        <code>@biorate/hygen</code> is a fork of <a href={upstreamUrl}>jondot/hygen</a>{' '}
        (v6.2.11, MIT). Here is how it differs from upstream.
      </p>
      <div className={styles.panel}>
        <ul className={styles.differencesList}>
          {differences.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className={styles.linkRow}>
          <Link className="button button--outline button--secondary" to="/docs/faq">
            Read the FAQ
          </Link>
          <Link
            className="button button--outline button--secondary"
            to="/docs/quick-start"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}

function Ecosystem() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Ecosystem &amp; tools</h2>
      <p className={styles.sectionSubtitle}>
        Share generators as packages, turn existing code into a generator, ship a
        standalone binary — and edit <code>.t</code> templates in IntelliJ IDEA.
      </p>
      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <h3>Packages</h3>
          <p>
            Publish compiled generators as versioned npm packages and consume them with{' '}
            <code>hygen-add</code>.
          </p>
          <Link to="/docs/packages">Packages guide →</Link>
        </div>
        <div className={styles.featureCard}>
          <h3>IntelliJ IDEA plugin</h3>
          <p>
            The <a href={pluginRepoUrl}>biorate/idea-hygen-plugin</a> provides file type
            recognition for <code>.t</code> templates, syntax highlighting of frontmatter
            and EJS tags, host-language injection, completion of frontmatter keys /{' '}
            <code>h</code> helpers / context variables and more. Requires IDEA 2024.3+
            (Community vs Ultimate capabilities differ).
          </p>
          <Link to="/docs/ide-plugin">Plugin docs →</Link>
        </div>
        <div className={styles.featureCard}>
          <h3>Create &amp; standalone</h3>
          <p>
            Wrap existing code with <code>hygen-create</code>, or ship a self-contained
            binary with the standalone distribution.
          </p>
          <Link to="/docs/create">Create guide →</Link>
        </div>
      </div>
    </section>
  );
}

function Support() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Support</h2>
      <p className={styles.sectionSubtitle}>
        If @biorate/hygen is useful to you, consider supporting the fork's maintainers.
        Picking a platform below is the quickest way to help the project keep moving.
      </p>
      <div className={styles.linkRow}>
        {donations.map((donation) => (
          <a
            key={donation.name}
            className={styles.supportCard}
            href={donation.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {donation.name}
          </a>
        ))}
      </div>
      <p className={styles.note}>
        Donation platform URLs are configured in <code>src/data/donations.ts</code>.{' '}
        {DONATION_DISCLAIMER}
      </p>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="@biorate/hygen"
      description="The scalable code generator that lives in your project — a fork of jondot/hygen with glob batch actions, content transforms, conditional skip and an interactive picker."
    >
      <Hero />
      <main>
        <UsageExamples />
        <ForkFeatures />
        <Differences />
        <Ecosystem />
        <Support />
      </main>
    </Layout>
  );
}
