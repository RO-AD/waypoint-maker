function init_points() {
    /*
    초기화 버튼 클릭 이벤트 발생 시 callback 함수
    */
    var level = map.getLevel();

    initialize_map(map.getCenter());
    map.setLevel(level);
    

    // marker 다 없앰.
}

function download_btn() {
    /*
    다운로드 버튼 클릭 이벤트 발생 시 callback 함수
    */
    var date = new Date();

    // waypoint 리스트 저장
    var data = separate_wp.map(function(position) {
        return position[0] + ', ' + position[1];
    }).join('\n');

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

        // UTM 경기대학교 WP 기준 (재승이 자취방 오프셋 뺀 값)
        var longlat = utm_to_longlat(
                    Number(wp_position[0]) + EAST_OFFSET, 
                    Number(wp_position[1]) + NORTH_OFFSET)
        wp_position = new kakao.maps.LatLng(longlat[1], longlat[0]);
        // console.log(longlat[0], longlat[1]);

        // UTM 
        // var longlat = utm_to_longlat(
        //     Number(wp_position[0]), 
        //     Number(wp_position[1]))
        // wp_position = new kakao.maps.LatLng(longlat[1], longlat[0]);

        // 위·경도 기준
        //wp_position = new kakao.maps.LatLng(Number(wp_position[0]), Number(wp_position[1]));
            
        create_marker(wp_position);
        map.setCenter(wp_position); // 해당 좌표로 화면 이동
    });
    
    
    //console.log('wp_to_marker : '+ wp_position);
    map.setLevel(2); // 확대 레벨 2

}

function separate_wp_btn() {
    /*
    클릭한 마커의 WP를 분할해주는 함수
    */
    var prev_position = markers[0].getPosition();
    console.log(prev_position['La'], prev_position['Ma']);
    prev_position = longlat_to_utm(prev_position['La'], prev_position['Ma'])
    var now_position;
    
    var m, n, y, x;
    var markers_cnt, distance, x_distance, separate_cnt;
    var wp_position;


    markers_cnt = markers.length;
    separate_wp.push(prev_position);
    for (var i = 1; i < markers_cnt; i++) {
        console.log(i);
        
        now_position = markers[i].getPosition();
        now_position = longlat_to_utm(now_position['La'], now_position['Ma']);

        distance = Math.sqrt(Math.pow((now_position[0] - prev_position[0]), 2) + 
                Math.pow((now_position[1] - prev_position[1]), 2));
        
        // 점과 점 사이를 0.5 간격으로 나눈 횟수
        separate_cnt = parseInt(Math.abs(distance * 2)); 

        x_distance = (now_position[0] - prev_position[0]);
        x_term = x_distance / separate_cnt
        
        // 기울기
        m = (now_position[1] - prev_position[1]) / (now_position[0] - prev_position[0])
        // y 절편
        n = prev_position[1] - (m * prev_position[0]);

        console.log('####################');
        // console.log(now_position);
        // console.log(now_position[1] - prev_position[1]);
        // console.log(now_position[0] - prev_position[0]);
        console.log('separate_cnt ' + separate_cnt);
        
        for (var j = 1; j < separate_cnt+1; j++) {
            x = prev_position[0] + x_term * j;
            console.log('x : ' + m);
            y = m * (x) + n;
            if (j != 1) {
               separate_wp.push([x,y]); // UTM 값
            }
        //     console.log(x + ' / ' +y);

            wp_position = utm_to_longlat(x, y);
            wp_position = new kakao.maps.LatLng(wp_position[1], wp_position[0]);
            separate_wp_marker(wp_position);
            
        }
        // map.setCenter(wp_position);

        prev_position = now_position;
    }
    //separate_wp.push(now_position);
    console.log(separate_wp);
    
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
    $('#separate_wp_btn').on('click', separate_wp_btn);
});