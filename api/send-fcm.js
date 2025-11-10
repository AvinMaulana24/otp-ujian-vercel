// api/send-fcm.js
export default async function handler(req, res) {
  const FCM_SERVER_KEY = "AAAAxxx:APA91bYourServerKey"; // dari Firebase Project Settings > Cloud Messaging
  const { tokens, title, body } = req.body;

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `key=${FCM_SERVER_KEY}`,
    },
    body: JSON.stringify({
      registration_ids: tokens,
      notification: { title, body },
    }),
  });

  const result = await response.json();
  res.status(200).json(result);
}
