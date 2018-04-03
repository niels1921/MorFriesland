//import { userInfo } from "os";

// Write your JavaScript code.


$(document).ready(function () {

    $(".navbar-toggle").on("click", function () {
        $(this).toggleClass("active");
    });

    $(".loader").hide();


    $("#email").hide();
    $("#EmailCheckbox").click(function () {
        $("#email").toggle();

        if ($(".ingelogd").data('ingelogd') === "loggedin") {
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