/*
* JavaScript Document
* @author xiege
* @function Img Scroll
* @data 2014.11.27
*/
;(function($){
	$.fn.box=function(options){
		var settings={
			move_num    :1,            	//表示滚动元素的数量
			display_num :5,            	//表示正常显示元素的数量
			margin_num  :10, 			//表示滚动元素之间的右边距
			speed       :3,				//表示滚动元素的速度，值越小，速度越快，反之则越慢
			times       :3,				//表示自动滚动元素的间隔时间，这是以秒为单位来计算
			Dom         :"div",			//表示获取对象元素，以用来后面获取元素的宽度(默认为滚动元素)
			prev        :"#xg-prev",		//表示获取上一页按钮
			next        :"#xg-next",		//表示获取下一页按钮
			element     :"div",			//表示滚动的元素，可以传递div、也可以传递li标签、也可以传递一个类如：('.box-img')
			auto		:true,			//判断是否自动滚动，true为自动,false为不自动
			allWidth	:0,				//在显示图片区域的宽度上额外可视区宽度
			btn			:true		//block表示显示默认按钮，none为不显示
		};
		var options=$.extend(settings,options);
		return this.each(function() {
			var $this=$(this),
				mon  =options.move_num,
				dn   =options.display_num,
				marn =options.margin_num,
				spd  =options.speed,
				t    =options.times,
				DW   =options.Dom,
				prev =options.prev,
				next =options.next,
				e    =options.element,
				sw	 =options.allWidth,
				auto =options.auto,
				btn  =options.btn,
				e_len=$(this).find(e).length,
				e_h	 =$(this).find(e).outerHeight(),
				e_w  =$(this).find(e).outerWidth()*dn-0+marn*dn-0,
				wr_w =$(this).find(e).outerWidth()*dn+marn*(dn-1)+sw,
				liw  =$(this).find(e).width()+marn;
			//通过判断将window字符串转换成window对象
			if(options.Dom=="window"){
				DW=window;
			};
			if((e_len-dn)<mon&&e_len>dn){
				mon=e_len-dn;
				spd=spd/2;
			};
			// 给元素包裹一层div,并重新定义选择元素的css样式属性
			$this.wrap("<div class='xg-wraper'><div class='xg-container'></div></div>").css({
				'position': 'absolute',
				'left': 0,
				'width':'99999px'
			});
			// 给包裹的最外层div添加样式
			$(".xg-wraper").css({
				'position': 'relative',
				'width': wr_w,
				'margin': '0 auto 0',
				'overflow': 'hidden'
			});
			// 给子元素添加右边框属性
			$this.find(e).css('margin-right', marn);
			// 插入按钮
			if(btn){
				$(".xg-container").before("<a href='javascript:void(0);' id='xg-prev'>prev</a><a href='javascript:void(0);' id='xg-next'>next</a>");
			};
			// 给包裹的上一层div添加样式
			$(".xg-container").css({
				'position': 'relative',
				'z-index': 22,
				'height': e_h,
				'width': e_w,
				'overflow': 'hidden',
				'margin': '0 auto'
			});
			// 判断是否自动滚动
			if (auto) {
				var timer=setInterval(ImgScroll,t*1000);
			};
			// 清除与开启定时器
			$this.hover(function() {
				clearInterval(timer);
				timer=null;
			}, function() {
				timer=setInterval(ImgScroll,t*1000);
			});
			// 给按钮添加click事件(这里在接口中传递的参数最好是id而不是类)
			$(prev).stop(true, false).on('click', function() {
				// 清除定时器
				if(auto){clearInterval(timer);};  
				timer=null;
				//判断是否处在动画中的条件
				var checkScroll=$this.is(':animated');
				//判断是否满足滚动条件				
				if (!checkScroll&&(e_len-dn)>=mon) {					
					ImgScroll2();
				};
			});
			$(next).stop(true, false).on('click', function() {
				// 清除定时器
				if(auto){clearInterval(timer);};   
				timer=null;
				//判断是否自在动画中的条件
				var checkScroll=$this.is(':animated');	
				//判断是否满足滚动条件			
				if (!checkScroll&&(e_len-dn)>=mon) {					
					ImgScroll();
				};
			});
			//初始化索引 
			var index=0;	
			//正常滚动次数		
			var sn=Math.floor((e_len-dn)/mon);		
			//正常索引滚动所到最大值
			var rn=e_len-dn;
			//余下元素空缺数量
			var sdn=(e_len-dn)%mon;
			//定义元素滚动方法
			function ImgScroll(){
				if(e_len>dn){
					index+=mon;
					if(sdn!=0){
						index=index==(rn+mon-sdn)?rn:index;
					};
					if(index<=rn){
						$this.animate({
							left:-index*liw
						}, spd);
					} else{
						var html=$this.find(e).slice(0,mon);
						var nowLeft=(e_len-mon)*liw-dn*liw;
						$this.append(html)
							 .css('left', -nowLeft)
							 .animate({
							 	left: -(e_len-dn)*liw
							 }, spd);
						index=e_len-dn;
					}
				}
			};
			// 定义元素滚动方法二
			function ImgScroll2(){
				if(e_len>dn){
					index-=mon;
					if(sdn!=0){
						index=index==(sdn-mon)?0:index;
					};
					if(index>=0){
						$this.animate({
							left:-index*liw
						}, spd)
					} else{
						var html=$this.find(e).slice(-mon);
						var nowLeft=mon*liw;
						$this.prepend(html)
							 .css('left', -nowLeft)
							 .animate({
							 	left:0
							 }, spd);
						index=0;
					}
				}
			};
		});
	}
})(jQuery)