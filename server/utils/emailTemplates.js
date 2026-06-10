const formatDateTime = (booking) => {
  return `${booking.date} at ${booking.time}`;
};

export const bookingCreatedEmail = ({ booking, businessName }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2>Your booking request was received</h2>

      <p>Hi ${booking.customerName},</p>

      <p>Thank you for booking with <strong>${businessName}</strong>. Your request has been received and is currently pending approval.</p>

      <div style="background:#f1f5f9; padding:16px; border-radius:12px; margin:20px 0;">
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Date/Time:</strong> ${formatDateTime(booking)}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ""}
      </div>

      <p>You will receive another email when your booking is approved or declined.</p>

      <p>Thank you,<br/>${businessName}</p>
    </div>
  `;
};

export const bookingStatusEmail = ({ booking, businessName }) => {
  const statusMessage =
    booking.status === "Confirmed"
      ? "Your booking has been confirmed."
      : booking.status === "Declined"
        ? "Your booking has been declined."
        : booking.status === "Cancelled"
          ? "Your booking has been cancelled."
          : `Your booking status is now ${booking.status}.`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2>${statusMessage}</h2>

      <p>Hi ${booking.customerName},</p>

      <p>Your booking with <strong>${businessName}</strong> has been updated.</p>

      <div style="background:#f1f5f9; padding:16px; border-radius:12px; margin:20px 0;">
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Date/Time:</strong> ${formatDateTime(booking)}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      </div>

      <p>Thank you,<br/>${businessName}</p>
    </div>
  `;
};
