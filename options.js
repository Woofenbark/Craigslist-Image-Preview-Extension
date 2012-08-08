function save_options() {
  localStorage['clpreview_enable'] = document.getElementById('enable').checked;
  // Update status to let user know options were saved.
  var status = document.getElementById('status');
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}
// Restores select box state to saved value from localStorage.
function restore_options() {
	/* If options aren't yet set, set them */
	if ( 'undefined' == typeof localStorage['clpreview_enable'])
		localStroage['clpreview_enable'] = true;

	/* Get the options */
  	document.getElementById('enable').checked = ('true' === localStorage['clpreview_enable']);

}

document.addEventListener('DOMContentLoaded', function() {
	restore_options();
	document.querySelector('button').addEventListener('click', save_options);
});

chrome.extension.onRequest.addListener( function( request, sender, sendResponse ) {
	if ( request.method == 'getOptions' ) {
		var enabled = localStorage['enable'] ? localStorage['enable'] : true;
		sendResponse( { enable: enabled } );
	} else
		sendResponse( {} );
})