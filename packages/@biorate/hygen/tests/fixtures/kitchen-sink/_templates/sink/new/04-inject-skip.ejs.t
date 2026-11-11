---
to: sink/config.js
inject: true
after: '// config'
skip_if: 'custom-feature'
---
custom-feature = true;
