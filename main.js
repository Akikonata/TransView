(function(){
  var nav_bar = $("#nav-bar");
  nav_bar.on("click","li",function(){
    var o = $(this);
    o.siblings().removeClass("active");
    o.addClass("active"); 
  });  

  $("body").on("touchmove",this,function(){
    e.stopPropagation();
    e.preventDefault();
  }); 
})();