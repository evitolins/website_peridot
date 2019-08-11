
/////////// lt IE9 detection //////////
var ie = (function(){
    var undef,v = 3,div = document.createElement('div'),all = div.getElementsByTagName('i');
    while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',all[0]);
		return v > 4 ? v : undef;
}());
var ltIE9 = (ie && ie < 9);

/////////// Menu Scripts ////////////

var closeTime = 200;
var closeTmr, openItem;

function menu_overHandler()
{
	jQuery(this).stop().animate({left:0},'fast');
	
	if(closeTmr)
		{ window.clearTimeout(closeTmr); closeTmr = null; }
	
	var newOpenItem = jQuery(this).find('ul');
	if (openItem && openItem.get(0) == newOpenItem.get(0)) return;
	menu_closeMenuItems();
	openItem = newOpenItem;
	
	if(openItem)
		{ openItem.stop(true,true).fadeIn(ltIE9?0:'fast'); }
}

function menu_outHandler()
{
	jQuery(this).stop().animate({left:0},'fast');
	
	if(closeTmr)
		{ window.clearTimeout(closeTmr); closeTmr = null; }
	
	closeTmr = window.setTimeout(menu_closeMenuItems, closeTime);
}

function menu_closeMenuItems()
{
	if(openItem)
		{ openItem.stop(true,true).fadeOut(ltIE9?0:'slow'); }
	openItem = null;
}

/* jQuery("#nav li a").bind('click', menu_closeMenuItems); */




///////////////// this will be used by the ajax contact form
var formvars = '', errMsgArea, succMsgArea;
var isProcessingContact = false;
function processContactForm()
{
	// to prevent multi-clicking sending a ton of messages
	if (isProcessingContact) return;
	
	formvars = '';
	errMsgArea = jQuery('.contact-form .error-msg');
	succMsgArea = jQuery('.contact-form .success-msg');
	errMsgArea.text('');
	succMsgArea.text('');
	
	jQuery('.contact-form input, .contact-form textarea').each(function(i){
		var nm = jQuery(this).attr('name');
		var val = jQuery(this).val();
		if (nm == 'name') {
			if (val.length <= 0) errMsgArea.text(CFE_NAME);
		} else if (nm == 'message') {
			if (val.length <= 0) errMsgArea.text(CFE_MSG);
		} else if (nm == 'email') {
			if (!(new RegExp(/\S+@.+\.\S+/i)).test(val)) errMsgArea.text(CFE_EMAIL);
		} else if (nm == 'phone') {
			if (val.length <= 0) errMsgArea.text(CFE_PHONE);
		}
		
		formvars += (i==0?'':'&')+nm+'='+escape(val);
	});
	
	if (errMsgArea.text() != '') { errMsgArea.hide().slideDown(); return false; }
	
	isProcessingContact = true;
	
	//alert(formvars); return;
	jQuery.ajax(jQuery('.contact-form').attr('action'), {  
		type: "POST",    
		data: formvars,  
		success: function(data) {
			succMsgArea.text(data);
			succMsgArea.hide().fadeIn();
			isProcessingContact = false;
		},
		error: function() {
			succMsgArea.text('Error, check internet connection.');
			succMsgArea.hide().fadeIn();
			isProcessingContact = false;
		}
	});
	
	succMsgArea.text(CF_SENDING);
	succMsgArea.hide().slideDown();
	
	return true;
}



//////////// functions for setting up galleries and hover effects for images ///////////

// this function adds hover colors/images for images
var addHover = function(className, obj){
	var img = obj.children('img');
	var overlay = jQuery('<div class="'+className+'">&nbsp;</div>').css({
		'height': '100%','width': '100%',
		'position': 'absolute','top': 0,'left': 0,
		'opacity': 0.0
	});
	obj.append(overlay);
	obj.bind('mouseover', function(){ var o = obj.children('.'+className).stop().animate({ 'opacity': 0.6 }, 'fast'); });
	obj.bind('mouseout', function(){ var o = obj.children('.'+className).stop().animate({ 'opacity': 0.0 }, 'fast'); });
}

