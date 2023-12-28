var hereLat, hereLon;   // 전역변수 선언해서, 모든 함수에서 이용할 수 있도록 함
  // 현재 위치를 가져오는 함수
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  // 현재 위치를 보여주는 함수
  function showPosition(position) {
    hereLat = position.coords.longitude; // 현재 위치의 경도
    hereLon = position.coords.latitude; // 현재 위치의 위도
    document.getElementById("demo").innerHTML = "현재 위치: " + hereLat + ", " + hereLon; // 현재 위치를 표시
  }

  getLocation(); // 페이지가 로드될 때, 현재 위치를 가져오는 함수 호출

  // 검색과 거리 계산을 수행하는 함수
  function searchAndCalculateDistance() {
    
    var address = document.getElementById('address').value; // 입력된 주소 값 가져오기
    var base_url = 'https://dapi.kakao.com/v2/local/search/address.json'; // Kakao API 주소 검색 엔드포인트
    var query = encodeURIComponent(address); // 검색할 주소를 인코딩
    var url = `${base_url}?query=${query}`; // Kakao API로 요청할 URL 생성

    var headers = {
      'Authorization': 'KakaoAK db8c17d6893ffe5d073cd03b8bfe32b5' // Kakao API 키
    };

    // 주소 검색 API를 호출하여 검색된 위치의 좌표를 가져오는 AJAX 요청
    $.ajax({
      url: url,
      headers: headers,
      success: function (result) {
        var latitude = result.documents[0].x; // 검색된 위치의 경도 
        var longitude = result.documents[0].y; // 검색된 위치의 위도
        var resultDiv = document.getElementById("result"); // 결과를 표시할 요소

        // 검색된 위치의 좌표를 표시
        resultDiv.innerHTML = `검색된 위치의 좌표: ${latitude}, ${longitude}`;

        // 현재 위치와 검색된 위치를 기반으로 거리를 계산하는 AJAX 요청
        var startLat = hereLat; // 현재 위치의 위도
        var startLon = hereLon; // 현재 위치의 경도
        var goalLat = latitude; // 검색된 위치의 위도
        var goalLon = longitude; // 검색된 위치의 경도

        var baseUrl = "https://apis-navi.kakaomobility.com/v1/directions?"; // Kakao 지도 API 엔드포인트
        var start = `origin=${startLat},${startLon}`; // 출발지 좌표
        var goal = `&destination=${goalLat},${goalLon}`; // 도착지 좌표
        var waypoint = "&waypoints=&priority=DISTANCE&car_fuel=GASOLINE&car_hipass=false&alternatives=false&road_details=false"; // 기타 설정

        var distanceUrl = `${baseUrl}${start}${goal}${waypoint}`; // 거리를 계산할 URL

        // 거리 계산 API를 호출하여 거리를 가져오는 AJAX 요청
        $.ajax({
          url: distanceUrl,
          headers: headers,
          success: function (distanceResult) {
            var distance = distanceResult.routes[0].summary.distance; // 계산된 거리
            resultDiv.innerHTML += `<br>거리: ${distance}m`; // 거리를 결과에 추가로 표시
          },
          error: function (error) {
            console.log('에러 발생:', error); // 에러가 발생했을 때 콘솔에 출력
          }
        });
      },
      error: function (error) {
        console.log('에러 발생:', error); // 에러가 발생했을 때 콘솔에 출력
      }
    });
  }