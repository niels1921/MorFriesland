//Variabelen die later in de code gevuld worden;



defaultMap();

//Laad de map in
function initMap() {
    var fryslan = { lat: 53.1641642, lng: 5.7817542 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: fryslan
    });
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
        draggable: false,
        icon: icon
    });

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
                content = "<div class='col-md-12 nopadding'><div class='col-md-4 nopadding'><img style='max-width: 100%;' src='" + Img + "'></div><div class='col-md-8 infobeschrijving'><b>" + Name + "</b><br/>" + Beschrijving + "<br/> <a href='" + url + "'>Bekijk melding</a> </div></div>";
            } else {
                content = "<div class='col-md-12 nopadding'><b>" + Name + "</b><br/>" + Beschrijving + "<br/> <a href='" + url + "'>Bekijk melding</a> </div>";
            }
        } else {
            content = "";
            if (Img !== "/uploads/" + Name + "/") {
                content = "<div class='col-md-12 nopadding'><div class='col-md-4 nopadding'><img style='max-width: 100%;' src='" + Img + "'></div><div class='col-md-8 infobeschrijving'><b>" + Name + "</b><br/>" + Beschrijving + "</div></div>";
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
        Locationmarker.setVisible(true);



        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent =
            place.formatted_address;
        infowindow.open(map, Locationmarker);




        $("#nieuwlat").val(place.geometry.location.lat());
        $("#nieuwlong").val(place.geometry.location.lng());

        console.log(place.geometry.location.lat());

    });
}

function toggleBounce() {


    if (Locationmarker.getAnimation() !== null) {
        Locationmarker.setAnimation(null);
    } else {
        Locationmarker.setAnimation(google.maps.Animation.BOUNCE);
    }
}


function Ondrag(event) {
    lat = event.latLng.lat();
    lng = event.latLng.lng();

    $("#nieuwlat").val(lat);
    $("#nieuwlong").val(lng);






}



function defaultMap() {
   
}