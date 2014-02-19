/* SCROLLBAR 重构版
	设计特点：
	1.鼠标事件专注维护鼠标纵向偏移量
	2.scrollBtn依据鼠标纵向偏移量进行位移，scrollCnt按照scrollBtn位置计算位移
	3.设立pos方法专门处理位移方式，让top或transition的切换更灵活
	4.以达到桌面版与平板共用一套HTML，页面行为统一由base_scrollbar.js处理
	5.支持translae3d的使用translae3d，否则使用top
	6.支持mousewheel鼠标滑轮事件
	7.支持动态增删内容，调整后（如果滚动条还处于显示状态），滚动按钮处于调整前的位置上
	8.围绕公司项目需求定制，无需设置任何参数
*/
var ScrollEmulate = function( scrollboxId ){
	var self = this
		 ,scrollboxId = '#' + scrollboxId + ' ';
	self.wrap = nmg( scrollboxId );
	self.cnt = nmg( scrollboxId + '.j_cntbox' );
	self.scrollbar = nmg( scrollboxId + '.j_bar' );	
	self.scrollbtn = nmg( scrollboxId + '.j_point' );
	self.scrollbtnOffsetLimit = [];
	self.cntOffsetLimit = [];
	self.pointX = 0;
	self.pointY = 0;
	self.cntCurrOffset = 0;
	self.scrollbtnCurrOffset = 0;
	self.isVariableContent = true;
	self.cntHeight = self.cnt.height().toNum();

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

	/* 设置scrollbtn的高度 */
	, setScrollBtnHeight : function(){
		var self = this
			 , cntHeight = self.cnt.height().toNum()
			 , wrapHeight = self.wrap.css( 'height' ).toNum()
			 , isCntHeigher =  cntHeight > wrapHeight
		if( isCntHeigher ){
			// wrapHeight / cntHeight =  scrollbtnHeight / wrapHeight  -->  scrollbtnHeight = wrapHeight * wrapHeight / cntHeight
			var scrollbtnHeight = parseInt( Math.pow( wrapHeight, 2 ) / cntHeight, 10 );
			self.scrollbtn.css( 'height', scrollbtnHeight + 'px' );
		}else{
			self.scrollbar.hide();
		}	
	}

	/* 设置元素的纵向位置 */
	, pos : function( obj, offset ){
		var self = this;
		if( self.has3d && !nmg.browser.isFirefox ){ 
			 obj.css( 'translate', '0,' + offset + 'px' );		
		}else{
			 obj.css( 'top', offset + 'px' );
		}
	}
    
	/* 获取当前元素的纵向偏移量 */
	, getCurrOffset : function( obj ){
		  var self = this
			    ,offsetY = 0;
		  if( self.has3d && !nmg.browser.isFirefox ){
		  	  // 获取当前translate3d的纵向值
			  var translate = obj.css( 'translate' );
			  offsetY = parseInt( translate.match(/,(.*),/)[1].replace(/\s*/, '').toNum(), 10 ); 
		  }else{
			  // 获取当前top的纵向值
			  offsetY = parseInt( obj.css( 'top' ).toNum(), 10 );
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
			currOffset = - ( scrollBtnOffset / self.wrap.height().toNum() ) * self.cnt.height().toNum();
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
			currOffset = - ( scrollCntOffset * self.wrap.height().toNum() ) / self.cnt.height().toNum();
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
    , handleEvent : function( event ){
		var self = this;
		if ( !nmg.support.hasTouch ){
			nmg.preventDefault( event );
		} 
		switch ( event.type ) {
			case eventFix.mousedown:
				self.mousedown( event );
				break;
			case eventFix.mousemove:
				self.mousemove( event );
				break;
			case eventFix.mouseup:
				self.mouseup( event );
				break;
			 case eventFix.mousewheel:
				self.mousewheel( event );
				break;
		}	
	}
   
	/* 协助维护鼠标纵向偏移量 */
	, mousedown : function( event ){
		var self = this
			 ,event = nmg.support.hasTouch ? event.touches[0] : event;
		// 节流模块（与业务逻辑无关）
		self.directionLocked = false;
		// 记录鼠标起始坐标	 （协助计算 scrollBtn 偏移量）
		self.pointX = ( nmg.browser.isIE ? event.clientX : event.pageX );
		self.pointY = ( nmg.browser.isIE ? event.clientY : event.pageY );
		self.cntCurrOffset = self.getCurrOffset( self.cnt );
		self.scrollbtnCurrOffset = self.getCurrOffset( self.scrollbtn );
		// 注册事件
		nmg( document ).bind( 'mousemove', self);	
		nmg( document ).bind( 'mouseup', self);		
	}

	/* 维护鼠标纵向偏移量 */
	, mousemove : function( event ){
		var self = this
			 ,event = nmg.support.hasTouch ? event.touches[0] : event
			 // 计算 scrollBtn 即时偏移量
			 ,deltaX = ( nmg.browser.isIE ? event.clientX : event.pageX ) - self.pointX
			 ,deltaY = ( nmg.browser.isIE ? event.clientY : event.pageY ) - self.pointY;

		// 启动联动
		self.setPos( deltaY );
	}
	
	/* 取消绑定事件 */
	, mouseup : function(){
		var self = this;
		nmg( document ).unbind( 'mousemove', self );
		nmg( document ).unbind( 'mouseup', self );
	}

	/* 初始化 self.cnt 、self.scrollbtn 的offset */
	, initOffset : function( currScrollbtnOffset ){
		 var self = this
		       , offsetY = 	isNaN( currScrollbtnOffset ) ? 0 : currScrollbtnOffset; 
		 if( self.has3d && !nmg.browser.isFirefox ){
			  if( offsetY != 0 ){
				  self.scrollbtn.css( 'translate' , '0, ' + offsetY );
				  self.setScrollCntPos_ByScrollBtn( offsetY );
			  }else{
				  self.cnt.css( 'translate' , '0, 0' );
				  self.scrollbtn.css( 'translate' , '0, 0' );
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

	/* 鼠标滑轮事件 */
	,mousewheel : function( event ){
		var self = this;
		self.cntCurrOffset = self.getCurrOffset( self.cnt );
		self.scrollbtnCurrOffset = self.getCurrOffset( self.scrollbtn );	
		if( nmg.isWheelDown( event ) ){
			// 向后滑动	 , 滚动按钮向下移动 
			self.setPos( 40 );
		}else{
			// 向前滑动	 , 滚动按钮向上移动 
			self.setPos( -40 );
		}
	}

	/* 初始化 */
    , init : function( currScrollbtnOffset ){
		var self = this;
		// 初始化
		self.setScrollBtnHeight();
		self.scrollbtnOffsetLimit = [ 0, self.wrap.height().toNum() - self.scrollbtn.height().toNum() ];
		// IE 必須此時賦值
		self.cntOffsetLimit = [ self.wrap.height().toNum() - self.cnt.height().toNum(), 0 ];
		self.initOffset( currScrollbtnOffset );   
    }

	/* 內容高度變化後 重新初始化 */
    , initWhenContentChange : function(){
		var self = this;
		setInterval(function(){
			var currCntHeight = self.cnt.height().toNum();
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
			self.scrollbtn.bind( 'mousedown', self );
			self.wrap.bind( 'mousewheel', self );
		}else{
			// 针对桌面版
			self.cnt.bind( 'mousedown', self );
		}
    }

}




