var bochumTree = {
	createTree : function ($tree) {
		var options = $.extend({}, JSON.parse($tree.attr("itemParam")));
		options.dataParam = $tree.attr("dataParam");
		bochum.ajax(options.dataUrl, options.dataParam, function(data){
			options.data = data.datasOut;
			bochumTree.refreshTree($tree, options);
		}, function(data){});
	},
	refreshTree : function (tree, options) {
		if (options.idField == undefined) options.idField = "id";
		if (options.pIdField == undefined) options.pIdField = "parentId";
		if (options.textField == undefined) options.textField = "name";
		
		var treeData = bochumTree.toTree(options);
//		var tree = $("#"+options.id);
		tree.html("");
		bochumTree.addTreeNode(tree, treeData, options);
		bochumTree.applyTreeStyle(tree);
//		loadScript("js/plugin/bootstraptree/bootstrap-tree.min.js");
	},
	applyTreeStyle : function (tree) {
//		tree.find('li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
		tree.find('li.parent_li').find('.treeNodeSpan').attr('title', '折叠');
		tree.find('li.parent_li > .treeNodeSpan').on('click', function (e) {
	        var children = $(this).parent('li.parent_li').find(' > ul > li.children_li');
	        if (children.is(":visible")) {
	            children.hide('fast');
	            $(this).attr('title', '展开').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
	        } else {
	            children.show('fast');
	            $(this).attr('title', '折叠').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
	        }
	        e.stopPropagation();
	    });
	},
	addTreeNode : function(pNode, datas, options) {
		var nodeUl = $("<ul class='tree_ul'></ul>").appendTo(pNode);
		for (index in datas) {
			var data = datas[index];
			if (data.children != undefined) {
				var nodeLi = $("<li class='tree_li parent_li children_li'><span class=\"treeNodeSpan\"><i class=\"fa fa-lg icon-minus-sign\"></i>"+data[options.textField]+"</span> </li>").appendTo(nodeUl);
				bochumTree.addTreeEdits(options, data).appendTo(nodeLi);
				bochumTree.addTreeState(options, data).appendTo(nodeLi);
				bochumTree.addTreeNode(nodeLi, data.children, options);
			} else {
				var nodeLi = $("<li class='tree_li children_li'><span><i class=\"icon-leaf\"></i> "+data[options.textField]+"</span> </li>").appendTo(nodeUl);
				bochumTree.addTreeEdits(options, data).appendTo(nodeLi);
				bochumTree.addTreeState(options, data).appendTo(nodeLi);
			}
		}
	},
	getState : function (data, options) {
		return "";
	},
	addTreeState : function(pNode, data, options) {
		var state = "";
		if (bochumTree.getState(data, options) == "success") {
			state = "<label class='text-success  fa fa-check text-left bochumInputLabel'></label>";
		}
		return $(state);
	},
	changeParam : function (options, params) {
		return params;
	},
	menuControl : function (treeId, btnId, data) {
		return "";
	},
	addTreeEdits : function(options, data) {
		if (options.editUrl == undefined || options.editUrl == "") return $("");
		if (options.editUrl instanceof Array) {

		} else {
			var buttons = options.menuDefault.split(",");
			if (buttons.length == 0) return $("");
			
			var editG = $('<div class="btn-group"><a href="javascript:void(0);" class="fa fa-edit dropdown-toggle" data-toggle="dropdown"></a></div>');
			var editU = $('<ul class="dropdown-menu"></ul>').appendTo(editG);
//			var editLi = $('<li></li>').appendTo(editU);

			var params = $.extend({}, data);//options.idField:data[options.idField], dialogId : options.id+'EditModal'};
			params.dialogId = options.id+'EditModal';
			params.children = undefined;
			
			if (options.menu != undefined && options.menu != "") {
				var userButtons = JSON.parse(options.menu);
				var editLi = $('<li class="divider"></li>').appendTo(editU);
				var editLi = $('<li></li>').appendTo(editU);
				for (idx in userButtons) {
					var btn = userButtons[idx];
					if ("hide" != bochumTree.menuControl(options.id, btn.id, data)) {
						var editA = $('<a name="'+btn.id+'" href="javascript:void(0);">'+btn.name+'</a>').appendTo(editLi);
						var url = btn.url+'?'+ encodeURI(bochum.json2getParam(bochumTree.changeParam(options, params)));
						bochumTree.addTreeEditsEvent(editA, options, url, data);
					}
				}
			}

			if (bochum.inArray("E", buttons) && "hide" != bochumTree.menuControl(options.id, "E", data)) {
				var editLi = $('<li class="divider"></li>').appendTo(editU);
				var editLi = $('<li></li>').appendTo(editU);
				var editA = $('<a name="E" href="javascript:void(0);">编辑</a>').appendTo(editLi);
				var url = options.editUrl+'?'+ encodeURI(bochum.json2getParam(bochumTree.changeParam(options, params)));
				bochumTree.addTreeEditsEvent(editA, options, url, data);
			}

//			if (bochum.inArray("MU", buttons) || bochum.inArray("MD", buttons)) {
//				var editA = $('<li class="divider"></li>').appendTo(editLi);
//				if (bochum.inArray("MU", buttons))
//					var editA = $('<a href="javascript:void(0);">上移</a>').appendTo(editLi);
//				if (bochum.inArray("MD", buttons))
//				var editA = $('<a href="javascript:void(0);">下移</a>').appendTo(editLi);
//			}

			if ((bochum.inArray("AI", buttons) && "hide" != bochumTree.menuControl(options.id, "AI", data)) 
					|| (bochum.inArray("AA", buttons) && "hide" != bochumTree.menuControl(options.id, "AA", data))
					|| (bochum.inArray("AS", buttons) && "hide" != bochumTree.menuControl(options.id, "AS", data))) {
				var editLi = $('<li class="divider"></li>').appendTo(editU);

				if (bochum.inArray("AI", buttons) && "hide" != bochumTree.menuControl(options.id, "AI", data)) {
					var editLi = $('<li></li>').appendTo(editU);
					var editA = $('<a name="AI" href="javascript:void(0);">同级插入</a>').appendTo(editLi);
					var url = options.editUrl+'/new?'+ encodeURI('params={'+options.pIdField+':\''+data[options.pIdField]+'\', dialogId:\''+options.id+'EditModal\'}');
					bochumTree.addTreeEditsEvent(editA, options, url, data);
				}

				if (bochum.inArray("AA", buttons) && "hide" != bochumTree.menuControl(options.id, "AA", data)) {
					var editLi = $('<li></li>').appendTo(editU);
					var editA = $('<a name="AA" href="javascript:void(0);">同级追加</a>').appendTo(editLi);
					var url = options.editUrl+'/new?'+ encodeURI('params={'+options.pIdField+':\''+data[options.pIdField]+'\', dialogId:\''+options.id+'EditModal\'}');
					bochumTree.addTreeEditsEvent(editA, options, url, data);
				}

				if (bochum.inArray("AS", buttons) && "hide" != bochumTree.menuControl(options.id, "AS", data)) {
					var editLi = $('<li></li>').appendTo(editU);
					var editA = $('<a name="AS" href="javascript:void(0);">下级追加</a>').appendTo(editLi);
					var url = options.editUrl+'/new?'+ encodeURI('params={'+options.pIdField+':\''+data[options.idField]+'\', dialogId:\''+options.id+'EditModal\'}');
					bochumTree.addTreeEditsEvent(editA, options, url, data);
				}
			}

			if (bochum.inArray("D", buttons) && "hide" != bochumTree.menuControl(options.id, "D", data)) {
				var editLi = $('<li class="divider"></li>').appendTo(editU);
				var editLi = $('<li></li>').appendTo(editU);
				var editA = $('<a name="D" href="javascript:void(0);">删除</a>').appendTo(editLi);
				var url = options.editUrl+'?'+ encodeURI('params={'+options.idField+':\''+data[options.idField]+'\', dialogId:\''+options.id+'EditModal\'}');
				bochumTree.addTreeDeleteEvent(editA, options, data);
			}
			
			if (editU.find("a").length == 0) {
				editG = $("");
			}
			
			return editG;
		}
	},
	addTreeEditsEvent : function(editA, options, url, data) {
		if ("disabled" == bochumTree.menuControl(options.id, editA.attr("name"), data)) {
			editA.parent().addClass("disabled");
			return;
		}
		editA.parent().removeClass("disabled");
		editA.on("click", function() {
			$("#"+options.id+"EditModal").modal({
				backdrop: 'static',
				keyboard: false,
				remote: url
			}).on("hidden.bs.modal", function() {
			    $(this).removeData(options.id+"EditModal");
			    $(this).find(".modal-content").html("");
			    bochumTree.createTree($("#"+options.id));
			});
		});
	},
	addTreeDeleteEvent : function(editA, options, delData) {
		if ("disabled" == bochumTree.menuControl(options.id, editA.attr("name"), delData)) {
			editA.parent().addClass("disabled");
			return;
		}
		editA.on("click", function() {
			bochum.confirm("您确定要删除数据吗?", function () {
				bochum.ajax(options.deleteUrl, {id:delData[options.idField]}, function(data){
					bochum.showMessage(data);
					bochumTree.createTree($("#"+options.id));
				}, function(data){
					bochum.showErrorMessage("数据删除失败!" + data);
				});
			}, function () {});
		});
	},
	toTree : function (options) {
	    var tree = [];
	    var datas = {};
	    for(var i=0;i<options.data.length;i++) {
	    	datas[options.data[i][options.idField]] = options.data[i];
	    	delete datas[options.data[i][options.idField]].children;
	    }
	    for(var i=0;i<options.data.length;i++) {
	    	if (datas[options.data[i][options.pIdField]] != null) {
	    		if (datas[options.data[i][options.pIdField]].children == undefined) {
	    			datas[options.data[i][options.pIdField]].children = [];
	    		}
	    		datas[options.data[i][options.pIdField]].children[datas[options.data[i][options.pIdField]].children.length]=options.data[i];
	    	} else {
	    		tree[tree.length]=options.data[i];
	    	}
	    }
	    return tree;
	}
}