<<<<<<< HEAD
$(document).ready(function () {
  // Let external links in jupyter notebooks open in new tab
  let jupyterNotebooks = $(".jupyter-notebook-iframe-container");
  jupyterNotebooks.each(function () {
    let iframeBody = $(this).find("iframe").get(0).contentWindow.document.body;
    // Get all <a> elements in the bodyElement
    let links = $(iframeBody).find("a");

    // Loop through each <a> element
    links.each(function () {
      // Check if the <a> element has an 'href' attribute
      if ($(this).attr("href")) {
        // Set the 'target' attribute to '_blank' to open the link in a new tab/window
        $(this).attr("target", "_blank");
      }
    });
  });
});
=======
$(document).ready(function(){$(".jupyter-notebook-iframe-container").each(function(){let t=$(this).find("iframe").get(0).contentWindow.document.body;$(t).find("a").each(function(){$(this).attr("href")&&$(this).attr("target","_blank")})})});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
