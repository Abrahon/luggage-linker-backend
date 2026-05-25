const sendOtpEmail = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>LuggageLinker OTP Verification</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
      <tr>
        <td align="center">

          <!-- MAIN CONTAINER -->
          <table width="100%" cellpadding="0" cellspacing="0" style="
            max-width:600px;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
          ">

            <!-- HEADER -->
            <tr>
              <td style="
                background:linear-gradient(135deg,#4f46e5,#7c3aed);
                padding:40px 30px;
                text-align:center;
              ">
                <h1 style="
                  margin:0;
                  color:#ffffff;
                  font-size:32px;
                  font-weight:700;
                  letter-spacing:0.5px;
                ">
                  LuggageLinker
                </h1>

                <p style="
                  margin-top:10px;
                  color:#e0e7ff;
                  font-size:15px;
                ">
                  Secure Community Package Delivery
                </p>
              </td>
            </tr>

            <!-- CONTENT -->
            <tr>
              <td style="padding:40px 35px;">

                <h2 style="
                  margin:0 0 15px;
                  color:#111827;
                  font-size:24px;
                ">
                  Hello ${name},
                </h2>

                <p style="
                  margin:0;
                  color:#4b5563;
                  font-size:16px;
                  line-height:1.7;
                ">
                  Welcome to <strong>LuggageLinker</strong>.
                  Use the verification code below to activate your account securely.
                </p>

                <!-- OTP BOX -->
                <div style="
                  margin:35px 0;
                  text-align:center;
                ">

                  <div style="
                    display:inline-block;
                    background:#f3f4f6;
                    border:2px dashed #c7d2fe;
                    border-radius:16px;
                    padding:22px 40px;
                  ">

                    <span style="
                      font-size:36px;
                      font-weight:700;
                      letter-spacing:10px;
                      color:#4f46e5;
                    ">
                      ${otp}
                    </span>

                  </div>

                </div>

                <!-- INFO -->
                <p style="
                  color:#ef4444;
                  font-size:14px;
                  font-weight:600;
                  margin-bottom:20px;
                ">
                  This OTP will expire in 10 minutes.
                </p>

                <p style="
                  color:#6b7280;
                  font-size:15px;
                  line-height:1.7;
                ">
                  For your security, never share this code with anyone.
                  LuggageLinker support will never ask for your OTP.
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="
                background:#f9fafb;
                padding:25px;
                text-align:center;
                border-top:1px solid #e5e7eb;
              ">

                <p style="
                  margin:0;
                  color:#6b7280;
                  font-size:13px;
                  line-height:1.6;
                ">
                  If you did not request this email, you can safely ignore it.
                </p>

                <p style="
                  margin-top:12px;
                  color:#9ca3af;
                  font-size:12px;
                ">
                  © ${new Date().getFullYear()} LuggageLinker. All rights reserved.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

module.exports = { sendOtpEmail };