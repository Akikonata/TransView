(function(){
  var _root = this; 
  var nav_bar = $("#nav-bar");
  var CRMModel = {};
  CRMModel.getSNAccounts = function(cb){
    $.getJSON(serverHost+"/social_network/valid_accounts/?network_id="+network_id+"&group_id="+group_id,
      {},
      cb(data));
  }
  
  _root.CRMModel = CRMModel;
})(window);