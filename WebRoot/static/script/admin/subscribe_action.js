
/**
 * 用户关注回复
 */

var msgAction;

$(function(){
	
	loadSubscribeMsg();
});

function loadSubscribeMsg(){
	
	$.ajax({
		url :  curUrl + '/admin/action/load',
		data : {
			"req_type" : "event",
			"event_type" : "subscribe"
		},
		dataType : "json",
		success : function(res) {
			msgAction = res;
			if(res){
				$("#set-tip").hide();
				thowSetting();
			}
		}
	});
}

function thowSetting(){
	//清除数据
	if(!msgAction){		//没有設置回复信息
		showActionContent('action_index');
		return false;
	}
	var viewHtml = "";		//预览效果HTML
	if(msgAction.action_type == 'material'){//数据源从素材读取
		var json = $.xml2json(msgAction.material.xml_data);
		var msgType = json.MsgType;
		if(msgType == "text"){		//文本消息
			viewHtml = json.Content;
		}else if(msgType == "news"){	//图文消息
			viewHtml = xml2NewsHtml(msgAction.material.xml_data, msgAction.material.str_in_time, msgAction.material.id);
		}
	}else if(msgAction.action_type == 'api'){
		viewHtml = "从接口【"+msgAction.extApp.name+"】中获得数据";
	}
	$("#viewDiv").html(viewHtml);
	$.parser.parse('#viewDiv');
	$("#resp-setting").hide();
	$("#view").show();
}



function updateMsgView(){
	clearData();
	$("#editType").val("edit");
	$("#msgActionId").val(msgAction.id);
	
	var tabIndex;
	
	if(msgAction.action_type == 'material'){//数据源从素材读取
		var json = $.xml2json(msgAction.material.xml_data);
		var msgType = json.MsgType;
		if(msgType == "text"){		//文本消息
			tabIndex = 0;
			$("#replyText").val(json.Content);
		}else if(msgType == "news"){	//图文消息
			tabIndex = 4;
			var newsId = msgAction.material.id;
			viewHtml = xml2NewsHtml(msgAction.material.xml_data,msgAction.material.str_in_time,newsId);
			$("#preview_news").html(viewHtml);				
		}
	}else if(msgAction.action_type == 'api'){
		tabIndex = 5;
		busiapi_combobox.combobox("select",msgAction.extApp.id);
	}
	$("#edit_tabs").tabs("select",tabIndex);
	$("#view").hide();
	$("#resp-setting").show();
}

/**
 * 提交响应规则設置
 * @param {} respType 消息响应类型
 */
function submitMsgActionForm(respType){
	msgActionForm.form('submit', {
		url : curUrl + '/admin/action/save',
		success : function(data) {
			fjx.closeProgress();
			var res = $.evalJSON(data);
			if(res && '1' == res.code){
//				clearData();
//				fjx.showMsg('設置成功');
				alert("设置成功");
				window.location.reload();
			}else{
				$.messager.alert('提示',	res?res.msg:'设置失败！','error');
			}
		},
		onSubmit : function(){
			$("#msgReqType").val(req_type);
			$("#eventType").val(event_type);
			if(respType === 'text'){
				$("#msgActionType").val("material");		//响应消息类型
				var txtContent = $.trim($("#replyText").val());
				if(!txtContent || "" == txtContent){
					$.messager.alert('提示', '请输入要回复的内容', 'warning');
					return false;
				}
				$("#txtContent").val(txtContent);
			}
			if(respType === 'news'){
				$("#msgActionType").val("material");		//响应消息类型
				var newsId = $("#newsId").val();
				if(!newsId || newsId == ''){
					$.messager.alert('提示', '请选择素材', 'warning');
					return false;
				}
				$("#msgMaterialId").val(newsId);
			}
			if(respType === 'busiapp_api'){
				$("#msgActionType").val("api");				//响应消息类型
				var app_id = busiapi_combobox.combobox("getValue");
				if(!app_id){
					$.messager.alert('提示', '请选择业务功能', 'warning');
					return false;
				}
				$("#msgExtAppId").val(app_id);
			}
			fjx.progress();
		}
	});
}