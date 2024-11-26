let username = ""
let password = ""
let balance = 10; //시작 비용
let item_cost = 15; //뽑기 비용
let multiply = 4; //배당
let isCommonRewardGiven = false;  // 커먼 보상 지급 여부
let isRareRewardGiven = false;    // 레어 보상 지급 여부
let isEpicRewardGiven = false;    // 에픽 보상 지급 여부
let isLegendRewardGiven = false;  // 레전드 보상 지급 여부

const items = [
     { name: "[커먼] 노란 달팽이", src: "img/collection/ping1.gif", rarity: "커먼" },
    { name: "[커먼] 연두 달팽이", src: "img/collection/ping2.gif", rarity: "커먼" },
    { name: "[커먼] 보라 달팽이", src: "img/collection/ping3.gif", rarity: "커먼" },
    { name: "[커먼] 무지개 달팽이", src: "img/collection/ping4.gif", rarity: "커먼" },
    { name: "[레어] 통통 달팽이", src: "img/collection/ping5.gif", rarity: "레어" },
    { name: "[레어] 마노", src: "img/collection/ping6.gif", rarity: "레어" },
    { name: "[레어] 이끼 달팽이", src: "img/collection/ping7.gif", rarity: "레어" },
    { name: "[레어] 변형된 달팽이", src: "img/collection/ping8.gif", rarity: "레어" },
    { name: "[에픽] 플라잉 달팽이", src: "img/collection/ping9.gif", rarity: "에픽" },
    { name: "[에픽] 픽셀 달팽이", src: "img/collection/ping10.gif", rarity: "에픽" },
    { name: "[레전드] 귤팽이", src: "img/collection/ping11.gif", rarity: "레전드" },
    { name: "[레전드] 검게 물든 달팽이", src: "img/collection/ping12.gif", rarity: "레전드" }
];

const probabilities = {
    "커먼": 50, // 50%
    "레어": 30, // 30%
    "에픽": 15, // 15%
    "레전드": 5  // 5%
};

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


function updateBalanceDisplay(balance) {
	document.getElementById("balance").innerText = `코인: ${balance}`;
    const balanceContainer = document.getElementById('balance');
    balanceContainer.innerHTML = ''; // 기존 내용을 초기화

    // balance 값만큼 코인 이미지 추가
    const coinImagePath = 'img/coin.png'; // 코인 이미지 경로 설정
    const maxCoinsToShow = 1; // 한 번에 보여줄 최대 코인 개수

	const coinImg = document.createElement('img');
	coinImg.src = coinImagePath;
	coinImg.alt = 'Coin';
	balanceContainer.appendChild(coinImg);

    // 잔여 코인이 많은 경우 "+X" 표시
    if (balance >= maxCoinsToShow) {
        const extraCoins = document.createElement('span');
        extraCoins.textContent = `x${balance - maxCoinsToShow+1}`;
        extraCoins.style.marginLeft = '5px';
        extraCoins.style.fontWeight = 'bold';
        balanceContainer.appendChild(extraCoins);
    }
	else{
		const extraCoins = document.createElement('span');
        extraCoins.textContent = `x0`;
        extraCoins.style.marginLeft = '5px';
        extraCoins.style.fontWeight = 'bold';
        balanceContainer.appendChild(extraCoins);
	}
}


function closeWindow() {
    window.close();
}

function success() {
    document.getElementById("restart_Button").style.display = 'block';
    document.getElementById("success_img").style.display = "block";
    document.getElementById("snailMusic").pause();
    document.getElementById("clap").play();
    document.getElementById("snailRacing").style.display = 'none';
    document.getElementById("balance").style.display = 'none';
    document.getElementById("container").style.display = 'none';
    document.getElementById("help-button").style.display = 'none';
}



