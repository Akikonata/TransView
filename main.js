(function(){
  var nav_bar = $("#nav-bar");
  nav_bar.on("click","li",function(){
    var o = $(this);
    o.siblings().removeClass("active");
    o.addClass("active"); 
  });    
})();