// this function processes colorbox stuff and adds the lightbox functionality and parses the href for swfs, iframes or video
var processForLightBox = function(groupName, obj){
	var href = obj.attr('href');
	var ext = href.substr(href.length-3);
	if (groupName != null) obj.attr('rel', groupName);
	var vars = new Object();
	var hClass = 'lightbox-h-div';
	
	if (obj.hasClass('lightbox-youtube')) {
		href = href.match(/(&|\?)v=(.*?)($|&)/i)[2];
		obj.attr('href', 'http://www.youtube.com/embed/'+href+'?autohide=1&autoplay=1&modestbranding=1&showinfo=0&showsearch=0');
		vars.type = 'iframe';
		vars.showNavArrows = false;
		hClass = 'video-h-div';
	}
	else if (obj.hasClass('lightbox-vimeo')) {
		href = href.match(/(vimeo.com\/)(.*?)(\/|\?|$)/i)[2];
		obj.attr('href', 'http://player.vimeo.com/video/'+href+'?autoplay=1&color=ffffff&title=0&byline=0&portrait=0');
		vars.type = 'iframe';
		vars.showNavArrows = false;
		hClass = 'video-h-div';
	}
	else if (obj.hasClass('lightbox-video')) {
		obj.attr('href', 'flash/hostedvideo.swf');
		vars.type = 'swf';
		vars.swf = {flashvars:'video='+href+'&autoplay=y', allowfullscreen:'true', wmode:'opaque'};
		vars.showNavArrows = false;
		hClass = 'video-h-div';
	}
	else if (obj.hasClass('lightbox-flash')) {
		vars.type = 'swf';
		hClass = 'swf-h-div';
	}
	else if (obj.hasClass('lightbox-iframe')) {
		vars.type = 'iframe';
		vars.showNavArrows = false;
		hClass = 'iframe-h-div';
	}
	
	vars.overlayColor = '#000';
	obj.fancybox(vars);
	addHover(hClass, obj);
}



////////////////// add in the preloading, having it in js is much more modular, being js only is a small price to pay for that :) //////////////
var wS = DEFAULT_BG_COLOR == '#FFFFFF' ? '-wht' : '';
var hoverLoader = '<div class="hover-ldr">';
hoverLoader += '<img src="img/submenu-sep.png" /><img src="img/submenu-end.png" /><img src="img/submenu-mid.png" /><img src="img/submenu-start.png" /><img src="img/menu-dots.png" /><img src="img/exit-btn-img'+wS+'.png" /><img src="img/exit-btn-img-hover'+wS+'.png" />';
hoverLoader += '<img src="img/btns/dark-l-hover.png" /><img src="img/btns/dark-r-hover.png" /><img src="img/btns/blue-l-hover.png" /><img src="img/btns/blue-r-hover.png" /><img src="img/btns/teal-l-hover.png" /><img src="img/btns/teal-r-hover.png" /><img src="img/btns/red-l-hover.png" /><img src="img/btns/red-r-hover.png" /><img src="img/btns/green-l-hover.png" /><img src="img/btns/green-r-hover.png" /><img src="img/btns/grey-l-hover.png" /><img src="img/btns/grey-r-hover.png" /><img src="img/btns/med-dark-l-hover.png" /><img src="img/btns/med-dark-r-hover.png" /><img src="img/btns/med-blue-l-hover.png" /><img src="img/btns/med-blue-r-hover.png" /><img src="img/btns/med-teal-l-hover.png" /><img src="img/btns/med-teal-r-hover.png" /><img src="img/btns/med-red-l-hover.png" /><img src="img/btns/med-red-r-hover.png" /><img src="img/btns/med-green-l-hover.png" /><img src="img/btns/med-green-r-hover.png" /><img src="img/btns/med-grey-l-hover.png" /><img src="img/btns/med-grey-r-hover.png" /><img src="img/btns/lar-dark-l-hover.png" /><img src="img/btns/lar-dark-r-hover.png" /><img src="img/btns/lar-blue-l-hover.png" /><img src="img/btns/lar-blue-r-hover.png" /><img src="img/btns/lar-teal-l-hover.png" /><img src="img/btns/lar-teal-r-hover.png" /><img src="img/btns/lar-red-l-hover.png" /><img src="img/btns/lar-red-r-hover.png" /><img src="img/btns/lar-green-l-hover.png" /><img src="img/btns/lar-green-r-hover.png" /><img src="img/btns/lar-grey-l-hover.png" /><img src="img/btns/lar-grey-r-hover.png" />';
hoverLoader += '<img src="img/icons/facebook.png" /><img src="img/icons/twitter.png" /><img src="img/icons/linkedin.png" /><img src="img/icons/vimeo.png" /><img src="img/icons/rss.png" /><img src="img/icons/flickr.png" /><img src="img/icons/myspace.png" /><img src="img/icons/reddit.png" /><img src="img/icons/stumbleupon.png" /><img src="img/icons/youtube.png" />';
hoverLoader += '<img src="img/icons/facebook-share-hover'+wS+'.png" /><img src="img/icons/twitter-share-hover'+wS+'.png" /><img src="img/icons/digg-share-hover'+wS+'.png" /><img src="img/icons/reddit-share-hover'+wS+'.png" /><img src="img/icons/del-share-hover'+wS+'.png" /><img src="img/icons/stumble-share-hover'+wS+'.png" /><img src="img/icons/facebook-like-hover'+wS+'.png" />';
hoverLoader += '</div>';



