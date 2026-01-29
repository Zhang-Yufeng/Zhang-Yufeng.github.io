<<<<<<< HEAD
window.MathJax = {
  tex: {
    tags: "ams",
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
  },
  options: {
    renderActions: {
      addCss: [
        200,
        function (doc) {
          const style = document.createElement("style");
          style.innerHTML = `
          .mjx-container {
            color: inherit;
          }
        `;
          document.head.appendChild(style);
        },
        "",
      ],
    },
  },
};
=======
window.MathJax={tex:{tags:"ams",inlineMath:[["$","$"],["\\(","\\)"]]},options:{renderActions:{addCss:[200,function(){const n=document.createElement("style");n.innerHTML="\n          .mjx-container {\n            color: inherit;\n          }\n        ",document.head.appendChild(n)},""]}}};
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
