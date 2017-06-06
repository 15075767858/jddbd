

//拍卖状态
var auctionStatus;
//拍卖编号
var paimaiId;
//SKU 
var sku;
//剩余时间
var remainTime;
//查询起始
var queryStart=0;
//查询结束
var queryEnd=9;
//倒计时开关
var countDown=0;
//封顶价
var maxPrice=0;
//当前价
var currentPrice=1;
//起拍价
var startPrice=1;
//最低加价幅度
var priceLowerOffset=1;
//最高加价幅度
var priceHigherOffset=1000;
//推荐列表
var recommendIdList="";

/**
 * 正在拍卖：点+
 * */
if(!String.prototype.trim) {
     String.prototype.trim = function () {
         return this.replace(/^\s+|\s+$/g,'');
    };
}
function incre(){
	var userprice = $("#bidPrice").val();
	var price = Number(jQuery.trim(userprice));
	var limitPrice = !isNaN(maxPrice) && maxPrice >= 1;

	if(limitPrice){
		if(price+1>maxPrice){
			$("#bidPrice").val(maxPrice);
			return ;
		}
	}
	if(price+1<currentPrice+priceLowerOffset){
		$("#bidPrice").val(currentPrice+priceLowerOffset);
	}
	else if(price+1>=currentPrice+priceLowerOffset && price+1<=currentPrice+priceHigherOffset){
		$("#bidPrice").val(price+1);
	}
	else{
		$("#bidPrice").val(currentPrice+priceLowerOffset);
	}
}


/**
 * 正在拍卖：点-
 * */
function decre(){
	var userprice = $("#bidPrice").val();
	var price = Number(jQuery.trim(userprice));
	var limitPrice = !isNaN(maxPrice) && maxPrice >= 1;
	if(limitPrice){
		if(price-1>maxPrice){
			$("#bidPrice").val(maxPrice);
			return ;
		}
	}
	if(price-1<currentPrice+priceLowerOffset){
		$("#bidPrice").val(currentPrice+priceLowerOffset);
	}
	else if(price-1>=currentPrice+priceLowerOffset && price-1<=currentPrice+priceHigherOffset){
		$("#bidPrice").val(price-1);
	}
	else{
		$("#bidPrice").val(currentPrice+priceLowerOffset);
	}
}



/**
 * 出价
 * */
function bid(){
	var userprice = $("#bidPrice").val();
	var price = Number(jQuery.trim(userprice));
	if(checkPrice(price)){
		var url = "/services/bid.action?t=" + getRamdomNumber();
	    var data = {paimaiId:paimaiId,price:price,proxyFlag:0,bidSource:0};
	    jQuery.getJSON(url,data,function(jqXHR){
            
			if(jqXHR!=undefined){
				if(jqXHR.result=='200'){
					dialogSuccess("恭喜您，出价成功<br/><font style='color: red;font-size: 12px'>温馨提示：该商品已加入[我的收藏]，请密切关注竞拍信息，获拍后请在1小时内转订单、24小时内付款，否则您的账号将被扣除2000个京豆</font></p>",5,"秒钟后窗口将会自动关闭","width:350px");
				}else if(jqXHR.result=='login'){
					window.location.href='//passport.jd.com/new/login.aspx?ReturnUrl='+window.location.href;
				}else if(jqXHR.result=='600'){
					dialogError("很抱歉，出价失败",5,"当日已流拍两次，不能继续出价");
				}else if(jqXHR.result=='573'){
					dialogError("啊哦，出价失败",5,"欢迎再次参与~");
				}else{
					dialogError("很抱歉，出价失败",5,jqXHR.message);
				}
				
				pageCurrentReload();
			}
	    });
	}else{
		//验证失败,给一个默认值
		$("#bidPrice").val(Number(Number(currentPrice)+Number(priceLowerOffset)));
	}
}

$(function(){
	//回车出价
	$("#bidPrice").keydown(function(event){
	    if(event.which == 13)       //13等于回车键(Enter)键值,ctrlKey 等于 Ctrl
	    {
		  bid();
	    }
	});
});


/**
 * 出价后页面重新异步加载
 * */
function pageCurrentReload(){
	queryStart=0;
	queryEnd=9;
	initCurrentData();
}
function jdThickBoxclose(){
	$(".tip-box warn-box").hide();
}

/**
 * 出价前价格校验
 * */