/////////////// for making elastic input boxes //////////////////
(function(jQuery){jQuery.fn.extend({elastic:function(){var mimics=['paddingTop','paddingRight','paddingBottom','paddingLeft','fontSize','lineHeight','fontFamily','width','fontWeight','border-top-width','border-right-width','border-bottom-width','border-left-width','borderTopStyle','borderTopColor','borderRightStyle','borderRightColor','borderBottomStyle','borderBottomColor','borderLeftStyle','borderLeftColor'];return this.each(function(){if(this.type!=='textarea'){return false}var $textarea=jQuery(this),$twin=jQuery('<div />').css({'position':'absolute','display':'none','word-wrap':'break-word'}),lineHeight=parseInt($textarea.css('line-height'),10)||parseInt($textarea.css('font-size'),'10'),minheight=parseInt($textarea.css('height'),10)||lineHeight*3,maxheight=parseInt($textarea.css('max-height'),10)||Number.MAX_VALUE,goalheight=0;if(maxheight<0){maxheight=Number.MAX_VALUE}$twin.appendTo($textarea.parent());var i=mimics.length;while(i--){$twin.css(mimics[i].toString(),$textarea.css(mimics[i].toString()))}function setTwinWidth(){curatedWidth=Math.floor(parseInt($textarea.width(),10));if($twin.width()!==curatedWidth){$twin.css({'width':curatedWidth+'px'});update(true)}}function setHeightAndOverflow(height,overflow){var curratedHeight=Math.floor(parseInt(height,10));if($textarea.height()!==curratedHeight){$textarea.css({'height':curratedHeight+'px','overflow':overflow});$textarea.trigger('resize')}}function update(forced){var textareaContent=$textarea.val().replace(/&/g,'&amp;').replace(/ {2}/g,'&nbsp;').replace(/<|>/g,'&gt;').replace(/\n/g,'<br />');var twinContent=$twin.html().replace(/<br>/ig,'<br />');if(forced||textareaContent+'&nbsp;'!==twinContent){$twin.html(textareaContent+'&nbsp;');if(Math.abs($twin.height()+lineHeight-$textarea.height())>3){var goalheight=$twin.height()+lineHeight;if(goalheight>=maxheight){setHeightAndOverflow(maxheight,'auto')}else if(goalheight<=minheight){setHeightAndOverflow(minheight,'hidden')}else{setHeightAndOverflow(goalheight,'hidden')}}}}$textarea.css({'overflow':'hidden'});$textarea.bind('keyup change cut paste',function(){update()});jQuery(window).bind('resize',setTwinWidth);$textarea.bind('resize',setTwinWidth);$textarea.bind('update',update);$textarea.bind('blur',function(){if($twin.height()<maxheight){if($twin.height()>minheight){$textarea.height($twin.height())}else{$textarea.height(minheight)}}});$textarea.bind('input paste',function(e){setTimeout(update,250)});update()})}})})(jQuery);



