jQuery(document).ready(function($){
	//Regole di validazione      
	$("#newdb").validate({
		rules: {
			newDb: {
				required:true,
				minlength:1
			}
		},//rules
		messages:{
		      newDb: {
		         required: "Devi inserire un nome",
		         minlength: "Il nome non deve contenere spazi"
		      }
	    },//messaggi
		errorPlacement: function(error, element) {
			error.insertAfter($("#newcoll > .crea"));
		},
		submitHandler: function(){form.submit();}
	});//validate
	
	$("#newcoll").validate({
		rules:{
			collName:{
				required:true,
				minlenght:1
			}
		},
		messages:{
			collName:{
				required:"Devi inserire un nome",
				minlenght:"Il nome deve contenere almeno 1 carattere"
			}
		},
		errorPlacement: function(error, element) {
			error.insertAfter($("#newcoll > .crea"));
		},
		submitHandler: function(){form.submit();}
	});
});