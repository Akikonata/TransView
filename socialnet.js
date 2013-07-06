(function(){
	var return_aclist = $("#return-aclist");
	var account_list = $("#account-list"); 
	var account_pane = $("#account-pane");
	var weibo_pane = $("#weibo-pane");
	var weibo_list = weibo_pane.find(".weibo-list");
	var timeline_select = $("#timeline-select");
	var startTime = 946656000;
	var endTime = Math.round(Date.parse(new Date())/1000);
  var d_conf = {network_id:network_id,group_id:group_id,start_time:startTime,end_time:endTime,page:1,per_page:20}; 
  var timeline = null;
  var permission_tpl = $($("#tpl-permission").html());
  var permission = {
    monitor:permission_tpl.find(".monitor").text()==="true"?true:false,
    comment:permission_tpl.find(".comment").text()==="true"?true:false,
    repost:permission_tpl.find(".repost").text()==="true"?true:false, 
    assign:permission_tpl.find(".assign").text()==="true"?true:false,
  };
	CRMModel.getSNAccounts(function(data){
		console.log(data);
		data.forEach(function(o){
			var _tmp = "<li class='btn account' data-id='" + o._id + "' data-platform='"+o.platform+"'>"+
                      "<img class='avatar' src ='" + o.profile_image_url + "'/>"+
                      "<span>" + o.screen_name + "</span>"+
                      "<img src='icon40_" + o.platform + ".png' class='platform-icon'/>"+
                   "</li>";
            account_list.append($(_tmp));
		});
	});
	var get_weibo = function(clear){
		CRMModel.getSNWeiboList(timeline,d_conf,function(data){
				if(clear)weibo_list.empty();
				else{weibo_list.find(".loadmore").remove();}
        console.log(data);
        var is_comment = (timeline.indexOf("comments") > -1),
            is_accounts_statuses = (timeline.indexOf("accounts_statuses")>-1),
            is_comments_by_me = (timeline.indexOf("comments_by_me") > -1),
            is_mention_statuses =(timeline.indexOf("mention_statuses") > -1);
        var statuses = data.statuses;

        statuses.forEach(function(o){
          var user_link = CRM_Status.get_user_link(o.platform,o.user.uid);
          var retweet_user_link = CRM_Status.get_user_link(o.platform,o.retweet.uid);
          var s_link = CRM_Status.get_status_link(o.platform,o.user.uid,o._id);
          var retweet_s_link = CRM_Status.get_status_link(o.platform,o.retweet.uid,o.retweet.id);
          //渲染单条微博
          var _tmp = CRM_Status.tmp(
            {
              id:o._id,
              is_comment: is_comment,
              u_id : o.user.uid,
              u_link : user_link,
              u_avatar : o.user.uimg,
              u_name: o.user.name,
              u_verify: o.user.isV?o.user.verified_type:-1,
              s_text: o.text,
              s_pic: o.pic,
              s_link: s_link,
              c_date: o.cdate,
              s_source:o.source,
              platform: o.platform,
              action_source:"account",
              data_type : d_conf.request,
              action_send_id : d_conf.account_id,
              is_deal:o.is_deal,
              pan:null,
              logs:o.logs,
              func_config:{
                monitor:null,
                flash:o.flash,
                eyeball:o.eyeball,
                comment:is_comments_by_me?
                        null:{
                          count:o.ccount,
                          func:permission.comment&&!o.is_deal
                        },
                repost:is_comment?
                        null:{
                          count:o.rcount,
                          func:permission.repost&&!o.is_deal
                        },
                assign:null
              },
              repost_block:o.retweet.id?
                          {
                            id:o.retweet.id,
                            u_name:o.retweet.s_name,
                            u_link:retweet_user_link,
                            s_text:o.retweet.text,
                            s_pic:o.retweet.pic,
                            s_link:retweet_s_link,
                            c_date:o.retweet.date,
                            s_source:o.retweet.source
                          }:null,
            }
          );
          weibo_list.append(_tmp);
        });
				weibo_list.append("<div class='S-interact loadmore'><a href='javascript:void(0)'>加载更多</a></div>")
        $("a[data-toggle='tooltip']").tooltip();
      });
	}  
	//时间线选择器变化时候获取相应微博
	timeline_select.on("change",this,function(){
		var o = $(this);  
		timeline = o.val();
		get_weibo(true);
	});
	//触发获取微博的事件
	account_list.on("click",".btn",function(){
		var o = $(this);
		d_conf.account_id = o.data("id");
		d_conf.platform = o.data("platform");
		o.siblings().removeClass("active");
		o.addClass("active");
		account_pane.slideUp();
		weibo_pane.slideDown();
		timeline_select.trigger("change");
	}); 
	return_aclist.on("click",this,function(){
		account_pane.slideDown();
		weibo_pane.slideUp(function(){
			account_list.find(".active").removeClass("active");
		});
	});
	weibo_list.on("click",".loadmore",function(){
		d_conf.page++;
		get_weibo();
	});
})();