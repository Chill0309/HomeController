// Login Form

$(function() {
    var button = $('#loginButton');
    var box = $('#loginBox');
    var form = $('#loginForm');
	var forgot = $('#forgotYourPassword');
	
    //button.removeAttr('href');
    button.click(function(login) {
        box.toggle();
        button.toggleClass('active');
    });
    form.mouseup(function() { 
        return false;
    });
    $(this).mouseup(function(login) {
        if(!($(login.target).parent('#loginButton').length > 0)) {
            button.removeClass('active');
            box.hide();
        }
    });
	forgot.click(function() {
		$('#dialog-message').html("That was stupid!");
		$('#dialog-message').dialog({
			modal: true, title: "Forgotten your password?",
			buttons: {
				"Ok": function() {
					$(this).dialog("close");
				}, 
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		});
		$('#dialog-message').dialog('open');
	});
});
