# jquery插件开发

软件开发需要一定的设计模式来指导的。  
jquery的插件开发有三种：

- 通过 $.extend()来扩展jquery
- 通过 $.fn向 jquery 添加新的方法
- 通过 $.widget()应用 jquery UI的部件工厂方式创建

第一种方式是创建简单的函数，譬如：

```
	$.extend({
		sayHello : function(name){
			console.log('hello , '+ name +' .');
		}
	});
	
	$.sayHello('guanMac');
	// hello , guanmac .
```

第三种是开发高级的jQuery部件，它带有许多jquery内建的特性，譬如插件状态信息保存。    
第二种是最常见的插件开发方式，它可以处理DOM元素。


## 基本方法
**基本格式**   

```
	$.fn.pluginName = function(){
	
	//...
	}
```
pluginName就是要开发的插件名称。  
譬如我们将页面上所有div的背景变成蓝，则可以这样写：

```
	$.fn.changBGColor = function(){
		this.css('background-color','green');
	}
	
	$('div').changeBGColor();
	
```

**warming**方法内部的 `this`，是指向我们使用jquery选择器选中的jquery类型元素集合，譬如上面就是 页面div的集合。   
也就是说，在函数内部使用 `this`是不需要加 `$(this)`的。    

上面是针对整个集合进行处理的，一般我们是对选中的每个具体元素进行操作。    
这是可以使用 `this.each()`方法来处理。需要注意的是，`each`里面的`this`是普通的DOM元素，调用jQuery方法时，要使用`$`符号包装。   

```
	$.fn.changeBGColor = function(){
		this.each(function(){
			$(this).css('background-color','green');
		})
	}
	
```

## 链式调用
jquery最优雅的特性就是支持链式调用，选择DOM元素后可以不断地调用其他方法。  
要实现链式调用，我们只需要在方法最后 `return this`即可：   

```
	$.fn.changBGColor = function(){
		return this.each(function(){
			$(this).css('background-color', 'green');
		});
	}

```

## 接受参数
好的插件是可以让调用者随意定制，在编写插件时，我们需要考虑的更全面，提供合适的参数。  
如果调用者没有提供参数，插件内部可以给出默认参数。  

譬如说调用者可以传入一个颜色，如果没有给，则默认是蓝色：

```
		$.fn.changeBGColor = function(opts){
			var default = {
				'backgroundColor' : 'green',
			}
			
			var options = $.extend(default , opts);
			
			return this.each(function(){
				$(this).css('background',options.backgroundColor);
			});
		}
		
		//调用
		$('div').changeBGColor({
			'backgroundColor' : 'green'
		});
	
```

上面是利用了 `$.extend()` 方法，它会将所有参数对象合并到第一个参数里面，如果有重名属性，则后面会覆盖签名，并且返回新的对象。   
我们在插件内部定义个保存默认值的对象，同时将接受的参数对象合并与默认值合并，作为新的参数。   

但是上面有个问题， 默认值`default`会被更改，这样并不好，如果后续还需要用到默认值，就会出现错误。我们可以骚骚做个修改，以**保护默认值**：  

```
	...
		var options = $.extend({} , default , opts);
	...
		
```   
这时我们就完成了一个简单的jquery插件编写了。   
实际上编写复制插件代码量很大，需要合理地组织内部代码。  
利用 **面向对象**的思维进行开发，可以让我们编写出健壮、灵活、清晰、易于维护的插件。   

## 面向对象的插件开发

下面已实际项目开发中的一个插件作为例子。  
该插件可以绑定某个元素，当数量hover时，自动计算位置并显示提示。   

### 整体结构
我们在插件内部定义一个构造函数，使代码变得面向对象，更好地维护和理解了。   
添加新的功能只需要在对象添加新变量和方法即可。

```
;(function(window,$,undefined){

		var Tips = function (ele, options){
		
		}
		
		Tips.prototype={
			show : function(){
			
			}
		};
		
		$.fn.tips = function(options）{
			var tips = new Tips(this , this.options);
			return tips.show();
		}
	
})(window,jQuery);

	//调用 
	$('.id1').tips({
		//...
	});
	
```

上面使用了**匿名函数**来包裹代码，在函数内部形成一个作用域，防止了污染全局变量，也不会跟别的代码冲突，这样我们可以放心地编写代码了。    
同时立即执行函数还有好处是，里面的代码是第一时间执行的，在页面准备完毕后，上面的插件也准备好了。   
另外我们将对象写在 `$.fn.plugnName`外面，这是因为fn就应该专注在插件的调用上。

