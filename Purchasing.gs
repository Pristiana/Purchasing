// 👑 GLOBAL VARIABLE BIAR COOKIE BISA DIPAKAI RAME-RAME
var COOKIE_SAKTI = "";
var HEADERS_TOPENG = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};

// 📊 FUNGSIONALITAS LOADING BAR UNTUK MEMANJAKAN MATA LOGGING
function cetakProgress(step, totalStep, statusPesan) {
  var persen = Math.round((step / totalStep) * 100);
  var panjangBar = 15;
  var isiBar = Math.round((persen / 100) * panjangBar);
  var barTeks = "";
  for (var i = 0; i < panjangBar; i++) {
    barTeks += (i < isiBar) ? "█" : "░";
  }
  Logger.log("⚙️ [" + barTeks + "] " + persen + "% | " + statusPesan);
}

// 🔐 1️⃣ FUNGSI LOGIN TUNGGAL 
function loginCentratireap() {
  Logger.log("=================================================");
  cetakProgress(1, 5, "Memulai ritual handshake awal ke server iReap...");
  var loginUrl = "https://pro.ireappos.com/login"; 
  var payload = { "email": "pristiana.faisal@gmail.com", "password": "1610IrEaP@" };

  function createCookie(response) {
    var c = response.getAllHeaders()["Set-Cookie"];
    if (!c) return "";
    return Array.isArray(c) ? c.map(x => x.split(';')[0]).join('; ') : c.split(';')[0];
  }

  var resAwal = UrlFetchApp.fetch(loginUrl, { "method": "get", "headers": HEADERS_TOPENG, "followRedirects": false });
  HEADERS_TOPENG["Cookie"] = createCookie(resAwal);
  cetakProgress(3, 5, "Mencuri Token Session Awal... [DONE]");

  var resLogin = UrlFetchApp.fetch(loginUrl, { "method": "post", "payload": payload, "headers": HEADERS_TOPENG, "followRedirects": false });
  if (resLogin.getResponseCode() === 200) {
    Logger.log("🚨 [CRITICAL ERROR] Kredensial lu ditendang mentah-mentah sama server!");
    throw new Error("❌ ZONK! Email/Password lu salah, mblo!");
  }
  
  COOKIE_SAKTI = createCookie(resLogin) || HEADERS_TOPENG["Cookie"];
  HEADERS_TOPENG["Cookie"] = COOKIE_SAKTI;
  cetakProgress(5, 5, "🔑 Sesi Login Sukses Total! Cookie Sakti diamankan.");
  Logger.log("=================================================");
}

// 🚀 2️⃣ COMMAND CENTER: TOMBOL MASTER 1
function Update_Master_1() {
  Logger.log("🏁 [OPERASI START] Memicu Penuh Pembaruan Master 1...");
  loginCentratireap();
  
  var storeConfig = { "Master 1": { id: "78191", smSheet: "Stock Movement 1" } };
  sikatSemuaAPI(storeConfig);

  Logger.log("🪡 [RITUAL JAHIT] Menyelaraskan Data ke Tab Master 1...");
  // 💥 KUNCI SILANG: End Qty B diambil murni dari Stock Movement 3!
  copasMasterGeneric('Master 1', [
    ['Data Barang', 'B2:E', 'Item Code'], 
    ['Data Barang', 'G2:G', 'Wholesale Price (IDR)'], 
    ['Data Barang', 'Q2:Q', 'Cost (IDR)'],
    ['Stock Movement 1', 'J2:J', 'End Qty'], 
    ['Stock Movement 1', 'D2:D', 'Issued'], 
    ['Stock Movement 1', 'E2:E', 'Receipt'], 
    ['Stock Movement 1', 'F2:F', 'Sold'],
    ['Stock Movement 3', 'J2:J', 'End Qty B'] 
  ]);

  autoSortTarget('Master 1');
  Logger.log("🏆 [SUCCESS] MASTER 1 LULUS UJI KLINIS PARIPURNA! 🥂✨");
}

