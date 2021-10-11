import m from "mithril";

import "./index.{{CSS_EXTENSION}}";

m.render(
  document.getElementById("app"),
  m("div", { class: "{{CONTAINER}}" }, [
    m("div", "Name: {{ NAME }}"),
    m("div", "Framework: {{ FRAMEWORK }}"),
    m("div", "Language: {{ LANGUAGE }}"),
    m("div", "CSS: {{ CSS }}"),
  ])
);
