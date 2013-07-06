(function(){
  var _root = this; 
  var bottom_bar = $(".bottom-bar");
  var CRM_Status = {};
  CRM_Status.tmp = _.template($("#Tmp-status").html().replace(/[\f\n\r\t\v]/g,""));
  CRM_Status.get_user_link = function(platform,u_id){
          var url = null;
          switch(platform){
            case "sina": url = "http://weibo.com/u/" + u_id; break;
            case "tencent":url = "http://t.qq.com/"+ u_id; break;
            default: break;
          }
          return url;
        }
  CRM_Status.get_status_link = function(platform,u_id,s_id){
          var url = null;
          switch(platform){
            case "sina": url = "http://api.t.sina.com.cn/" + u_id + "/statuses/" + s_id; break;
            case "tencent": url = "http://t.qq.com/p/t/" + s_id; break;
            default: break;
          }
          return url;
        }
  CRM_Status.verify_map = {
      0:"approve",// 0-名人；
      1:"approveco",// 1-政府;
      2:"approveco",// 2-企业；
      3:"approveco",// 3-媒体；
      4:"approveco",// 4-校园；
      5:"approveco",// 5-网站；
      6:"approveco",// 6-应用；
      7:"approveco",// 7-团体（机构）；
      8:"none",// 8-待审企业；
      10:"vlady",// 10-微女郎 
      200:"club",// 200-初级达人；
      220:"club",// 220-通过审核的达人；
      400:"approve" // 400-已故V用户
    };
  CRM_Status.verify_map[-1]="none";// -1:普通用户
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
  $("body").ajaxStart(function(){
    $("#page_mask").modal({
      backdrop:"static",
      keyboard:false,
      show:true
    });
  });
  $("body").ajaxStop(function(){
    $("#page_mask").modal("hide");
  });
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
  this.CRM_Status = CRM_Status;
})(window);