// 🚀 3️⃣ COMMAND CENTER: TOMBOL MASTER 3
function Update_Master_3() {
  Logger.log("🏁 [OPERASI START] Memicu Penuh Pembaruan Master 3...");
  loginCentratireap();
  
  var storeConfig = { "Master 3": { id: "138696", smSheet: "Stock Movement 3" } };
  sikatSemuaAPI(storeConfig);

  Logger.log("🪡 [RITUAL JAHIT] Menyelaraskan Data ke Tab Master 3...");
  // 💥 KUNCI SILANG: End Qty B diambil murni dari Stock Movement 1!
  copasMasterGeneric('Master 3', [
    ['Data Barang', 'B2:E', 'Item Code'], 
    ['Data Barang', 'G2:G', 'Wholesale Price (IDR)'], 
    ['Data Barang', 'Q2:Q', 'Cost (IDR)'],
    ['Stock Movement 3', 'J2:J', 'End Qty'], 
    ['Stock Movement 3', 'D2:D', 'Issued'], 
    ['Stock Movement 3', 'E2:E', 'Receipt'], 
    ['Stock Movement 3', 'F2:F', 'Sold'],
    ['Stock Movement 1', 'J2:J', 'End Qty B']
  ]);

  autoSortTarget('Master 3');
  Logger.log("🏆 [SUCCESS] MASTER 3 LULUS UJI KLINIS PARIPURNA! 🥂✨");
}

