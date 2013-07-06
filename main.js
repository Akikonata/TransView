(function(eve){
  var _root = this; 
  var nav_bar = $("#nav-bar");
  var CRMModel={};
  nav_bar.on("click","li",function(){
    var o = $(this);
    o.siblings().removeClass("active");
    o.addClass("active"); 
    nav_bar.siblings.remove();
  });
  CRMModel.getAccounts = function(cb){
    $.getJSON("",
      {},
      cb(data));
  }
  
  _root.CRMModel = CRMModel;
})(window);