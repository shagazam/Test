function showSection(section) {
	//display the text if it is not displayed; hide it if it is displayed
	if (section.style.display=="none") {
		section.style.display=""
	} else {
		section.style.display="none"
	}
}

function expandWithArrow(section, arrow) {
	//display the text if it is not displayed and change the arrow to point down
	//hide the text again, and make the arrow point right
	if (section.style.display=="none") {
		section.style.display=""
		arrow.src="shared/arrowdn.gif"
	} else {
		section.style.display="none"
		arrow.src="shared/arrowrt.gif"
	}
}


function showSectionNoHide(section, arrow) {
	// Extra search to expand all parent DIV tags if this is a nested DIV tag
	var searchString = 'id=' + section + ' '
	openDivTagsWithString(searchString)
}


function scrollToAnchor(anchor) {
	location = '#' + anchor // Now reload the page again so the page scrolls to the anchor
}


// Open all DIV tags containing a matching search string
function openDivTagsWithString(searchString) {
	var divTags = document.all.tags("DIV")	// get a handle on all the DIV tags in the document
	for (i=0; i<divTags.length; i++) {	// loop through all the DIV tags
		var divText = divTags(i).outerHTML	// get a handle on all the HTML code within the current DIV tag, including the tag itself
		if (divText.indexOf(searchString) != -1) {	// if there's a match of the section number
			var divTagId = divTags(i).id	// get a handle on the ID of the current DIV tag
			var arrowTagId = divTagId.replace("section","arrow")	// work out the corresponding arrow image ID
			divTags(i).style.display = "block"	// set the display style of the current DIV tag to be block (visible)
			if (divTags(i).className == "expanded") {	// if the DIV class is expanded, it has a corresponding arrow image
				document.images[arrowTagId].src = "shared/arrowdn.gif"	// so change the image to use the down arrow
			}
		}
	}
}


// Show all text when check box selected
function showAllText() {
	var lists = document.all.tags("DIV") ;
	for (i=0; i<lists.length; i++) {
		lists(i).style.display = "" ;
	}
	var arrows = document.all.tags("IMG") ;
	for (i=0; i<arrows.length; i++) {
		if (arrows(i).id.length > 0) {
			arrows(i).src="shared/arrowdn.gif" ;
		}
	}
}


// Hide all text when check box cleared
function hideAllText() {
	var lists = document.all.tags("DIV") ;
	for (i=0; i<lists.length; i++) {
		lists(i).style.display = "none" ;
	}
	var arrows = document.all.tags("IMG") ;
	for (i=0; i<arrows.length; i++) {
		if (arrows(i).id.length > 0) {
			arrows(i).src="shared/arrowrt.gif" ;
		}
	}
}


// Run these functions when the document loads
function finishDocument() {
	checkLocation()
	setCheckBoxState()
	hideSections()
	setVisibility()
	checkForHighlighting()
	checkForAnchor()
}


// Check whether the topic has been called from a context ID in the software, and if so,
// reload the topic without the parent CHM file name in the path.
// This function corrects the problem where the HHC doesn't auto-sync if you jump to a topic
// by using the syntax 'ms-its:<parent>.chm::/<child>.chm::/topics/<file>.htm>$global_<window>'
// in the parent's ALI file.
function checkLocation() {
	locationString = location.toString()	// get a handle on the current location (href) and convert it to a string
	if ( locationString.indexOf('.chm::/') != locationString.lastIndexOf('.chm::/') ) {	// if the 1st match of '.chm::/' does NOT match the location of the last match, i.e. there's only one instance
		startNumber = locationString.indexOf('.chm::/') + 7	// set the start point for the replacement string to the start of the child's CHM name (the 1st character after the 1st '.chm::/')
		endNumber = locationString.length	// set the end point for the replacement string to the length of the whole string
		replacedString = 'ms-its:' + locationString.substring(startNumber, endNumber)	// create a new string which is 'ms-its:' + the section of the location from the child's CHM to the end
		location = replacedString	// load the topic defined by the new string, which is the same topic but directly in the child CHM, so the TOC will auto-sync
	}
}


// Check whether there is hidden text in the document, and if not, disable the Expand all text check box and label
function setCheckBoxState() {
	var divTags = document.all.tags("DIV")	// get a handle on all the DIV tags in the document
	var formTags = document.all.tags("FORM")	// get a handle on all the FORM tags in the document
	if ( (divTags.length == 0) && (formTags.length > 0) ) {	// if there are no DIV tags in the document but there is a form
		document.form1.ShowAll.checked = true	// select the check box in the Expand all text form
		document.form1.ShowAll.disabled = true	// disable the check box
		checkboxLabel.className = "disabledlabel"	// make the check box label grey
	}
}


