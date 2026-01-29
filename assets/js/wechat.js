<<<<<<< HEAD
var wechatModal = document.getElementById("WeChatMod");
var wechatBtn = document.querySelectorAll('[id="WeChatBtn"]');

for (var i = 0; i < wechatBtn.length; i++) {
  wechatBtn[i].onclick = function () {
    wechatModal.style.display = "block";
  };
}

window.onclick = function (event) {
  if (event.target == wechatModal) {
    wechatModal.style.display = "none";
  }
};
=======
for(var wechatModal=document.getElementById("WeChatMod"),wechatBtn=document.querySelectorAll('[id="WeChatBtn"]'),i=0;i<wechatBtn.length;i++)wechatBtn[i].onclick=function(){wechatModal.style.display="block"};window.onclick=function(t){t.target==wechatModal&&(wechatModal.style.display="none")};
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