function restart() {
    const event_type = "게임 재시작";
    const comment = "";

    // 음악 객체 가져오기
    const snailMusic = document.getElementById("snailMusic");
    const endingMusic = document.getElementById("endingMusic");

    // 음악 초기화
    if (snailMusic) {
        snailMusic.pause();
        snailMusic.currentTime = 0; // 음악 재생 위치 초기화
    }
    if (endingMusic) {
        endingMusic.pause();
        endingMusic.currentTime = 0; // 엔딩 음악도 초기화
    }

    // UI 초기화
    document.getElementById("img").style.display = "none"; // 초기 메인 화면 숨기기
    document.getElementById("restart_Button").style.display = "none";
    document.getElementById("ending_img").style.display = "none";
    document.getElementById("success_img").style.display = "none";

    document.getElementById("balance").style.display = "block";
    document.getElementById("snailRacing").style.display = "block";
    document.getElementById("container").style.display = "block";
    document.getElementById("help-button").style.display = "block";

    // 게임 상태 초기화
    balance = 10; // 코인 초기화
    betPlaced = false; // 배팅 초기화
    selectedSnail = null; // 선택한 달팽이 초기화
    isRaceRunning = false; // 레이스 상태 초기화
    betAmountSnail = 0; // 배팅 금액 초기화
    multiply = 4; // 기본 배당 초기화

    updateBalanceDisplay(balance); // 코인 표시 업데이트

    // 텍스트 초기화
    document.getElementById("select_snail").innerText = "";
    document.getElementById("betting_coin").innerText = "";
    document.getElementById("winner_snail").innerText = "";
    document.getElementById("get_coin").innerText = "";

    // 달팽이 위치 초기화
    const snails = [
        document.getElementById("snail1"),
        document.getElementById("snail2"),
        document.getElementById("snail3"),
    ];
    snails.forEach(snail => {
        snail.style.left = "0px"; // 달팽이 위치 초기화
    });

    // 컬렉션 북 블라인드 초기화
    all_blind();

    // 컬렉션 상태 초기화
    collection.clear();
    isCommonRewardGiven = false;
    isRareRewardGiven = false;
    isEpicRewardGiven = false;
    isLegendRewardGiven = false;

    // 컬렉션 새로고침
    initializeCollection();

    // 효과음 재생 (선택 사항)
    const selet = document.getElementById("selet");
    if (selet) {
        selet.currentTime = 0;
        selet.play();
    }

    // **음악 다시 재생**
    setTimeout(() => {
        if (snailMusic) {
            snailMusic.play(); // 게임 시작 음악 다시 재생
        }
    }, 500); // 약간의 지연시간 후 음악 재생
}


function start_button() {

	
    document.getElementById("img").style.display = 'none';
    document.getElementById("loginForm").style.display = 'none';

    document.getElementById("balance").style.display = 'block';
    document.getElementById("snailRacing").style.display = 'block';
    document.getElementById("container").style.display = 'block';
    document.getElementById("help-button").style.display = 'block';

	document.getElementById("snailMusic").play();
	
	
	var sound = document.getElementById("sound");
    sound.play();
}

