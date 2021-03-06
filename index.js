var { ToggleButton } = require('sdk/ui/button/toggle');

var { get: get_pref, set: set_pref } = require("sdk/preferences/service");
var { when: unload } = require("sdk/system/unload");

var prop_name = "media.autoplay.enabled"
var old_value = get_pref(prop_name);


/* State: Autoplay Enabled */
const AutoplayEnabledState = {
  checked: true,
  label: "Autoplay Enabled. Click to disable",
  icon: {
  	"16" : "./enabled-16.png",
  	"32" : "./enabled-32.png",
  	"64" : "./enabled-64.png"
  }
}

/* State: Autoplay Disabled */
const AutoplayDisabledState = {
  checked: false,
  label: "Autoplay Disabled. Click to enable",
  icon : {
  	"16" : "./disabled-16.png",
  	"32" : "./disabled-32.png",
  	"64" : "./disabled-64.png"
  }
}


/* Button Definition - Used for creating each new button instance on new windows */
var button = ToggleButton({
  id: "toggle-autoplay",
  
  /* Set initial state - This depends on the pre-addon state, and is needed to ensure the first window works.
   * These values MUST be set, so we set them from the defaults
   */
  checked: old_value,
  label:  (old_value) ? AutoplayEnabledState.label : AutoplayDisabledState.label,
  icon:   (old_value) ? AutoplayEnabledState.icon  : AutoplayDisabledState.icon,
  
  /* Invert the state when clicked - This is global, shared state... */
  onChange: function(state) {
  	/* Ensure that we're setting global only
  	 * (Note: This needs to happen each time, as the click handler resets this)
  	 */
  	this.state('window', null);
  	
  	/* Update state globally */
  	button.checked = !button.checked;
  	
  	set_pref(prop_name, this.checked);
  	if (button.checked) {
  		button.state(button, AutoplayEnabledState);
  	}
    else {
    	button.state(button, AutoplayDisabledState);
    }
  }
});


/* By AMO policy global preferences must be changed back to their original value */
unload(function() {
  set_pref(prop_name, old_value);
});

browser.browserAction.onClicked.addListener(handleClick);
