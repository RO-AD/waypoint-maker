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

$(function() {
    // event listener
    $('#init_btn').on('click', init_points);
    $('#download_btn').on('click', download_btn);
});