var bochumFile = {
	create : function(filesId) {
		var $fileInput = $("#"+filesId);

		var options = $.extend({
			multiple : true,
			canModify : true,
			showName : true,
			imgWidth : 50,
			fileCount : 12,
			addbutton : "img/addbutton.png"
		}, JSON.parse($fileInput.attr("itemParam")));
		
		options.input = $fileInput;
		options.fileBox = $("#"+filesId + "Box");
		options.vals = $fileInput.val();

		options.fileBox.empty();
		bochumFile.createForm(options);

		if (options.vals != undefined && options.vals != "") {
			var fileIds = options.vals.split(",");
			for (idx in fileIds) {
				bochumFile.addFile(options, fileIds[idx]);
			}

			if (bochum.str2bool(options.multiple)) {
				bochumFile.showAdd(options);
			}
		} else {
			bochumFile.showAdd(options);
		}
	},
	change : function(options) {
		if (!bochum.str2bool(options.multiple)) {
			if (options.fileBox.find(".bochumFileBox").length > 0) {
				options.fileBox.find(".bochumFileBoxAdd").remove();			
			} else {
				bochumFile.showAdd(options);
			}			
		}
		
		var fileIds = "";
		$.each(options.fileBox.find(".bochumFileBox"), function (idx, obj) {
			if ($(obj).data("thisData") != undefined)
				fileIds += "," + $(obj).data("thisData").id;
		});
		options.input.val(fileIds.substr(1));
	},
	createForm : function(options) {
		var iframe = $('<iframe class="hide"></iframe>').appendTo(options.fileBox);
		var form = $('<form enctype="multipart/form-data" method="post"></form>').appendTo(options.fileBox);
		var inputFile = $('<input type="file" name="uploadFile" class="hide inputFile">').appendTo(form);
		var inputId = $('<input type="hidden" name="id" class="hide inputFileId">').appendTo(form);
		inputFile.on("change", function() {
			if (options.filter != undefined && options.filter != "") {
				if (!bochum.inArray(inputFile.val().substr(inputFile.val().lastIndexOf(".")+1), options.filter.split("|"))) {
					bochum.showErrorMessage("文件类型必须是"+options.filter);
					return;
				}
			}
			bochum.mask("文件上传中,请稍等...");
			form.ajaxSubmit({
	            type: "post",
	            url: "upload",
	            dataType:"json",
	            success : function (data) {
	    			bochum.closeMask();
	    			bochum.showSuccessMessage("文件上传成功！");
	            	for (idx in data.datasOut) {
	            		bochumFile.addFile2box(options, data.datasOut[idx]);
	            	}
	            },
	            error: function (data) {
					bochum.closeMask();
	    			bochum.showErrorMessage("文件上传失败！");
	            }
			});
		});
	},
	addFile : function(options, fileId) {
		bochum.ajax("rbac/data/getComFile", {id:fileId}, function(data){
			bochumFile.addFile2box(options, data.dataOut);
		}, function(data){});
	},
	addFile2box : function(options, fileInfo) {
		var a = options.fileBox.find("#a_"+fileInfo.id);
		var fileBox; 
		if (a.length == 0) {
			fileBox = bochumFile.createBox(options);
			a = $("<a id='a_"+fileInfo.id+"' title='"+fileInfo.name+"'></a>").appendTo(fileBox.find(".row"));

			fileBox.prependTo(options.fileBox);
		} else {
			fileBox = a.parents(".bochumFileBox:first");
			a.empty();
		}
		
		fileBox.data("thisData", fileInfo);
		
		var imgFile = 'img/fileTypes/'+fileInfo.fileType+'.png';
		if (bochum.inArray(fileInfo.fileType, ["png", "jpg", "bmp", "gif"])) {
			imgFile = 'download?id=' + fileInfo.id + "&v=" + new Date();
		}
		
		var img = $("<img width='100%' src='"+imgFile+"'></img>").appendTo(a);

		if (options.download == "true" || options.upload == "true") {
			var tb = $('<div id="toolbar_'+fileInfo.id+'" class="btn-toolbar hidden"></div>').appendTo(fileBox);
			if (options.download == "true")
				$('<a class="download" href="javascript:void(0);" title="下载"><i class="fa fa-download"></i></a>').appendTo(tb);
			if (options.upload == "true")
				$('<a class="upload" href="javascript:void(0);" title="重新上传"><i class="fa fa-upload"></i></a>').appendTo(tb);

			img.toolbar({
			    content: '#toolbar_'+fileInfo.id, 
			    position: 'right'
			}).on("toolbarItemClick", {options:options, fileInfo:fileInfo}, function (event, item) {
				if ($(item).hasClass("upload")) {
					event.data.options.fileBox.find(".inputFileId").val(event.data.fileInfo.id);
					event.data.options.fileBox.find(".inputFile").click();
				} else if ($(item).hasClass("download")) {
					event.data.options.fileBox.find("iframe").attr("src", 'download?id=' + event.data.fileInfo.id + "&v=" + new Date());
				}
			}).on("toolbarShowBefore", {options:options, fileInfo:fileInfo}, function (event, item) {
				bochumFile.onShowToolbarBefore(item, fileInfo);
			});
		}

		if (bochum.str2bool(options.showName)) {
			$("<label class='control-label'>"+fileInfo.name+"</label>").appendTo(a);
		}

		bochumFile.change(options);
	},
	onShowToolbarBefore : function (item, data) {
//		item.toolbar.find(".upload").addClass("hide");
//		item.toolbar.find(".download").removeClass("hide");
	},
	showAdd : function(options) {
		var fileBox = bochumFile.createBox(options);
		fileBox.appendTo(options.fileBox);
		fileBox.addClass("bochumFileBoxAdd");
		var add = $("<a href='javascript:void(0)' style='width:100%;' title='上传'><img style='width:100%;' title='上传' src='"+options.addbutton+"'></img></a>");
		add.appendTo(fileBox.find(".row"));
		add.on("click", function() {
			options.fileBox.find(".inputFileId").val("");
			options.fileBox.find(".inputFile").click();
		});
		add.find("li").css("font-size", add.width());
	},
	createBox : function (options) {
		return $('<div class="bochumFileBox col-sm-1 col-md-1 col-lg-'+(12/options.fileCount)+' padding-5" css="margin:auto" ><div class="row no-margin"></div></div>');
	}
}