function checkPrice(price){
	if(!/^-?\d+$/.test(price)){
        dialogError("很抱歉，出价失败",5,"出价必须为正整数");
        return false;
    }
	if(maxPrice>0 && price>maxPrice){
		dialogError("很抱歉，出价失败",5,"出价不能超过本次竞拍封顶价（￥"+maxPrice+"）");
		return false;
	}
	if(price<=currentPrice){
		dialogError("很抱歉，出价失败",5,"出价不能低于当前价（￥"+currentPrice+"）");
		return false;
	}
	if(price<currentPrice+priceLowerOffset){
		dialogError("很抱歉，出价失败",5,"加价幅度不能低于最低加价幅度（￥"+priceLowerOffset+"）");
		return false;
	}
	if(price>currentPrice+priceHigherOffset){
		dialogError("很抱歉，出价失败",5,"加价幅度不能高于最高加价幅度（￥"+priceHigherOffset+"）");
		return false;
	}
	return true;
}
function doErrorMsg(text1,text2){
	alert(text1+","+text2);
}
function loadBidList(){
	queryEnd=Number(queryEnd)+5;
	if(queryEnd>30){
		queryEnd=30;
	}
	initCurrentData();
}

setInterval(remainTimeCountDown,1000);

function remainTimeCountDown(){
	if(countDown==1 && remainTime>0) {
		remainTime = remainTime - 1000;
		if (remainTime<=0) {
			initCurrentData();
		}
		var timeText = timeBetweenText();
		$("#auction1Timer").html(timeText);
		$("#auction3Timer").html(timeText);
	}
}

function rightZeroStr(v) {
    if (v < 10) {
        return "0" + v;
    }
    return v + "";
}

function timeBetweenText(){
	var dayOfMil = (24 * 60 * 60 * 1000);
    var hourOfMil = 60 * 60 * 1000;
    var minOfMil = 60 * 1000;
    var secOfMil = 1000;
    
    var hourOffset = remainTime % dayOfMil;
    var minuteOffset = hourOffset % hourOfMil;
    var seccondOffset = minuteOffset % minOfMil;
    
    var hours = Math.floor(remainTime / hourOfMil);
    var minutes = Math.floor(minuteOffset / minOfMil);
    var seconds = Math.floor(seccondOffset / secOfMil);

    if(hours>0){
    	return "<em class=\"hour\">"+rightZeroStr(hours)+"</em>时<em class=\"hour\">"+rightZeroStr(minutes)+"</em>分<em class=\"hour\">"+rightZeroStr(seconds)+"</em>秒";
    }else if(minutes>0){
    	return "<em class=\"hour\">"+rightZeroStr(minutes)+"</em>分<em class=\"hour\">"+rightZeroStr(seconds)+"</em>秒";
    }else if (seconds>0) {
		return "<em class=\"hour\">"+rightZeroStr(seconds)+"</em>秒";
	}else{
		return "<em class=\"hour\">0</em>秒";
	}
    
}


Date.prototype.format = function(format){ 
	var o = { 
	"M+" : this.getMonth()+1, //month 
	"d+" : this.getDate(), //day 
	"h+" : this.getHours(), //hour 
	"m+" : this.getMinutes(), //minute 
	"s+" : this.getSeconds(), //second 
	"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
	"S" : this.getMilliseconds() //millisecond 
	}
}
function loadJdPrice(){
	
	var showJdPrice = $("#showJdPrice").val();
	if(Number(showJdPrice)<1){
		return ;
	}
	
	var url="/json/current/queryJdPrice?sku="+sku+"&paimaiId="+paimaiId;
	jQuery.getJSON(url,function (response) {
		var jdPrice = response.jdPrice;
		var access = response.access;
		if (jdPrice>1) {
			var jdPriceInfo = "<em class=\"line\"></em>封顶价：&yen;"+jdPrice;
			$("#auction1dangqianjia").after(jdPriceInfo);
			$("#auction2dangqianjia").after(jdPriceInfo);
			$("#auction3dangqianjia").after(jdPriceInfo);
		}
		if (access>0) {
			var accessInfo = "围观数：<span class=\"color33 font14\">"+access+"次</span>";
			$("#auction1weiguan").html(accessInfo);
			$("#auction2weiguan").html(accessInfo);
			$("#auction3weiguan").html(accessInfo);
		}
	});
}

function loadCurrentPriceList(){
	var url = "/json/current/queryList.action?paimaiIds="+recommendIdList;
	jQuery.getJSON(url,function (response) {
		$(response).each(function(key,value){
			try{
				var id=value.paimaiId;
				var price=value.currentPriceStr;
				$("#sameSku_price_"+id).html("<i>¥</i>"+price);
				$("#recomm_price_"+id).html("<i>¥</i>"+price);
				$("#recomm_narrow_price_"+id).html("<i>¥</i>"+price);
			}catch(error){
				console.log(error);
			}
		});
	});
}

