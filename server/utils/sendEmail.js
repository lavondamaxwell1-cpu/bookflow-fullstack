import { Resend } from "resend";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("Email skipped: missing RESEND_API_KEY");
      return {
        success: false,
        message: "Missing RESEND_API_KEY",
      };
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.log("Email skipped: missing RESEND_FROM_EMAIL");
      return {
        success: false,
        message: "Missing RESEND_FROM_EMAIL",
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend email error:", error);
      return {
        success: false,
        message: error.message || "Email failed",
      };
    }

    console.log("Email sent:", data?.id);

    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error("Send email catch error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};