### 完善插件
接下来我们专注于插件的编写： 

```
	var Tips = function(ele , options){
		this.$element = ele;
		
		this.defaults = {
			content : '提示内容',
			'x':0,
			'y':'0',
		}
		
		this.options = $.extend({},this.defaults , options);
		this.stepTemplate = '<div class="Tip">'
            + '<b class="jt" style=""></b>'
            + '<p><span class="TipTitle"></span>'
            + '<br><span class="TipContent"></span></p></div>';
	}
	
	Tips.prototype = {
	
		//为元素绑定hover时间
		show : function(){
			var _this= this;
            this.container = $(this.stepTemplate);
            //设置标题和内容
            this.container.find(".TipTitle").html(this.options.title);
            this.container.find(".TipContent").html(this.options.content);


            return this.$element.hover(function () {
                _this.resetPosition();
                _this.item.container.show();
            }, function () {
                _this.item.container.remove();
            });
		},
		
		//设置元素该出现的未知
		resetPosition : function(){
		}
	}

```

在 `show`方法里面，我们对元素进行hover事件绑定，当鼠标覆盖时，则会重新计算提示框显示的位置，并且显示；鼠标移开后则移除整个提示框。   
我们使用了 `this.$element = this `来接受jquery选择的元素。命名为 `$element`是因为这样可以让我们更好地识别出它是一个jquery类型的元素。   

接下来我们把`resetPositon`方法完善。  

```
	resetPosition : function(){
	            //先添加到页面中，否则无法获取container的宽高
            $("body").append(this.container);
            var target = this.$element;
            var corner = this.container.find(".jt");
            var tleft = target.offset().left-20;
            var ttop = target.offset().top;
            var twidth = target.width();
            var theight = target.height();
            var cheight = this.container.height();
            var cwidth = this.container.width();
            var cpaddingHeight = parseInt(this.container.css("padding-bottom")) + parseInt(this.container.css("padding-top"));
            var cpaddingWidth = parseInt(this.container.css("padding-left")) + parseInt(this.container.css("padding-right"));
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
                    this.container.css({
                        top: ttop + theight + cnBorder,
                        left: tleft + twidth / 2
                    });
                    corner.addClass("jt_topleft");
                    break;
                case 1:
                    //bottom - left 左下
                    this.container.css({
                        top: ttop - cheight - cpaddingHeight - cnBorder,
                        left: tleft + twidth / 2
                    });
                    corner.addClass("jt_bottomleft");
                    break;
                case 2:
                    //0  - left 左
                    this.container.css({
                        top: ttop + (theight - cheight - cpaddingHeight) / 2,
                        left: tleft + twidth + cnBorder
                    });
                    corner.addClass("jt_left");
                    break;
                case 3:
                    //top  - right 右上
                    this.container.css({
                        top: ttop + theight + cnBorder,
                        left: tleft - cwidth / 2
                    });
                    corner.addClass("jt_topright");
                    break;
                case 4:
                    //bottom  - right  右下
                    this.container.css({
                        top: ttop - cheight - cpaddingHeight - cnBorder,
                        left: tleft - cwidth / 2
                    });
                    corner.addClass("jt_bottomright");
                    break;
                case 5:
                    //0  -right   右
                    this.container.css({
                        top: ttop + (theight - cheight - cpaddingHeight) / 2,
                        left: tleft - cwidth - cpaddingWidth - cnBorder
                    });
                    corner.addClass("jt_right");
                    break
                default :
                    //默认 左上
                    this.container.css({
                        top: ttop + theight + cnBorder,
                        left: tleft + twidth / 2
                    });
                    corner.addClass("jt_topleft");
                    break;
            }
	}
	
```

上面的原理也很简单，获取元素相对于页面的位置以及提示框所占的长和宽（包括`padding`和 `border`），判断其在document的位置：`[左，左上，左下，右，右上，右下]`，合理显示即可。   

至此，我们就完成了整个插件的开发。  

### 题外话
上面插件并没有将数据保存在元素里，如果需要保存数据的话，可以通过 `$this.data('pluginName',setting)`进行保存。

## 后记

虽然现在已经越来越少人使用jquery以及它的插件了，但是它毕竟是风靡一个时代的框架，学习它的插件写法以及内部实现，可以帮助我们更好地管理代码结构以及编写合理的原生js。   
感谢jquery为前端事业做出的贡献！   

- [完整项目地址](http://https://github.com/guanMac/jquery_tips)