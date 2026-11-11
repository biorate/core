---
to: sink/new-file.txt
inject: true
create_if_missing: true
append: true
skip_if: 'create-missing-marker'
---
create-missing-marker = true;
