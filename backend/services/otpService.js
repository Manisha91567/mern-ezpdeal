const redis = require("../utility/redisClient");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (phone) => {
  const otp = generateOTP();
  await redis.setex(`otp:${phone}`, 300, otp); 
  console.log(`OTP for ${phone}: ${otp}`); // For development/testing
  
  // for production
  // return client.messages.create({
  //   body: `Your OTP is ${otp}`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phone,
  // });
};

exports.verifyOtpInRedis = async (phone, otp) => {
  const storedOtp = await redis.get(`otp:${phone}`);
  if (storedOtp === otp) {
    await redis.del(`otp:${phone}`);
    return true;
  }
  return false;
};
