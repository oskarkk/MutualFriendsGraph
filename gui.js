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
	mfgShow('#mfgTest');
});

// start button on the test page
$('#mfgTest .mfgButton.start').click(function(){
	var stopAfter = parseInt($('#mfgTest textarea').val(),10);
	if(stopAfter > 0) {
		GM_setValue('_friendsCount',stopAfter);
		GM_setValue('_isTest',1);
		startCrawler();
	} else {
		alert('You must enter value larger than 0');
	}
});

// show last results
$('#mfgStart .mfgButton.show').click(showResults);

// hide the menu
$('.mfgLink.close').click(function(){
	$('#mfgWrapper').css('display', 'none');
});

// make GUI almost transparent when out of focus
$('body > ._li').mouseenter(function(){
	$('#mfgPanel').css('opacity', '0.3');
});
$('body > ._li').mouseleave(function(){
	$('#mfgPanel').css('opacity', '1');
});

// select all text when clicking on the textarea
$('#mfgPanel textarea').focus(function(){
	$('#mfgPanel textarea').select();
});

// copy output to clipboard
$('.mfgLink.copy').click(function(){
	$('#mfgPanel textarea').select();
	document.execCommand('copy');
});

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