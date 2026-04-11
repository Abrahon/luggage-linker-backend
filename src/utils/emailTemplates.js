const sendOtpEmail = (name, otp) => {
  return `
    <div style="max-width:600px;margin:auto;font-family:Arial;background:#ffffff;border:1px solid #eee;border-radius:10px;overflow:hidden">

      <div style="background:#4f46e5;color:white;padding:20px;text-align:center">
        <h2>Welcome to LuggageLinker</h2>
      </div>

      <div style="padding:30px">

        <h3>Hello ${name},</h3>

        <p>Use the OTP below to verify your account:</p>

        <div style="
          font-size:28px;
          font-weight:bold;
          letter-spacing:6px;
          background:#f3f4f6;
          padding:15px 25px;
          display:inline-block;
          border-radius:8px;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p style="color:red;font-weight:bold;">
          This OTP will expire in 10 minutes.
        </p>

        <p style="color:#777;font-size:13px;">
          If you did not request this, ignore this email.
        </p>

      </div>

      <div style="background:#f9fafb;text-align:center;padding:15px;font-size:12px;color:#888">
        © ${new Date().getFullYear()} LuggageLinker
      </div>

    </div>
  `;
};

module.exports = { sendOtpEmail };