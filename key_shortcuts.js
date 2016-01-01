var keypress_map = {65: false, 83: false, 68: false, 70:false};
$(document).keydown(function(e) {
    if (e.keyCode in keypress_map) {
        keypress_map[e.keyCode] = true;
        if (keypress_map[65] && keypress_map[83] && keypress_map[68] && keypress_map[70]) {
          chrome.extension.sendMessage({name:'openCopilotTab'}, function(){});
        }
    }
}).keyup(function(e) {
    if (e.keyCode in keypress_map) {
        keypress_map[e.keyCode] = false;
    }
});
