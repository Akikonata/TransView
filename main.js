(function(){
  var _root = this; 
  var nav_bar = $("#nav-bar");
  var CRMModel = {};
  nav_bar.on("click","li",function(){
    var o = $(this);
    o.siblings().removeClass("active");
    o.addClass("active"); 
    nav_bar.siblings().remove();
    nav_bar.after($("#tpl-"+o.data("module")).html());
  });
  CRMModel.getSNAccounts = function(cb){
    $.getJSON(serverHost+"/social_network/valid_accounts/?network_id="+network_id+"&group_id="+group_id,
      {},
      cb(data));
  }
  
  _root.CRMModel = CRMModel;
})(window);