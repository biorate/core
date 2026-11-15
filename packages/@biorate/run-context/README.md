# Run context

Contexted scenarios execution by Middleware-based template

#### Example:

```ts
import { Scenario, Context, step } from '@biorate/run-context';

export class Scenario1 extends Scenario {
  @step()
  protected async step1() {
    this.ctx.set('step1', true);
  }

  @step()
  protected async step2() {
    this.ctx.set('step2', 1);
  }
}

export class Scenario2 extends Scenario {
  @step()
  protected async step3() {
    this.ctx.set('step3', false);
  }
}

(async () => {
  const ctx = await Context.run([Scenario1, Scenario2], { initial: 'value' });
  console.log(ctx.get<boolean>('step1')); // true
  console.log(ctx.get<number>('step2')); // 1
  console.log(ctx.get<boolean>('step3')); // false
  console.log(ctx.all()); // {
  //    'step1': true,
  //    'step2': 1,
  //    'step3': false
  //  }
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/run_context.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/run-context/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/run-context/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)

---

[![Donate on Boosty](https://img.shields.io/badge/Boosty-donate-orange)](https://boosty.to/llevkin)

Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license.
