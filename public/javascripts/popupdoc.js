$(function() {
	var form = $("#crea").parents("form");
	console.log(form);
	
	$( "#crea" ).click(function(event) {
			event.preventDefault(); //Blocca l'evento di default per questo elemento.
	      	$( "#dialog-confirm" ).dialog( "open" );
	});
	
    $( "#dialog-confirm" ).dialog({
		draggable:false,
	  	resizable: false,
      	height:400,
		width:400,
      	modal: true,
		dialogClass:"menu",
      	buttons: {
      	  "Crea Documento ": function() {
			$("#newdocument").submit();
      	  },
      	  "Annulla": function() {
      		$( this ).dialog( "close" );
      	  },
		  "+": function(){
			$("<div class=left><input type=text class=aggiungiinput placeholder=Chiave name=chiave></div>").appendTo("#newdocument");
	  		$("<div class=right><input type=text class=aggiungiinput placeholder=Valore name=valore></div>").appendTo("#newdocument");  	
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
		button.addClass("creadocumento");
		var aggiungi = $(this).find("div[class=ui-dialog-buttonset]").find("button:nth-child(3)");
		aggiungi.addClass("aggiungi");
		/*var label = $(this).find("form[id=newdocument]").find("label");
		label.addClass("aggiungilabel");
		var input = $(this).find("form[id=newdocument]").find("input");
		input.addClass("aggiungiinput");*/
		});
  });