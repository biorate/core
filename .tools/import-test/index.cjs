// Auto-generated: require() every @biorate package (CJS entry via package.json exports/main)
const pkgs = [
  "@biorate/amf",
  "@biorate/amqp",
  "@biorate/async-loop",
  "@biorate/auto-object",
  "@biorate/axios",
  "@biorate/axios-prometheus",
  "@biorate/batcher",
  "@biorate/bit-array",
  "@biorate/cleanup",
  "@biorate/clickhouse",
  "@biorate/collection",
  "@biorate/command",
  "@biorate/config",
  "@biorate/config-loader",
  "@biorate/config-loader-env",
  "@biorate/config-loader-fs",
  "@biorate/config-loader-vault",
  "@biorate/connector",
  "@biorate/errors",
  "@biorate/file-config",
  "@biorate/haproxy",
  "@biorate/i18n",
  "@biorate/inversion",
  "@biorate/ioredis",
  "@biorate/kafkajs",
  "@biorate/lifecycled",
  "@biorate/masquerade",
  "@biorate/migrations",
  "@biorate/minio",
  "@biorate/mocha",
  "@biorate/mocha-spec",
  "@biorate/mongodb",
  "@biorate/mssql",
  "@biorate/nestjs-tools",
  "@biorate/opensearch",
  "@biorate/opentelemetry",
  "@biorate/pg",
  "@biorate/playwright",
  "@biorate/prometheus",
  "@biorate/proxy",
  "@biorate/proxy-prometheus",
  "@biorate/rdkafka",
  "@biorate/react-virtual-table",
  "@biorate/redis",
  "@biorate/run-context",
  "@biorate/schema-registry",
  "@biorate/sequelize",
  "@biorate/shutdown-hook",
  "@biorate/singleton",
  "@biorate/symbolic",
  "@biorate/tools",
  "@biorate/unimock",
  "@biorate/vault",
  "@biorate/vitest",
  "@biorate/vitest-spec"
];

/** Packages that only load under Mocha / browser; set STRICT=1 to try anyway. */
const SKIP_CJS_DEFAULT = new Set([
  '@biorate/mocha-spec',
  '@biorate/react-virtual-table',
]);

let failed = 0;
for (const name of pkgs) {
  if (!process.env.STRICT && SKIP_CJS_DEFAULT.has(name)) {
    console.log('[cjs SKIP]', name, '(needs Mocha or DOM; STRICT=1 to require)');
    continue;
  }
  try {
    require(name);
    console.log('[cjs OK]', name);
  } catch (err) {
    failed++;
    console.error('[cjs FAIL]', name);
    console.error(err && err.stack ? err.stack : err);
  }
}
if (failed) {
  console.error('\nCJS: ' + failed + ' package(s) failed.');
  process.exit(1);
}
const loaded = pkgs.length - (process.env.STRICT ? 0 : SKIP_CJS_DEFAULT.size);
console.log('\nCJS: finished (' + loaded + ' required, skips unless STRICT=1).');
