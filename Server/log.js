var SHEET_NAME = "시트1";
var SCRIPT_PROP = PropertiesService.getScriptProperties(); 

function doGet(e) {
  return handleResponse(e);
}

function doPost(e){
  return handleResponse(e);
}

function handleResponse(e) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;
    var row = [];

    // 이벤트 ID 생성 및 증가
    var eventId = getNextEventId();  // 이벤트 ID를 가져와 설정

    for (var i in headers){
      if (headers[i] === "Timestamp") { 
        row.push(new Date());
      } else if (headers[i] === "이벤트ID") {
        row.push(eventId);  // 이벤트 ID를 추가
      } else { 
        row.push(e.parameter[headers[i]]);
      }
    }

    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { 
    lock.releaseLock();
  }
}

// 이벤트 ID 값을 가져오고 증가시키는 함수
function getNextEventId() {
  var eventId = parseInt(SCRIPT_PROP.getProperty("eventId")) || 0; // 저장된 ID 불러오기 (기본값 0)
  SCRIPT_PROP.setProperty("eventId", eventId + 1); // ID 1 증가 후 저장
  return eventId;
}

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
    SCRIPT_PROP.setProperty("eventId", 0); // 초기 이벤트 ID 값 설정
}