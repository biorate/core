# Inversion

IoC core module build on InversifyJS

#### Example:

```ts
import { Core, init, injectable, inject, container, kill } from '@biorate/inversion';

@injectable()
class One {
  @init() public initialize() {
    console.log('One module initialized');
  }

  @kill() public kill() {
    console.log('One module killed');
  }
}

@injectable()
class Two {
  @init() public initialize() {
    console.log('Two module initialized');
  }
}

@injectable()
class Three {
  @init() public initialize() {
    console.log('Three module initialized');
  }
}

class Root extends Core() {
  @inject(One) public one;
  @inject(Two) public two;
  @inject(Three) public three;
}

container.bind(One).toSelf();
container.bind(Two).toSelf();
container.bind(Three).toSelf();
container.bind(Root).toSelf();

const root = container.get(Root);

root.$run().then(() => {
  console.log(root.one instanceof One); // true
  console.log(root.two instanceof Two); // true
  console.log(root.three instanceof Three); // true
});
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/inversion.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/inversion/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/inversion/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
