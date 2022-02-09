
// EPSG:4326, EPSG:4166 (WGS84)
const PROJ_ARG_LONGLAT = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

// EPSG:32652 UTM52N (WGS84)
const PROJ_ARG_UTM = '+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs';




function longlat_to_utm(long, lat) {
    projected_result = proj4(
        PROJ_ARG_LONGLAT, PROJ_ARG_UTM, [long, lat]
    );

    return projected_result;
}
function utm_to_longlat(x, y) {
    projected_result = proj4(
        PROJ_ARG_UTM, PROJ_ARG_LONGLAT, [x, y]
    );

    return projected_result;
}


$(function() {
    //var $div = create_map_element();
    
    var container = $('.map-container')[0];
    var options = {
        center: new kakao.maps.LatLng(37.30061299648025, 127.03577935414826),
        level: 3
    };

    var map = new kakao.maps.Map(container, options);

    var marker = new kakao.maps.Marker({
        // 지도 중심좌표에 마커를 생성합니다
        position: map.getCenter()
    });

    // 지도에 마커를 표시합니다
    marker.setMap(map);

    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {

    // 클릭한 위도, 경도 정보를 가져옵니다
        var latlng = mouseEvent.latLng;

        // 마커 위치를 클릭한 위치로 옮깁니다
        marker.setPosition(latlng);

        var lat = latlng.getLat();
        var lng = latlng.getLng();

        var message = '위도 : ' + lat;
        message += ' / 경도 : ' + lng;

        var resultDiv = document.getElementById('map');
        //resultDiv.innerHTML = message;
        console.log(message);
        console.log(longlat_to_utm(lng, lat))

    });
});

