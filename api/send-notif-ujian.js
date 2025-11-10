const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 🔐 Token Wablas (langsung aktif)
// >>>>>>> 76f48dc01adba9778d35a2799d9cd5d93f02355d
const WABLAS_TOKEN = "GjsjeZCUGwLXs5B7K3CjwUnpVx5JNzyHxAbIDT6gULjUWjvn5xJalG8";
const WABLAS_SECRET = "pWzudmXL";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).send("OK");

  try {
    const { namaUjian, jadwal, deskripsi, phones } = req.body;

    if (!phones || phones.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Daftar nomor WhatsApp kosong.",
      });
    }

    // Siapkan pesan untuk setiap nomor
    const messages = phones.map((p) => {
      let nomor = p.startsWith("0")
        ? "62" + p.substring(1)
        : p.replace("+", "");
      return {
        phone: nomor,
        message: `📘 Ujian Baru: ${namaUjian}\n🕓 Jadwal: ${jadwal}\n📝 ${deskripsi}\n\nSegera buka aplikasi IKMION untuk mengikuti ujian.`,
        isGroup: false,
      };
    });

    const response = await fetch("https://sby.wablas.com/api/v2/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${WABLAS_TOKEN}.${WABLAS_SECRET}`,
      },
      body: JSON.stringify({ data: messages }),
    });

    const result = await response.json();
    res.status(200).json({
      success: true,
      message: "Notifikasi ujian berhasil dikirim.",
      wablasResponse: result,
    });
  } catch (error) {
    console.error("Gagal kirim notifikasi ujian:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengirim pesan WhatsApp.",
      error: error.message,
    });
  }
}
