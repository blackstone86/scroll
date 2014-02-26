#Scroll

##关于

Scroll 是一款模拟滚动条的js插件，类似于iScroll，用于改变网页默认的滚动条样式

##优点
 - 兼容 WebSite 和 Mobile Web
 - 轻松定制滚动条样式，样式与插件分离
 - 使用方便，无需设置参数
 - 支持动态添加内容
 - 支持多个滚动实例同时工作
 - 支持鼠标滚轮事件
 - 轻量，压缩后5Kb
 - 提供jQuery版本

##注意
 - 依赖base.js（个人开发的基础库）
 - Scroll 提供了基础样式，用户可以专注编写定制的滚动条样式，为了避免样式冲突，基础样式的class都以'j_'开头

##效果
 - WebSite：用户通过滑动滚动条，使内容滚动显示
 - Mobile Web：用户手指触摸滚动区内容，内容根据手指滑动1:1滚动显示

##有待完善
 - 在滑动的时候没有惯性处理

##基础样式
``` style
.j_scrollbox,.j_scrollbox .j_cntbox,.j_scrollbox .j_cntwrap{ position:relative; } 
.j_scrollbox{ width:500px; height:100px;}/*可视区域尺寸*/
.j_scrollbox .j_cntwrap,.j_scrollbox .j_bar{ height:100%; }
.j_scrollbox .j_cntwrap{ width:100%; overflow:hidden; }
.j_scrollbox .j_bar,.j_scrollbox .j_point{ right:-5px; position:absolute; background:#000; width:1px; }
.j_scrollbox .j_bar{ top:0; }
.j_scrollbox .j_point{ width:7px; right:-3px; height:30px; outline:none; }
```

##例子

###CASE 1

``` 自定義樣式
.mybox{ padding:25px; background:#666; float:left; }
.mybox .j_scrollbox{ width:500px; height:216px; color:#fff; }
.mybox .j_scrollbox .j_bar{ right: -13px; }
```

``` html
<div class="mybox">
  <div id="scrollbox" class="j_scrollbox">
    <div class="j_cntwrap">
      <div class="j_cntbox">
        <h1>contact us</h1>
        <p>misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食</p>  
      </div>        
    </div>
    <div class="j_bar">
      <a href="javascript:" class="j_point"></a>
    </div>
  </div>  
</div> 
<script src="js/base.min.js"></script>
<script src="js/scroll.min.js"></script>
```

``` js
nmg('#scrollbox').toScrollBar();
```

###CASE 2

 动态添加内容

``` html
<div class="mybox">
  <div id="scrollbox" class="j_scrollbox">
    <div class="j_cntwrap">
      <div class="j_cntbox">
        <h1>contact us</h1>
        <p class="cnt_box">misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支攻速食市場的分支mi2cool場的分支misocool攻速食</p>  
      </div>        
    </div>
    <div class="j_bar">
      <a href="javascript:" class="j_point"></a>
    </div>
  </div>   
</div>
<button id="btn">更多內容</button>
<script src="js/base.min.js"></script>
<script src="js/scroll.min.js"></script>
```
``` js
var cnt = '动态添加的内容。动态添加的内容。动态添加的内容。动态添加的内容。';
nmg('#btn').bind('click',function(){
  nmg('.cnt_box').html( nmg('.cnt_box').html() + cnt ); 
});
```
