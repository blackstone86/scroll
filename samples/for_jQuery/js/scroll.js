/* SCROLLBAR 重构版 --- for jQuery
	设计特点：
	1.鼠标事件专注维护鼠标纵向偏移量
	2.scrollBtn依据鼠标纵向偏移量进行位移，scrollCnt按照scrollBtn位置计算位移
	3.设立pos方法专门处理位移方式，让top或transition的切换更灵活
	4.以达到桌面版与平板共用一套HTML，页面行为统一由scroll.js处理
	5.支持translae3d的使用translae3d，否则使用top
	6.支持mousewheel鼠标滑轮事件
	7.支持动态增删内容，调整后（如果滚动条还处于显示状态），滚动按钮处于调整前的位置上
	8.围绕公司项目需求定制，无需设置任何参数
*/
var ScrollEmulate = function( scrollboxId ){
	var self = this
		 ,scrollboxId = '#' + scrollboxId + ' ';
	self.wrap = $( scrollboxId );
	self.cnt = $( scrollboxId + '.j_cntbox' );
	self.scrollbar = $( scrollboxId + '.j_bar' );	
	self.scrollbtn = $( scrollboxId + '.j_point' );
	self.scrollbtnOffsetLimit = [];
	self.cntOffsetLimit = [];
	self.pointX = 0;
	self.pointY = 0;
	self.cntCurrOffset = 0;
	self.scrollbtnCurrOffset = 0;
	self.isVariableContent = true;
	self.cntHeight = self.cnt.height();

	// 延時執行的目的：IE獲取 self.cnt.offsetHeight 需要時間
	setTimeout( function(){ 
		self.work();
		if( self.isVariableContent ){
			self.initWhenContentChange();
		}
	}, 350 );
};

