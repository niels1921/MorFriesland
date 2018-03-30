//import { userInfo } from "os";

// Write your JavaScript code.

$(document).on('change', ':file', function () {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});

$(document).ready(function () {
    $(".loader").hide();


    $("#email").hide();
    $("#EmailCheckbox").click(function () {
        $("#email").toggle();

        if ($(".ingelogd").data('ingelogd') == "loggedin") {
            if ($('#EmailCheckbox').is(':unchecked')) {
                $("#email").val("false");
                console.log("false");
            }
            else
            {
                $("#email").val("true");
            }
        }
    }); 
});