//
// General
//

// add GUI css and html
var cssTxt = GM_getResourceText('css');
var panelTxt = GM_getResourceText('panel');
$('head').append('<style>' + cssTxt + '</style>');
$('body').append(panelTxt);

// make GUI almost transparent when out of focus
$('body > ._li').mouseenter(function(){
	$('#mfgPanel').css('opacity', '0.3');
});
$('body > ._li').mouseleave(function(){
	$('#mfgPanel').css('opacity', '1');
});


//
// Menu
//

// button which starts the crawler
$('#mfgStart .mfgButton.start').click(function(){
	GM_setValue('_isTest',0);
	startCrawler();
});

// test button
$('#mfgStart .mfgButton.test').click(function(){
	mfgShow('#mfgTest');
});

// start button on the test page
$('#mfgTest .mfgButton.start').click(function(){
	var toTest = parseInt($('#mfgTest textarea').val(),10);
	if(toTest > 0) {
		startCrawler(toTest);
	} else {
		alert('You must enter value larger than 0');
	}
});

// return button
$('.mfgLink.return').click(function(){
	mfgShow('#mfgStart');
});

// show last results
if(GM_getValue('_friendsCount',0) > 0) {
	$('#mfgStart .mfgButton.show').click(showResults);
} else {
	$('#mfgStart .mfgButton.show').css('background','#7a7a7a');
}

// hide the GUI
$('.mfgLink.close').click(function(){
	$('#mfgWrapper').css('display', 'none');
});


//
// Crawler
//

// abort crawling
$('.mfgLink.abort').click(function(){
	GM_setValue('mfgCrawlerRunning',0);
	location.reload();
});

function progressBar(position,string,fraction) {
	var percent = (fraction*100).toFixed()+'%';
	if(string!=0) {
		$('.mfgProgress.' + position + ' p.left').text(string);
	}
	if(position=='bottom') {
		if(fraction==0) {
			$('.mfgProgress.bottom .bar div').css('transition', 'none');
		} else {
			$('.mfgProgress.bottom .bar div').css('transition', 'width 0.2s');
		}
	} else {
		$('.mfgProgress.' + position + ' p.right').text(percent);
	}
	$('.mfgProgress.' + position + ' .bar div').css('width', percent);
}


//
// Results
//

// select all text when clicking on the textarea
$('#mfgPanel textarea').focus(function(){
	$('#mfgPanel textarea').select();
});

// copy output to clipboard
$('.mfgLink.copy').click(function(){
	$('#mfgPanel textarea').select();
	document.execCommand('copy');
});

// graph fullscreen enter
$('.mfgGraph .button.enter').click(function(){
	$('.mfgGraph .button.enter').css('display', 'none');
	$('.mfgGraph').addClass('fullscreen');
	$('.mfgGraph .button.close').css('display', 'block');
});

// graph fullscreen close
$('.mfgGraph .button.close').click(function(){
	$('.mfgGraph .button.close').css('display', 'none');
	$('.mfgGraph').removeClass('fullscreen');
	$('.mfgGraph .button.enter').css('display', 'block');
});

// graph center
$('.mfgGraph .button.center').click(function(){
	cy.fit();
});

// graph layout
$('.mfgGraph .button.layout-start').click(function(){
	spring.run();
});