function loadPaimaiBigField(){
	
	var showIntro = $("#showIntro").val();
	if(Number(showIntro)<1){
		return ;
	}
	
	var cateId = $("#firstCateId").val();
	var url = "/json/paimaiProduct/queryPaimaiBigField?id="+sku+"&cateId="+cateId;
	jQuery.getJSON(url,function (response) {
		var intro = response.model.productIntroduction;
		var speci = response.model.productSpecification;
		
		$("#productIntroduction").html(intro);
		$("#productSpecifacation").html(speci);
		
		var effectNum = 0;
		var sameSkuInfo = "";
		$(response.model.sameSku).each(function(key,value){
			var id = value.paimaiId;
			var productImage = value.productImage;
			var waiguan = value.appearance;
			var baozhuang = value.packaging;
			var useStatus = value.useStatus;
			var auctionType = value.auctionType;
			if(id!=paimaiId){
				effectNum++;
				if(auctionType==-1){
					var info ="<a href=\"//dbditem.jd.com/"+id+"-1\" target=\"_blank\"><div class=\"same_item clearfix\"><span class=\"price fr\"><i>¥</i>"+value.onePrice+"</span><span class=\"useIcon ui"+useStatus+"\"></span><p>"+baozhuang+"，"+waiguan+"</p></div></a>";
				}else{
					var info ="<a href=\"//dbditem.jd.com/"+id+"-1\" target=\"_blank\"><div class=\"same_item clearfix\"><span class=\"price fr\" id='sameSku_price_"+id+"'><i></i></span><span class=\"useIcon ui"+useStatus+"\"></span><p>"+baozhuang+"，"+waiguan+"</p></div></a>";
					if(recommendIdList==null ||recommendIdList==""||recommendIdList===undefined){
						recommendIdList += id;
					}else{
						recommendIdList += "-"+id;
					}
				}
				sameSkuInfo += info;
			}
			
		});
		if(effectNum>0){
			//$("#sameSku").html(sameSkuInfo);
			//$("#sameSkuList").attr("class","details_column wide column_padding");
		}
		
		effectNum = 0;
		var recommendInfo = "";
		var recommendInfoNarrow = "";
		$(response.model.recomList).each(function(key,value){
			var id = value.paimaiId;
			var productImage = value.productImage;
			var useStatus = value.useStatus;
			var title = value.title;
			var auctionType = value.auctionType;
			var infoNarrow = "";
			var info = "";
			if(id!=paimaiId){
				effectNum++;
				if(auctionType==-1){
					infoNarrow="<li><a href=\"//dbditem.jd.com/"+id+"-2\" target=\"_blank\" class=\"pic\"><img width=\"100\" height=\"100\" class=\"err-product\" src=\"//img10.360buyimg.com/n2/"+productImage+"\" data-lazyload=\"//img10.360buyimg.com/n2/"+productImage+"\"/></a><a href=\"//dbditem.jd.com/"+id+"-2\" target=\"_blank\" class=\"name\">"+title+"</a><span class=\"price\"><i>￥</i>"+value.onePrice+"</span><span class=\"useIcon ui"+useStatus+"\"></span></li>";
					info="<li><a href=\"//dbditem.jd.com/"+id+"-2\" target=\"_blank\" class=\"pic\"><img width=\"100\" height=\"100\" class=\"err-product\" src=\"//img10.360buyimg.com/n2/"+productImage+"\" data-lazyload=\"//img10.360buyimg.com/n2/"+productImage+"\"/></a><a href=\"//dbditem.jd.com/"+id+"-2\" target=\"_blank\" class=\"name\">"+title+"</a><span class=\"price\"><i>￥</i>"+value.onePrice+"</span><span class=\"useIcon ui"+useStatus+"\"></span></li>";
				}else{
					infoNarrow="<li><a href=\"//dbditem.jd.com/"+id+"-2\" target=\"_blank\" class=\"pic\"><img width=\"100\" height=\"100\" class=\"err-product\" src=\"//img10.360buyimg.com/n2/"+productImage+"\" data-lazyload=\"//img10.360buyimg.com/n2/"+productImage+"\"/></a><a href=\"//dbditem.jd.com/"+id+"-2\" target=\"_blank\" class=\"name\">"+title+"</a><span class=\"price\" id=\"recomm_narrow_price_"+id+"\"><i></i></span><span class=\"useIcon ui"+useStatus+"\"></span></li>";
					info="<li><a href=\"//dbditem.jd.com/"+id+"-2\" target=\"_blank\" class=\"pic\"><img width=\"100\" height=\"100\" class=\"err-product\" src=\"//img10.360buyimg.com/n2/"+productImage+"\" data-lazyload=\"//img10.360buyimg.com/n2/"+productImage+"\"/></a><a href=\"//dbditem.jd.com/"+id+"-2\" target=\"_blank\" class=\"name\">"+title+"</a><span class=\"price\" id=\"recomm_price_"+id+"\"><i></i></span><span class=\"useIcon ui"+useStatus+"\"></span></li>";
					if(recommendIdList==null ||recommendIdList==""||recommendIdList===undefined){
						recommendIdList += id;
					}else{
						recommendIdList += "-"+id;
					}
				}
				recommendInfo += info;
				recommendInfoNarrow += infoNarrow;
			}
		});
		
		if(effectNum>0){
			$("#recommendUL").html(recommendInfo);
			$("#recommendList").attr("class","details_column wide");
			$("#recommendULNarrow").html(recommendInfoNarrow);
			$("#recommendListNarrow").attr("class","details_column narrow");
		}
		
		if(recommendIdList!=""){
			loadCurrentPriceList();
		}
		
	});
}

