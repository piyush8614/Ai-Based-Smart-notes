import { transporter } from "./emailConfig.js";

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    await transporter.sendMail({
      from: `"Smart Notes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email ✔",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1>${verificationCode}</h1>
      `,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw error; // important so controller knows it failed
  }
};
