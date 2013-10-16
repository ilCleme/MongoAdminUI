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
		submitHandler: function(){form.submit();}
	});//validate
});