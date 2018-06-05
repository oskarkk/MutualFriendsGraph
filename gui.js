// add GUI css and html
var cssTxt = GM_getResourceText('css');
var panelTxt = GM_getResourceText('panel');
$('head').append('<style>' + cssTxt + '</style>');
$('body').append(panelTxt);

// button which starts the crawler
$('#mfgStart .mfgButton.start').click(function(){
	GM_setValue('_isTest',0);
	startCrawler();
});

// test button
$('#mfgStart .mfgButton.test').click(function(){
	$('#mfgStart').css('display', 'none');
	$('#mfgTest').css('display', 'block');
});

// start button on the test page
$('#mfgTest .mfgButton.start').click(function(){
	stopAfter = $('#mfgTest textarea').html();
	if(stopAfter > 0) {
		GM_setValue('_friendsCount',stopAfter);
		GM_setValue('_isTest',1);
		startCrawler();
	} else {
		alert('You must enter value larger than 0');
	}
});

// hide the menu
$('.mfgButton.close').click(function(){
	$('#mfgPanelWrapper').css('display', 'none');
});

// make GUI almost transparent when out of focus
$(fbBody).mouseenter(function(){
	$('#mfgPanel').css('opacity', '0.3');
});
$(fbBody).mouseleave(function(){
	$('#mfgPanel').css('opacity', '1');
});

// select all text when clicking on the textarea
$('#mfgPanel textarea').focus(function(){
	$('#mfgPanel textarea').select();
});

// copy output to clipboard
$('.mfgButton.copy').click(function(){
	$('#mfgPanel textarea').select();
	document.execCommand('copy');
});

// abort crawling
$('.mfgButton.abort').click(function(){
	GM_setValue('mfgCrawlerRunning',0);
	location.reload();
});

function progressBar(position,string,fraction) {
	percent = (fraction*100).toFixed(3)+'%';
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