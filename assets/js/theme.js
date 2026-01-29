<<<<<<< HEAD
// Has to be in the head tag, otherwise a flicker effect will occur.

// Toggle through light, dark, and system theme settings.
let toggleThemeSetting = () => {
  let themeSetting = determineThemeSetting();
  if (themeSetting == "system") {
    setThemeSetting("light");
  } else if (themeSetting == "light") {
    setThemeSetting("dark");
  } else {
    setThemeSetting("system");
  }
};

// Change the theme setting and apply the theme.
let setThemeSetting = (themeSetting) => {
  localStorage.setItem("theme", themeSetting);

  document.documentElement.setAttribute("data-theme-setting", themeSetting);

  applyTheme();
};

// Apply the computed dark or light theme to the website.
let applyTheme = () => {
  let theme = determineComputedTheme();

  transTheme();
  setHighlight(theme);
  setGiscusTheme(theme);
  setSearchTheme(theme);

  // if mermaid is not defined, do nothing
  if (typeof mermaid !== "undefined") {
    setMermaidTheme(theme);
  }

  // if diff2html is not defined, do nothing
  if (typeof Diff2HtmlUI !== "undefined") {
    setDiff2htmlTheme(theme);
  }

  // if echarts is not defined, do nothing
  if (typeof echarts !== "undefined") {
    setEchartsTheme(theme);
  }

  // if Plotly is not defined, do nothing
  if (typeof Plotly !== "undefined") {
    setPlotlyTheme(theme);
  }

  // if vegaEmbed is not defined, do nothing
  if (typeof vegaEmbed !== "undefined") {
    setVegaLiteTheme(theme);
  }

  document.documentElement.setAttribute("data-theme", theme);

  // Add class to tables.
  let tables = document.getElementsByTagName("table");
  for (let i = 0; i < tables.length; i++) {
    if (theme == "dark") {
      tables[i].classList.add("table-dark");
    } else {
      tables[i].classList.remove("table-dark");
    }
  }

  // Set jupyter notebooks themes.
  let jupyterNotebooks = document.getElementsByClassName("jupyter-notebook-iframe-container");
  for (let i = 0; i < jupyterNotebooks.length; i++) {
    let bodyElement = jupyterNotebooks[i].getElementsByTagName("iframe")[0].contentWindow.document.body;
    if (theme == "dark") {
      bodyElement.setAttribute("data-jp-theme-light", "false");
      bodyElement.setAttribute("data-jp-theme-name", "JupyterLab Dark");
    } else {
      bodyElement.setAttribute("data-jp-theme-light", "true");
      bodyElement.setAttribute("data-jp-theme-name", "JupyterLab Light");
    }
  }

  // Updates the background of medium-zoom overlay.
  if (typeof medium_zoom !== "undefined") {
    medium_zoom.update({
      background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee", // + 'ee' for trasparency.
    });
  }
};

let setHighlight = (theme) => {
  if (theme == "dark") {
    document.getElementById("highlight_theme_light").media = "none";
    document.getElementById("highlight_theme_dark").media = "";
  } else {
    document.getElementById("highlight_theme_dark").media = "none";
    document.getElementById("highlight_theme_light").media = "";
  }
};

let setGiscusTheme = (theme) => {
  function sendMessage(message) {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe) return;
    iframe.contentWindow.postMessage({ giscus: message }, "https://giscus.app");
  }

  sendMessage({
    setConfig: {
      theme: theme,
    },
  });
};

let addMermaidZoom = (records, observer) => {
  var svgs = d3.selectAll(".mermaid svg");
  svgs.each(function () {
    var svg = d3.select(this);
    svg.html("<g>" + svg.html() + "</g>");
    var inner = svg.select("g");
    var zoom = d3.zoom().on("zoom", function (event) {
      inner.attr("transform", event.transform);
    });
    svg.call(zoom);
  });
  observer.disconnect();
};