$(function(){
	paimaiId = $("#paimaiId").val();
	sku = $("#productId").val();
	initCurrentData();
	if(sku>0){
		loadPaimaiBigField();
		loadJdPrice();
	}else{
		console.log("sku异常，不会获取大字段数据");
	}
});
function getRamdomNumber(){
	var num=""; 
	for(var i=0;i<6;i++) 
	{ 
		num+=Math.floor(Math.random()*10); 
	} 
	return num;
}

function initCurrentData1(){
    var paimaiId=$("#paimaiId").val();
    var url = "//bid.jd.com/json/current/englishquery?paimaiId="+paimaiId+"&skuId=0&t="+getRamdomNumber()+"&start="+queryStart+"&end="+queryEnd;
    $.ajax({
        url: url, dataType:"jsonp",
        success:function(response){
            console.log(arguments)
        }
    });
}
function responseInstall(response){
	auctionStatus = response.auctionStatus;
	remainTime = response.remainTime;
	currentPrice = Number(response.currentPrice);
	priceLowerOffset = Number($("#lowPriceOffSet").val().trim());
	priceHigherOffset = Number($("#highPriceOffSet").val().trim());
	
	if (auctionStatus==0) {
		$("#auctionStatus1").attr("class","auction3 hide");
		$("#auctionStatus2").attr("class","auction2 hide");
		$("#auctionStatus0").attr("class","auction1");
	}
	
	if ((auctionStatus==0&&remainTime<0 || auctionStatus==1 && remainTime>0)) {
		$("#auctionStatus2").attr("class","auction2 hide");
		$("#auctionStatus0").attr("class","auction1 hide");
		$("#auctionStatus1").attr("class","auction3");
	}
	
	if ((auctionStatus==2)||(auctionStatus==1 && remainTime<0) ||(auctionStatus==4)) {
		$("#auctionStatus2").attr("class","auction2");
		$("#auctionStatus0").attr("class","auction1 hide");
		$("#auctionStatus1").attr("class","auction3 hide");
//		if(response.currentUser!=null && $("#userinfo").val()!=null && $("#userinfo").val()!="" && $("#userinfo").val()==response.currentUser){
//			//dialogJump("恭喜，成功获拍！",5,"秒钟后将自动跳转结算页...","//pm.jd.com/pm/"+paimaiId);
//			dialogJump("恭喜，成功获拍！",5,"秒钟后将自动跳转结算页...</br> 请在1小时内转订单，否则自动取消获拍资格，并扣除本次参拍的保证金或京豆","//pm.jd.com/pm/"+paimaiId);
//		}
		if(response.orderStatus==1){
//			//dialogJump("恭喜，成功获拍！",5,"秒钟后将自动跳转结算页...","//pm.jd.com/pm/"+paimaiId);
			dialogJump("恭喜，成功获拍！",5,"秒钟后将自动跳转结算页...</br> 请在1小时内转订单，否则自动取消获拍资格，并扣除本次参拍的保证金或京豆","//dbpm.jd.com/pm/"+paimaiId);
		}
	}
	
	var currentPriceInfo = "<em class=\"font12\">&yen;</em>"+response.currentPrice;
	$("#auction1dangqianjia").html(currentPriceInfo);
	$("#auction2dangqianjia").html(currentPriceInfo);
	$("#auction3dangqianjia").html(currentPriceInfo);
	currentPrice = Number(response.currentPrice);
	if(Number(response.bidCount)>0){
		$("#bidCount").html("出价记录（共<em class=\"num\">"+response.bidCount+"</em>次）");
		$("#bidCountNarrow").html("出价记录（共<em class=\"num\">"+response.bidCount+"</em>次）");
	}else{
		$("#bidCount").html("出价记录");
		$("#bidCountNarrow").html("出价记录");
	}
	var bidInfo = "";
	var bidInfoNarrow = "";
	$(response.bidList).each(function(key,value){
		var bidTime = value.bidTimeStr1;
		var pin = value.username;
		var price = value.priceStr;
		var status = "无效";
		if(key==0){
			status="领先";
			var bidRecord = "<dd class=\"clearfix\"><span class=\"wd1\">"+bidTime+"</span><span class=\"wd2\"><i class=\"phone\">"+pin+"</i><div class=\"line\"></div><i class=\"price\">￥"+price+"</i></span><span class=\"wd3\"><i>"+status+"</i></span></dd>";
			var bidRecordNarrow = "<dd><span class=\"sp1\">"+(key+1)+"</span><span class=\"sp2\">"+bidTime+"</span><span class=\"sp3\">"+pin+"</span><span class=\"sp4\"><b>&yen;</b>"+price+"</span><span class=\"sp5\"><i>领先</i></span></dd>";
			bidInfo += bidRecord;
			bidInfoNarrow += bidRecordNarrow;
		}else{
			status="出局";
			var bidRecord = "<dd class=\"clearfix\"><span class=\"wd1\">"+bidTime+"</span><span class=\"wd2\"><i class=\"phone\">"+pin+"</i><div class=\"line\"></div><i class=\"price\">￥"+price+"</i></span><span class=\"wd3 out\"><i>"+status+"</i></span></dd>";
			var bidRecordNarrow = "<dd><span class=\"sp1\">"+(key+1)+"</span><span class=\"sp2\">"+bidTime+"</span><span class=\"sp3\">"+pin+"</span><span class=\"sp4\"><b>&yen;</b>"+price+"</span><span class=\"sp5 out\"><i>出局</i></span></dd>";
			bidInfo += bidRecord;
			bidInfoNarrow += bidRecordNarrow;
		}
		
	});
	$(".records dl dt").nextAll().remove();
	$(".records dl dt").after(bidInfo);
	$("#records-narrow dl dt").nextAll().remove();
	$("#records-narrow dl dt").after(bidInfoNarrow);
}