////////////// tipsy /////////////////////
(function($){function fixTitle($ele){if($ele.attr('title')||typeof($ele.attr('original-title'))!='string'){$ele.attr('original-title',$ele.attr('title')||'').removeAttr('title');}}function Tipsy(element,options){this.$element=$(element);this.options=options;this.enabled=true;fixTitle(this.$element);}Tipsy.prototype={show:function(){var title=this.getTitle();if(title&&this.enabled){var $tip=this.tip();$tip.find('.tipsy-inner')[this.options.html?'html':'text'](title);$tip[0].className='tipsy';$tip.remove().css({top:0,left:0,visibility:'hidden',display:'block'}).appendTo(document.body);var pos=$.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight});var actualWidth=$tip[0].offsetWidth,actualHeight=$tip[0].offsetHeight;var gravity=(typeof this.options.gravity=='function')?this.options.gravity.call(this.$element[0]):this.options.gravity;var tp;switch(gravity.charAt(0)){case 'n':tp={top:pos.top+pos.height+this.options.offset,left:pos.left+pos.width/2-actualWidth/2};break;case 's':tp={top:pos.top-actualHeight-this.options.offset,left:pos.left+pos.width/2-actualWidth/2}; break;case 'e':tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth-this.options.offset};break;case 'w':tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width+this.options.offset};break;}if(gravity.length==2){if(gravity.charAt(1)=='w'){tp.left=pos.left+pos.width/2-15;}else{tp.left=pos.left+pos.width/2-actualWidth+15;}}$tip.css(tp).addClass('tipsy-'+gravity);if(this.options.fade){$tip.stop().css({opacity:0,display:'block',visibility:'visible'}).animate({opacity:this.options.opacity});}else{$tip.css({visibility:'visible',opacity:this.options.opacity});}}},hide:function(){if(this.options.fade){this.tip().stop().fadeOut(function(){$(this).remove();});}else{this.tip().remove();}},getTitle:function(){var title,$e=this.$element,o=this.options;fixTitle($e);var title,o=this.options;if(typeof o.title=='string'){title=$e.attr(o.title=='title'?'original-title':o.title);}else if(typeof o.title=='function'){title=o.title.call($e[0]);}title=(''+title).replace(/(^\s*|\s*$)/,"");return title||o.fallback;},tip:function(){if(!this.$tip){this.$tip=$('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>');}return this.$tip;},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null;}},enable:function(){this.enabled=true;},disable:function(){this.enabled=false;},toggleEnabled:function(){this.enabled=!this.enabled;}};$.fn.tipsy=function(options){if(options===true){return this.data('tipsy');}else if(typeof options=='string'){return this.data('tipsy')[options]();}options=$.extend({},$.fn.tipsy.defaults,options);function get(ele){var tipsy=$.data(ele,'tipsy');if(!tipsy){tipsy=new Tipsy(ele,$.fn.tipsy.elementOptions(ele,options));$.data(ele,'tipsy',tipsy);}return tipsy;}function enter(){var tipsy=get(this);tipsy.hoverState='in';if(options.delayIn==0){tipsy.show();}else{setTimeout(function(){if(tipsy.hoverState=='in')tipsy.show();},options.delayIn);}};function leave(){var tipsy=get(this);tipsy.hoverState='out';if(options.delayOut==0){tipsy.hide();}else{setTimeout(function(){if(tipsy.hoverState=='out')tipsy.hide();},options.delayOut);}};if(!options.live)this.each(function(){get(this);});if(options.trigger!='manual'){var binder=options.live?'live':'bind',eventIn=options.trigger=='hover'?'mouseenter':'focus',eventOut=options.trigger=='hover'?'mouseleave':'blur';this[binder](eventIn,enter)[binder](eventOut,leave);}return this;};$.fn.tipsy.defaults={delayIn:0,delayOut:0,fade:false,fallback:'',gravity:'n',html:false,live:false,offset:0,opacity:0.8,title:'title', trigger:'hover'};$.fn.tipsy.elementOptions=function(ele,options){return $.metadata?$.extend({},options,$(ele).metadata()):options;};$.fn.tipsy.autoNS=function(){return $(this).offset().top>($(document).scrollTop()+$(window).height()/2)?'s':'n';};$.fn.tipsy.autoWE=function(){return $(this).offset().left>($(document).scrollLeft()+$(window).width()/2)?'e':'w';};})(jQuery);



