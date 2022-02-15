function init_points() {
    /*
    초기화 버튼 클릭 이벤트 발생 시 callback 함수
    */

    // marker 다 없앰.
}

function download_btn() {
    /*
    다운로드 버튼 클릭 이벤트 발생 시 callback 함수
    */
    var date = new Date();

    // 일단 임시. 여기에 waypoint 리스트가 들어갈 예정
    var data = "waypoint example"; 

    var blob = new Blob([data], { type: "application/text"});
	tag = document.createElement("a");
	tag.href = window.URL.createObjectURL(blob);

    var date_string = date.toISOString().split('.')[0].replace(/:/g, '').replace('T', '_')
	tag.download = `waypoint_${date_string}.txt`;

	document.body.appendChild(tag);
	tag.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, view:window}));
	tag.remove();

	window.URL.revokeObjectURL(tag.href);

    console.log("donw")
}

function upload_btn() {

}

function wp_to_marker() {
    /*
    WP를 마커로 변환해주는 함수
    재승이 자취방 오프셋을 뺀 경기대학교 WP와 위·경도 값 중에서 주석 해제하여 선택하여 사용
    */
    var wp_positions = document.getElementById('wp_position').value;
    //wp_positions = wp_position.replace(' ', '').split(',');
    wp_positions = wp_positions.replaceAll(', ', ',').split(' ');

    console.log(wp_positions);
    wp_positions.forEach(function(wp_position) {
        wp_position = wp_position.split(',');
        console.log(wp_position);

        // 경기대학교 WP 기준 (재승이 자취방 오프셋 뺀 값)
        var longlat = utm_to_longlat(
                    Number(wp_position[0]) + EAST_OFFSET, 
                    Number(wp_position[1]) + NORTH_OFFSET)
        wp_position = new kakao.maps.LatLng(longlat[1], longlat[0]);

        // 위·경도 기준
        //wp_position = new kakao.maps.LatLng(Number(wp_position[0]), Number(wp_position[1]));
            
        create_marker(wp_position);
        map.setCenter(wp_position); // 해당 좌표로 화면 이동
    });
    
    
    //console.log('wp_to_marker : '+ wp_position);
    map.setLevel(2); // 확대 레벨 2

}

function separate_waypoint() {
    /*
    WP 분할해주는 함수
    */
}

function kgu_to_kcity_btn() {
    map.setCenter(new kakao.maps.LatLng(37.23869182220047, 126.77262943430033));
    map.setLevel(2);
}

function kcity_to_kgu_btn() {
    map.setCenter(new kakao.maps.LatLng(37.30061299648025, 127.03577935414826));
    map.setLevel(2);
}

$(function() {
    // event listener
    $('#init_btn').on('click', init_points);
    $('#download_btn').on('click', download_btn);
    //$('#upload_btn').on('click', upload_btn);
    $('#wp_to_marker').on('click', wp_to_marker);
    $('#kgu_to_kcity_btn').on('click', kgu_to_kcity_btn);
    $('#kcity_to_kgu_btn').on('click', kcity_to_kgu_btn);
});