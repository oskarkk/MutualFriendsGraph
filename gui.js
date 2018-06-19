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
// Text results
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


//
// Graph
//

// graph fullscreen enter
$('.mfgGraph svg.enter').click(function(){
	$('.mfgGraph svg.enter').css('display', 'none');
	$('.mfgGraph').addClass('fullscreen');
	$('.mfgGraph svg.close').css('display', 'block');
	hideEverythingElse();
	cy.resize();
});

// graph fullscreen close
$('.mfgGraph svg.close').click(function(){
	hideEverythingElse();
	$('.mfgGraph svg.close').css('display', 'none');
	$('.mfgGraph').removeClass('fullscreen');
	$('.mfgGraph svg.enter').css('display', 'block');
	cy.resize();
});

function hideEverythingElse() {
	var ele = $('head style#mfgHide');
	if(ele.length) ele.remove();
	else $('head').append('<style id="mfgHide">body > *:not(.mfg) {display: none !important;}</style>')
}

// graph center
$('.mfgGraph button.center').click(function(){
	cy.fit(15);
});

// graph layout, one time event listener
$('.mfgGraph button.layout-start').one('click', runLayout);

function runLayout() {
	$('.mfgGraph button.layout-start').css('color', 'lightgrey');
	setTimeout(function(){
		// run when layout stops running:
		layout.current.stop = function(){
			$('.mfgGraph button.layout-start').css('color', 'black');
			// add one-time event listener again
			$('.mfgGraph button.layout-start').one('click', runLayout);
		}
		cy.layout(layout.current).run();
	},100); // timeout to allow greying out to appear
}

// graph settings
$('.mfgGraph button.settings').click(function(){
	$('#graphDialog').css('display', 'block');
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
	layout.current = Object.assign({}, layout.cose);
	$('#graphDialog form')[0].reset(); // [0] cuz .reset() isn't jQ function
	$('#graphDialog').css('display', 'none');
});