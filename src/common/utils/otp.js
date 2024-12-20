const UserForgetPassword = require("../../auth/auth.model");



const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};


exports.createOTP = async (email, userId) => {
  const otp = await generateOtp();
  const expiresAt = new Date(Date.now() + 60 * 1000); // 1 minute from now

  await UserForgetPassword.findOneAndUpdate(
    { email }, // Find user by email
    { otp, expiresAt, userId }, // Update OTP and expiration fields
    { new: true, upsert: true } // Create if it doesn't exist, and return the new document
  );

  // Send OTP to the user's email (for now, we'll log it to the console)
  console.log(`OTP: ${otp}`); // Replace with actual email sending logic

  return otp;
};
