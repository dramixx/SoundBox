(function ($) {

    /**
     * Replay function
     *
     * Gets the value from the select to know about
     * if replay is activated
     */
    var replay = function () {
        if ($('#slider_replay').val() === 'on') {
            $(document).bind('event_replay', function (event, info) { $.ionSound.play(info); });
        } else {
            $(document).unbind('event_replay');
        }
    };

    // on page load
    $.ready(function () { replay(); });

    // on select change
    $('#slider_replay').bind('change', function () { replay(); });

})(jQuery);