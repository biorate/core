---
to: out/<%= name %>-cond.txt
skip: <% if (wantTests) { %>false<% } else { %>no tests requested<% } %>
---
cond-body-<%= name %>
