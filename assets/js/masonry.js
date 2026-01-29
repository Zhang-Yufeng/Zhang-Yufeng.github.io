<<<<<<< HEAD
$(document).ready(function () {
  // Init Masonry
  var $grid = $(".grid").masonry({
    gutter: 10,
    horizontalOrder: true,
    itemSelector: ".grid-item",
  });
  // Layout Masonry after each image loads
  $grid.imagesLoaded().progress(function () {
    $grid.masonry("layout");
  });
});
=======
$(document).ready(function(){var r=$(".grid").masonry({gutter:10,horizontalOrder:!0,itemSelector:".grid-item"});r.imagesLoaded().progress(function(){r.masonry("layout")})});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
