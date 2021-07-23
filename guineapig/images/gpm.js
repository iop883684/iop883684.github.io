
$(document).on("pagebeforecreate", function(e) { 
	
//});

 //jQuery(document).ready(function(){
	var menu='';
	//menu += '<a href="" data-role="button">nesto</a>';
	//menu += '<div id="popup" data-role="popup" data-overlay-theme="a" >';

	//menu += '<ul class="checklist" id="submenu" data-inset="true" data-role="listview">';
	
	
	menu += '<div id="mainMenu" style="display:none" data-role="navbar">';
	menu += '<ul class="menu">';
	menu += '<li><a href="1_1.html"><img src="slike/1-quick.png" alt="Quick Manual"/></a></li>';
	menu += '<li><a href="2_1.html"><img src="slike/2-sounds.png" alt="Sounds"/></a></li>';
	menu += '<li><a  href="3_1.html"><img src="slike/3-bedding.png" alt="Bedding"/></a></li>';
	menu += '<li><a href="4_1.html"><img src="slike/4-cage.png" alt="Cage"/></a></li>'; 
	menu += '<li><a href="5_1.html"><img src="slike/5-eating.png"alt="Eating"/></a></li>';
	menu += '<li><a  href="6_1.html"><img src="slike/6-health.png" alt="Health"/></a></li>';
	menu += '<li><a  href="test.html"><img src="slike/7-Test.png" alt="Health"/></a></li>';
	menu += '<li><a  href="wallpaper.html"><img src="slike/9-walls.png" alt="wallpapers"/></a></li>';
	menu += '</ul>';
	menu += '</div>';
	var pageTitle = $('h2').first().text();
	

	
	var btns='<div data-role="navbar" id="topMenu">';
	btns += '<ul>';
	btns += '<li><a id="smB" class="ui-btn-active" data-icon="arrow-r">' + pageTitle + '</a></li>';
	btns += '<li><a id="mmB" data-icon="arrow-r">Menu</a></li>';
	
	btns += '<li><a href="rate.html">More...</a></li>';
	btns += '</ul></div>';
	btns += menu;
	
	var pt =  $('#submenu').find('*[data-theme="b"]').first().text();
	
	var ptitle = $('<h5>' + pt + '</h5>');
	
	$('#submenu').after(ptitle);
	
	
	$('#content').before($(btns));

	
	

	$('#mmB').click(function() {	
		showMainMenu();		
	});

		$('#smB').click(function() {


		$('#mainMenu').hide();
		$('#mmB').find('.ui-icon').removeClass('ui-icon-arrow-d');
		$('#submenu').toggle();
		$(this).find('.ui-icon-arrow-r').toggleClass('ui-icon-arrow-d');	
	});
	$.mobile.ajaxEnabled = false;
	

});


$(document).on("pagecreate", function(e) { 
	$('#topMenu').find('.ui-btn-icon-top').removeClass('ui-btn-icon-top').addClass('ui-btn-icon-right');
});

function showMainMenu() {
	$('#submenu').hide();
	$('#mainMenu').toggle();
	$('#smB').find('.ui-icon').removeClass('ui-icon-arrow-d');
	$(this).find('.ui-icon-arrow-r').toggleClass('ui-icon-arrow-d');
}
