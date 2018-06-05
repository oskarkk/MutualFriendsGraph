// ==UserScript==
// @name       MutualFriendsGraph
// @namespace  https://oskark.pl/
// @version    1.6.1
// @updateURL  https://gist.github.com/oskarkk/55eb8abedfa7bb0e6d4280727d1f1371/raw/MutualFriendsGraph.user.js
// @resource   css mfg.css
// @resource   panel panel.html
// @resource   gui gui.js
// @run-at     document-end
// @require    https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @noframes
// @include    *://*.facebook.com/*
// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_getResourceText
// ==/UserScript==

eval(GM_getResourceText('gui'));

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
	$('#mfgStart').css('display', 'block');	// show menu
}

function startCrawler() {
	// error when user tries to start the crawler on wrong page
	if($(fbYourFriendsBox).length == 0){
		alert('Go to your friends page and reload.');
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
			GM_setValue('_currentFriend',0);
			goToFriend(0); // leave current page and go to the 1st friend
		}
	}, 300);
}

// save every friend from logged in user's friends list
function getYourFriends() {
	var friendsList = $(fbYourFriendsElements);
	var friendsCount = friendsList.length;
	
	for(var i = 0; i < friendsCount; i++) { // for every friend on the list
		GM_setValue(
			'f' + addZeroes(i) + 'id', // friend seq number
			$(friendsList[i]).find('a.friendButton').attr('data-profileid')
		);
		GM_setValue(
			'f' + addZeroes(i) + 'name', // friend name
			$(friendsList[i]).find('.fsl.fwb.fcb a').text()
		);
	}
	if(GM_getValue('_isTest') == 0) GM_setValue('_friendsCount',friendsCount);
	
	//progressBar('top',0,1/(friendsCount+2));
	progressBar('bottom','Loading the next page...',1);
}

// go to the page with mutual friends with nth friend on the list
function goToFriend(num) {
	num = addZeroes(num);
	$(location).attr('href', fbMutualFriendsURL+GM_getValue('f' + num + 'id') );
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
	
	$('#mfgProcessing').css('display', 'block'); // show processing window
	
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
				showResults();
			}
		}
	}, 300);
}

function getMutualFriends(currentFriend) {
	currentFriend = addZeroes(currentFriend);
	var mutualFriendsList = $(fbMutualFriendsElements);
	var mutualFriendsCount = mutualFriendsList.length;
	GM_setValue('f' + currentFriend + 'fNum', mutualFriendsCount);

	for(var i = 0; i < mutualFriendsCount; i++) {
		var currentMutualFriend = $(mutualFriendsList[i]).find('.fsl.fwb.fcb a').text();
		GM_setValue('f' + currentFriend + 'm' + addZeroes(i), currentMutualFriend);
	}

	progressBar('bottom','Loading the next page...',1);
}

function showResults() {

	progressBar('top','Processing results...',1);
	var edgesNumber = 0;
	var friendsCount = GM_getValue('_friendsCount');

	for(var i = 0; i<friendsCount; i++) {
		var mutualFriendsCount = GM_getValue('f'+addZeroes(i)+'fNum');
		var currentFriendName = GM_getValue('f'+addZeroes(i)+'name');
		for(var j = 0; j < mutualFriendsCount; j++){
			var currentMutualFriendName = GM_getValue('f'+addZeroes(i)+'m'+addZeroes(j));
			if(checkUniqueness(currentMutualFriendName,i) == 1){
				$('#mfgResults textarea').append(currentFriendName+
								'&Tab;'+currentMutualFriendName+'\n');
				edgesNumber++;
			}
		}
	}
	
	var duration = ((Date.now() - GM_getValue('_timeStart'))/1000).toFixed(1);
	$('#mfgResults p.stats').append('Number of graph edges: '+
						edgesNumber+
						'<br> Duration: '+
						duration+
						' seconds');
	
	$('#mfgProcessing').css('display', 'none');
	$('#mfgResults').css('display', 'block');
}

function checkUniqueness(currentName,n) {
	for(var i = 0; i<n; i++) {
		if( currentName == GM_getValue('f'+addZeroes(i)+'name') ) {
			return 0;
		}
	}
	return 1;
}

function addZeroes(x) {
	return x.toString().padStart(4,'0');
}