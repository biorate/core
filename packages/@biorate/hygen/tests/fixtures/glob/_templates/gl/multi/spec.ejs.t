---
glob: module/**/*
to: out/<%= name %>/
base: module
stripExtensions: ['.t']
---
multi spec body
