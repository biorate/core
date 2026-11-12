// `wantTests` is supplied by the CLI in the real run (`--wantTests` makes it a
// truthy boolean). Its absence means "no tests requested", sending the template's
// `skip:` conditional down its `else` branch — exactly the spec's prompt answer.
module.exports = {
  params: ({ args }) => ({
    wantTests: args.wantTests === true || args.wantTests === 'true',
  }),
};
