---
glob: module/**/*
to: out/<%= name %>/
base: module
stripExtensions: ['.t']
skip: batch skipped
---
never-<%= name %>
