---
to: sink/skip-not.js
inject: true
after: '// guard'
skip_if: 'custom-feature'
skip_if_not: true
---
custom-feature-inverted = true;
