/**
 * 操作提示控件
 */
(function ($) {
	$('#openHelpLink').prop('href',window.location.protocol + "//" + window.location.hostname+'/open/');
    var KZTips = function (ele, options) {
        this.$element = ele;
        this.defaults = {
            'title': LANG['tips'],
            'content': '提示内容',
            'x': 0,
            'y': 0
        }
        this.options = $.extend({}, this.defaults, options);
        this.stepTemplate = '<div class="KZTip">'
            + '<b class="KZjt" style=""></b>'
            + '<p><span class="KZTipTitle"></span>'
            + '<br><span class="KZTipContent"></span></p></div>';
        this.item = {};
    }

    KZTips.prototype = {
        resetPosition: function () {
            //先添加到页面中，否则无法获取container的宽高
            $("body").append(this.item.container);
            var target = this.$element;
            var corner = this.item.container.find(".KZjt");
            var tleft = target.offset().left-20;
            var ttop = target.offset().top;
            var twidth = target.width();
            var theight = target.height();
            var cheight = this.item.container.height();
            var cwidth = this.item.container.width();
            var cpaddingHeight = parseInt(this.item.container.css("padding-bottom")) + parseInt(this.item.container.css("padding-top"));
            var cpaddingWidth = parseInt(this.item.container.css("padding-left")) + parseInt(this.item.container.css("padding-right"));
            var cnBorder = 20;
            //根据target的位置设置提示框的位置
            var position = 0;
            if (this.options.x == 0 && this.options.y == 0) {
                if (tleft < (document.body.offsetWidth / 2)) {
                    if (ttop < (document.body.offsetHeight / 4)) {
                        position = 0;
                    }
                    else if (ttop > (document.body.offsetHeight * 3 / 4)) {
                        position = 1;
                    }
                    else {
                        position = 2;
                    }
                }
                else {
                    if (ttop < (document.body.offsetHeight / 4)) {
                        position = 3;
                    }
                    else if (ttop > (document.body.offsetHeight * 3 / 4)) {
                        position = 4;
                    }
                    else {
                        position = 5;
                    }
                }
            } else {
                var x = this.options.x, y = this.options.y;
                if (x == 'right' && y == 'bottom') {
                    position = 0;
                } else if (x == 'right' && y == 'top') {
                    position = 1;
                } else if (x == 'right' && y == 0) {
                    position = 2;
                } else if (x == 'left' && y == 'bottom') {
                    position = 3;
                } else if (x == 'left' && y == 'top') {
                    position = 4;
                } else if (x == 'left' && y == 0) {
                    position = 5;
                }
            }
            switch (position) {
                case 0:
                    //top - left 左上
                    this.item.container.css({
                        top: ttop + theight + cnBorder,
                        left: tleft + twidth / 2
                    });
                    corner.addClass("KZjt_topleft");
                    break;
                case 1:
                    //bottom - left 左下
                    this.item.container.css({
                        top: ttop - cheight - cpaddingHeight - cnBorder,
                        left: tleft + twidth / 2
                    });
                    corner.addClass("KZjt_bottomleft");
                    break;
                case 2:
                    //0  - left 左
                    this.item.container.css({
                        top: ttop + (theight - cheight - cpaddingHeight) / 2,
                        left: tleft + twidth + cnBorder
                    });
                    corner.addClass("KZjt_left");
                    break;
                case 3:
                    //top  - right 右上
                    this.item.container.css({
                        top: ttop + theight + cnBorder,
                        left: tleft - cwidth / 2
                    });
                    corner.addClass("KZjt_topright");
                    break;
                case 4:
                    //bottom  - right  右下
                    this.item.container.css({
                        top: ttop - cheight - cpaddingHeight - cnBorder,
                        left: tleft - cwidth / 2
                    });
                    corner.addClass("KZjt_bottomright");
                    break;
                case 5:
                    //0  -right   右
                    this.item.container.css({
                        top: ttop + (theight - cheight - cpaddingHeight) / 2,
                        left: tleft - cwidth - cpaddingWidth - cnBorder
                    });
                    corner.addClass("KZjt_right");
                    break
                default :
                    //默认 左上
                    this.item.container.css({
                        top: ttop + theight + cnBorder,
                        left: tleft + twidth / 2
                    });
                    corner.addClass("KZjt_topleft");
                    break;
            }
        },
        show: function () {
            var _this= this;
            this.item.title = this.options.title;
            this.item.content = this.options.content;
            this.item.container = $(this.stepTemplate);
            this.item.container.find(".KZTipTitle").html(this.item.title);
            this.item.container.find(".KZTipContent").html(this.item.content);
            return this.$element.hover(function () {
                _this.resetPosition();
                _this.item.container.show();
            }, function () {
                _this.item.container.remove();
            });
        }
    }
    $.fn.kzTips = function (options) {
        //创建KZTips实例
        var kzTips = new KZTips(this, options);
        return kzTips.show();
    }
})(jQuery);