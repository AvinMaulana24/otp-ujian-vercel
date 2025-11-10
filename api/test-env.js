export default function handler(req, res) {
  res.status(200).json({
    status: "✅ Server Vercel Aktif",
    message: "API berhasil dijalankan.",
    endpoints: {
      sendOtp: "/api/send-otp",
      sendNotifUjian: "/api/send-notif-ujian",
    },
  });
}