//PC喊价页面修改
var pcBidModify = {
	paimaiIds:[],
	//同类推荐模板
	_similarItems : '<li class={{similarItemId}}>\
		<a href="//dbditem.jd.com/{{similarItemId}}" target="_blank">\
		<div class="cate_recommend_items">\
		<div class="cate_recommend_img">\
		<img src="{{similarItemProductImage}}">\
		</div>\
		<div class="cate_recommend_name">{{similarItemName}}</div>\
	<div class="cate_recommend_price">\
		<span class="price_span">当前价：<em class="cur_price">￥<span></span></em></span>\
	<span class="bidCount">出价：<em></em>次</span>\
	</div>\
	<div class="cate_recommend_countdown">\
		<span>时间剩余：</span>\
	<span class="countdown_time" id="{{similarTimeId}}"></span>\
	</div>\
	</div>\
	</a>\
	</li>',

	//热品推荐模板
	_hotItems : '<li class="hot_auction_main_li {{hotItemId}}" onmouseover="hotSwitchCur(this)">\
	<a href="//dbditem.jd.com/{{hotItemId}}" target="_blank">\
		<div class="hot_auction_info">\
		<div class="hot_auction_img">\
		<img src="{{hotItemsImg}}">\
		</div>\
		<div class="hot_auction_countdown">\
		<span>剩余时间：</span>\
	<span id="{{hotTimeId}}"></span>\
	</div>\
	<div class="hot_auction_item_name">\
		<span>{{hotItemsName}}</span>\
	</div>\
	<div class="hot_auction_price">\
		<div class="hot_auction_price_div">\
		<span>当前价:</span>\
	<span class="cur_price">￥<span></span></span>\
	</div>\
	<div class="hot_auction_times_div">\
		<span>出价:</span>\
	<span class="bidCount"><em></em>次</span>\
	</div>\
	</div>\
	</div>\
	</a>\
	</li>',


	//同款待拍模板
	waitBidHtml : '<li paimaiId="{{waitBidPaimaiId}}">\
		<div class="sameSkuListInfo">\
		<p class="sameSkuListInfo_p1">\
		<span class="use_status {{statusClass}}">{{waitBidUseStatus}}</span>\
		<span class="sameSku_item_status" title="{{waitBidFeature}}">{{waitBidFeature}}</span>\
	</p>\
	<p class="sameSkuListInfo_p2">\
		<span class="sameSkuCountDown">\
		<span>距离开拍：</span>\
	<span id="{{waitBidTimeId}}"></span>\
	</span>\
	<input type="hidden" value={{end_waitBidTimeId}} id="{{end_waitBidTimeId}}">\
	<a class="sameSkuCollect">\
		<span class="sameSkuCollect_icon"></span>\
		收藏\
		</a>\
		</p>\
		</div>\
		</li>',

	//出价记录
	bidListHtml : '<li>\
		<div class="records_infos">\
		<div class="records_status {{bidStatusClass}}">{{bidStatusTxt}}</div>\
		<div class="records_user">\
		<p>{{bidName}}</p>\
		<p>￥<span>{{bidPrice}}</span></p>\
	</div>\
	<div class="records_time">\
		<p>{{bidTime1}}</p>\
		<p>{{bidTime2}}</p>\
	</div>\
	</div>\
	</li>',

	//出价记录More
	bidListMoreHtml : '<li class="bid_list_info">\
		<span class="bid_status {{bidListMoreClass}}">{{bidListMoreStatusTxt}}</span>\
		<span class="bid_name">\
		<span class="bid_name_span1">{{bidListMoreName}}</span>\
		<span class="bid_name_span2">￥<span>{{bidListMorePrice}}</span></span>\
	</span>\
	<span class="bid_time">{{bidListMoreTime}}</span>\
	</li>',

	//调取接口拉取热门推荐数据
	geRecommandList : function (){
		$.ajax({
			url: "//dbd.jd.com/json/recommandList?page=5&limit=5&sortField=2&auctionType=1&paimaiStatus=1",
			type: "get",
			contentType : "application/json",
			jsonpCallback : "geRecommandListCallBack",
			dataType: "jsonp",
			success: function(res){
				if(res!="" && res!=null && res!=undefined){
					pcBidModify.replaceHotItemInfoHtml(res);
				}
			},
			error: function(res){}
		});
	},

	//调取接口拉取同类推荐数据
	getSimilarItemList : function (){
		var cateId = $("#secondCateId").val();
		$.ajax({
			url: "//dbd.jd.com/json/recommandList?page=1&limit=4&sortField=2&auctionType=1&paimaiStatus=1&productCateId="+cateId,
			type: "get",
			contentType : "application/json",
			jsonpCallback : "getSimilarItemListCallBack",
			dataType: "jsonp",
			success: function(res){
				if(res!="" && res!=null && res!=undefined){
					pcBidModify.replaceSimilarItemInfoHtml(res);
				}
			},
			error: function(res){}
		});
	},

	//调取接口拉取同款待拍数据
	getWaitBidList : function (){
		var productId = $("#productId").val();
		// productId = 3322629;//测试
		$.ajax({
			url: "//dbd.jd.com/json/recommandList?productId="+productId+"&page=1&limit=3&auctionType=1&paimaiStatus=0&sortField=0",
			type: "get",
			contentType : "application/json",
			jsonpCallback : "getWaitBidListCallBack",
			dataType: "jsonp",
			success: function(res){
				if(res!="" && res!=null && res!=undefined){
					pcBidModify.replaceWaitBidHtml(res);
				}
			},
			error: function(res){}
		});
	},

	//替换同类推荐模板
	replaceSimilarItemInfoHtml : function (res){
		var list = res.recommandList;
		if(list=="" || list==null || list==undefined){
			return false;
		}
		var html = '';
		var listLen = list.length;
		listLen=listLen>4?4:listLen;
		if (listLen > 0) {
			var str='{#hour#}:{#min#}:{#sec#}';
			var currentTimeLocal = parseInt(Date.parse(new Date())/1000);
			var currentTime = parseInt(res.currentTime/1000);
			window._diffTime = currentTime -currentTimeLocal;
			for (var i = 0; i < listLen; i++) {
				var paimaiId = list[i].id;
				pcBidModify.paimaiIds.push(paimaiId);
				var endTime=parseInt(list[i].endTime/1000);
				var timeId="similarCountTime_"+i;
				var forHtml = pcBidModify._similarItems;
				forHtml = forHtml.replace(new RegExp("\{{similarTimeId}}", "g"), timeId);
				forHtml = forHtml.replace(new RegExp("\{{similarItemName}}", "g"), list[i].title);
				var productImage = "//img14.360buyimg.com/n7/" + list[i].productImage;
				forHtml = forHtml.replace(new RegExp("\{{similarItemProductImage}}", "g"), productImage);
				forHtml = forHtml.replace(new RegExp("\{{similarItemId}}", "g"), paimaiId);
				html += forHtml;
				new Timer(endTime, timeId, str,currentTime,function(){});
			}
		}
		$("#cate_recommend ul").html(html);
	},

	//替换热品推荐模板
	replaceHotItemInfoHtml : function(res){
		var list = res.recommandList;
		if(list=="" || list==null || list==undefined){
			return false;
		}
		var html = '';
		var listLen = list.length;
		if (listLen > 0) {
			var str='{#hour#}:{#min#}:{#sec#}';
			var currentTimeLocal = parseInt(Date.parse(new Date())/1000);
			var currentTime = parseInt(res.currentTime/1000);
			window._diffTime = currentTime -currentTimeLocal;
			for (var i = 0; i < listLen; i++) {
				var paimaiId = list[i].id;
				pcBidModify.paimaiIds.push(paimaiId);
				var endTime=parseInt(list[i].endTime/1000);
				var timeId="hotCountTime_"+i;
				var forHtml = pcBidModify._hotItems;
				forHtml = forHtml.replace(new RegExp("\{{hotTimeId}}", "g"), timeId);
				forHtml = forHtml.replace(new RegExp("\{{hotItemsName}}", "g"), list[i].title);
				var productImage = "//img14.360buyimg.com/n7/" + list[i].productImage;
				forHtml = forHtml.replace(new RegExp("\{{hotItemsImg}}", "g"), productImage);
				forHtml = forHtml.replace(new RegExp("\{{hotItemId}}", "g"), paimaiId);
				html += forHtml;
				new Timer(endTime, timeId, str,currentTime,function(){});
			}
		}
		$("#hot_auction ul").html(html);
	},

	//实时价格及出价次数
	getNewPrice : function (){
		var curPaimaiId = $("#paimaiId").val();

		if(pcBidModify.paimaiIds.indexOf(curPaimaiId)<0){
			pcBidModify.paimaiIds.push(curPaimaiId);
		}

		var ids = pcBidModify.paimaiIds.join("-");
		$.ajax({
			url: "//dbditem.jd.com/services/currentList.action?paimaiIds="+ids+"&curPaimaiId=" + curPaimaiId,
			type: "get",
			contentType : "application/json",
			jsonpCallback : "jsonp_"+new Date().getTime(),
			dataType: "jsonp",
			success: function(data){
				for(var i=0;i<data.length;i++){
					var id = data[i].paimaiId;
					var currentPrice = data[i].currentPriceStr;
					var bidCount = data[i].bidCount;
					var accessNum = data[i].accessNum;
					if(id==curPaimaiId){
						var x = new Date().getTime();
						var curPrice = "<em class=\"font12\">&yen;</em>"+currentPrice;
						var accessInfo = "围观数：<span class=\"color33 font14\">"+accessNum+"次</span>";
						window.currentPrice = Number(currentPrice);
						$("#auction3dangqianjia").html(curPrice);
						$("#auction3weiguan").html(accessInfo);

						$("."+id).find(".cur_price span").html(currentPrice);
						$("."+id).find(".bidCount em").html(bidCount);
					}else{
						$("."+id).find(".cur_price span").html(currentPrice);
						$("."+id).find(".bidCount em").html(bidCount);
					}

				}
			},
			error: function(data){}
		});
	},

	//获取出价记录
	getBidList : function (){
		var paimaiId = $("#duobao_paimaiId").text();
		$.ajax({
			url: "//bid.jd.com/json/current/englishquery?skuId=0&start=0&end=9&paimaiId="+paimaiId,
			type: "get",
			contentType : "application/json",
			jsonpCallback : "jsonpCallBack_"+new Date().getTime(),
			dataType: "jsonp",
			success: function(res){
				var data = res.bidList;
				var bidCount = res.bidCount;
				$(".bid_counts,#bidCount .num").text(bidCount);
				pcBidModify.replaceBidListHtml(data);
				pcBidModify.replaceBidListMoreHtml(data);
			},
			error: function(res){}
		});
	},

	replaceBidListHtml : function (list){
		var html = '';
		var listLen = list.length;
		listLen= listLen>3?3:listLen;
		if (listLen > 0) {
			for (var i = 0; i < listLen; i++) {
				var forHtml = pcBidModify.bidListHtml;
				if(i==0){
					forHtml = forHtml.replace(new RegExp("\{{bidStatusTxt}}", "g"), "领先");
					forHtml = forHtml.replace(new RegExp("\{{bidStatusClass}}", "g"), "cur");
				}else{
					forHtml = forHtml.replace(new RegExp("\{{bidStatusTxt}}", "g"), "出局");
					forHtml = forHtml.replace(new RegExp("\{{bidStatusClass}}", "g"), "");
				}
				forHtml = forHtml.replace(new RegExp("\{{bidName}}", "g"), list[i].username);
				forHtml = forHtml.replace(new RegExp("\{{bidPrice}}", "g"), list[i].priceStr);
				var bidTime = list[i].bidTimeStr1;
				var bidTimeArr = bidTime.split("  ");
				var bidTime1 = bidTimeArr[0];
				var bidTime2 = bidTimeArr[1];
				forHtml = forHtml.replace(new RegExp("\{{bidTime1}}", "g"), bidTime1);
				forHtml = forHtml.replace(new RegExp("\{{bidTime2}}", "g"), bidTime2);
				html += forHtml;
			}
			$("#records-list ul").html(html);
			$("#records-list .no_records").hide();
			$("#records-list ul").show();
		}else{
			$("#records-list ul").html("");
			$("#records-list ul").hide();
			$("#records-list .no_records").show();
		}
	},

	//替换同款待拍模板
	replaceWaitBidHtml : function (res){
		var list = res.recommandList;
		if(list!="" && list!=null && list!=undefined){
			$("#sameSkuList ul").show();
			$(".no_sameSkuList").hide();
		}else{
			$("#sameSkuList ul").hide();
			$(".no_sameSkuList").show();
			return false;
		}
		var html = '';
		var listLen = list.length;
		listLen=listLen>3?3:listLen;
		if (listLen > 0) {
			var str='{#hour#}时{#min#}分{#sec#}秒';
			var currentTimeLocal = parseInt(Date.parse(new Date())/1000);
			var currentTime = parseInt(res.currentTime/1000);
			window._diffTime = currentTime -currentTimeLocal;
			for (var i = 0; i < listLen; i++) {
				var startTime=parseInt(list[i].startTime/1000);
				var endTime=parseInt(list[i].endTime/1000);
				var timeId="waitBidCountTime_"+i;
				var end_timeId="end_waitBidCountTime_"+i;
				var forHtml = pcBidModify.waitBidHtml;
				var useStatus = list[i].useStatus;
				var statusClass = "unused";
				var useStatusTxt = "未使用";
				if(useStatus==2){
					statusClass = "used";
					useStatusTxt = "使用过";
				}else if(useStatus==3){
					statusClass = "repaired";
					useStatusTxt = "维修过";
				}
				var packaging = list[i].packaging;
				var appearance = list[i].appearance
				var feature = "";
				if(packaging !="" && packaging!=null){
					if(appearance !="" && appearance!=null){
						feature = appearance+ "，" +packaging ;
					}else{
						feature = packaging ;
					}
				}else{
					if(appearance !="" && appearance!=null){
						feature = appearance ;
					}
				}

				forHtml = forHtml.replace(new RegExp("\{{waitBidPaimaiId}}", "g"), list[i].id);
				forHtml = forHtml.replace(new RegExp("\{{waitBidFeature}}", "g"), feature);
				forHtml = forHtml.replace(new RegExp("\{{statusClass}}", "g"), statusClass);
				forHtml = forHtml.replace(new RegExp("\{{waitBidUseStatus}}", "g"), useStatusTxt);
				forHtml = forHtml.replace(new RegExp("\{{waitBidTimeId}}", "g"), timeId);
				forHtml = forHtml.replace(new RegExp("\{{end_waitBidTimeId}}", "g"), end_timeId);
				html+=forHtml;
				new Timer(startTime, timeId, str,currentTime,function(){});
				new Timer(endTime, end_timeId, str,currentTime,function(){});
			}
			$("#sameSkuList ul").html(html);
		}
	},

	replaceBidListMoreHtml : function (list){
		var html = '';
		var listLen = list.length;
		listLen= listLen>40?40:listLen;
		if (listLen > 0) {
			for (var i = 0; i < listLen; i++) {
				var forHtml = pcBidModify.bidListMoreHtml;
				if(i==0){
					forHtml = forHtml.replace(new RegExp("\{{bidListMoreStatusTxt}}", "g"), "领先");
					forHtml = forHtml.replace(new RegExp("\{{bidListMoreClass}}", "g"), "lead");
				}else{
					forHtml = forHtml.replace(new RegExp("\{{bidListMoreStatusTxt}}", "g"), "出局");
					forHtml = forHtml.replace(new RegExp("\{{bidListMoreClass}}", "g"), "out");
				}
				forHtml = forHtml.replace(new RegExp("\{{bidListMoreName}}", "g"), list[i].username);
				forHtml = forHtml.replace(new RegExp("\{{bidListMorePrice}}", "g"), list[i].priceStr);
				forHtml = forHtml.replace(new RegExp("\{{bidListMoreTime}}", "g"), list[i].bidTimeStr1);
				html += forHtml;
			}
			$(".product_detail .product_detail_5 ul .bid_list_info").remove();
			$(".product_detail .product_detail_5 ul .bid_list_title").after(html);
		}
	}
};


