$('document').ready(function() {
							 
	/////////////////////////////////////////////
	// Navagation Menus
	/////////////////////////////////////////////
	$(".menu li").each(function() {
		// if has child menus  Если имеется под ме
		if( $(this).children('ul').length > 0 ) {
			// add the submenu class to it   добавить submenu класс к нему 
			$(this).find('a.active').append('<span class="indicator"></span>');
			$(this).addClass("submenu");
			if($(this).find('ul > .tr').length <= 0) // make sure there isnt one already there Убедитесь что там не один еще нет
				$(this).find('ul').prepend( $('<div class="tr" />') );
			// label first and last li elements  метка начала и конца li элементов
			$(this).find('ul.child > li:last').addClass("last-child");
			$(this).find('ul.child > li:first').addClass("first-child");
			if($(this).find('ul > .bf').length <= 0) // make sure there isnt one already there
				$(this).find('ul').append( $('<div class="bf" />') );
			// find the deep children classes
			$(this).find('ul.deep-child > li:last').addClass("last-child");
			$(this).find('ul.deep-child > li:first').addClass("first-child");
			var menuTimeOut = null;
			// label deep-child's li elements
			$(this).mouseenter(function() {
				// show if not already being shown
				$(this).find('ul.child').filter(":not(:animated)").stop().fadeIn(250);
				$(this).find('a').addClass("hover");
				if(menuTimeOut)
					clearTimeout(menuTimeOut);
			}).mouseleave(function() {
				//save parent
				var ele = this;
				 menuTimeOut = setTimeout(function(){
					$(ele).find('ul.child').stop().fadeOut(50);
					// Hide all child submenus
					$(ele).find('ul.child ul.deep-child').each(function() {
						$(this).css('display', 'none');													
					});
					$(ele).find('a').removeClass("hover");
				}, 75);				
			});
			// if has more sub classes
			if( $(this).find('ul').filter(":not(:first)").length > 0 ) {
				$(this).find('ul').filter(":not(:first)").each(function() {
					$(this).addClass('deep-child');									
				});
			}
			
			var submenuTimeOut = null;
			// now the deep child classes appear if hovered over
			$("ul.deep-child").parent('li').mouseenter(function() {
				var ele = this; // save element
				// hide all children that are visible
				$('ul.deep-child:visible').each(function() {
					if( $(ele).has( $(this) ).length <= 0 ) // check if current tab is a child to the parent
						// if not, hide it
						$(this).fadeOut(100);
				});
				// show the child
				$(this).children('ul.deep-child').filter(":not(:animated)").stop().fadeIn(250).addClass('activeAnim');
				
				if(submenuTimeOut)
					clearTimeout(submenuTimeOut);	
					
			}).mouseleave(function() {
				var ele = this; // save the element
				submenuTimeOut = setTimeout(function() {
					$(ele).children('ul.deep-child').stop().fadeOut(50).removeClass('activeAnim');
				}, 200);
			});
		}
	});
	
	/////////////////////////////////////////////
	// Navagation Dropdown Setup
	/////////////////////////////////////////////
	var menuNav = $('.navagation-wrapper select.navagation');
	$('.menu li').each(function() { 		// Go through all the menu options		
		var depth = ''; 								// level of list style
		var len = $(this).parents("ul").length;			// Amount of parents
		for(i=1;i<len;i++){depth += '&mdash;&nbsp;';}   // For each parent, create identifiers
		var text = depth + $(this).clone().children('ul').remove().end().text();
		var link = $(this).find('a').attr('href');
		var options = '<option value="'+link+'">'+text+'</option>';
		$(options).appendTo(menuNav); 
	});
	$(menuNav).change(function() {
		window.location = $(this).attr('value');
	}); 
});
//$(window).load