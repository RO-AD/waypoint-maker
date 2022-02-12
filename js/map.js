
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

console.log(longlat_to_utm(127.03257673041796, 37.296834146070275));

$(function() {
    //var $div = create_map_element();

    var container = $('.map-container')[0];
    // KCITY : (37.22932411777117, 126.77329790671789)
    // KGU : (37.30061299648025, 127.03577935414826)
    var options = {
        center: new kakao.maps.LatLng(37.30061299648025, 127.03577935414826),
        level: 3
    };

    var map = new kakao.maps.Map(container, options);

    // 마커 이미지
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
    var imageSize = new kakao.maps.Size(24, 35); 
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
    
    var positions = []


    // 지도 클릭 이벤트
    kakao.maps.event.addListener(map, 'click', function(mouse_event) {
        var marker = new kakao.maps.Marker({
            position: mouse_event.latLng, // 마커 생성 위치
            image : markerImage // 마커 이미지 
        });

        // 마커 클릭 이벤트 (마커 삭제)
        kakao.maps.event.addListener(marker, 'click', function() {
            marker.setMap(null);
            console.log('삭제');

            return true;
        });

        marker.setMap(map);
        // console.log(mouse_event.latLng.La, mouse_event.latLng.Ma);


        // 클릭한 위도, 경도 정보를 가져옵니다
        var latlng = mouse_event.latLng;

        // 마커 위치를 클릭한 위치로 옮깁니다
        marker.setPosition(latlng);

        var lat = latlng.getLat();
        var lng = latlng.getLng();

        console.log('위도 : ' + lat + ' / 경도 : ' + lng);
        var utm_position = longlat_to_utm(lng, lat);
        console.log(utm_position[0] - 325618.68229865003, utm_position[1] - 4129608.2187828263); // UTM
        console.log(utm_position[0] - 4129608.2187828263, utm_position[1] -325618.68229865003 ); // UTM

    });
});

