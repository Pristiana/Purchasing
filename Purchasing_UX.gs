function Reset() {
  const spreadsheet = SpreadsheetApp.getActive();
  // 👑 SEJUTA UMAT: Langsung tembak sheet yang lagi lu buka!
  const masterSheet = spreadsheet.getActiveSheet(); 
  const sheetName = masterSheet.getName();

  // 🛡️ PROTEKSI BRUTAL: Biar ga sengaja ngehapus sheet 'Setting', 'Jadwal', dll!
  if (!sheetName.includes("Master")) {
    spreadsheet.toast("🚨 MAU NGELAWAK LU? Fungsi ini cuma boleh jalan di sheet yang ada nama 'Master'-nya!", "AKSES DITOLAK", 5);
    return;
  }

  // 1️⃣ BERSIHKAN DOSA MASA LALU (TAPI RUMUS TETAP SUCI! 😇)
  const masterLastRow = masterSheet.getLastRow();
  const masterLastCol = masterSheet.getLastColumn();

  if (masterLastRow >= 3 && masterLastCol > 0) {
    const range = masterSheet.getRange(3, 1, masterLastRow - 2, masterLastCol);
  
    // 🕵️‍♂️ Sedot semua rumus dulu ke memori biar ga ilang!
    const formulas = range.getFormulas();
  
    // 🧹 Filter data ampas, sisakan rumus suci
    const dataBersih = formulas.map(row => 
      row.map(sel => sel ? sel : "") 
    );
  
    // 💥 TEMBAK BALIK!
    range.setValues(dataBersih);
    
    spreadsheet.toast("Sheet [" + sheetName + "] berhasil dikinclongin! Rumus aman! 🧼🧹", "RESET DYNAMIC SUKSES", 3);
  } else {
    spreadsheet.toast("Sheet udah bersih dari baris 3 ke bawah, ga ada data! 👀", "STATUS AMAN", 3);
  }
}


function HideEC() {
SpreadsheetApp.getActiveSheet().hideColumns(8,2);
};

function ExpandEC() {
SpreadsheetApp.getActiveSheet().showColumns(8, 2); 
};

function HideSM() {
SpreadsheetApp.getActiveSheet().hideColumns(11,3);
};

function ExpandSM() {
SpreadsheetApp.getActiveSheet().showColumns(11,3); 
};

function HideTF() {
SpreadsheetApp.getActiveSheet().hideColumns(14,7);
};

function ExpandTF() {
SpreadsheetApp.getActiveSheet().showColumns(14,7); 
};

function HideRS() {
SpreadsheetApp.getActiveSheet().hideColumns(24,9);
};

function ExpandRS() {
SpreadsheetApp.getActiveSheet().showColumns(24,9); 
};

function HideRP() {
SpreadsheetApp.getActiveSheet().hideColumns(37,2);
};

function ExpandRP() {
SpreadsheetApp.getActiveSheet().showColumns(37,2); 
};

function ShowAll() {
ExpandEC();
ExpandSM();
ExpandTF();
ExpandRS();
ExpandRP();
};

function HideAll() {
HideEC();
HideSM();
HideTF();
HideRS();
HideRP();
};
