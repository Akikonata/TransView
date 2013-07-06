(function(){
  var _root = this; 
  var nav_bar = $("#nav-bar");
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