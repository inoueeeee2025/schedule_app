const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function main() {
  const uid = process.argv[2];
  const flag = process.argv[3] === "true"; // true / false

  if (!uid) {
    console.log("使い方: node setPro.js <uid> true|false");
    process.exit(1);
  }

  await admin.auth().setCustomUserClaims(uid, { isPro: flag });
  console.log(`OK: uid=${uid} isPro=${flag}`);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