// 🌪️ 4️⃣ FUNGSI TARIK DATA MASSAL (METODE PARALEL JSON DEWA)
function sikatSemuaAPI(storeConfig) {
  Logger.log("📡 [NETWORK AREA] Membuka Portal API iReap...");
  var zonaWaktu = Session.getScriptTimeZone();
  var d = new Date(), m = new Date(); 
  m.setDate(d.getDate() - 30); 
  
  var tglAkhir = Utilities.formatDate(d, zonaWaktu, "yyyy/MM/dd");
  var tglAwal = Utilities.formatDate(m, zonaWaktu, "yyyy/MM/dd");
  Logger.log("📅 Rentang Data Diminta: " + tglAwal + " s/d " + tglAkhir);

  var apiHeaders = { 
    "User-Agent": HEADERS_TOPENG["User-Agent"], 
    "Cookie": COOKIE_SAKTI, 
    "X-Requested-With": "XMLHttpRequest", 
    "Accept": "application/json, text/javascript, */*; q=0.01", 
    "Referer": "https://pro.ireappos.com/stockpos" 
  };
  
  // Payload Sakti hasil Inspect Element lu yang super rigid!
  var payloadDataTables = JSON.stringify({
    "draw": 1,
    "columns": [
      { "data": "article.itemCode", "name": "Item Code", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "article.description", "name": "Description", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "startQty", "name": "START Quantity", "searchable": true, "orderable": false, "search": { "value": "", "regex": false } },
      { "data": "issuedQty", "name": "Issued", "searchable": true, "orderable": false, "search": { "value": "", "regex": false } },
      { "data": "receiptQty", "name": "Receipt", "searchable": true, "orderable": false, "search": { "value": "", "regex": false } },
      { "data": "saleQty", "name": "Sold", "searchable": true, "orderable": false, "search": { "value": "", "regex": false } },
      { "data": "returnQty", "name": "Returned", "searchable": true, "orderable": false, "search": { "value": "", "regex": false } },
      { "data": "tinQty", "name": "Transfered In", "searchable": true, "orderable": false, "search": { "value": "", "regex": false } },
      { "data": "toutQty", "name": "Transfered Out", "searchable": true, "orderable": false, "search": { "value": "", "regex": false } },
      { "data": "endQty", "name": "END Quantity", "searchable": true, "orderable": false, "search": { "value": "", "regex": false } }
    ],
    "order": [ { "column": 1, "dir": "asc" } ],
    "start": 0,
    "length": 10000, 
    "search": { "value": "", "regex": false }
  });

  var reqs = [{ url: "https://pro.ireappos.com/article", method: "get", headers: HEADERS_TOPENG, followRedirects: false }];
  
  var keys = Object.keys(storeConfig || {});
  keys.forEach(master => {
    var qParam = "?storeid=" + storeConfig[master].id + "&startdate=" + tglAwal + "&enddate=" + tglAkhir + "&excludezero=false&excludedeleted=true";
    reqs.push({ url: "https://pro.ireappos.com/stockpos/datatable" + qParam, method: "post", contentType: "application/json", payload: payloadDataTables, headers: apiHeaders, muteHttpExceptions: true });
  });

  cetakProgress(20, 100, "Menembak endpoint server secara paralel (fetchAll)...");
  var responses = UrlFetchApp.fetchAll(reqs);
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 📦 PARSING DATA BARANG (Index Respon: 0)
  cetakProgress(50, 100, "Mengekstrak DOM Data Barang...");
  if (responses[0].getResponseCode() !== 302) {
    var html = responses[0].getContentText();
    var tbody = html.substring(html.search(/<tbody[^>]*>/i), html.search(/<\/tbody>/i));
    if (tbody) {
      var finalData = [];
      tbody.split('<tr').slice(1).forEach(row => {
        var rowData = row.split('<td').slice(1).map(col => col.split('</td>')[0].replace(/^[^>]+>/, '').replace(/<[^>]+>/g, '').replace(/>/g, '').replace(/,/g, '').replace(/\s+/g, ' ').trim());
        if (rowData.length > 0) { rowData.pop(); finalData.push(rowData); }
      });
      if (finalData.length > 0) {
        finalData.sort((a, b) => (a[2] || "").toString().toLowerCase().localeCompare((b[2] || "").toString().toLowerCase()));
        var columnHeaders = ["System ID", "Item Code", "Description", "Category", "Normal Price (IDR)", "Promo Price (IDR)", "Wholesale Price (IDR)", "Wholesale Promo Price (IDR)", "Unit of Measure", "Min Stock", "Tax (%)", "Non Stock", "Unsellable", "Open Selling Price", "Status", "Last Update", "Cost"];
        var sheetBrg = ss.getSheetByName("Data Barang") || ss.insertSheet("Data Barang");
        sheetBrg.clear(); 
        sheetBrg.getRange(1, 1, 1, columnHeaders.length).setValues([columnHeaders]);
        sheetBrg.getRange(2, 1, finalData.length, 2).setNumberFormat("@"); 
        sheetBrg.getRange(2, 1, finalData.length, finalData[0].length).setValues(finalData);
        cetakProgress(75, 100, "🎉 BOOM! Tab [Data Barang] sukses diperbarui!");
      }
    }
  }

  // 🚚 PARSING STOCK MOVEMENT
  keys.forEach((master, i) => {
    var resCode = responses[i + 1].getResponseCode();
    var jsonMentah = responses[i + 1].getContentText();
    
    if (resCode !== 200 || jsonMentah.indexOf("<!DOCTYPE") !== -1 || jsonMentah.indexOf("<html") !== -1) {
      Logger.log("💀 [CRITICAL] Server batuk-batuk mendadak! Code: " + resCode);
      return;
    }

    var dataJSON = JSON.parse(jsonMentah);
    var arrayBarang = dataJSON.data;

    if (!arrayBarang || arrayBarang.length === 0) {
      Logger.log("👻 Server merespon kosong untuk mutasi stok toko: " + master);
      return;
    }

    var hasilRampokan = [["Item Code", "Description", "Start Qty", "Issued", "Receipt", "Sold", "Returned", "Transfer In", "Transfer Out", "End Qty"]];
    for (var j = 0; j < arrayBarang.length; j++) {
      var item = arrayBarang[j];
      hasilRampokan.push([
        item.article ? item.article.itemCode : "",
        item.article ? item.article.description : "",
        item.startQty || 0, item.issuedQty || 0, item.receiptQty || 0,
        item.saleQty || 0, item.returnQty || 0, item.tinQty || 0,
        item.toutQty || 0, item.endQty || 0
      ]);
    }

    var namaSheetSm = storeConfig[master].smSheet;
    var sheetSm = ss.getSheetByName(namaSheetSm) || ss.insertSheet(namaSheetSm);
    sheetSm.clear(); 
    sheetSm.getRange(1, 1, hasilRampokan.length, hasilRampokan[0].length).setValues(hasilRampokan);
    
    cetakProgress(100, 100, "🚀 Mendaratkan " + (hasilRampokan.length - 1) + " baris mutasi ke tab [" + namaSheetSm + "]");
  });
}

