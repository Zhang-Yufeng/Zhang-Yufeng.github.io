<<<<<<< HEAD
let mermaidTheme = determineComputedTheme();

/* Create mermaid diagram as another node and hide the code block, appending the mermaid node after it
    this is done to enable retrieving the code again when changing theme between light/dark */
document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    document.querySelectorAll("pre>code.language-mermaid").forEach((elem) => {
      const svgCode = elem.textContent;
      const backup = elem.parentElement;
      backup.classList.add("unloaded");
      /* create mermaid node */
      let mermaid = document.createElement("pre");
      mermaid.classList.add("mermaid");
      const text = document.createTextNode(svgCode);
      mermaid.appendChild(text);
      backup.after(mermaid);
    });

    mermaid.initialize({ theme: mermaidTheme });

    /* Zoomable mermaid diagrams */
    if (typeof d3 !== "undefined") {
      window.addEventListener("load", function () {
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
      });
    }
  }
});
=======
let mermaidTheme=determineComputedTheme();document.addEventListener("readystatechange",()=>{"complete"===document.readyState&&(document.querySelectorAll("pre>code.language-mermaid").forEach(e=>{const t=e.textContent,d=e.parentElement;d.classList.add("unloaded");let a=document.createElement("pre");a.classList.add("mermaid");const n=document.createTextNode(t);a.appendChild(n),d.after(a)}),mermaid.initialize({theme:mermaidTheme}),"undefined"!=typeof d3&&window.addEventListener("load",function(){d3.selectAll(".mermaid svg").each(function(){var e=d3.select(this);e.html("<g>"+e.html()+"</g>");var t=e.select("g"),d=d3.zoom().on("zoom",function(e){t.attr("transform",e.transform)});e.call(d)})}))});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
