const SPREADSHEET_ID = '1wdR4peF9gzcpQrByBiO_t1oZ_wVMaMT5mR1dnu3uA-4';
const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    const sheet = getOrCreateSheet_();
    const data = e && e.parameter ? e.parameter : {};
    const nome = sanitize_(data.nome);
    const phone = sanitize_(data.phone);
    const pagina = sanitize_(data.pagina);
    const origem = sanitize_(data.origem);

    if (!nome || !phone) {
      return jsonResponse_({
        success: false,
        message: 'Campos obrigatorios ausentes.',
      });
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/Hora', 'Nome', 'Telefone', 'Pagina', 'Origem']);
    }

    sheet.appendRow([
      new Date(),
      nome,
      phone,
      pagina,
      origem,
    ]);

    return jsonResponse_({
      success: true,
      message: 'Lead salvo com sucesso.',
    });
  } catch (error) {
    return jsonResponse_({
      success: false,
      message: error.message,
    });
  }
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  return sheet || spreadsheet.insertSheet(SHEET_NAME);
}

function sanitize_(value) {
  return String(value || '').trim();
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
