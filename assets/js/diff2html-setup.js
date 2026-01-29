<<<<<<< HEAD
let diff2HtmlTheme = determineComputedTheme();

/* Create diff2html as another node and hide the code block, appending the diff2html node after it
    this is done to enable retrieving the code again when changing theme between light/dark */
document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    document.querySelectorAll("pre>code.language-diff2html").forEach((elem) => {
      const textData = elem.textContent;
      const backup = elem.parentElement;
      backup.classList.add("unloaded");
      /* create diff node */
      let diffElement = document.createElement("div");
      diffElement.classList.add("diff2html");
      backup.after(diffElement);
      const configuration = { colorScheme: diff2HtmlTheme, drawFileList: true, highlight: true, matching: "lines" };
      const diff2htmlUi = new Diff2HtmlUI(diffElement, textData, configuration);
      diff2htmlUi.draw();
    });
  }
});
=======
let diff2HtmlTheme=determineComputedTheme();document.addEventListener("readystatechange",()=>{"complete"===document.readyState&&document.querySelectorAll("pre>code.language-diff2html").forEach(e=>{const t=e.textContent,d=e.parentElement;d.classList.add("unloaded");let l=document.createElement("div");l.classList.add("diff2html"),d.after(l);new Diff2HtmlUI(l,t,{colorScheme:diff2HtmlTheme,drawFileList:!0,highlight:!0,matching:"lines"}).draw()})});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
