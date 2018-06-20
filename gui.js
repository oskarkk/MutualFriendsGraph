function mfgListeners() {

	////  General

	// make GUI almost transparent when out of focus
	$('body > ._li')
		.mouseenter( ()=> $('#mfgPanel').css('opacity', '0.3') )
		.mouseleave( ()=> $('#mfgPanel').css('opacity', '1') );

	////  Menu

	// button which starts the crawler
	$('.mfgButton.start').click( ()=> {
		GM_setValue('_isTest',0);
		startCrawler();
	});

	$('.mfgButton.test').click( ()=> mfgShow('#mfgTest') );
	$('.mfgLink.return').click( ()=> mfgShow('#mfgStart') );
	$('.mfgLink.close').click( ()=> $('#mfgWrapper').hide() );

	// start button on the test page
	$('.mfgButton.startTest').click( ()=> {
		var toTest = parseInt($('#mfgTest textarea').val(),10);
		if(toTest > 0) startCrawler(toTest);
		else alert('You must enter value larger than 0');
	});

	// "last results" active or not
	let btnRes = $('.mfgButton.results');
	if(GM_getValue('_friendsCount',0) > 0) {
		btnRes.click(showResults);
	} else {
		btnRes.css('background','#7a7a7a');
	}

	////  Crawler

	// abort crawling
	$('.mfgLink.abort').click( ()=> {
		GM_setValue('mfgCrawlerRunning',0);
		location.reload();
	});

	//// Text results

	// select all text when clicking on the textarea
	$('#mfgPanel textarea').focus( ()=> $('#mfgPanel textarea').select() );

	// copy output to clipboard
	$('.mfgLink.copy').click( ()=> {
		$('#mfgPanel textarea').select();
		document.execCommand('copy');
	});

	////  Graph

	// graph fullscreen
	$('.mfgGraph svg').click( ()=> {
		$('.mfgGraph').toggleClass('fullscreen');
		$('.mfgGraph svg').toggle();
		hideEverythingElse();
		cy.resize();
	});

	$('.mfgGraph button.center').click( ()=> cy.fit(15) );
	$('.mfgGraph button.settings').click( ()=> $('#graphDialog').show() );

	// graph layout, one time event listener
	$('.mfgGraph button.layout-start').one('click', runLayout);

	$('#save-layout').click( ()=> {
		graphLayout.current.nodeRepulsion = Number($('#node-repulsion').val());
		graphLayout.current.nodeOverlap = Number($('#node-overlap').val());
		graphLayout.current.idealEdgeLength = Number($('#ideal-edge-length').val());
		graphLayout.current.edgeElasticity = Number($('#edge-elasticity').val());
		graphLayout.current.nestingFactor = Number($('#nesting-factor').val());
		graphLayout.current.gravity = Number($('#gravity').val());
		graphLayout.current.numIter = Number($('#num-iter').val());
		graphLayout.current.animate = $('#animate').prop('checked');
		graphLayout.current.refresh = Number($('#refresh').val());
		graphLayout.current.fit = $('#fit').prop('checked');
		graphLayout.current.padding = Number($('#padding').val());
		graphLayout.current.randomize = $('#randomize').prop('checked');
		graphLayout.current.debug = $('#debug').prop('checked');
		graphLayout.current.initialTemp = Number($('#initialTemp').val());
		graphLayout.current.minTemp = Number($('#minTemp').val());
		$('#graphDialog').hide();
	});

	$("#default-layout").click( ()=> {
		graphLayout.current = Object.assign({}, graphLayout.cose);
		$('#graphDialog form')[0].reset(); // [0] cuz .reset() isn't jQ function
		$('#graphDialog').hide();
	});
}

function runLayout() {
	let btn = $('.mfgGraph button.layout-start')
	btn.css('color', 'lightgrey');
	setTimeout( ()=> {
		graphLayout.current.stop = ()=> { // run when layout stops running
			btn.css('color', 'black');
			btn.one('click', runLayout); // add one-time event listener again
		}
		cy.layout(graphLayout.current).run();
	},100); // timeout to allow greying out to appear
}

function hideEverythingElse() {
	var ele = $('head style#mfgHide');
	if(ele.length) ele.remove();
	else $('head').append('<style id="mfgHide">body > *:not(.mfg) {display: none !important;}</style>')
}

function progressBar(position,string,fraction) {
	var percent = (fraction*100).toFixed()+'%';
	if(string!=0) {
		$('.mfgProgress.' + position + ' p.left').text(string);
	}
	if(position=='bottom') {
		let bott = $('.mfgProgress.bottom .bar div');
		if(fraction==0) {
			bott.css('transition', 'none');
		} else {
			bott.css('transition', 'width 0.2s');
		}
	} else {
		$('.mfgProgress.' + position + ' p.right').text(percent);
	}
	$('.mfgProgress.' + position + ' .bar div').css('width', percent);
}

function mfgShow(str) {
	$('#mfgBody > div').hide();
	$(str).show();
}