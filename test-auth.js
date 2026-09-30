const { verifyToken } = require('@360parminder/auth');
const jwt = require('jsonwebtoken');

async function test() {
  require('dotenv').config();
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Found' : 'Missing');
  const token = jwt.sign({ id: "some-id", sessionId: "some-session" }, process.env.JWT_SECRET || "");
  console.log("Created test token");
  try {
    const result = await verifyToken(token);
    console.log("verifyToken result:", result);
  } catch(e) {
    console.log("verifyToken error:", e);
  }
}
test();