let setMermaidTheme = (theme) => {
  if (theme == "light") {
    // light theme name in mermaid is 'default'
    // https://mermaid.js.org/config/theming.html#available-themes
    theme = "default";
  }

  /* Re-render the SVG, based on https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_includes/mermaid.html */
  document.querySelectorAll(".mermaid").forEach((elem) => {
    // Get the code block content from previous element, since it is the mermaid code itself as defined in Markdown, but it is hidden
    let svgCode = elem.previousSibling.childNodes[0].innerHTML;
    elem.removeAttribute("data-processed");
    elem.innerHTML = svgCode;
  });

  mermaid.initialize({ theme: theme });
  window.mermaid.init(undefined, document.querySelectorAll(".mermaid"));

  const observable = document.querySelector(".mermaid svg");
  if (observable !== null) {
    var observer = new MutationObserver(addMermaidZoom);
    const observerOptions = { childList: true };
    observer.observe(observable, observerOptions);
  }
};

let setDiff2htmlTheme = (theme) => {
  document.querySelectorAll(".diff2html").forEach((elem) => {
    // Get the code block content from previous element, since it is the diff code itself as defined in Markdown, but it is hidden
    let textData = elem.previousSibling.childNodes[0].innerHTML;
    elem.innerHTML = "";
    const configuration = { colorScheme: theme, drawFileList: true, highlight: true, matching: "lines" };
    const diff2htmlUi = new Diff2HtmlUI(elem, textData, configuration);
    diff2htmlUi.draw();
  });
};

let setEchartsTheme = (theme) => {
  document.querySelectorAll(".echarts").forEach((elem) => {
    // Get the code block content from previous element, since it is the echarts code itself as defined in Markdown, but it is hidden
    let jsonData = elem.previousSibling.childNodes[0].innerHTML;
    echarts.dispose(elem);

    if (theme === "dark") {
      var chart = echarts.init(elem, "dark-fresh-cut");
    } else {
      var chart = echarts.init(elem);
    }

    chart.setOption(JSON.parse(jsonData));
  });
};

