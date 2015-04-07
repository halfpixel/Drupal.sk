// $Id: shoutbox-form.js,v 1.9.2.3 2008/07/11 10:16:59 disterics Exp $

 if (typeof(Drupal) == "undefined" || !Drupal.shoutbox) {    
    Drupal.shoutbox = {};
 }

/*
 * Submit shout with javascript.
 *
 */

Drupal.shoutbox.attachShoutAddForm = function () {
    // initial color to use for first post
    // tell server what color to use
    $("input[@name='nextcolor']").val(Drupal.settings.shoutbox.color);	
    var options = {
	resetForm: true,
	beforeSubmit: Drupal.shoutbox.validate,
	success: Drupal.shoutbox.success
    };

    $("#shoutbox-add-form").ajaxForm(options);
}

/**
  * Display response text and update the color
  * field. Remove top message if we are over 
  * the max count. 
  */

Drupal.shoutbox.success = function (responseText) {
	
    if (Drupal.settings.shoutbox.shownAmount == 0) {
	$('#shoutbox-posts').children().eq(0).remove();
	Drupal.settings.shoutbox.shownAmount += 1;		
    }
    else if(Drupal.settings.shoutbox.shownAmount >= Drupal.settings.shoutbox.showAmount) {
	var indexToRemove = ((Drupal.settings.shoutbox.ascending) ? ($('#shoutbox-posts').children().length - 1)
			     : 0 );
	$('#shoutbox-posts').children().eq(indexToRemove).remove();		
	}
    else {
	Drupal.settings.shoutbox.shownAmount += 1;		
    }
    //update color
    Drupal.settings.shoutbox.color = (Drupal.settings.shoutbox.color) ? 0 : 1;
    if(Drupal.settings.shoutbox.ascending) {
	$('#shoutbox-posts').prepend(responseText);
    }
    else {		
	$('#shoutbox-posts').append(responseText);
    }
    
    // tell server what color to use
    $("input[@name='nextcolor']").val(Drupal.settings.shoutbox.color);		
    // enable submit button 
    $('#shoutbox-throbber').hide();
    $('input#edit-0').show();
}

/**
  * Attach focus handling code to the form
  * fields 
  *
  */ 
Drupal.shoutbox.attachForm = function() {
    $('input#edit-nick').focus(
	function() {
	    if( $(this).val() == Drupal.settings.shoutbox.defaultNick) {
		$(this).val("");
	    }
	}
    );
    $('input#edit-message').focus(
	function() {
	    if( $(this).val() == Drupal.settings.shoutbox.defaultMsg) {
		$(this).val("");
	    }
	}
    );
    $('input#edit-url').focus(
	function() {
	    if( $(this).val() == Drupal.settings.shoutbox.defaultUrl) {
		$(this).val("");
	    }
	}
    );

    var button = $("input#edit-0");
    $('<div id="shoutbox-throbber">&nbsp;</div>').insertAfter(button);
    $('#shoutbox-throbber').hide();
}

/**
 * Creates a timer that triggers every delay seconds.
 */
Drupal.shoutbox.startTimer = function(delay) {
	Drupal.shoutbox.interval = setInterval("Drupal.shoutbox.loadShouts()",delay);	
}

/**
 * Reloads all shouts from the server.
 */
Drupal.shoutbox.loadShouts = function() {
	$("#shoutbox-posts").load(Drupal.settings.shoutbox.refreshPath);
}

/**
 * Validate input before submitting.
 * Don't accept default values or empty strings.
 */

Drupal.shoutbox.validate = function (formData, jqForm, options) {
    var form = jqForm[0];		
    if ((form.nick.value == Drupal.settings.shoutbox.defaultNick) ||
	(!form.nick.value)) {
	alert('Enter a valid Name/Nick');
	return false;		
    }
    if ((!form.message.value) ||
	(form.message.value == Drupal.settings.shoutbox.defaultMsg)) {
	alert('Enter a valid Message');
	return false;		
    }
    // tell server we are using ajax
    for (var i=0; i < formData.length; i++) { 
	if (formData[i].name == 'ajax') { 
	    formData[i].value = 1;      
	}
    }
    // clear the typed in put 
    $("#shoutbox-add-form").resetForm();
    $('input#edit-0').hide();
    $('#shoutbox-throbber').show();
    return true;	
}
	
		
	
	
if (Drupal.jsEnabled) {
    $(document).ready(function() {
	Drupal.settings.shoutbox.color = Drupal.settings.shoutbox.shownAmount%2;
	Drupal.shoutbox.attachForm();
	Drupal.shoutbox.attachShoutAddForm();
	if( Drupal.settings.shoutbox.refreshDelay > 0) {
	    Drupal.shoutbox.startTimer(Drupal.settings.shoutbox.refreshDelay);
	}	
    }
		     );
};
