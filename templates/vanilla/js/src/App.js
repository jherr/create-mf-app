import "./index.{{CSS_EXTENSION}}";

document.getElementById("app").innerHTML = `
<div class="{{CONTAINER}}">
  <div>Host: {{NAME}}</div>
  <div>Framework: {{FRAMEWORK}}</div>
  <div>Language: {{LANGUAGE}}</div>
  <div>CSS: {{CSS}}</div>
</div>
`;
