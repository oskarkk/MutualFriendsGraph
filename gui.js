//
// General
//

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
	cy.layout(layout.current).run();
});


$("#save-layout").on("click", function () {
	layout.current.nodeRepulsion = Number(document.getElementById("node-repulsion").value);
	layout.current.nodeOverlap = Number(document.getElementById("node-overlap").value);
	layout.current.idealEdgeLength = Number(document.getElementById("ideal-edge-length").value);
	layout.current.edgeElasticity = Number(document.getElementById("edge-elasticity").value);
	layout.current.nestingFactor = Number(document.getElementById("nesting-factor").value);
	layout.current.gravity = Number(document.getElementById("gravity").value);
	layout.current.numIter = Number(document.getElementById("num-iter").value);
	layout.current.animate = document.getElementById("animate").checked;
	layout.current.refresh = Number(document.getElementById("refresh").value);
	layout.current.fit = document.getElementById("fit").checked;
	layout.current.padding = Number(document.getElementById("padding").value);
	layout.current.randomize = document.getElementById("randomize").checked;
	layout.current.debug = document.getElementById("debug").checked;
	layout.current.initialTemp = Number(document.getElementById("initialTemp").value);
	layout.current.minTemp = Number(document.getElementById("minTemp").value);
	$('#graphDialog').css('display', 'none');
});

$("#default-layout").on("click", function () {
	layout.current = layout.cose;
	$('#graphDialog form')[0].reset(); // [0] cuz .reset() isn't jQ function
	$('#graphDialog').css('display', 'none');
});