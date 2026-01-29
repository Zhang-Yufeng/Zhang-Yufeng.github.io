<<<<<<< HEAD
/* Create leaflet map as another node and hide the code block, appending the leaflet node after it */
document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    document.querySelectorAll("pre>code.language-geojson").forEach((elem) => {
      const jsonData = elem.textContent;
      const backup = elem.parentElement;
      backup.classList.add("unloaded");
      /* create leaflet node */
      let mapElement = document.createElement("div");
      mapElement.classList.add("map");
      backup.after(mapElement);

      var map = L.map(mapElement);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      let geoJSON = L.geoJSON(JSON.parse(jsonData)).addTo(map);
      map.fitBounds(geoJSON.getBounds());
    });
  }
});
=======
document.addEventListener("readystatechange",()=>{"complete"===document.readyState&&document.querySelectorAll("pre>code.language-geojson").forEach(e=>{const t=e.textContent,a=e.parentElement;a.classList.add("unloaded");let o=document.createElement("div");o.classList.add("map"),a.after(o);var n=L.map(o);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(n);let d=L.geoJSON(JSON.parse(t)).addTo(n);n.fitBounds(d.getBounds())})});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
