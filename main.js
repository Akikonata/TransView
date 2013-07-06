(function(){
  var _root = this; 
  var bottom_bar = $(".bottom-bar");

  var sn_timeline_urls = {
    home_statuses:"/home_timeline/statuses/conditions/",
    mention_statuses:"/mentions_in_statuses/conditions/",
    mentions_in_comments:"/mentions_in_comments/conditions/",
    comments_to_me:"/comments_to_me/conditions/",
    accounts_statuses:"/account/statuses/conditions/",
    comments_by_me:"/comments_by_me/conditions/"
  };

  bottom_bar.on("click","li",function(){
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
  CRMModel.getSNWeiboList = function(timeline,config,cb){
    $.getJSON(serverHost+sn_timeline_urls[timeline],
      config,
      cb);
  }
  _root.CRMModel = CRMModel;
})(window);