const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

export const sendVerificationEmail = async (email, name, otp) => {
  //logging the otp in the console itself

    console.log(`[EKYAM DEV] OTP for ${email}: ${otp}`);
};

export { generateOtp };
