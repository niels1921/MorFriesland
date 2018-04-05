//Variabelen die later in de code gevuld worden;




var locationstring = "";


var url = "";

getLocation();

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(SetPosistion); 
    }
    else {
        defaultMap();
        initNavigator();
    }
}

function initNavigator() {
        
    navigator.permissions.query({ name: 'geolocation' })
        .then(function (permissionStatus) {
            if (permissionStatus.state === "denied") {
                defaultMap();
            } else if (permissionStatus.state === "prompt") {
                defaultMap();
            }


            permissionStatus.onchange = function () {
                if (this.state === "denied") {
                    defaultMap();
                }
                //console.log('geolocation permission state has changed to ', this.state);
            };
        });
}




//Laad de map in
function initMap() {

 }

function toggleBounce() {


    if (Locationmarker.getAnimation() !== null) {
        Locationmarker.setAnimation(null);
    } else {
        Locationmarker.setAnimation(google.maps.Animation.BOUNCE);
    }
}


function Ondrag(event) {

    locationstring.close();

    lat = event.latLng.lat();
    lng = event.latLng.lng();

    $("#nieuwlat").val(lat);
    $("#nieuwlong").val(lng);




    url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=" + lat + "&lon=" + lng;




}

$(document).ready(function () {
    $("body").on("click", "#meldingsubmit", function () {

        $(".loader").show();

        if ($("#validatie").is("span.text-danger.field-validation-error")) {
            $(".loader").hide();

        }


        console.log("iets hier");
        form = $("#submit");

        console.log("iets hier2");

        var gemeentenaam = "";

        $.getJSON(url, function (result) {
            $.each(result, function (i, field) {
                console.log(result);
                console.log(field.docs[0]);
                gemeentenaam = field.docs[0].gemeentenaam;

                $("#gemeente").val(gemeentenaam);
                console.log(field);
                if (field.docs[0].provincienaam !== "Friesland") {
                    alert("U kunt helaas geen melding doen buiten Friesland");
                    $(".loader").hide();
                    console.log("iets hier34");

                } else {
                    console.log("iets hier343454");
                    form.submit();
                }
            })
        });

    });

});


function SetPosistion(position) {



    lat = position.coords.latitude;
    lng = position.coords.longitude;

    url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=" + lat + "&lon=" + lng;


    console.log(url);

    $("#nieuwlat").val(lat);
    $("#nieuwlong").val(lng);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: lat, lng: lng }
    });
    var icon = {
        url: "/images/Pompebledblauw.png",
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var icon2 = {
        url: "/images/Pompebled.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };




    Locationmarker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: position.coords.latitude, lng: position.coords.longitude },
        icon: icon
    });
    Locationmarker.addListener('click', toggleBounce);
    Locationmarker.addListener('drag', Ondrag);
    Locationmarker.addListener('dragend', Ondrag);

    locationstring = new google.maps.InfoWindow({
        content: "Uw locatie"
    });

    locationstring.open(map, Locationmarker);

    $('#meldingen[data-lat]').each(function () {

        var latdata = $(this).data('lat');
        var lngdata = $(this).data('lng');
        var Name = $(this).data('name');
        var Beschrijving = $(this).data('beschrijving');
        var Img = $(this).data('img');

        var id = $(this).data('id');
        console.log(id);

        var url = "https://morfriesland20180329110629.azurewebsites.net/beheer/details/" + id;

        var content = "";

        if (id !== undefined) {
            if (Img !== "/uploads/" + Name + "/") {
                content = "<div class='col-md-12 nopadding'><div class='col-md-4 nopadding'><img class='meldfoto' style='max-width: 100%;' src='" + Img + "'></div><div class='col-md-8 infobeschrijving'><b>" + Name + "</b><br/>" + Beschrijving + "<br/> <a href='" + url + "'>Bekijk melding</a> </div></div>";
            } else {
                content = "<div class='col-md-12 nopadding'><b>" + Name + "</b><br/>" + Beschrijving + "<br/> <a href='" + url + "'>Bekijk melding</a> </div>";
            }
        } else {
            content = "";
            if (Img !== "/uploads/" + Name + "/") {
                content = "<div class='col-md-12 nopadding'><div class='col-md-4 nopadding'><img class='meldfoto' style='max-width: 100%;' src='" + Img + "'></div><div class='col-md-8 infobeschrijving'><b>" + Name + "</b><br/>" + Beschrijving + "</div></div>";
            } else {
                content = "<div class='col-md-12 nopadding'><b>" + Name + "</b><br/>" + Beschrijving + "</div>";
            }
        }





        var marker = new google.maps.Marker({
            position: { lat: latdata, lng: lngdata },
            title: 'Home Center',
            map: map,
            icon: icon2

        });

        var infoWindow = new google.maps.InfoWindow({
            content: content,
            maxWidth: 400

        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
        });

    });

    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);


    autocomplete.addListener('place_changed', function () {



        infowindow.close();
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



        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent =
            place.formatted_address;
        infowindow.open(map, Locationmarker);



        $("#nieuwlat").val(place.geometry.location.lat());
        $("#nieuwlong").val(place.geometry.location.lng());

        console.log(place.geometry.location.lat());
        url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=" + place.geometry.location.lat() + "&lon=" + place.geometry.location.lng();

        console.log(url);
    });

}


 
function defaultMap() {
    var fryslan = { lat: 53.1641642, lng: 5.7817542 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: fryslan
    })
    var icon = {
        url: "/images/Pompebledblauw.png",
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    var icon2 = {
        url: "/images/Pompebled.png",
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    Locationmarker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: fryslan,
        icon: icon
    });
    Locationmarker.addListener('click', toggleBounce);
    Locationmarker.addListener('drag', Ondrag);
    Locationmarker.addListener('dragend', Ondrag);

    $('#meldingen[data-lat]').each(function () {

        var latdata = $(this).data('lat');
        var lngdata = $(this).data('lng');

        var marker = new google.maps.Marker({
            position: { lat: latdata, lng: lngdata },
            title: 'Home Center',
            map: map,
            icon: icon2

        });

    });

    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);


    autocomplete.addListener('place_changed', function () {



        infowindow.close();
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



        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent =
            place.formatted_address;
        infowindow.open(map, Locationmarker);




        $("#nieuwlat").val(place.geometry.location.lat());
        $("#nieuwlong").val(place.geometry.location.lng());




        console.log(place.geometry.location.lat());

    });
}