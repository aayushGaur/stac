/**	This Class is responsible for providing the Search boxes for the Network Visualization.
*		The functionality provided for the Search boxes are a follows:
*		1. Auto complete with the relevant information that is to be associated with the search box.
*		2. Zoom in functionality over the element that has been selected in the search box.
*		This functionality needs to be discussed - Ability to store the user searches and use them as tagged information to show similar search options.???
*/

(function(){
	NETWORK.SearchBox = function(searchTags,sbDOMID) {
		this.searchTags = searchTags;
		this.DOMID = sbDOMID;
	};
	
	NETWORK.SearchBox.prototype.autoComplete  = function () {
		$(this.DOMID).autocomplete({
            source: this.searchTags,
			autoFocus: true,
			select: function (event,ui) {
				VIEWS.SharedFunctionality.zoomOnElement(ui.item.eleID)
			}
        });
	};
})(NETWORK || (NETWORK = {}));