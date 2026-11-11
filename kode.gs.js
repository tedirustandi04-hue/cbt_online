const GEMINI_API_KEY = "GANTI_DENGAN_API_KEY_GEMINI_ANDA";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('CBT SD Berbasis AI')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function generateQuestions(kelas, mapel, jumlahSoal) {
  try {
    const prompt = `Buatkan ${jumlahSoal} soal pilihan ganda untuk tingkat SD Kelas ${kelas} mata pelajaran ${mapel}.
Kriteria soal:
1. Bahasa Indonesia yang baik dan sesuai tingkat perkembangan anak SD Kelas ${kelas}.
2. Pilihan jawaban A, B, C, D (opsional untuk kelas 1-3 bisa disesuaikan, tapi format tetap A,B,C,D).
3. Berikan output HANYA format JSON valid tanpa teks atau markdown tambahan apapun.

Format JSON yang diharapkan:
[
  {
    "id": 1,
    "pertanyaan": "Teks pertanyaan di sini...",
    "opsi": {
      "A": "Pilihan A",
      "B": "Pilihan B",
      "C": "Pilihan C",
      "D": "Pilihan D"
    },
    "kunci": "A"
  }
]`;

    const payload = {
      "contents": [
        {
          "parts": [
            { "text": prompt }
          ]
        }
      ],
      "generationConfig": {
        "response_mime_type": "application/json"
      }
    };

    const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    const response = UrlFetchApp.fetch(API_URL, options);
    const jsonResponse = JSON.parse(response.getContentText());

    if (jsonResponse.candidates && jsonResponse.candidates[0].content.parts[0].text) {
      const rawText = jsonResponse.candidates[0].content.parts[0].text;
      return JSON.parse(rawText);
    } else {
      throw new Error("Gagal mengambil respon dari AI API");
    }
  } catch (error) {
    throw new Error("Error Backend: " + error.message);
  }
}