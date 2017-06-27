;(function($, window, document,undefined) {
    //定义ChartBar的构造函数
    var ChartBar = function(ele, opt) {
        this.$element = ele,
        this.defaults = {
            'url': '',
            'fontSize': '12px',
            'textDecoration': 'none'
        },
        this.options = $.extend({}, this.defaults, opt)
    }
    //定义ChartBar的方法
    ChartBar.prototype = {
        beautify: function() {
            return this.$element.css({
                'color': this.options.color,
                'fontSize': this.options.fontSize,
                'textDecoration': this.options.textDecoration
            });
        }
    }
    //在插件中使用Beautifier对象
    $.fn.bochum.charts.bar = function(options) {
        //创建Beautifier的实体
        var chartBar = new ChartBar(this, options);
        //调用其方法
        return chartBar;
    }
})(jQuery, window, document);