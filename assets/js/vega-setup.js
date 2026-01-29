<<<<<<< HEAD
let vegaTheme = determineComputedTheme();

/* Create vega lite chart as another node and hide the code block, appending the vega lite node after it
       this is done to enable retrieving the code again when changing theme between light/dark */
document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    document.querySelectorAll("pre>code.language-vega_lite").forEach((elem) => {
      const jsonData = elem.textContent;
      const backup = elem.parentElement;
      backup.classList.add("unloaded");
      /* create vega lite node */
      let chartElement = document.createElement("div");
      chartElement.classList.add("vega-lite");
      backup.after(chartElement);

      /* Embed the visualization in the container */
      if (vegaTheme === "dark") {
        vegaEmbed(chartElement, JSON.parse(jsonData), { theme: "dark" });
      } else {
        vegaEmbed(chartElement, JSON.parse(jsonData));
      }
    });
  }
});
=======
let vegaTheme=determineComputedTheme();document.addEventListener("readystatechange",()=>{"complete"===document.readyState&&document.querySelectorAll("pre>code.language-vega_lite").forEach(e=>{const t=e.textContent,a=e.parentElement;a.classList.add("unloaded");let d=document.createElement("div");d.classList.add("vega-lite"),a.after(d),"dark"===vegaTheme?vegaEmbed(d,JSON.parse(t),{theme:"dark"}):vegaEmbed(d,JSON.parse(t))})});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