// 🪡 5️⃣ FUNGSI JAHIT DYNAMIC SHEET
function copasMasterGeneric(targetSheetName, tasks) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const masterSheet = ss.getSheetByName(targetSheetName); 
  if (!masterSheet) return;

  const masterLastRow = masterSheet.getLastRow();
  const masterLastCol = masterSheet.getLastColumn();

  if (masterLastRow >= 3 && masterLastCol > 0) {
    const range = masterSheet.getRange(3, 1, masterLastRow - 2, masterLastCol);
    const formulas = range.getFormulas();
    const dataBersih = formulas.map(row => row.map(sel => sel ? sel : ""));
    range.setValues(dataBersih);
  }

  const headers = masterSheet.getRange(2, 1, 1, masterLastCol > 0 ? masterLastCol : 1).getValues()[0];
  const radarKolom = {};
  headers.forEach((judul, index) => { if (judul) radarKolom[judul.toString().trim().toLowerCase()] = index + 1; });

  var totalTugas = tasks.length;
  tasks.forEach((task, index) => {
    const [sourceSheetName, sourceRangeA1, targetHeader] = task;
    const sourceSheet = ss.getSheetByName(sourceSheetName);
    if (!sourceSheet) return;

    const targetCol = radarKolom[targetHeader.toString().trim().toLowerCase()];
    if (!targetCol) return; 

    const sourceRange = sourceSheet.getRange(sourceRangeA1);
    const startRow = sourceRange.getRow();
    const lastRow = sourceSheet.getLastRow();
    if (lastRow < startRow) return; 
    
    const numRows = lastRow - startRow + 1;
    const values = sourceSheet.getRange(startRow, sourceRange.getColumn(), numRows, sourceRange.getNumColumns()).getValues();

    if (values.length > 0) { 
      masterSheet.getRange(3, targetCol, values.length, values[0].length).setValues(values); 
    }
    
    // Cetak progress penjahitan kolom secara realtime
    var progressJahit = Math.round(((index + 1) / totalTugas) * 100);
    Logger.log("🪡 [JAHIT BAR] Mengerjakan: " + sourceSheetName + " ➡️ Column: " + targetHeader + " (" + progressJahit + "%)");
  });
}

// 🌪️ 6️⃣ AUTO SORT SPESIFIK TARGET
function autoSortTarget(sheetName) {
  const spreadsheet = SpreadsheetApp.getActive();
  const sheetMaster = spreadsheet.getSheetByName(sheetName); 
  if (!sheetMaster) return;

  const lastRow = sheetMaster.getLastRow();
  const lastCol = sheetMaster.getLastColumn();
  if (lastRow < 3) return; 
  
  const headers = sheetMaster.getRange(2, 1, 1, lastCol).getValues()[0];
  const colUrg = headers.indexOf("Urg.") + 1;
  const colCategory = headers.indexOf("Category") + 1;
  
  if (colUrg === 0 || colCategory === 0) return;
  
  Logger.log("🌪️ [AUTO-SORT] Mengurutkan Semesta Tab " + sheetName + " berdasarkan Kategori & Urgensi...");
  const rangeSort = sheetMaster.getRange(3, 1, lastRow - 2, lastCol);
  rangeSort.sort([ { column: colCategory, ascending: true }, { column: colUrg, ascending: false } ]);
  spreadsheet.toast("Sheet [" + sheetName + "] Auto-Sort Kelar!", "SUKSES");
}
