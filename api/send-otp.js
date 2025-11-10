<<<<<<< HEAD
=======
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 🔐 Token Wablas (langsung aktif)
>>>>>>> 76f48dc01adba9778d35a2799d9cd5d93f02355d
const WABLAS_TOKEN = "GjsjeZCUGwLXs5B7K3CjwUnpVx5JNzyHxAbIDT6gULjUWjvn5xJalG8";
const WABLAS_SECRET = "pWzudmXL";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).send("OK");

  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "phoneNumber dan otp wajib diisi." });
    }

    // Format nomor: 08 → 628
    let nomor = phoneNumber;
    if (nomor.startsWith("0")) nomor = "62" + nomor.substring(1);
    if (nomor.startsWith("+")) nomor = nomor.substring(1);

    const payload = {
      data: [
        {
          phone: nomor,
          message: `IKMION\nKode OTP: ${otp}\nBerlaku 2 menit untuk verifikasi login.\nDemi keamanan, jangan berikan kode ini ke siapa pun.`,
          isGroup: false,
        },
      ],
    };

    const response = await fetch("https://sby.wablas.com/api/v2/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${WABLAS_TOKEN}.${WABLAS_SECRET}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    res.status(200).json({
      success: true,
      message: "OTP berhasil dikirim ke WhatsApp",
      wablasResponse: result,
    });
  } catch (error) {
    console.error("Gagal kirim OTP:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengirim OTP via Wablas",
      error: error.message,
    });
  }
}
