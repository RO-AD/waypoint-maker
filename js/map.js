let map;
let markers = [];
let separate_wp = [];

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
    /*
    마커 생성 및 마커 클릭 이벤트 발생 시 마커 삭제
    */
    var marker = new kakao.maps.Marker({
        position: marker_position, // 마커 생성 위치
        image : MARKER_IMAGE // 마커 이미지 
    });

    // 마커 클릭 이벤트 (마커 삭제)
    kakao.maps.event.addListener(marker, 'click', function() {
        marker.setMap(null);
        
        // 마커 배열에서 삭제
        markers = markers.filter(function(m) {
            return m.n != marker.n;
        });

        return true;
    });

    // 지도에 마커 표시
    marker.setMap(map);
    
    // 마커 배열에 추가
    markers.push(marker);
    
}

function separate_wp_marker(marker_position) {
    /*
    분할된 wp를 마커로 표시
    markers 배열에 포함되지 않음
    */
    var marker = new kakao.maps.Marker({
        position: marker_position, // 마커 생성 위치
        image : MARKER_IMAGE // 마커 이미지 
    });
    marker.setMap(map);
}


function initialize_map(latlng) {
    /*
    지도 초기화 함수
    markers, separate_wp 변수도 초기화
    */
    $('.map-container').remove();
    var container = $('<div class="map-container"></div>')[0];
    
    $(document.body).append(container);

    markers = [];
    separate_wp = [];

    var options = {
        center: latlng,
        level: 3
    };

    map = new kakao.maps.Map(container, options);

    // 스카이뷰 전환 컨트롤
    var mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 클릭 이벤트
    kakao.maps.event.addListener(map, 'click', function(mouse_event) {
        
        // 마커 생성
        create_marker(mouse_event.latLng);

        // 클릭한 위도, 경도 정보를 가져옵니다
        // var latlng = mouse_event.latLng;

        // var lat = latlng.getLat(); // 위도
        // var lng = latlng.getLng(); // 경도

        // console.log('위도 : ' + lat + ' / 경도 : ' + lng);
        // var utm_position = longlat_to_utm(lng, lat);
        // console.log(utm_position[0], utm_position[1]); // UTM

    });

}



$(function() {
    //var $div = create_map_element();

    initialize_map(new kakao.maps.LatLng(37.30061299648025, 127.03577935414826));
    
});

