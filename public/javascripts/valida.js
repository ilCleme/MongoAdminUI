jQuery(document).ready(function($){
	//Regole di validazione      
	$("#connetti").validate({
		rules: {
			numhost: {
				required:true,
				minlength:"3"
			},
			numport:{
				required:true,
				minlenght:"2"
			}
		},//rules
		messages:{
		      numhost: {
		         required: "Devi inserire l'indirizzo dell'host"
		      },
		      numport: {
		         required: "Devi inserire un numero di porta"
		      }
	    },//messaggi
		submitHandler: function(){form.submit();}
	});//validate
});