$(document).ready(function() {
	/*二维码 S*/
	var auctionType = $("#auctionType").val();
	var paimaiId = $("#paimaiId").val();
	var mUrl = "http://duobao.m.jd.com/duobao/item/detail.html?paimaiId="+paimaiId+"&auctionType="+auctionType;
	var option={
		render: "table", //table方式
		width: 146, //宽度
		height:146, //高度
		text: mUrl || "dbd.jd.com"
	};

	function makeCode () {
		$("#code_area #code").empty();
		$("#code_area #code").qrcode(option);
	}
	$(".qr_code_div").mouseover(function (){
		makeCode();
		$("#code_area").show();
	});

	$("#code_area").mouseover(function (){
		$("#code_area").show();
	});

	$("#code_area").mouseout(function (){
		$("#code_area").hide();
	});
	/*二维码 E*/

	//出价记录查看更多
	$(".more_records_list").live("click",function (){
		$(".product_detail .tabContent").hide();
		$(".menu_tab li").removeClass("curr");
		$(".product_detail_5 ").show();
		$(".menu_tab .item05").addClass("curr");
	});

	pcBidModify.getSimilarItemList();
	pcBidModify.geRecommandList();
	pcBidModify.getWaitBidList();

	setTimeout(function (){
		pcBidModify.getNewPrice();
		pcBidModify.getBidList();
	},500)
	setInterval(function () {
		pcBidModify.getNewPrice();
		pcBidModify.getBidList();
	},10000);

	//同款待拍跳转商详
	$("#sameSkuList ul li").unbind("click").live("click",function (e){
		e = e || window.event;
		if(e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		var id = $(this).attr("paimaiId");
		window.open("http://dbditem.jd.com/"+id);
	});
	//同款待拍收藏
	$("#sameSkuList ul li .sameSkuCollect").unbind("click").live("click",function (e){
		e = e || window.event;
		if(e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		var id = $(this).parents("li").attr("paimaiId");
		addBox(id);
	});

});

//热品推荐hover事件
function hotSwitchCur (obj){
	$(".hot_auction_main_li").removeClass("cur");
	$(obj).addClass("cur");
}


setTimeout(function (){
	$(".spec-items").show();
},200)

