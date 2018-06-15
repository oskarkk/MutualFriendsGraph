// ==UserScript==
// @name         MutualFriendsGraph
// @namespace    https://oskark.pl/
// @version      1.7.6
// @updateURL    https://github.com/oskarkk/MutualFriendsGraph/raw/master/MutualFriendsGraph.user.js
// @downloadURL  https://github.com/oskarkk/MutualFriendsGraph/raw/master/MutualFriendsGraph.user.js
// @resource     css mfg.css
// @resource     panel panel.html
// @resource     gui gui.js
// @resource     visualization visualization.js
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.2.13/cytoscape.min.js
// @noframes
// @include      *://*.facebook.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// ==/UserScript==

eval(GM_getResourceText('gui'));
eval(GM_getResourceText('visualization'));

var fbMutualFriendsURL = 'https://www.facebook.com/browse/mutual_friends/?uid=';
var fbYourFriendsBox = '#pagelet_timeline_medley_friends';
var fbYourFriendsElements = '#pagelet_timeline_medley_friends li._698';
var fbYourFriendsLoading = '#pagelet_timeline_medley_friends img._359.img';
var fbMutualFriendsElements = '.fbProfileBrowser .fbProfileBrowserListItem';
var fbMutualFriendsLoading = '.fbProfileBrowser .uiMorePagerLoader.pam';

// check if script was started on previous page
if(GM_getValue('_crawlerRunning') == 1) {
	// page should be the list of mutual friends, continue crawling
	crawlFriend();
} else {
	mfgShow('#mfgStart');
}

function startCrawler(toTest) {
	// error when user tries to start the crawler on wrong page
	if($(fbYourFriendsBox).length == 0){
		alert('Go to your friends list and reload.');
		return;
	}
	// hide menu and show progress window
	$('#mfgStart, #mfgTest').css('display', 'none');
	$('#mfgProcessing').css('display', 'block');
	// save the information that the crawler was started
	GM_setValue('_crawlerRunning',1);
	
	progressBar('top','Getting friends...',0);
	progressBar('bottom','Scrolling...',0);
	GM_setValue('_timeStart',Date.now());
	
	var loop = setInterval(function(){
		progressBar('bottom',0,0);
		// be sure to scroll to the end of the page
		window.scrollTo(0, 100000);
		progressBar('bottom',0,1);
		// check if there is page loading image
		if($(fbYourFriendsLoading).length==0){
			clearInterval(loop); // break loop
			progressBar('bottom','Processing...',0);
			// when the page is fully loaded, save every friend on the page
			getYourFriends();
			if(toTest > 0) GM_setValue('_friendsCount',toTest);
			GM_setValue('_currentFriend',0);
			goToFriend(0); // leave current page and go to the 1st friend
		}
	}, 300);
}

// save every friend from logged in user's friends list
function getYourFriends() {
	var friendsList = $(fbYourFriendsElements);
	var friendsCount = friendsList.length;
	
	for(let i = 0; i < friendsCount; i++) { // for every friend on the list
		GM_setValue(
			addZeroes(i) + '-id', // friend seq number
			$(friendsList[i]).find('a.friendButton').attr('data-profileid')
		);
		GM_setValue(
			addZeroes(i) + '-name', // friend name
			$(friendsList[i]).find('.fsl.fwb.fcb a').text()
		);
	}
	GM_setValue('_friendsCount',friendsCount);
	progressBar('top',0,1/(friendsCount+2));
	progressBar('bottom','Loading the next page...',1);
}

// go to the page with mutual friends with nth friend on the list
function goToFriend(num) {
	num = addZeroes(num);
	$(location).attr('href', fbMutualFriendsURL+GM_getValue(num + '-id') );
}

// get mutual friends with the next friend
function crawlFriend() {
	
	var currentFriend = GM_getValue('_currentFriend'); // which friend to crawl
	var friendsCount = GM_getValue('_friendsCount');   // total number of friends
	
	// show 'current friend / total friends' on the progress bar
	progressBar('top',
				'Getting friend '+(currentFriend+1)+
					'/'+friendsCount+' data ...',
				(currentFriend+1)/(friendsCount+2));
	
	mfgShow('#mfgProcessing');
	
	// loop till the end of list
	var loop = setInterval(function(){
		// show that something is happening on the progress bar
		progressBar('bottom','Scrolling...',0);
		window.scrollTo(0, 100000);
		progressBar('bottom','Scrolling...',1);
		// if it's the end of list
		if($(fbMutualFriendsLoading).length==0){
			clearInterval(loop); // break loop
			progressBar('bottom','Processing...',0);
			getMutualFriends(currentFriend); // save all mutual friends
			currentFriend++;
			if( currentFriend < friendsCount ) {
				// if there are friends to crawl left go to the next friend
				GM_setValue('_currentFriend',currentFriend);
				goToFriend(currentFriend);
			} else {
				// if that was the last friend, show results
				GM_setValue('_crawlerRunning',0);
				progressBar('top','Processing results...',1);
				var duration = ((Date.now() - GM_getValue('_timeStart'))/1000).toFixed(1);
				GM_setValue('_duration',duration);
				showResults();
			}
		}
	}, 300);
}

function getMutualFriends(currentFriend) {
	currentFriend = addZeroes(currentFriend);
	var mutualFriendsList = $(fbMutualFriendsElements);
	var mutualFriendsCount = mutualFriendsList.length;
	GM_setValue(currentFriend + '-mNum', mutualFriendsCount);

	for(let i = 0; i < mutualFriendsCount; i++) {
		let currentMutualFriend = $(mutualFriendsList[i]).find('.fsl.fwb.fcb a').text();
		GM_setValue(currentFriend + '-m-' + addZeroes(i), currentMutualFriend);
	}

	progressBar('bottom','Loading the next page...',1);
}

function showResults() {
	var graphElements = [];
	$('#mfgResults textarea').html('');
	var edgesNumber = 0;
	var friendsCount = GM_getValue('_friendsCount');
	var duration = GM_getValue('_duration');

	for(let i = 0; i < friendsCount; i++) {
		let i0 = addZeroes(i);
		graphElements.push({
			data: {
				id: 'n'+i0,
				name: GM_getValue(i0+'-name'),
				mutualCount: GM_getValue(i0+'-mNum')
			}
		});
	}

	for(let i = 0; i < friendsCount; i++) {
		let i0 = addZeroes(i);
		for(let j = 0; j < graphElements[i].data.mutualCount; j++){
			let j0 = addZeroes(j);
			var mutualName = GM_getValue(i0+'-m-'+j0);
			if(checkUniqueness(mutualName,i)){
				$('#mfgResults textarea')
					.append(graphElements[i].data.name+'&Tab;'+mutualName+'\n');

				graphElements.push({
					data: {
						id: 'e'+addZeroes(edgesNumber++),
						source: 'n'+i0,
						target: 'n'+j0,
					}
				});
			}
		}
	}
	cy.add(graphElements);
	$('#mfgResults p.stats').html(  `Friends count: ${friendsCount}\n`+
									`Number of graph edges: ${edgesNumber}\n`+
									`Duration: ${duration} seconds\n`);
	mfgShow('#mfgResults');
	cy.resize();
	testLayout.run();
}

function checkUniqueness(currentName,n) {
	for(let i = 0; i<n; i++) {
		if( currentName == GM_getValue(addZeroes(i)+'-name') ) {
			return 0;
		}
	}
	return 1;
}

function addZeroes(x) {
	return x.toString().padStart(5,'0');
}

function mfgShow(str) {
	$('#mfgBody > div').css('display', 'none');
	$(str).css('display', 'block');
}