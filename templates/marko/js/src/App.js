import view from "./hello";

import "./index.{{CSS_EXTENSION}}";

const result = view.renderSync({});

result.appendTo(document.getElementById("app"));
