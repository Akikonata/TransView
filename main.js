(function(){
  var _root = this; 
  var nav_bar = $(".bottom-bar");
  nav_bar.on("click","li",function(){
    var o = $(this);
    o.siblings().removeClass("active");
    o.addClass("active");
  });
  var CRMModel = {};
  CRMModel.getSNAccounts = function(cb){
    $.getJSON(serverHost+"/social_network/account_settings/get/",
      {user_id:openname,group_id:group_id},
      cb);
  }
  CRMModel.getSNWeiboList = function(config,cb){
    $.getJSON(serverHost+"",
      config,
      cb);
  }
  _root.CRMModel = CRMModel;
})(window);