// Hide all DIV tags apart from ones to be expanded
function hideSections() {
	var sections = document.all.tags("DIV") ;		// get a handle on all the DIV tags in the document
	for (i=0; i<sections.length; i++) {			// loop through all the DIV tags
		var sectionID = sections(i).id		// get a handle on the ID of the current DIV tag
		if (sectionID.indexOf("expanded") == -1) {	// if the string 'expanded' can't be found in the ID
			sections(i).style.display = "none" ;	// set the display style of the current DIV tag to be hidden
		}
	}
}


// Now that you've hidden the relevant DIV tags, set the BODY tag to be visible
function setVisibility() {
	body.style.visibility="visible"		// set the visibility style of the BODY tag to be visible
}


// When a page loads, check whether there is any search results highlighting, and if so,
// expand all the DIV tags that contain hits, and scroll to the first hit
function checkForHighlighting() {
	var tempHTML = document.body.innerHTML	// get a handle on all the HTML code between the BODY tags
	if ( (tempHTML.indexOf('<FONT') != -1) && (tempHTML.indexOf('style="BACKGROUND-COLOR: #') != -1) && (tempHTML.indexOf('color=#ffffff') != -1) ) {		// if there's a match of the strings
		var divTags = document.all.tags("DIV")	// get a handle on all the DIV tags in the document
		var openDivTags = 0	// create a variable which will count the number of open DIV tags
		for (i=0; i<divTags.length; i++) {	// loop through all the DIV tags
			var divText = divTags(i).innerHTML	// get a handle on all the HTML code within the current DIV tag
			if ( (divText.indexOf('<FONT') != -1) && (divText.indexOf('style="BACKGROUND-COLOR: #') != -1) && (divText.indexOf('color=#ffffff') != -1) ) {	// if there's a match of the strings
				var divTagId = divTags(i).id	// get a handle on the ID of the current DIV tag
				var arrowTagId = divTagId.replace("section","arrow")	// work out the corresponding arrow image ID
				divTags(i).style.display = "block"	// set the display style of the current DIV tag to be block (visible)
				if (divTags(i).className == "expanded") {	// if the DIV class is expanded, it has a corresponding arrow image
					document.images[arrowTagId].src = "shared/arrowdn.gif"	// so change the image to use the down arrow
				}
				openDivTags = openDivTags + 1
			}
		}
		var fontTags = document.all.tags("FONT")	// get a handle on all the FONT tags in the document
		for (i=0; i < fontTags.length; i++) {		// loop through all the FONT tags
			if ( (fontTags(i).color == "#ffffff") && (fontTags(i).style.backgroundColor != -1) ) {	// if there's a match of the strings
				fontTagToUse = fontTags(i)	// get a handle on the current FONT tag
				break	// then leave the loop
			}
		}
		var parentTag = fontTagToUse.parentElement	// get a handle on the current FONT tag's parent element (tag)
		if ( (parentTag.tagName == 'B') || (parentTag.tagName == 'I') || (parentTag.tagName == 'A') || (parentTag.tagName == 'SPAN') ) {	// if the parent tag is a B, I, A or SPAN tag
			parentTag.parentElement.scrollIntoView()	// scroll to the parent tag's parent tag, which will hopefully be a block level element
		} else {
			parentTag.scrollIntoView()	// otherwise, scroll to the parent tag, which will hopefully be a block level element
		}
		var formTags = document.all.tags("FORM")	// get a handle on all the FORM tags in the document
		if ( (openDivTags == divTags.length) & (formTags.length > 0) ) {		// if the number of open DIV tags equals the total number, i.e. they are all open, and there is a form
			document.form1.ShowAll.checked = true		// select the check box in the Expand all text form
		}
	}
}


// When a page loads, check whether the location includes an anchor, and if so,
// expand all the DIV tags that contain the anchor
function checkForAnchor() {
	// Extra search to expand all parent DIV tags if this is an anchor within the document
	locationString = location.toString()	// get a handle on the current location (href) and convert it to a string
	if ( locationString.indexOf('.htm#') != -1 ) {	// if there is an anchor in the location
		startNumber = locationString.indexOf('.htm#') + 5	// set the start point for the anchor string to the start of the anchor number
		endNumber = locationString.length	// set the end point for the anchor string to the length of the whole string
		anchor = locationString.substring(startNumber, endNumber)	// create a new string which is the section of the location from the start of the anchor to the end
		var searchString = '<A name=' + anchor + '></A>'
		openDivTagsForSpansWithString(searchString)
		openDivTagsWithString(searchString)
		location = '#' + anchor // Now reload the page again so the page scrolls to the anchor
	}
}

// Open all DIV tags containing a matching search string
function openDivTagsForSpansWithString(searchString) {
	var spanTags = document.all.tags("SPAN")	// get a handle on all the SPAN tags in the document
	for (i=0; i<spanTags.length; i++) {	// loop through all the SPAN tags
		var spanText = spanTags(i).outerHTML	// get a handle on all the HTML code within the current SPAN tag, including the tag itself
		if (spanText.indexOf(searchString) != -1) {	// if there's a match of the section number
			spanTags(i).click() 	// click the SPAN tag to open its corresponding DIV tag
		}
	}
}