async function login() {

  // 사용자 입력 값 가져오기
  username = document.getElementById('username').value.trim();
  password = document.getElementById('password').value.trim();

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxsSh1bmzKOQJRAMn709Yl9w1aQzz5WLi4P1wNdl-IIccqnPLditBuiLCz4vi3Uw_rfqw/exec"); // Google Apps Script URL
    const users = await response.json();
    const event_type = "로그인성공";
    const comment = "이은석";

    // users 배열이 비어있거나 undefined일 경우 처리
    if (!users || users.length === 0) {
      alert("사용자 데이터를 가져오는 데 실패했습니다.");
      return;
    }
	
    // 입력한 username과 password가 일치하는 사용자를 검색
    const user = users.find(user => 
      user.username === username && 
      user.password === password
    );

    if (user) {
      // 로그 이벤트 기록
      log(username, event_type, comment);
      start_button(); // 로그인 성공 시 다음 단계로 진행
      alert("로그인 성공!");
    } else {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    alert("로그인 중 오류가 발생했습니다.");
  } finally {
    // 로딩 완료 후 버튼 다시 활성화
    loginButton.disabled = false;
    loginButton.textContent = "로그인"; // 원래 텍스트로 복구
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
let betAmountSnail = 0;    // 배팅 금액

// 배팅 금액 입력 처리
function formatBetAmountSnail() {
    const betInput = document.getElementById('betAmountSnail');
    let betValue = betInput.value.replace(/,/g, '');
    if (!isNaN(betValue) && betValue !== '') {
        betInput.value = parseInt(betValue).toLocaleString();
    }
}

let betPlaced = false;  // 배팅 여부를 추적하는 변수

// 달팽이 선택
function placeBetSnail(snailId) {
    // 레이스 실행 중이면 배팅 불가
    if (isRaceRunning) {
        alert("레이스가 진행 중입니다! 종료 후 다시 시도 해주세요.");
        return; // 레이스 중에는 함수 종료
    }

    // 배팅이 이미 설정된 경우 확인
    if (betPlaced) {
        const confirmReset = confirm("이미 배팅이 완료되었습니다. 기존 배팅을 취소하고 다시 배팅하시겠습니까?");
        if (!confirmReset) {
            return; // 취소를 원하지 않으면 함수 종료
        } else {
            // 기존 배팅 취소 처리
            betPlaced = false;
            selectedSnail = null;
            betAmountSnail = 0;
        }
    }

    var selet = document.getElementById("selet");
    selet.play();

    selectedSnail = snailId;
    const betInput = document.getElementById('betAmountSnail');
    betAmountSnail = parseInt(betInput.value.replace(/,/g, ''));

    if (isNaN(betAmountSnail) || betAmountSnail <= 0 || betAmountSnail > balance) {
        alert("유효한 배팅 개수를 입력하세요 (보유 코인 내에서)");
        selectedSnail = null;  // 유효하지 않으면 달팽이 선택 취소
        return;
    }

    betPlaced = true;  // 배팅이 완료되었음을 표시
    alert(`${snailId}에 ${betAmountSnail.toLocaleString()}코인을 배팅했습니다.`);
    document.getElementById("select_snail").innerText = `${snailId}`;
    document.getElementById("betting_coin").innerText = `${betAmountSnail}`;
    updateBalanceDisplay(balance - betAmountSnail);
	//document.getElementById("balance").innerText = `코인 : ${balance - betAmountSnail}`;
}


// 달팽이 레이스 시작 함수
let isRaceRunning = false; // 레이스 실행 상태 플래그


function startSnailRace() {
    if (!selectedSnail) {
        alert("먼저 달팽이에게 배팅을 해주세요!");
        return;
    }

    if (isRaceRunning) {
        alert("레이스가 아직 진행 중입니다. 종료 후 다시 시도하세요!");
        return;
    }

    isRaceRunning = true;
    raceResult.textContent = ''; // 이전 결과 초기화
	const race = document.getElementById("race");
	race.play();
	raceResult.textContent = '';
    snails.forEach(snail => {
        snail.style.left = '0px';
    });

    const raceDistance = gameArea.clientWidth - 40;
    let speeds = Array.from({ length: 3 }, () => Math.random() * 10 + 5);
    let accelerations = Array.from({ length: 3 }, () => Math.random() * 0.5 + 0.1);

    let finished = false;

    const interval = setInterval(() => {
        snails.forEach((snail, index) => {
            let currentLeft = parseInt(snail.style.left) || 0;

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

                // 레이스 결과 확인
                let winner = snail.id === "snail1" ? "파란 달팽이" :
                             snail.id === "snail2" ? "빨간 달팽이" :
                             "코크 달팽이";

                if (winner === selectedSnail) {
                    balance += betAmountSnail * multiply; // 승리 시 배당 계산
                    showRewardMessage(`🎉 ${winner}가 승리했습니다! +${(betAmountSnail * multiply).toLocaleString()} 코인!`);
                } else {
                    balance -= betAmountSnail; // 패배 시 배팅 금액 차감
                    showRewardMessage(`😢 ${winner}가 승리했습니다. -${betAmountSnail.toLocaleString()} 코인`);
                }

                // 코인 즉시 업데이트
                updateBalanceDisplay(balance);

                // 레이스 상태 초기화
                isRaceRunning = false;
                betPlaced = false;
                selectedSnail = null;
                betAmountSnail = 0;

                // 게임 종료 후 잔액 확인
                if (balance <= 0) {
                    showEndingScreen();
                }
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
    document.getElementById("balanceAmount").textContent = balance.toLocaleString(); // 코인 업데이트

    if (balance <= 0) {
        // 코인이 0이 될 때 엔딩 화면과 음악 전환
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
    document.getElementById("container").style.display = 'none';
    document.getElementById("help-button").style.display = 'none';
}


// 뽑은 아이템을 기록
const collection = new Set();

// HTML 요소 가져오기
const drawButton = document.getElementById('drawButton');
const newItemElement = document.getElementById('newItem');
const collectionList = document.getElementById('collectionList');

// 컬렉션 초기화 (블라인드 상태로 생성)
function initializeCollection() {
    const collectionList = document.getElementById("collectionList");
    if (collectionList) {
        collectionList.innerHTML = ""; // 기존 컬렉션 초기화
    }

    items.forEach((item, index) => {
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("item");
        itemContainer.setAttribute("data-index", index);

        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.name;
        img.style.display = "none"; // 초기에는 숨김 처리

        const blind = document.createElement("div");
        blind.classList.add("blind");

        itemContainer.appendChild(img);
        itemContainer.appendChild(blind);
        collectionList.appendChild(itemContainer);
    });
}

function drawItemWithProbability() {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const rarity in probabilities) {
        cumulativeProbability += probabilities[rarity];
        if (random <= cumulativeProbability) {
            const filteredItems = items.filter(item => item.rarity === rarity);
            return filteredItems[Math.floor(Math.random() * filteredItems.length)];
        }
    }
}

// 보상 및 배당 관련 로직
function checkCollectionRewards() {
    const commonItems = [...collection].filter(index => items[index].rarity === "커먼").length;
    const rareItems = [...collection].filter(index => items[index].rarity === "레어").length;
    const epicItems = [...collection].filter(index => items[index].rarity === "에픽").length;
    const legendItems = [...collection].filter(index => items[index].rarity === "레전드").length;

    // 모든 달팽이를 모았을 때 우선 처리
    if (collection.size === items.length) {
        // 게임 엔딩 메시지 출력
        showRewardMessage("🎉 모든 달팽이를 얻었습니다! 게임을 클리어했습니다!");
        
        // 게임 엔딩 화면 호출
        setTimeout(() => {
            success();
        }, 3000); // 메시지 표시 후 엔딩 화면으로 전환 (3초 대기)

        return; // 다른 보상 메시지 출력 차단
    }

    // 커먼 보상 (중복 실행 방지)
    if (commonItems === 4 && !isCommonRewardGiven) {
        balance += 45;
        isCommonRewardGiven = true; // 보상 상태 플래그 업데이트
        updateBalanceDisplay(balance);
        showRewardMessage("🎉 축하합니다! 커먼 달팽이를 모두 모았습니다. 45 코인이 지급되었습니다!");
    }

    // 레어 보상 (중복 실행 방지)
    if (rareItems === 4 && !isRareRewardGiven) {
        balance += 90;
        isRareRewardGiven = true; // 보상 상태 플래그 업데이트
        updateBalanceDisplay(balance);
        showRewardMessage("🎉 축하합니다! 레어 달팽이를 모두 모았습니다. 90 코인이 지급되었습니다!");
    }

    // 에픽 보상 (중복 실행 방지)
    if (epicItems === 2 && !isEpicRewardGiven) {
        balance += 150;
        isEpicRewardGiven = true; // 보상 상태 플래그 업데이트
        updateBalanceDisplay(balance);
        showRewardMessage("🎉 축하합니다! 에픽 달팽이를 모두 모았습니다. 150 코인이 지급되었습니다!");
    }

    // 레전드 보상 (중복 실행 방지)
    if (legendItems === 2 && !isLegendRewardGiven) {
        multiply = 10; // 배당 10배로 상승
        isLegendRewardGiven = true; // 보상 상태 플래그 업데이트
        updateBalanceDisplay(balance);
        showRewardMessage("🎉 축하합니다! 레전드 달팽이를 모두 모았습니다. 이제 배당이 10배로 상승합니다!");
    }
}


console.log("item_cost:", item_cost); // item_cost 확인
console.log("balance:", balance); // 잔액 확인
// 뽑기 함수
function drawItem() {
    if (balance >= item_cost) { // 뽑기 비용 확인
        // 코인 차감
        balance -= item_cost;
        updateBalanceDisplay(balance);
        console.log("뽑기 진행 중. 잔여 코인: ", balance); // 디버깅용

        // 랜덤 아이템 선택
        const selectedItem = drawItemWithProbability();
        console.log("선택된 아이템: ", selectedItem); // 디버깅용

        // 새로 뽑은 아이템 표시
        newItemElement.innerHTML = `
            <img id="selectedItem_img" src="${selectedItem.src}" alt="${selectedItem.name}" title="${selectedItem.name}">
            <p>${selectedItem.name}</p>
        `;

        // 이미 뽑은 아이템이라면 무시
        const selectedIndex = items.indexOf(selectedItem);
        if (collection.has(selectedIndex)) {
            console.log("이미 보유한 아이템입니다."); // 디버깅용
            return;
        }

        // 뽑은 아이템 컬렉션에 추가
        collection.add(selectedIndex);
        console.log("컬렉션 업데이트: ", collection); // 디버깅용

        // 블라인드 해제
        const itemContainers = document.querySelectorAll('.item');
        const targetItem = itemContainers[selectedIndex];
        const img = targetItem.querySelector('img');
        const blind = targetItem.querySelector('.blind');

        // 이미지 표시, 블라인드 제거
        img.style.display = 'block';
        blind.style.display = 'none';

        // 보상 및 배당 체크
        checkCollectionRewards();
    } else {
        alert(`${item_cost.toLocaleString()}코인 이상 소지 시 사용 가능합니다.`);
    }
}


function all_blind() {
    const itemContainers = document.querySelectorAll('.item');
    itemContainers.forEach(itemContainer => {
        const img = itemContainer.querySelector('img');
        const blind = itemContainer.querySelector('.blind');

        // 이미지 숨김, 블라인드 표시
        if (img) img.style.display = 'none';
        if (blind) blind.style.display = 'block';
    });

    // 현재 뽑힌 아이템 영역 초기화
    const newItemElement = document.getElementById("newItem");
    if (newItemElement) {
        newItemElement.innerHTML = "";
    }
}



// 초기화 실행
initializeCollection();

// 버튼 클릭 이벤트 등록
drawButton.addEventListener('click', drawItem);



////////도움말/////////////
// HTML 요소 가져오기
const helpButton = document.getElementById('help-button');
const modal = document.getElementById('modal');
const closeButton = document.getElementById('close-button');
const tab1 = document.getElementById('tab-1');
const tab2 = document.getElementById('tab-2');
const page1 = document.getElementById('page-1');
const page2 = document.getElementById('page-2');

// 모달 열기
helpButton.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// 닫기 버튼 클릭 시 모달 숨기기
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// 1페이지 탭 클릭 이벤트
tab1.addEventListener('click', () => {
  // 페이지 활성화 변경
  page1.classList.add('active');
  page2.classList.remove('active');

  // 탭 스타일 변경
  tab1.classList.add('active');
  tab2.classList.remove('active');
});

// 2페이지 탭 클릭 이벤트
tab2.addEventListener('click', () => {
  // 페이지 활성화 변경
  page2.classList.add('active');
  page1.classList.remove('active');

  // 탭 스타일 변경
  tab2.classList.add('active');
  tab1.classList.remove('active');
});

// 모달 외부를 클릭하면 숨기기
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
function resetGame() {
    balance = 10;
    multiply = 4;
    collection.clear(); // 컬렉션 초기화

    // 보상 상태 플래그 초기화
    isCommonRewardGiven = false;
    isRareRewardGiven = false;
    isEpicRewardGiven = false;
    isLegendRewardGiven = false;

    // 기타 게임 상태 초기화
    updateBalanceDisplay(balance);
    all_blind();
}
function showRewardMessage(message) {
    const rewardMessage = document.getElementById('rewardMessage');
    rewardMessage.textContent = message; // 메시지 설정z
    rewardMessage.style.display = 'block'; // 메시지 박스 표시
	
	 updateBalanceDisplay(balance);
    // 일정 시간 후 메시지 박스 숨기기
    setTimeout(() => {
        rewardMessage.style.display = 'none';
    }, 3000); // 3초 후 사라짐
}
