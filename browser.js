window.addEventListener("load", function() { myExtension.init(); }, false);


var myExtension = {
  init: function() {
    var appcontent = document.getElementById("appcontent");   // browser
    if(appcontent)
      appcontent.addEventListener("DOMContentLoaded", this.onPageLoad, true);
    var messagepane = document.getElementById("messagepane"); // mail
    if(messagepane)
      messagepane.addEventListener("load", function () { myExtension.onPageLoad(); }, true);
  },

  onPageLoad: function(aEvent) {
    var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
	//check to see if this is a craigslist page
	if(doc.location.href.search("craigslist.") > -1)
	{
		myExtension.loadSummary(doc);		
	}
	
  },
  
  loadSummary: function(doc)
  {
	  //get all the links on the page
	var counter = 0;
	for(i=0;i<doc.links.length;i++){
    	//doc.links[i].href = "http://www.google.com";
		
		//check to see if this is a ad link
		var isAdLink = myExtension.checkAdLink(doc.links[i].href);
		if(isAdLink != null & isAdLink != "" & i < 200) //TODO: remove.
		{
			var parent = doc.links[i].parentNode;
			var parentHTML = $(parent).html();
			
			
			//**********************************************
			// version #2
			// add check to see if there is a 'pic' item for this listing
			//**********************************************
			var isPic = false;
			if(parentHTML.search("> pic</span>") > -1)
			{
				var isPic = true;
			}
			//**********************************************
			// end version #2 enhancement
			//**********************************************
			
			if(isPic){
				//append an element to the parent.
				var summaryDiv = doc.createElement('div');
				summaryDiv.id = "cl_summary_" + counter;
				summaryDiv.setAttribute("listing", doc.links[i].href);
				summaryDiv.innerHTML = isAdLink;
				parent.appendChild(summaryDiv); 
				counter++;
			}
		}
		else
		{
			//doc.links[i].href = "Nope";
		}

   	}
	
	
	//add a div element that holds the large images
	var previewW = 500;
	var windowW = doc.width;
	var previewL = doc.width - (previewW + 10);
	
	var previewT = 20;
	var footer = doc.body;
	var previewDiv = doc.createElement('div');
	$(previewDiv).attr("id","clPreviewDiv");
	$(previewDiv).attr("style", "position: absolute;");
	$(previewDiv).css("left",previewL);
	$(previewDiv).css("width",previewW);
	$(previewDiv).css("position","fixed");
	$(previewDiv).css("top","20px");
	$(previewDiv).css("float", "right");
	$(footer).append(previewDiv);
;
	
	//loop through each element and load the ad.
	setTimeout(myExtension.loadSummaryDetails(counter, doc, previewDiv),1250);
	
	

  },
  
  loadSummaryDetails: function(counter, doc, previewDiv)
  {
	  
	  	
	  
	  	var i = 0;
	  	for(i=0;i<counter;i++)
		{
			if(i < 100) //temp control
			{
				var el = doc.getElementById("cl_summary_" + i);
				var href = el.getAttribute("listing");
				ajax_loadContent("cl_summary_" + i,href,doc, previewDiv)
			}
		}
		

		
  },
  
  checkAdLink: function(href)
  {
	  var isMatch = href.match(/\/\d{5,}.html/);
	  return isMatch;
  }
  
}



//------------------------------
var dynamicContent_ajaxObjects = new Array(); 
var jsCache = new Array();
var enableCache = true; 
var timer;
function ajax_loadContent(divId,pathToFile,doc, previewDiv)
{
    if(enableCache && jsCache[pathToFile]){
    	doc.getElementById(divId).innerHTML = jsCache[pathToFile];
    	return;
    }
  
    var ajaxIndex = dynamicContent_ajaxObjects.length;
    doc.getElementById(divId).innerHTML = '';
    dynamicContent_ajaxObjects[ajaxIndex] = new sack();
    dynamicContent_ajaxObjects[ajaxIndex].requestFile = pathToFile;

	//when the page is done loading..
  	dynamicContent_ajaxObjects[ajaxIndex].onCompletion = function()
  			{ 
				//ajax_showContent(divId,ajaxIndex,pathToFile, doc); 
				ajax_showImages(divId,ajaxIndex,pathToFile, doc, previewDiv); 
			};  

    dynamicContent_ajaxObjects[ajaxIndex].runAJAX();  
  
  
} 



function ajax_showImages(divId,ajaxIndex,pathToFile, doc, previewDiv)
{
	//get the html of the url
	var html = dynamicContent_ajaxObjects[ajaxIndex].response;
	
	//strip the images from the html
	var re = /http:\/\/images.craigslist.org\/\d*\w*.jpg/g
	//re = /http.*.jpg/g
	var matches = html.match(re);
	//alert(matches);
	if(matches != null)
	{
		var totalImages = matches.length;
		//store all the images in an array.
		
		if(totalImages >0)
		{
			//get each of the the images and store them in an array.
			var images = new Array(totalImages); 
			for (var i = 0; i < totalImages; i++) {
				images[i] = matches[i];
			}
		}
		
		//build the image list.
		var iDiv = doc.createElement('div');
		iDiv.setAttribute("class","clad-imageholder");
		iDiv.setAttribute("style","margin-bottom: 10px;");
		
		for (var i = 0; i < totalImages; i++) {
			
			
			//**********************************************
			// version #2
			// change in the way images are created... add dom elements.
			// old: iDiv += "<img src='" + images[i] + "' height='75px' style='padding: 2px;'>";
			//**********************************************
			var img = doc.createElement('img');
			img.setAttribute("id",divId + "_" + i);
			img.setAttribute("src",images[i]);
			img.setAttribute("height","75px");
			img.setAttribute("style","padding: 2px;");
			
			$(img).bind("mouseenter", function(e){
				showImage(this, doc, previewDiv);
			});
			$(img).bind("mouseleave", function(e){
				hideImage(this, previewDiv);
			});

			
			iDiv.appendChild(img);
			
		}
		
		
		doc.getElementById(divId).appendChild(iDiv);
	}
	else
	{
		doc.getElementById(divId).innerHTML = "";
	}
	
	
	
}

