<<<<<<< HEAD
window.MathJax = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
    processEnvironments: true,
  },
};

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    document.querySelectorAll("pre>code.language-pseudocode").forEach((elem) => {
      const texData = elem.textContent;
      const parent = elem.parentElement.parentElement;
      /* create pseudocode node */
      let pseudoCodeElement = document.createElement("pre");
      pseudoCodeElement.classList.add("pseudocode");
      const text = document.createTextNode(texData);
      pseudoCodeElement.appendChild(text);
      /* add pseudocode node and remove the original code block */
      parent.appendChild(pseudoCodeElement);
      parent.removeChild(elem.parentElement);
      /* embed the visualization in the container */
      pseudocode.renderElement(pseudoCodeElement);
    });
  }
});
=======
window.MathJax={tex:{inlineMath:[["$","$"],["\\(","\\)"]],displayMath:[["$$","$$"],["\\[","\\]"]],processEscapes:!0,processEnvironments:!0}},document.addEventListener("readystatechange",()=>{"complete"===document.readyState&&document.querySelectorAll("pre>code.language-pseudocode").forEach(e=>{const t=e.textContent,n=e.parentElement.parentElement;let d=document.createElement("pre");d.classList.add("pseudocode");const a=document.createTextNode(t);d.appendChild(a),n.appendChild(d),n.removeChild(e.parentElement),pseudocode.renderElement(d)})});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
