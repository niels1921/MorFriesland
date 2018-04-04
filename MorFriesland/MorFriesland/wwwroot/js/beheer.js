//Variabelen die later in de code gevuld worden;



defaultMap();

//Laad de map in
function initMap() {
    var fryslan = "";

    $('#meldingen[data-lat]').each(function () {

        var latdata = $(this).data('lat');
        var lngdata = $(this).data('lng');

        fryslan = { lat: latdata, lng: lngdata };

    });
    

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
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

        var content = "";
        if (Img !== "/uploads/" + Name + "/") {
            content = "<div class='col-md-12 nopadding'><div class='col-md-4 nopadding'><img class='meldfoto' style='max-width: 100%;' src='" + Img + "'></div><div class='col-md-8 infobeschrijving'><b>" + Name + "</b><br/>" + Beschrijving + "</div></div>";
        } else {
            content = "<div class='col-md-12 nopadding'><b>" + Name + "</b><br/>" + Beschrijving + "</div>";
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


    
}

function toggleBounce() {


    if (Locationmarker.getAnimation() !== null) {
        Locationmarker.setAnimation(null);
    } else {
        Locationmarker.setAnimation(google.maps.Animation.BOUNCE);
    }
}






function defaultMap() {
   
}