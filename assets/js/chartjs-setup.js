<<<<<<< HEAD
$(document).ready(function () {
  var $canvas = null,
    $this = null,
    _ctx = null,
    _text = "";
  $(".language-chartjs").each(function () {
    $this = $(this);
    $canvas = $("<canvas></canvas>");
    _text = $this.text();
    $this.text("").append($canvas);
    _ctx = $canvas.get(0).getContext("2d");
    _ctx && _text && new Chart(_ctx, JSON.parse(_text)) && $this.attr("data-processed", true);
  });
});
=======
$(document).ready(function(){var t=null,a=null,e=null,n="";$(".language-chartjs").each(function(){a=$(this),t=$("<canvas></canvas>"),n=a.text(),a.text("").append(t),(e=t.get(0).getContext("2d"))&&n&&new Chart(e,JSON.parse(n))&&a.attr("data-processed",!0)})});
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
