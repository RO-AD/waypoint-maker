let map;
let markers = [];

// EPSG:4326, EPSG:4166 (WGS84)
const PROJ_ARG_LONGLAT = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

// EPSG:32652 UTM52N (WGS84)
const PROJ_ARG_UTM = '+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs';

// 재승이 전 자취방 기준
const EAST_OFFSET = 325618.68229865003;
const NORTH_OFFSET = 4129608.2187828263;

// 마커 이미지
const MARKER_IMAGE = new kakao.maps.MarkerImage(
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
    new kakao.maps.Size(24, 35)
);



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

function create_marker(marker_position) {
    var marker = new kakao.maps.Marker({
        position: marker_position, // 마커 생성 위치
        image : MARKER_IMAGE // 마커 이미지 
    });

    console.log(marker_position);

    // 마커 클릭 이벤트 (마커 삭제)
    kakao.maps.event.addListener(marker, 'click', function() {
        marker.setMap(null);
        //console.log('삭제');

        //console.log('배열 길이 : ' + markers.length);
        //console.log(marker);
        markers = markers.filter(function(m) {
            return m.n != marker.n;
        });
        //console.log('삭제 완료 : ' + markers.length);

        return true;
    });

    marker.setMap(map);
    // console.log(mouse_event.latLng.La, mouse_event.latLng.Ma);
    
    markers.push(marker);
    //console.log(marker);
    //console.log('추가 완료 : ' + markers[markers.length - 1]);
    //console.log('배열 길이 : ' + markers.length);
}

function separate_wp_marker(marker_position) {
    var marker = new kakao.maps.Marker({
        position: marker_position, // 마커 생성 위치
        image : MARKER_IMAGE // 마커 이미지 
    });
    marker.setMap(map);
}


function initialize_map(selector) {
    var options = {
        center: new kakao.maps.LatLng(37.30061299648025, 127.03577935414826),
        level: 3
    };
    var container = $(selector)[0];
    return new kakao.maps.Map(container, options);
}



$(function() {
    //var $div = create_map_element();

    map = initialize_map('.map-container');
    
    // 스카이뷰 전환 컨트롤
    var mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);


    // 지도 클릭 이벤트
    kakao.maps.event.addListener(map, 'click', function(mouse_event) {
        
        // 마커 생성
        create_marker(mouse_event.latLng);

        // 클릭한 위도, 경도 정보를 가져옵니다
        var latlng = mouse_event.latLng;

        var lat = latlng.getLat(); // 위도
        var lng = latlng.getLng(); // 경도

        //console.log('위도 : ' + lat + ' / 경도 : ' + lng);
        var utm_position = longlat_to_utm(lng, lat);
        //console.log(utm_position[0] - EAST_OFFSET, utm_position[1] - NORTH_OFFSET); // UTM
        console.log(utm_position[0], utm_position[1]); // UTM
        console.log(utm_position);

    });
});

