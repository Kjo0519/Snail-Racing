function doGet(e) {
  var sheet = SpreadsheetApp.openById("1Qq-Yx_66XYKSL-_0Cw5ZXOdzrdZ9rECOSfYyDm-BPEk").getSheetByName("시트1");
  var rows = sheet.getDataRange().getValues();
  var data = [];

  for (var i = 1; i < rows.length; i++) {
    data.push({
      username: rows[i][0],
      password: rows[i][1]
    });
  }

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}