let setPlotlyTheme = (theme) => {
  document.querySelectorAll(".js-plotly-plot").forEach((elem) => {
    // Get the code block content from previous element, since it is the plotly code itself as defined in Markdown, but it is hidden
    let jsonData = JSON.parse(elem.previousSibling.childNodes[0].innerHTML);

    if (theme === "dark") {
      // dark theme extracted from https://github.com/plotly/plotly.py/blob/main/plotly/package_data/templates/plotly_dark.json?raw=true
      // prettier-ignore
      const plotlyDarkLayout = {"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#f2f5fa"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"rgb(17,17,17)","plot_bgcolor":"rgb(17,17,17)","polar":{"bgcolor":"rgb(17,17,17)","angularaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"radialaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"ternary":{"bgcolor":"rgb(17,17,17)","aaxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"baxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""},"caxis":{"gridcolor":"#506784","linecolor":"#506784","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"#283442","linecolor":"#506784","ticks":"","title":{"standoff":15},"zerolinecolor":"#283442","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3","gridwidth":2},"yaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3","gridwidth":2},"zaxis":{"backgroundcolor":"rgb(17,17,17)","gridcolor":"#506784","linecolor":"#506784","showbackground":true,"ticks":"","zerolinecolor":"#C8D4E3","gridwidth":2}},"shapedefaults":{"line":{"color":"#f2f5fa"}},"annotationdefaults":{"arrowcolor":"#f2f5fa","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"rgb(17,17,17)","landcolor":"rgb(17,17,17)","subunitcolor":"#506784","showland":true,"showlakes":true,"lakecolor":"rgb(17,17,17)"},"title":{"x":0.05},"updatemenudefaults":{"bgcolor":"#506784","borderwidth":0},"sliderdefaults":{"bgcolor":"#C8D4E3","borderwidth":1,"bordercolor":"rgb(17,17,17)","tickwidth":0},"mapbox":{"style":"dark"}},"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"marker":{"line":{"color":"#283442"}},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#f2f5fa"},"error_y":{"color":"#f2f5fa"},"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"marker":{"line":{"color":"#283442"}},"type":"scattergl"}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermap":[{"type":"scattermap","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"baxis":{"endlinecolor":"#A2B1C6","gridcolor":"#506784","linecolor":"#506784","minorgridcolor":"#506784","startlinecolor":"#A2B1C6"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#506784"},"line":{"color":"rgb(17,17,17)"}},"header":{"fill":{"color":"#2a3f5f"},"line":{"color":"rgb(17,17,17)"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"rgb(17,17,17)","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]}};

      // if jsonData.layout exists, then update the theme
      if (jsonData.layout) {
        if (jsonData.layout.template) {
          jsonData.layout.template = { ...plotlyDarkLayout, ...jsonData.layout.template };
        } else {
          jsonData.layout.template = plotlyDarkLayout;
        }
      } else {
        jsonData.layout = { template: plotlyDarkLayout };
      }
    } else {
      // light theme extracted from https://github.com/plotly/plotly.py/blob/main/plotly/package_data/templates/plotly_white.json?raw=true
      // prettier-ignore
      const plotlyLightLayout = {"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"white","polar":{"bgcolor":"white","angularaxis":{"gridcolor":"#EBF0F8","linecolor":"#EBF0F8","ticks":""},"radialaxis":{"gridcolor":"#EBF0F8","linecolor":"#EBF0F8","ticks":""}},"ternary":{"bgcolor":"white","aaxis":{"gridcolor":"#DFE8F3","linecolor":"#A2B1C6","ticks":""},"baxis":{"gridcolor":"#DFE8F3","linecolor":"#A2B1C6","ticks":""},"caxis":{"gridcolor":"#DFE8F3","linecolor":"#A2B1C6","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"#EBF0F8","linecolor":"#EBF0F8","ticks":"","title":{"standoff":15},"zerolinecolor":"#EBF0F8","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"#EBF0F8","linecolor":"#EBF0F8","ticks":"","title":{"standoff":15},"zerolinecolor":"#EBF0F8","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"white","gridcolor":"#DFE8F3","linecolor":"#EBF0F8","showbackground":true,"ticks":"","zerolinecolor":"#EBF0F8","gridwidth":2},"yaxis":{"backgroundcolor":"white","gridcolor":"#DFE8F3","linecolor":"#EBF0F8","showbackground":true,"ticks":"","zerolinecolor":"#EBF0F8","gridwidth":2},"zaxis":{"backgroundcolor":"white","gridcolor":"#DFE8F3","linecolor":"#EBF0F8","showbackground":true,"ticks":"","zerolinecolor":"#EBF0F8","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"white","subunitcolor":"#C8D4E3","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}},"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"white","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermap":[{"type":"scattermap","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"#C8D4E3","linecolor":"#C8D4E3","minorgridcolor":"#C8D4E3","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"#C8D4E3","linecolor":"#C8D4E3","minorgridcolor":"#C8D4E3","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"white","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]}};

      // if jsonData.layout exists, then update the theme
      if (jsonData.layout) {
        if (jsonData.layout.template) {
          jsonData.layout.template = { ...plotlyLightLayout, ...jsonData.layout.template };
        } else {
          jsonData.layout.template = plotlyLightLayout;
        }
      } else {
        jsonData.layout = { template: plotlyLightLayout };
      }
    }

    Plotly.relayout(elem, jsonData.layout);
  });
};

let setVegaLiteTheme = (theme) => {
  document.querySelectorAll(".vega-lite").forEach((elem) => {
    // Get the code block content from previous element, since it is the vega lite code itself as defined in Markdown, but it is hidden
    let jsonData = elem.previousSibling.childNodes[0].innerHTML;
    elem.innerHTML = "";
    if (theme === "dark") {
      vegaEmbed(elem, JSON.parse(jsonData), { theme: "dark" });
    } else {
      vegaEmbed(elem, JSON.parse(jsonData));
    }
  });
};

let setSearchTheme = (theme) => {
  const ninjaKeys = document.querySelector("ninja-keys");
  if (!ninjaKeys) return;

  if (theme === "dark") {
    ninjaKeys.classList.add("dark");
  } else {
    ninjaKeys.classList.remove("dark");
  }
};

let transTheme = () => {
  document.documentElement.classList.add("transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 500);
};

// Determine the expected state of the theme toggle, which can be "dark", "light", or
// "system". Default is "system".
let determineThemeSetting = () => {
  let themeSetting = localStorage.getItem("theme");
  if (themeSetting != "dark" && themeSetting != "light" && themeSetting != "system") {
    themeSetting = "system";
  }
  return themeSetting;
};

// Determine the computed theme, which can be "dark" or "light". If the theme setting is
// "system", the computed theme is determined based on the user's system preference.
let determineComputedTheme = () => {
  let themeSetting = determineThemeSetting();
  if (themeSetting == "system") {
    const userPref = window.matchMedia;
    if (userPref && userPref("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else {
      return "light";
    }
  } else {
    return themeSetting;
  }
};

let initTheme = () => {
  let themeSetting = determineThemeSetting();

  setThemeSetting(themeSetting);

  // Add event listener to the theme toggle button.
  document.addEventListener("DOMContentLoaded", function () {
    const mode_toggle = document.getElementById("light-toggle");

    mode_toggle.addEventListener("click", function () {
      toggleThemeSetting();
    });
  });

  // Add event listener to the system theme preference change.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches }) => {
    applyTheme();
  });
};
=======
let toggleThemeSetting=()=>{let e=determineThemeSetting();setThemeSetting("system"==e?"light":"light"==e?"dark":"system")},setThemeSetting=e=>{localStorage.setItem("theme",e),document.documentElement.setAttribute("data-theme-setting",e),applyTheme()},applyTheme=()=>{let e=determineComputedTheme();transTheme(),setHighlight(e),setGiscusTheme(e),setSearchTheme(e),"undefined"!=typeof mermaid&&setMermaidTheme(e),"undefined"!=typeof Diff2HtmlUI&&setDiff2htmlTheme(e),"undefined"!=typeof echarts&&setEchartsTheme(e),"undefined"!=typeof Plotly&&setPlotlyTheme(e),"undefined"!=typeof vegaEmbed&&setVegaLiteTheme(e),document.documentElement.setAttribute("data-theme",e);let t=document.getElementsByTagName("table");for(let o=0;o<t.length;o++)"dark"==e?t[o].classList.add("table-dark"):t[o].classList.remove("table-dark");let o=document.getElementsByClassName("jupyter-notebook-iframe-container");for(let t=0;t<o.length;t++){let r=o[t].getElementsByTagName("iframe")[0].contentWindow.document.body;"dark"==e?(r.setAttribute("data-jp-theme-light","false"),r.setAttribute("data-jp-theme-name","JupyterLab Dark")):(r.setAttribute("data-jp-theme-light","true"),r.setAttribute("data-jp-theme-name","JupyterLab Light"))}"undefined"!=typeof medium_zoom&&medium_zoom.update({background:getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color")+"ee"})},setHighlight=e=>{"dark"==e?(document.getElementById("highlight_theme_light").media="none",document.getElementById("highlight_theme_dark").media=""):(document.getElementById("highlight_theme_dark").media="none",document.getElementById("highlight_theme_light").media="")},setGiscusTheme=e=>{function t(e){const t=document.querySelector("iframe.giscus-frame");t&&t.contentWindow.postMessage({giscus:e},"https://giscus.app")}t({setConfig:{theme:e}})},addMermaidZoom=(e,t)=>{d3.selectAll(".mermaid svg").each(function(){var e=d3.select(this);e.html("<g>"+e.html()+"</g>");var t=e.select("g"),o=d3.zoom().on("zoom",function(e){t.attr("transform",e.transform)});e.call(o)}),t.disconnect()},setMermaidTheme=e=>{"light"==e&&(e="default"),document.querySelectorAll(".mermaid").forEach(e=>{let t=e.previousSibling.childNodes[0].innerHTML;e.removeAttribute("data-processed"),e.innerHTML=t}),mermaid.initialize({theme:e}),window.mermaid.init(void 0,document.querySelectorAll(".mermaid"));const t=document.querySelector(".mermaid svg");if(null!==t){const e={childList:!0};new MutationObserver(addMermaidZoom).observe(t,e)}},setDiff2htmlTheme=e=>{document.querySelectorAll(".diff2html").forEach(t=>{let o=t.previousSibling.childNodes[0].innerHTML;t.innerHTML="";new Diff2HtmlUI(t,o,{colorScheme:e,drawFileList:!0,highlight:!0,matching:"lines"}).draw()})},setEchartsTheme=e=>{document.querySelectorAll(".echarts").forEach(t=>{let o=t.previousSibling.childNodes[0].innerHTML;if(echarts.dispose(t),"dark"===e)var r=echarts.init(t,"dark-fresh-cut");else r=echarts.init(t);r.setOption(JSON.parse(o))})},setPlotlyTheme=e=>{document.querySelectorAll(".js-plotly-plot").forEach(t=>{let o=JSON.parse(t.previousSibling.childNodes[0].innerHTML);if("dark"===e){const e={layout:{autotypenumbers:"strict",colorway:["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],font:{color:"#f2f5fa"},hovermode:"closest",hoverlabel:{align:"left"},paper_bgcolor:"rgb(17,17,17)",plot_bgcolor:"rgb(17,17,17)",polar:{bgcolor:"rgb(17,17,17)",angularaxis:{gridcolor:"#506784",linecolor:"#506784",ticks:""},radialaxis:{gridcolor:"#506784",linecolor:"#506784",ticks:""}},ternary:{bgcolor:"rgb(17,17,17)",aaxis:{gridcolor:"#506784",linecolor:"#506784",ticks:""},baxis:{gridcolor:"#506784",linecolor:"#506784",ticks:""},caxis:{gridcolor:"#506784",linecolor:"#506784",ticks:""}},coloraxis:{colorbar:{outlinewidth:0,ticks:""}},colorscale:{sequential:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]],sequentialminus:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]],diverging:[[0,"#8e0152"],[.1,"#c51b7d"],[.2,"#de77ae"],[.3,"#f1b6da"],[.4,"#fde0ef"],[.5,"#f7f7f7"],[.6,"#e6f5d0"],[.7,"#b8e186"],[.8,"#7fbc41"],[.9,"#4d9221"],[1,"#276419"]]},xaxis:{gridcolor:"#283442",linecolor:"#506784",ticks:"",title:{standoff:15},zerolinecolor:"#283442",automargin:!0,zerolinewidth:2},yaxis:{gridcolor:"#283442",linecolor:"#506784",ticks:"",title:{standoff:15},zerolinecolor:"#283442",automargin:!0,zerolinewidth:2},scene:{xaxis:{backgroundcolor:"rgb(17,17,17)",gridcolor:"#506784",linecolor:"#506784",showbackground:!0,ticks:"",zerolinecolor:"#C8D4E3",gridwidth:2},yaxis:{backgroundcolor:"rgb(17,17,17)",gridcolor:"#506784",linecolor:"#506784",showbackground:!0,ticks:"",zerolinecolor:"#C8D4E3",gridwidth:2},zaxis:{backgroundcolor:"rgb(17,17,17)",gridcolor:"#506784",linecolor:"#506784",showbackground:!0,ticks:"",zerolinecolor:"#C8D4E3",gridwidth:2}},shapedefaults:{line:{color:"#f2f5fa"}},annotationdefaults:{arrowcolor:"#f2f5fa",arrowhead:0,arrowwidth:1},geo:{bgcolor:"rgb(17,17,17)",landcolor:"rgb(17,17,17)",subunitcolor:"#506784",showland:!0,showlakes:!0,lakecolor:"rgb(17,17,17)"},title:{x:.05},updatemenudefaults:{bgcolor:"#506784",borderwidth:0},sliderdefaults:{bgcolor:"#C8D4E3",borderwidth:1,bordercolor:"rgb(17,17,17)",tickwidth:0},mapbox:{style:"dark"}},data:{histogram2dcontour:[{type:"histogram2dcontour",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],choropleth:[{type:"choropleth",colorbar:{outlinewidth:0,ticks:""}}],histogram2d:[{type:"histogram2d",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],heatmap:[{type:"heatmap",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],contourcarpet:[{type:"contourcarpet",colorbar:{outlinewidth:0,ticks:""}}],contour:[{type:"contour",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],surface:[{type:"surface",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],mesh3d:[{type:"mesh3d",colorbar:{outlinewidth:0,ticks:""}}],scatter:[{marker:{line:{color:"#283442"}},type:"scatter"}],parcoords:[{type:"parcoords",line:{colorbar:{outlinewidth:0,ticks:""}}}],scatterpolargl:[{type:"scatterpolargl",marker:{colorbar:{outlinewidth:0,ticks:""}}}],bar:[{error_x:{color:"#f2f5fa"},error_y:{color:"#f2f5fa"},marker:{line:{color:"rgb(17,17,17)",width:.5},pattern:{fillmode:"overlay",size:10,solidity:.2}},type:"bar"}],scattergeo:[{type:"scattergeo",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scatterpolar:[{type:"scatterpolar",marker:{colorbar:{outlinewidth:0,ticks:""}}}],histogram:[{marker:{pattern:{fillmode:"overlay",size:10,solidity:.2}},type:"histogram"}],scattergl:[{marker:{line:{color:"#283442"}},type:"scattergl"}],scatter3d:[{type:"scatter3d",line:{colorbar:{outlinewidth:0,ticks:""}},marker:{colorbar:{outlinewidth:0,ticks:""}}}],scattermap:[{type:"scattermap",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scattermapbox:[{type:"scattermapbox",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scatterternary:[{type:"scatterternary",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scattercarpet:[{type:"scattercarpet",marker:{colorbar:{outlinewidth:0,ticks:""}}}],carpet:[{aaxis:{endlinecolor:"#A2B1C6",gridcolor:"#506784",linecolor:"#506784",minorgridcolor:"#506784",startlinecolor:"#A2B1C6"},baxis:{endlinecolor:"#A2B1C6",gridcolor:"#506784",linecolor:"#506784",minorgridcolor:"#506784",startlinecolor:"#A2B1C6"},type:"carpet"}],table:[{cells:{fill:{color:"#506784"},line:{color:"rgb(17,17,17)"}},header:{fill:{color:"#2a3f5f"},line:{color:"rgb(17,17,17)"}},type:"table"}],barpolar:[{marker:{line:{color:"rgb(17,17,17)",width:.5},pattern:{fillmode:"overlay",size:10,solidity:.2}},type:"barpolar"}],pie:[{automargin:!0,type:"pie"}]}};o.layout?o.layout.template?o.layout.template={...e,...o.layout.template}:o.layout.template=e:o.layout={template:e}}else{const e={layout:{autotypenumbers:"strict",colorway:["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],font:{color:"#2a3f5f"},hovermode:"closest",hoverlabel:{align:"left"},paper_bgcolor:"white",plot_bgcolor:"white",polar:{bgcolor:"white",angularaxis:{gridcolor:"#EBF0F8",linecolor:"#EBF0F8",ticks:""},radialaxis:{gridcolor:"#EBF0F8",linecolor:"#EBF0F8",ticks:""}},ternary:{bgcolor:"white",aaxis:{gridcolor:"#DFE8F3",linecolor:"#A2B1C6",ticks:""},baxis:{gridcolor:"#DFE8F3",linecolor:"#A2B1C6",ticks:""},caxis:{gridcolor:"#DFE8F3",linecolor:"#A2B1C6",ticks:""}},coloraxis:{colorbar:{outlinewidth:0,ticks:""}},colorscale:{sequential:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]],sequentialminus:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]],diverging:[[0,"#8e0152"],[.1,"#c51b7d"],[.2,"#de77ae"],[.3,"#f1b6da"],[.4,"#fde0ef"],[.5,"#f7f7f7"],[.6,"#e6f5d0"],[.7,"#b8e186"],[.8,"#7fbc41"],[.9,"#4d9221"],[1,"#276419"]]},xaxis:{gridcolor:"#EBF0F8",linecolor:"#EBF0F8",ticks:"",title:{standoff:15},zerolinecolor:"#EBF0F8",automargin:!0,zerolinewidth:2},yaxis:{gridcolor:"#EBF0F8",linecolor:"#EBF0F8",ticks:"",title:{standoff:15},zerolinecolor:"#EBF0F8",automargin:!0,zerolinewidth:2},scene:{xaxis:{backgroundcolor:"white",gridcolor:"#DFE8F3",linecolor:"#EBF0F8",showbackground:!0,ticks:"",zerolinecolor:"#EBF0F8",gridwidth:2},yaxis:{backgroundcolor:"white",gridcolor:"#DFE8F3",linecolor:"#EBF0F8",showbackground:!0,ticks:"",zerolinecolor:"#EBF0F8",gridwidth:2},zaxis:{backgroundcolor:"white",gridcolor:"#DFE8F3",linecolor:"#EBF0F8",showbackground:!0,ticks:"",zerolinecolor:"#EBF0F8",gridwidth:2}},shapedefaults:{line:{color:"#2a3f5f"}},annotationdefaults:{arrowcolor:"#2a3f5f",arrowhead:0,arrowwidth:1},geo:{bgcolor:"white",landcolor:"white",subunitcolor:"#C8D4E3",showland:!0,showlakes:!0,lakecolor:"white"},title:{x:.05},mapbox:{style:"light"}},data:{histogram2dcontour:[{type:"histogram2dcontour",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],choropleth:[{type:"choropleth",colorbar:{outlinewidth:0,ticks:""}}],histogram2d:[{type:"histogram2d",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],heatmap:[{type:"heatmap",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],contourcarpet:[{type:"contourcarpet",colorbar:{outlinewidth:0,ticks:""}}],contour:[{type:"contour",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],surface:[{type:"surface",colorbar:{outlinewidth:0,ticks:""},colorscale:[[0,"#0d0887"],[.1111111111111111,"#46039f"],[.2222222222222222,"#7201a8"],[.3333333333333333,"#9c179e"],[.4444444444444444,"#bd3786"],[.5555555555555556,"#d8576b"],[.6666666666666666,"#ed7953"],[.7777777777777778,"#fb9f3a"],[.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],mesh3d:[{type:"mesh3d",colorbar:{outlinewidth:0,ticks:""}}],scatter:[{fillpattern:{fillmode:"overlay",size:10,solidity:.2},type:"scatter"}],parcoords:[{type:"parcoords",line:{colorbar:{outlinewidth:0,ticks:""}}}],scatterpolargl:[{type:"scatterpolargl",marker:{colorbar:{outlinewidth:0,ticks:""}}}],bar:[{error_x:{color:"#2a3f5f"},error_y:{color:"#2a3f5f"},marker:{line:{color:"white",width:.5},pattern:{fillmode:"overlay",size:10,solidity:.2}},type:"bar"}],scattergeo:[{type:"scattergeo",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scatterpolar:[{type:"scatterpolar",marker:{colorbar:{outlinewidth:0,ticks:""}}}],histogram:[{marker:{pattern:{fillmode:"overlay",size:10,solidity:.2}},type:"histogram"}],scattergl:[{type:"scattergl",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scatter3d:[{type:"scatter3d",line:{colorbar:{outlinewidth:0,ticks:""}},marker:{colorbar:{outlinewidth:0,ticks:""}}}],scattermap:[{type:"scattermap",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scattermapbox:[{type:"scattermapbox",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scatterternary:[{type:"scatterternary",marker:{colorbar:{outlinewidth:0,ticks:""}}}],scattercarpet:[{type:"scattercarpet",marker:{colorbar:{outlinewidth:0,ticks:""}}}],carpet:[{aaxis:{endlinecolor:"#2a3f5f",gridcolor:"#C8D4E3",linecolor:"#C8D4E3",minorgridcolor:"#C8D4E3",startlinecolor:"#2a3f5f"},baxis:{endlinecolor:"#2a3f5f",gridcolor:"#C8D4E3",linecolor:"#C8D4E3",minorgridcolor:"#C8D4E3",startlinecolor:"#2a3f5f"},type:"carpet"}],table:[{cells:{fill:{color:"#EBF0F8"},line:{color:"white"}},header:{fill:{color:"#C8D4E3"},line:{color:"white"}},type:"table"}],barpolar:[{marker:{line:{color:"white",width:.5},pattern:{fillmode:"overlay",size:10,solidity:.2}},type:"barpolar"}],pie:[{automargin:!0,type:"pie"}]}};o.layout?o.layout.template?o.layout.template={...e,...o.layout.template}:o.layout.template=e:o.layout={template:e}}Plotly.relayout(t,o.layout)})},setVegaLiteTheme=e=>{document.querySelectorAll(".vega-lite").forEach(t=>{let o=t.previousSibling.childNodes[0].innerHTML;t.innerHTML="","dark"===e?vegaEmbed(t,JSON.parse(o),{theme:"dark"}):vegaEmbed(t,JSON.parse(o))})},setSearchTheme=e=>{const t=document.querySelector("ninja-keys");t&&("dark"===e?t.classList.add("dark"):t.classList.remove("dark"))},transTheme=()=>{document.documentElement.classList.add("transition"),window.setTimeout(()=>{document.documentElement.classList.remove("transition")},500)},determineThemeSetting=()=>{let e=localStorage.getItem("theme");return"dark"!=e&&"light"!=e&&"system"!=e&&(e="system"),e},determineComputedTheme=()=>{let e=determineThemeSetting();if("system"==e){const e=window.matchMedia;return e&&e("(prefers-color-scheme: dark)").matches?"dark":"light"}return e},initTheme=()=>{let e=determineThemeSetting();setThemeSetting(e),document.addEventListener("DOMContentLoaded",function(){document.getElementById("light-toggle").addEventListener("click",function(){toggleThemeSetting()})}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",({matches:e})=>{applyTheme()})};
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
