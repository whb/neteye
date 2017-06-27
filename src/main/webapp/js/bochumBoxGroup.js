var bochumBoxGroup = {
	renderEdit : function(id) {
		
	},
	createBoxGroup : function($boxGroup) {
		$boxGroup.parent().empty().append($boxGroup);
		bochumBoxGroup.createNewBoxGroup($boxGroup);
	},
	createNewBoxGroup : function($boxGroup) {
		$boxGroup.hide();
		options = $.extend({}, JSON.parse($boxGroup.attr("itemParam")));
		options.dataParam = JSON.parse($boxGroup.attr("dataParam"));
		bochum.ajax(options.url, options.dataParam, function(data){
			options.data = data;
			bochumBoxGroup.refreshBoxGroup($boxGroup, options);
//			bochumTable.refreshPagination(options.tableId+"Pagination", data.totalPage, data.currPage, function(pageIdx){menuList.selectMenus({page:pageIdx})});
		}, function(data){});
	},
	onCreateBox : function (box) {
		
	},
	refreshBoxGroup : function(boxGroup, options) {
//		var boxGroup = $("#"+options.boxGroupId);
		var group = $('<div id="'+options.id+'Group" class="bochumInputBoxGroup col-sm-12 col-md-12 col-lg-12 padding-5"></div>').appendTo(boxGroup.parent());
		var groupRow = $('<div id="'+options.id+'GroupRow" class="row"></div>').appendTo(group);
		var groupItem;
		var groupAdd = $("#"+options.add);
		if (options.color == undefined || options.color == "") {
			options.color = "";
		}
		var rowColors = options.color.split(",");
		var boxSize = parseInt((options.boxWidth==undefined?0:options.boxWidth));
		var rowSize = 0;
		for (var j = 0; j < options.data.datasOut.length; j++) {
			rowSize += boxSize;
			if (rowSize > 12) {
				rowSize = boxSize;
				groupRow = $('<div id="'+options.id+'GroupRow" class="row"></div>').appendTo(group);
			}
			var subData = options.data.datasOut[j];
			var newItemId = boxGroup.attr("id")+subData.id;
			groupItem = $(boxGroup.html());
			if (options.color != "") {
				groupItem.find(".row:first").css("background-color",rowColors[(j%rowColors.length)]);
			}
			groupItem.attr("id", newItemId);
			groupItem.data("itemData", subData);
			groupItem.addClass("bochumInputBox");
			groupRow.append(groupItem);
			bochumBoxGroup.onCreateBox(groupItem);
			bochum.json2area(subData, groupItem);
			$.each(groupItem.find(".bochumInputCombobox"), function(n, value) {
				var $value = $(value);
				var $parentGroup = $value.parents(".bochumInputBoxGroup:first");
				if (group.attr("id") == $parentGroup.attr("id")) {
					$value.attr("dataParam", JSON.stringify(subData));
//					$value.attr("boxgroupId", "pid_"+subData.id);
					bochumSelect.create($value);
				}
			});
			$.each(groupItem.find(".bochumInputBoxGroup"), function(n, value) {
				var $value = $(value);
				var $parentGroup = $value.parents(".bochumInputBoxGroup:first");
				if (group.attr("id") == $parentGroup.attr("id")) {
					$value.attr("dataParam", JSON.stringify($.extend({}, options.dataParam, subData)));
					bochumBoxGroup.createNewBoxGroup($value);
				}
			});
			groupItem.find('.progress-bar').progressbar({
				display_text : 'fill'
			});
			groupItem.find('.easy-pie-chart').each(function() {
				var $this = $(this),
					barColor = $this.css('color') || $this.data('pie-color'),
				    trackColor = $this.data('pie-track-color') || 'rgba(0,0,0,0.04)',
				    size = parseInt($this.data('pie-size')) || 25;
				    
				$this.easyPieChart({
					barColor : barColor,
					trackColor : trackColor,
					scaleColor : false,
					lineCap : 'butt',
					lineWidth : parseInt(size / 8.5),
					animate : 1500,
					rotate : -90,
					size : size,
					onStep: function(from, to, percent) {
            			$(this.el).find('.percent').text(Math.round(percent));
        			}
					
				});
				
				$this = null;
			});
		}
		groupRow.append(groupAdd);
	},
	refreshPagination : function (paginationId, totalPage, currPage, callback) {
		var pagination = $("#"+paginationId);
		pagination.html("");
		var st = Math.floor((currPage-1)/10)*10+1;
		var ed = Math.min(totalPage, Math.floor((currPage-1)/10)*10+10);
		var page = $("<ul class='pagination pagination'></ul>").appendTo(pagination);
		if (currPage<=1) {
			$("<li class='disabled'><a href='javascript:void(0);'><i class='fa fa-chevron-left'></i></a></li>").appendTo(page);
		} else {
			$("<li ><a href='javascript:void(0);'><i class='fa fa-chevron-left'></i></a></li>").appendTo(page).one("click", (currPage-1), function(event) {callback(event.data)});
		}
		for (i=st; i<=ed; i++) {
			$("<li"+(i==currPage?" class='active'":"")+"><a href='javascript:void(0);'>"+i+"</a></li>").appendTo(page).one("click", i, function(event) {callback(event.data)});
		}
		if (currPage>=totalPage) {
			$("<li class='disabled'><a href='javascript:void(0);'><i class='fa fa-chevron-right'></i></a></li>").appendTo(page);
		} else {
			$("<li ><a href='javascript:void(0);'><i class='fa fa-chevron-right'></i></a></li>").appendTo(page).one("click", (currPage+1), function(event) {callback(event.data)});
		}
	}
}