//////////////// calls when page is ready ///////////////////
jQuery(document).ready(function($)
{
/*
	// set up the menu
	$('#nav').children('li').bind('mouseover', menu_overHandler);
	$('#nav').children('li').bind('mouseout',  menu_outHandler);
	$('#nav').children('li').children('ul').css('visibility', 'visible');
	$('#nav').children('li').children('ul').hide();
	
*/
	
	// fade in anything marked to (if not IE8 or lower)
	if (!ltIE9) {
	$('.fade-in-slow').animate({opacity:0}, 0).delay(2400).animate({opacity:1}, 1500);
	$('.fade-in').animate({opacity:0}, 0).delay(1000).animate({opacity:1}, 700);
	$('.fade-in-first').animate({opacity:0}, 0).delay(1000).animate({opacity:1}, 700);
	$('.fade-in-second').animate({opacity:0}, 0).delay(1200).animate({opacity:1}, 700);
	$('.fade-in-third').animate({opacity:0}, 0).delay(1400).animate({opacity:1}, 700);
	$('.fade-in-fourth').animate({opacity:0}, 0).delay(1600).animate({opacity:1}, 700);
	$('.fade-in-fifth').animate({opacity:0}, 0).delay(1800).animate({opacity:1}, 700);
	$('.fade-in-sixth').animate({opacity:0}, 0).delay(2000).animate({opacity:1}, 700);
	}
	
	// make the zebra tables actually zebra
	$('.horizontal-zebra tr:odd').addClass('odd');
	$('.vertical-zebra tr').each(function(){ $(this).children('tr td, tr th').filter(':odd').addClass('odd'); });
	$('.vertical-zebra tr').each(function(){ $(this).children('tr td, tr th').filter(':even').addClass('even'); });
	
	// to mimick fixed position for the menu, but only for vertical scrolling (not horizontal) and also work on iOS<5
	$('#menu-wrapper').fixedCenter();
	// use js to set the menu widths correctly
	$(window).bind('resize', setMenuW);
	setMenuW();
	
	// set up functionality for the exit-box class
	$('.exit-box').each(function(i){
		var addition = $('<a onclick="javascript:exitBoxBtnClick('+i+');return false;" class="exit-box-btn" id="exit-box-id'+i+'"><div class="exit-box-btn-img"></div></a>');
		$(this).append(addition);
	});
	
	// add gallery hovering/lightbox abilities to the thumbs
	$('.gallery-2-columns').children('a').each(function(){ processForLightBox('gallery', $(this)); });
	$('.gallery-3-columns').children('a').each(function(){ processForLightBox('gallery', $(this)); });
	$('.gallery-4-columns').children('a').each(function(){ processForLightBox('gallery', $(this)); });
	$('.lightbox').each(function(){ processForLightBox(null, $(this)); });
	$('.lightbox-link').fancybox({type:'iframe'}); // add lightbox directly without any hover stuff, open link in iframe
	
	// add other hover types using the addHover function
	$('.magnify-hover').each(function(){ addHover('magnify-h-div', $(this)); });
	$('.arrow-hover').each(function(){ addHover('arrow-h-div', $(this)); });
	$('.plus-hover').each(function(){ addHover('plus-h-div', $(this)); });
	$('.swf-hover').each(function(){ addHover('swf-h-div', $(this)); });
	$('.video-hover').each(function(){ addHover('video-h-div', $(this)); });
	$('.iframe-hover').each(function(){ addHover('iframe-h-div', $(this)); });
	
	// add preloading images to the end of the body
	$('body').append($(hoverLoader));
	
	// add hover states to each of the icons in the footer
	$('.social-icons-left a img, .social-icons-right a img').each(function(){ $(this).bind('mouseover', function(){
		var s = $(this).attr('src');
		$(this).attr('src', s.substring(0,s.length-7)+'.png');
	}).bind('mouseout', function(){
		var s = $(this).attr('src');
		$(this).attr('src', s.substring(0,s.length-4)+'-bw.png');
	}); });
	
	// make the contact form and comment form textareas elastic
	$('.contact-form textarea').elastic();
	$('#commentform textarea').elastic();
	
	// enable tipsy support on anything with class .tooltip
	$('.tooltip').tipsy({gravity:'s', delayIn:500});
	
	// make menu links without an href show the default cursor
/* 	$("#nav li a:not([href])").css('cursor', 'default'); */
});



//////////////// below this line is a great place to put your analytics scripts ///////////////
