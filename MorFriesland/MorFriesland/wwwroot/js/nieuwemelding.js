//Variabelen die later in de code gevuld worden;




var locationstring;
var geocoder;
var map;
var url = "";
var Locationmarker;
var icon;
var icon2;
var icongreen;
var latlng;


getLocation();

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(SetPosistion);
    }
    else {
        // Browser doesn't support Geolocation
        initMap();
    }
}
//Laad de map in
function initMap() {
    icon = {
        url: "/images/Pompebledblauw.png",
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    icongreen = {
        url: "/images/Pompebledgreen.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    icon2 = {
        url: "/images/Pompebled.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    locationstring = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder;
    var fryslan = { lat: 53.1641642, lng: 5.7817542 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: fryslan
    })
    Locationmarker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: fryslan,
        icon: icon
    });

    Locationmarker.addListener('click', reversegeo);
    Locationmarker.addListener('drag', Ondrag);
    Locationmarker.addListener('dragend', Ondrag);
    Locationmarker.addListener('dragend', reversegeo);

    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    autocomplete.addListener('place_changed', function () {

    locationstring.close();
    var place = autocomplete.getPlace();
     if (!place.geometry) {
            return;
     }

    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
     } else {
       map.setCenter(place.geometry.location);
       map.setZoom(17);
    }
        // Set the position of the marker using the place ID and location.
        Locationmarker.setPosition(place.geometry.location);

        $("#nieuwlat").val(place.geometry.location.lat());
        $("#nieuwlong").val(place.geometry.location.lng());

        latlng = place.geometry.location.lat() + "," + place.geometry.location.lng();

        url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=" + place.geometry.location.lat() + "&lon=" + place.geometry.location.lng();

        var geocoder = new google.maps.Geocoder;
        geocodeLatLng(geocoder, map, locationstring);
    });

    var pompebled = icon2;
    $('#meldingen[data-lat]').each(function () {

        var latdata = $(this).data('lat');
        var lngdata = $(this).data('lng');
        var Name = $(this).data('name');
        var Beschrijving = $(this).data('beschrijving');
        var Img = $(this).data('img');
        var gearchiveerd = $(this).data('gearchiveerd');

        var id = $(this).data('id');

        var naam;
        if (gearchiveerd == "True") {
            pompebled = icongreen;
            naam = Name + ' (opgelost)';
        } else {
            naam = Name
            var pompebled = icon2;
        }

        var url = "https://morfriesland20180329110629.azurewebsites.net/beheer/details/" + id;

        var content = "";

        if (id !== undefined) {
            if (Img !== "/uploads/" + Name + "/") {
                content = "<div class='col-md-12 nopadding'><div class='col-md-4 nopadding'><img class='meldfoto' style='max-width: 100%;' src='" + Img + "'></div><div class='col-md-8 infobeschrijving'><b>" + Name + "</b><br/>" + Beschrijving + "<br/> <a href='" + url + "'>Bekijk melding</a> </div></div>";
            } else {
                content = "<div class='col-md-12 nopadding'><b>" + naam + "</b><br/>" + Beschrijving + "<br/> <a href='" + url + "'>Bekijk melding</a> </div>";
            }
        } else {
            content = "";
            if (Img !== "/uploads/" + Name + "/") {
                content = "<div class='col-md-12 nopadding'><div class='col-md-4 nopadding'><img class='meldfoto' style='max-width: 100%;' src='" + Img + "'></div><div class='col-md-8 infobeschrijving'><b>" + Name + "</b><br/>" + Beschrijving + "</div></div>";
            } else {
                content = "<div class='col-md-12 nopadding'><b>" + naam + "</b><br/>" + Beschrijving + "</div>";
            }
        }





        var marker = new google.maps.Marker({
            position: { lat: latdata, lng: lngdata },
            title: 'Home Center',
            map: map,
            icon: pompebled

        });

        var infoWindow = new google.maps.InfoWindow({
            content: content,
            maxWidth: 400

        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
        });

    });
}

function reversegeo() {

    geocodeLatLng(geocoder, map, locationstring);

}

function geocodeLatLng(geocoder, map, locationstring) {

    var latlngStr = latlng.split(',', 2);
    var loc = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
    geocoder.geocode({ 'location': loc }, function (results, status) {
        locationstring.setContent(results[0].formatted_address);
        locationstring.open(map, Locationmarker);
    });
}



function Ondrag(event) {

    lat = event.latLng.lat();
    lng = event.latLng.lng();

    $("#nieuwlat").val(lat);
    $("#nieuwlong").val(lng);

    latlng = lat + "," + lng;

    url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=" + lat + "&lon=" + lng;
}

$(document).ready(function () {
    $("body").on("click", "#meldingsubmit", function () {

        $(".loader").show();

        if ($("#validatie").is("span.text-danger.field-validation-error")) {
            $(".loader").hide();
        }

        form = $("#submit");

        var gemeentenaam = "";

        $.getJSON(url, function (result) {
            $.each(result, function (i, field) {

                gemeentenaam = field.docs[0].gemeentenaam;

                $("#gemeente").val(gemeentenaam);
                if (field.docs[0].provincienaam !== "Friesland") {
                    alert("U kunt helaas geen melding doen buiten Friesland");
                    $(".loader").hide();

                } else {
                    form.submit();
                }
            })
        });

    });

});


function SetPosistion(position) {



    lat = position.coords.latitude;
    lng = position.coords.longitude;

    latlng = lat + "," + lng;

    url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=" + lat + "&lon=" + lng;

    $("#nieuwlat").val(lat);
    $("#nieuwlong").val(lng);

    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map.setCenter(pos);
    map.setZoom(16);

    Locationmarker.setPosition(pos);

    var geocoder = new google.maps.Geocoder;
    geocodeLatLng(geocoder, map, locationstring);

 }
