$(document).ready(function () {
$(function() {
	var form = $("#cancella").parents("form");
	var input = $("#cancinput");
	
	$( "#cancella" ).click(function(event) {
		event.preventDefault();
			console.log(input.val());
			if(input.val() == ''){	
				input.focus();
				console.log("impossibile");
			} else {
	      		$( "#dialog-confirm" ).dialog( "open" );
			}
	});
	
    $( "#dialog-confirm" ).dialog({
		draggable:false,
	  	resizable: false,
      	height:200,
		width:350,
      	modal: true,
		dialogClass:"menu",
      	buttons: {
      	  "Cancella collezione ":function() {
      		  form.submit();
      	  },
      	  "Annulla": function() {
			$("input.newcoll").val('');  
      		$( this ).dialog( "close" );
      	  }
      	},
	  	autoOpen: false,
	 	show: {
	          effect: "drop",
	          duration: 500
	        },
	    hide: {
	          effect: "drop",
	          duration: 500
	        }
    });
	
	$(".menu").ready(function(){
		var button = $(this).find("div[class=ui-dialog-buttonset]").find("button:first-child");
		button.addClass("cancelladocumento");
		var annulla = $(this).find("div[class=ui-dialog-buttonset]").find("button:nth-child(2)");
		annulla.addClass("annulla");
	});
	
  });
});