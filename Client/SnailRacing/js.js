let username = ""
let password = ""

async function log(username, event_type, comment, winner){

  const url_code = "https://script.google.com/macros/s/AKfycbwFCiz4mdhkB85zlBLmrRCUHh29FKmOLLOxfKKs05egK0iU9QnpDVcL36OT9P2rpNQhmQ/exec"
  const now = new Date();
  const now_date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  const now_time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  const get_user_id = username;
  
  $.ajax({
	type: "GET",
	url: url_code,
	data: {
		"이벤트발생 날짜": now_date,
		"이벤트발생 시간": now_time,
		"유저 ID": get_user_id,
		"이벤트 종류": event_type,
		"코멘트": comment,
		"승리한달팽이": winner
	},
	error: function(request, status, error) {
		isLoading(false);
		console.log("code:" + request.status + "\n" + "error:" + error);
		console.log(request.responseText);
	}
	});

}

let balance = 100000;


function closeWindow() {
    window.close();
}

const backgroundMusic = document.getElementById('backgroundMusic');

function restart() {
	const event_type = "게임 재시작"
	const comment = ""
	
	log(username, event_type, comment)
	
    document.getElementById("img").style.display = 'none';
    document.getElementById("restart_Button").style.display = 'none';
    document.getElementById("ending_img").style.display = 'none';
    
	
	document.getElementById("balance").style.display = 'block';
    document.getElementById("snailRacing").style.display = 'block';

    // 게임 상태 초기화
    balance = 100000;
    betPlaced = false;  // 베팅 초기화
    selectedSnail = null;  // 달팽이 선택 초기화
    betAmountSnail = 0;    // 베팅 금액 초기화

    // 보유금 표시
    document.getElementById("balance").innerText = `보유금: ${balance.toLocaleString()}`;

    // 모든 달팽이의 위치를 초기화
    const snails = [
        document.getElementById('snail1'),
        document.getElementById('snail2'),
        document.getElementById('snail3')
    ];
    snails.forEach(snail => {
        snail.style.left = '0px'; // 달팽이 위치 초기화
    });

    // 음악 초기화
    snailMusic.pause(); // 달팽이 음악 정지
    snailMusic.currentTime = 0; // 음악 시간 초기화
    endingMusic.pause(); // 엔딩 음악 정지
    endingMusic.currentTime = 0; // 음악 시간 초기화
    
    const selet = document.getElementById("selet");
    selet.play();
}
function start_button() {
	backgroundMusic.play();
	
    document.getElementById("img").style.display = 'none';
    document.getElementById("loginForm").style.display = 'none';

    document.getElementById("balance").style.display = 'block';
    document.getElementById("snailRacing").style.display = 'block';
	backgroundMusic.pause()
	document.getElementById("snailMusic").play();
	
	
	var sound = document.getElementById("sound");
    sound.play();
}

async function login() {
  username = document.getElementById('username').value.trim();
  password = document.getElementById('password').value.trim();
  
  
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxsSh1bmzKOQJRAMn709Yl9w1aQzz5WLi4P1wNdl-IIccqnPLditBuiLCz4vi3Uw_rfqw/exec"); // Google Apps Script URL
    const users = await response.json();
    const event_type = "로그인성공"
    const comment = "이은석"

    // users 배열이 비어있거나 undefined일 경우 처리
    if (!users || users.length === 0) {
      alert("사용자 데이터를 가져오는 데 실패했습니다.");
      return;
    }
	
    const user = users.find(user => 
      user.username === username && 
      user.password === password
    );

    if (user) {
	  log(username, event_type, comment)
      start_button()
	  alert("로그인 성공!");
    } else {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    alert("로그인 중 오류가 발생했습니다.");
  }
}

const snails = [
    document.getElementById('snail1'),
    document.getElementById('snail2'),
    document.getElementById('snail3')
];
const gameArea = document.getElementById('gameArea');
const raceResult = document.getElementById('raceResult');

let selectedSnail = null;  // 사용자가 선택한 달팽이
let betAmountSnail = 0;    // 베팅 금액

// 베팅 금액 입력 처리
function formatBetAmountSnail() {
    const betInput = document.getElementById('betAmountSnail');
    let betValue = betInput.value.replace(/,/g, '');
    if (!isNaN(betValue) && betValue !== '') {
        betInput.value = parseInt(betValue).toLocaleString();
    }
}

let betPlaced = false;  // 베팅 여부를 추적하는 변수

