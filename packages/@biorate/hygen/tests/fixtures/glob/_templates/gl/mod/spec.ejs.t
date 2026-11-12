---
glob: module/**/*
to: src/<%= name %>/
base: module
stripExtensions: ['.t']
---
spec body for <%= name %>
