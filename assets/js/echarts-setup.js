<<<<<<< HEAD
let echartsTheme = determineComputedTheme();

/* Create echarts chart as another node and hide the code block, appending the echarts node after it
       this is done to enable retrieving the code again when changing theme between light/dark */
document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    document.querySelectorAll("pre>code.language-echarts").forEach((elem) => {
      const jsonData = elem.textContent;
      const backup = elem.parentElement;
      backup.classList.add("unloaded");
      /* create echarts node */
      let chartElement = document.createElement("div");
      chartElement.classList.add("echarts");
      backup.after(chartElement);

      /* create echarts */
      if (echartsTheme === "dark") {
        var chart = echarts.init(chartElement, "dark-fresh-cut");
      } else {
        var chart = echarts.init(chartElement);
      }

      chart.setOption(JSON.parse(jsonData));
      window.addEventListener("resize", function () {
        chart.resize();
      });
    });
  }
});
=======
let echartsTheme=determineComputedTheme();document.addEventListener("readystatechange",()=>{"complete"===document.readyState&&document.querySelectorAll("pre>code.language-echarts").forEach(e=>{const t=e.textContent,a=e.parentElement;a.classList.add("unloaded");let r=document.createElement("div");if(r.classList.add("echarts"),a.after(r),"dark"===echartsTheme)var n=echarts.init(r,"dark-fresh-cut");else n=echarts.init(r);n.setOption(JSON.parse(t)),window.addEventListener("resize",function(){n.resize()})})});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
