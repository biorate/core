# File Config

Module for configuring the application using files,
extends [Config](https://biorate.github.io/core/classes/config.Config.html) base class.

### Examples:

In ***cwd*** of you app, near package.json, create 2 files:
<br />
<br />

```bash
# config.json
{
  "app": "test"
}
```
<br />

```bash
# config.debug.json:
{
  "title": "My awesome app"
}
```

```ts
import { Core, injectable, inject, container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { FileConfig } from '@biorate/file-config';

@injectable()
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
}

container.bind<IConfig>(Types.Config)
 .to(FileConfig)
 .inSingletonScope();

container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = await container.get(Root).$run();

  console.log(root.config.get('package'));
  // {
  //   "name": "file-config-test",
  //   "version": "0.0.0",
  //   "description": "Test package.json",
  //   "keywords": [],
  //   "author": "llevkin",
  //   "license": "MIT"
  // }

  console.log(root.config.get('app')); // test
  console.log(root.config.get('title')); // My awesome app
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/file-config.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/file-config/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/file-config/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