// 달팽이 선택
function placeBetSnail(snailId) {
    if (betPlaced) {
        alert("이미 베팅이 완료되었습니다. 레이스를 시작하세요!");
        return;
    }
	var selet = document.getElementById("selet");
		selet.play();
    selectedSnail = snailId;
    const betInput = document.getElementById('betAmountSnail');
    betAmountSnail = parseInt(betInput.value.replace(/,/g, ''));

    if (isNaN(betAmountSnail) || betAmountSnail <= 0 || betAmountSnail > balance) {
        alert("유효한 베팅 금액을 입력하세요 (현재 자금 내에서)");
        selectedSnail = null;  // 유효하지 않으면 달팽이 선택 취소
        return;
    }

    betPlaced = true;  // 베팅이 완료되었음을 표시
    alert(`${snailId}에 ${betAmountSnail.toLocaleString()}원을 베팅했습니다.`);
}

// 달팽이 레이스 시작 함수
function startSnailRace() {
    if (!selectedSnail) {
        alert("먼저 달팽이에게 배팅을 해주세요!");
        return;
    }
	var race = document.getElementById("race");
		race.play();
    raceResult.textContent = '';
    snails.forEach(snail => {
        snail.style.left = '0px';
    });
	
	const event_type = "레이스 시작"
	const amount = betAmountSnail
    const comment = "교수님"
	log(username,event_type, comment)
	
    const raceDistance = gameArea.clientWidth - 40;
    let speeds = Array.from({ length: 3 }, () => Math.random() * 10 + 5);
    let accelerations = Array.from({ length: 3 }, () => Math.random() * 0.5 + 0.1);

    let finished = false;

    const interval = setInterval(() => {
        snails.forEach((snail, index) => {
            let currentLeft = parseInt(snail.style.left);

            if (Math.random() < 0.1) {
                speeds[index] = Math.random() * 10 + 5;
                accelerations[index] = Math.random() * 0.5 + 0.1;
            }

            if (currentLeft < raceDistance) {
                speeds[index] += accelerations[index];
                snail.style.left = currentLeft + speeds[index] + 'px';
            } else if (!finished) {
                finished = true;
                clearInterval(interval);

                let winner = snail.id;

                if (winner === "snail1") {
                    winner = "파란 달팽이";
                } else if (winner === "snail2") {
                    winner = "빨간 달팽이";
                } else if (winner === "snail3") {
                    winner = "코크 달팽이";
                }

                if (winner === selectedSnail) {
                    balance -= betAmountSnail;
                    balance += betAmountSnail * 3;  // 승리 시 3배
					const event_type = "게임 승리"
					const amount = betAmountSnail
					const comment = ""
					log(username,event_type, comment, winner)
                    alert(`축하합니다! ${winner}가 승리했습니다! ${betAmountSnail.toLocaleString()}원의 3배를 획득했습니다.`);
                } else {
                    balance -= betAmountSnail;  // 패배 시 베팅 금액 손실
					const event_type = "게임 패배"
					const amount = betAmountSnail
					const comment = ""
					log(username,event_type, comment, winner)
                    alert(`안타깝네요! ${winner}가 승리했습니다. 베팅 금액 ${betAmountSnail.toLocaleString()}원을 잃었습니다.`);
                    
                    // 자금이 0일 때 엔딩 화면과 음악 전환
                    if (balance <= 0) {
                        showEndingScreen();
                        return; // 이후 코드 실행 방지
                    }
                }

                document.getElementById("balance").innerText = `보유금: ${balance.toLocaleString()}`;

                // 레이스 종료 후 베팅 상태 초기화
                betPlaced = false;
                selectedSnail = null;
                betAmountSnail = 0;
            }
        });
    }, 100);
}
function formatBetAmount() {
    const betInput = document.getElementById('betAmount');
    let betValue = betInput.value.replace(/,/g, '');
    if (!isNaN(betValue) && betValue !== '') {
        betInput.value = parseInt(betValue).toLocaleString();
    }
}

function formatBetAmountGuess() {
    const betInput = document.getElementById('betAmountGuess');
    let betValue = betInput.value.replace(/,/g, '');
    if (!isNaN(betValue) && betValue !== '') {
        betInput.value = parseInt(betValue).toLocaleString();
    }
}


function checkBalance(amount) {
    balance -= amount; // 배팅 금액 차감
    document.getElementById("balanceAmount").textContent = balance.toLocaleString(); // 보유금 업데이트

    if (balance <= 0) {
        // 보유금이 0이 될 때 엔딩 화면과 음악 전환
		showEndingScreen();
    }
}

function showEndingScreen() {
    // 엔딩 화면을 보여주고 음악 전환
	const event_type = "게임 파산"
	const comment = "사랑해요"
	log(username,event_type, comment)
	
    document.getElementById("restart_Button").style.display = 'block';
    document.getElementById("ending_img").style.display = "block";
	document.getElementById("snailMusic").pause();
    document.getElementById("endingMusic").play(); // 엔딩 음악 재생
    document.getElementById("snailRacing").style.display = 'none';
    document.getElementById("balance").style.display = 'none';
}