function showImage(el, bodyEl, previewDiv)
{
	//alert("dd:" + el.id);
	var src = $(el).attr("src");
	previewDiv.innerHTML = "<div style='width: 100%;'><img src='" + src + "' style=' float: right;'><div style='float:right; font-size: .7em; background-color: #FFFFFF;'>Image Preview Ext. by <a href='http://www.craigstoolbox.com' target='_blank'>www.craigstoolbox.com</a></div></div>";
	
	
}
function hideImage(el, previewDiv)
{
	imageHide(el, previewDiv);	
	//timer = setTimeout('imageHide(el, previewDiv)',1000);
}
function imageHide(el, previewDiv)
{
	clearTimeout(timer);
	timer = null;
	previewDiv.innerHTML = "";
	
}



/*
function ajax_showContent(divId,ajaxIndex,pathToFile, doc)
{
  doc.getElementById(divId).innerHTML =
    dynamicContent_ajaxObjects[ajaxIndex].response;
  if(enableCache){
    jsCache[pathToFile] = 
    dynamicContent_ajaxObjects[ajaxIndex].response;
  }
  dynamicContent_ajaxObjects[ajaxIndex] = false;
}
*/

function sack(file){
	this.AjaxFailedAlert = "Your browser does not support the enhanced functionality of this website, and therefore you will have an experience that differs from the intended one.\n";
	this.requestFile = file;
	this.method = "POST";
	this.URLString = "";
	this.encodeURIString = true;
	this.execute = false;

	this.onLoading = function() { };
	this.onLoaded = function() { };
	this.onInteractive = function() { };
	this.onCompletion = function() { };

	this.createAJAX = function() {
		try {
			this.xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (err) {
				this.xmlhttp = null;
			}
		}
		if(!this.xmlhttp && typeof XMLHttpRequest != "undefined")
			this.xmlhttp = new XMLHttpRequest();
		if (!this.xmlhttp){
			this.failed = true; 
		}
	};
	
	this.setVar = function(name, value){
		if (this.URLString.length < 3){
			this.URLString = name + "=" + value;
		} else {
			this.URLString += "&" + name + "=" + value;
		}
	}
	
	this.encVar = function(name, value){
		var varString = encodeURIComponent(name) + "=" + encodeURIComponent(value);
	return varString;
	}
	
	this.encodeURLString = function(string){
		varArray = string.split('&');
		for (i = 0; i < varArray.length; i++){
			urlVars = varArray[i].split('=');
			if (urlVars[0].indexOf('amp;') != -1){
				urlVars[0] = urlVars[0].substring(4);
			}
			varArray[i] = this.encVar(urlVars[0],urlVars[1]);
		}
	return varArray.join('&');
	}
	
	this.runResponse = function(){
		eval(this.response);
	}
	
	this.runAJAX = function(urlstring){
		this.responseStatus = new Array(2);
		if(this.failed && this.AjaxFailedAlert){ 
			alert(this.AjaxFailedAlert); 
		} else {
			if (urlstring){ 
				if (this.URLString.length){
					this.URLString = this.URLString + "&" + urlstring; 
				} else {
					this.URLString = urlstring; 
				}
			}
			if (this.encodeURIString){
				var timeval = new Date().getTime(); 
				this.URLString = this.encodeURLString(this.URLString);
				this.setVar("rndval", timeval);
			}
			if (this.element) { this.elementObj = document.getElementById(this.element); }
			if (this.xmlhttp) {
				var self = this;
				if (this.method == "GET") {
					var totalurlstring = this.requestFile + "?" + this.URLString;
					this.xmlhttp.open(this.method, totalurlstring, true);
				} else {
					this.xmlhttp.open(this.method, this.requestFile, true);
				}
				if (this.method == "POST"){
  					try {
						this.xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded')  
					} catch (e) {}
				}

				this.xmlhttp.send(this.URLString);
				this.xmlhttp.onreadystatechange = function() {
					switch (self.xmlhttp.readyState){
						case 1:
							self.onLoading();
						break;
						case 2:
							self.onLoaded();
						break;
						case 3:
							self.onInteractive();
						break;
						case 4:
							self.response = self.xmlhttp.responseText;
							self.responseXML = self.xmlhttp.responseXML;
							self.responseStatus[0] = self.xmlhttp.status;
							self.responseStatus[1] = self.xmlhttp.statusText;
							self.onCompletion();
							if(self.execute){ self.runResponse(); }
							if (self.elementObj) {
								var elemNodeName = self.elementObj.nodeName;
								elemNodeName.toLowerCase();
								if (elemNodeName == "input" || elemNodeName == "select" || elemNodeName == "option" || elemNodeName == "textarea"){
									self.elementObj.value = self.response;
								} else {
									self.elementObj.innerHTML = self.response;
								}
							}
							self.URLString = "";
						break;
					}
				};
			}
		}
	};
this.createAJAX();
}

function ResizeImage(image)
{
	alert(image.height + ":" + image.width);	
}