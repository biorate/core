---
to: sink/package.json
inject: true
after: '"main": "index.js"'
eof_last: true
---
  "custom": "node custom.js",