ScrollEmulate.prototype = {
	
	/* 是否支持translae3d */
	has3d : "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix	|| 'MozTransition' in document.createElement('DIV').style
	
	/* 是否触屏设备 */
	, hasTouch : "ontouchstart" in window

	/* 是否IE浏览器 */
	, isIE: /trident/.test( navigator.userAgent.toLowerCase() )

	/* 是否webkit内核浏览器 */
	, isWebkit: /webkit/.test( navigator.userAgent.toLowerCase() )

	/* 获取translate的纵向偏移量 */
	, getTranslateY: function(obj){
		var self = this
			,transform = obj.css('transform')
			,transform_arr = transform.split(',')
			,transform_arr_len = transform_arr.length;

		return parseInt( transform_arr[transform_arr_len-1], 10 );
	}

	/* 设置scrollbtn的高度 */
	, setScrollBtnHeight : function(){
		var self = this
			 , cntHeight = self.cnt.height()
			 , wrapHeight = self.wrap.height()
			 , isCntHeigher =  cntHeight > wrapHeight
		if( isCntHeigher ){
			// wrapHeight / cntHeight =  scrollbtnHeight / wrapHeight  -->  scrollbtnHeight = wrapHeight * wrapHeight / cntHeight
			var scrollbtnHeight = parseInt( Math.pow( wrapHeight, 2 ) / cntHeight, 10 );
			self.scrollbtn.css( 'height', scrollbtnHeight);
		}else{
			self.scrollbar.hide();
		}	
	}

	/* 设置元素的纵向位置 */
	, pos : function( obj, offset ){
		var self = this;
		if( self.has3d ){ 
			 if( self.isWebkit ){
			 	obj.css( '-webkit-transform', 'translate3d(0,' + offset + 'px' + ',0' );		
			 }else{
			 	obj.css( 'transform', 'translate3d(0,' + offset + 'px' + ',0' );		
			 }
		}else{
			 obj.css( 'top', offset);
		}
	}
    
	/* 获取当前元素的纵向偏移量 */
	, getCurrOffset : function( obj ){
		  var self = this
			    ,offsetY = 0;
		  if( self.has3d ){
		  	  // 获取当前translate3d的纵向值
			  offsetY = self.getTranslateY(obj); // parseInt( translate.match(/,(.*),/)[1].replace(/\s*/, '').toNum(), 10 ); 
		  }else{
		  	  var top = obj.css( 'top' );
			  // 获取当前top的纵向值
			  offsetY = parseInt( top.substring(0, top.length - 2), 10 );
		  }
		  return offsetY;
	}

	/* 设置 scrollBtn 位置 , 主导 scrollCnt 位移
	    deltaY：鼠标即时的纵向位移 
	*/
	, setScrollBtnPos : function( deltaY ){
		var self = this
			 ,currOffset = self.scrollbtnCurrOffset;
		currOffset += deltaY;
		// 消除误差
		if( currOffset <= self.scrollbtnOffsetLimit[0] ){
			 currOffset = self.scrollbtnOffsetLimit[0];
		}else if( currOffset >= self.scrollbtnOffsetLimit[1] ){
			 currOffset = self.scrollbtnOffsetLimit[1]
		}
		self.setScrollCntPos_ByScrollBtn( currOffset );
		self.pos( self.scrollbtn, currOffset ); 
	}
    
	/* 设置 scrollCnt 位置 , 根据	scrollBtn 联动
		scrollBtnOffset：scrollBtn即时的纵向位移 
	*/
    , setScrollCntPos_ByScrollBtn : function( scrollBtnOffset ){
		var self = this
			 ,currOffset = self.cntCurrOffset;
			currOffset = - ( scrollBtnOffset / self.wrap.height() ) * self.cnt.height();
			// 消除误差
			if( currOffset <= self.cntOffsetLimit[0] ){
				 currOffset = self.cntOffsetLimit[0];
			}else if( currOffset >= self.cntOffsetLimit[1] ){
				 currOffset = self.cntOffsetLimit[1];
			}
		self.pos( self.cnt, currOffset ); 
	}

	/* 设置 scrollCnt 位置 , 主导	scrollBtn 位移 */
	, setScrollCntPos : function( deltaY ){
		var self = this
			 ,currOffset = self.cntCurrOffset;
		currOffset += deltaY;
		// 消除误差
		if( currOffset <= self.cntOffsetLimit[0] ){
			 currOffset = self.cntOffsetLimit[0];
		}else if( currOffset >= self.cntOffsetLimit[1] ){
			 currOffset = self.cntOffsetLimit[1];
		}
		self.setScrollBtnPos_ByScrollCnt( currOffset );
		self.pos( self.cnt, currOffset ); 
	}

	/* 设置 scrollBtn 位置 , 根据	scrollCnt 联动
		scrollCntOffset：scrollCnt即时的纵向位移 
	*/
    , setScrollBtnPos_ByScrollCnt : function( scrollCntOffset ){
		var self = this
			 ,currOffset = self.scrollbtnCurrOffset;
			currOffset = - ( scrollCntOffset * self.wrap.height() ) / self.cnt.height();
		// 消除误差
		if( currOffset <= self.scrollbtnOffsetLimit[0] ){
			 currOffset = self.scrollbtnOffsetLimit[0];
		}else if( currOffset >= self.scrollbtnOffsetLimit[1] ){
			 currOffset = self.scrollbtnOffsetLimit[1]
		}
		self.pos( self.scrollbtn, currOffset ); 
	}

	/* 联动指挥
	    deltaY：鼠标即时的纵向位移 	
	*/
	, setPos : function( deltaY ){
		  var self = this;
		  if( !self.hasTouch ){
			// 桌面版，滚动按钮 1 : 1 移动，内容区联动 
			self.setScrollBtnPos( deltaY );
		  }else{
			// 移动版，内容区 1 : 1 移动，滚动按钮联动 
			self.setScrollCntPos( deltaY );			
		  }
	}

	/* 事件句柄中转站 */
 //    , handleEvent : function( event ){
	// 	var self = this;
	// 	if ( !self.hasTouch ){
	// 		event.preventDefault();
	// 	} 
	// 	switch ( event.type ) {
	// 		case 'mousedown':
	// 			self.mousedown( event );
	// 			break;
	// 		case 'mousemove':
	// 			self.mousemove( event );
	// 			break;
	// 		case 'mouseup':
	// 			self.mouseup( event );
	// 			break;
	// 		 case 'mousewheel':
	// 			self.mousewheel( event );
	// 			break;
	// 	}	
	// }
   
	/* 协助维护鼠标纵向偏移量 */
	, mousedown : function( event ){
		var self = this
			 ,event = self.hasTouch ? event.touches[0] : event;
		// 节流模块（与业务逻辑无关）
		self.directionLocked = false;
		// 记录鼠标起始坐标	 （协助计算 scrollBtn 偏移量）
		self.pointX = ( self.isIE ? event.clientX : event.pageX );
		self.pointY = ( self.isIE ? event.clientY : event.pageY );
		self.cntCurrOffset = self.getCurrOffset( self.cnt );
		self.scrollbtnCurrOffset = self.getCurrOffset( self.scrollbtn );
		// 注册事件
		$( document ).bind( 'mousemove', (function(self){ 
												return function(event){ 
												   if ( !self.hasTouch ){ event.preventDefault(); }	
											   	   self.mousemove.call(self,event);
											    }; 
										 })(self)
						  );	
		$( document ).bind( 'mouseup', (function(self){ 
												return function(event){ 
												   if ( !self.hasTouch ){ event.preventDefault(); }	
											   	   self.mouseup.call(self,event);
											    }; 
									   })(self)
						  );			
	}

	/* 维护鼠标纵向偏移量 */
	, mousemove : function( event ){
		var self = this
			 ,event = self.hasTouch ? event.touches[0] : event
			 // 计算 scrollBtn 即时偏移量
			 ,deltaX = ( self.isIE ? event.clientX : event.pageX ) - self.pointX
			 ,deltaY = ( self.isIE ? event.clientY : event.pageY ) - self.pointY;

		// 启动联动
		self.setPos( deltaY );
	}
	
	/* 取消绑定事件 */
	, mouseup : function(){
		var self = this;
		$( document ).unbind( 'mousemove' );
		$( document ).unbind( 'mouseup' );
	}

	/* 初始化 self.cnt 、self.scrollbtn 的offset */
	, initOffset : function( currScrollbtnOffset ){
		 var self = this
		       , offsetY = 	isNaN( currScrollbtnOffset ) ? 0 : currScrollbtnOffset; 
		 if( self.has3d ){
			  if( offsetY != 0 ){
				  if( self.isWebkit ){
					  self.scrollbtn.css( '-webkit-transform' , 'translate3d(0, ' + offsetY + ', 0)' );
				  }else{
				  	  self.scrollbtn.css( 'transform' , 'translate3d(0, ' + offsetY + ', 0)' );
				  }
				  self.setScrollCntPos_ByScrollBtn( offsetY );
			  }else{
				  if( self.isWebkit ){
					  self.cnt.css( '-webkit-transform' , 'translate3d(0, 0, 0)' );
					  self.scrollbtn.css( '-webkit-transform' , 'translate3d(0, 0, 0)' );
				  }else{
				  	  self.cnt.css( 'transform' , 'translate3d(0, 0, 0)' );
				  	  self.scrollbtn.css( 'transform' , 'translate3d(0, 0, 0)' );
				  }
			  }
		 }else{
			  if( offsetY != 0 ){
				  self.scrollbtn.css( 'top' , offsetY );
				  self.setScrollCntPos_ByScrollBtn( offsetY );
			  }else{
				  self.cnt.css( 'top' , 0 );
				  self.scrollbtn.css( 'top' , 0 );
			  }
		 }
	}

// 	/* 鼠标滑轮事件 */
// 	,mousewheel : function( event ){
// 		var self = this;
// 		self.cntCurrOffset = self.getCurrOffset( self.cnt );
// 		self.scrollbtnCurrOffset = self.getCurrOffset( self.scrollbtn );	
// 		if( nmg.isWheelDown( event ) ){
// 			// 向后滑动	 , 滚动按钮向下移动 
// 			self.setPos( 40 );
// 		}else{
// 			// 向前滑动	 , 滚动按钮向上移动 
// 			self.setPos( -40 );
// 		}
// 	}

	/* 初始化 */
    , init : function( currScrollbtnOffset ){
		var self = this;
		// 初始化
		self.setScrollBtnHeight();
		self.scrollbtnOffsetLimit = [ 0, self.wrap.height() - self.scrollbtn.height() ];
		// IE 必須此時賦值
		self.cntOffsetLimit = [ self.wrap.height() - self.cnt.height(), 0 ];
		self.initOffset( currScrollbtnOffset );   
    }

	/* 內容高度變化後 重新初始化 */
    , initWhenContentChange : function(){
		var self = this;
		setInterval(function(){
			var currCntHeight = self.cnt.height();
			if( currCntHeight != self.cntHeight ){
				var currScrollbtnOffset = self.getCurrOffset( self.scrollbtn );
				self.init( currScrollbtnOffset );
				self.cntHeight = currCntHeight;
			}
		}, 500);
    }

    /* 启动模拟 */
    , work : function(){
		var self = this;
		self.init();
		if( !self.hasTouch ){
			// 针对桌面版
			self.scrollbtn.bind( 'mousedown', (function(self){ 
													return function(event){ 
													   if ( !self.hasTouch ){ event.preventDefault(); }	
												   	   self.mousedown.call(self,event);
												    }; 
											  })(self)
							   );
			//self.wrap.bind( 'mousewheel', self );
		}else{
			// 针对移动版
			self.cnt.bind( 'mousedown', (function(self){ 
											return function(event){ 
											   if ( !self.hasTouch ){ event.preventDefault(); } 												
										   	   self.mousedown.call(self,event);
										    }; 
									    })(self)
						 );			
		}
    }

}




