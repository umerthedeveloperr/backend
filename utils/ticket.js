const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

async function generateTicketPdfAndSendEmail(booking) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4" });
      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(chunks);
        await sendEmailWithAttachment(
          booking.email,
          "Your Ticket",
          "Please find attached ticket",
          pdfBuffer
        );
        resolve({ pdfBuffer, filename: `ticket-${booking._id}.pdf` });
      });

      doc.fontSize(20).text("Ticket", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Name: ${booking.name}`);
      doc.text(`Email: ${booking.email}`);
      if (booking.eventId) {
        doc.text(`Event: ${booking.eventId.title}`);
        doc.text(`Date: ${booking.eventId.date}`);
        doc.text(`Location: ${booking.eventId.location || ""}`);
      }
      doc.moveDown();

      const qrDataUrl = await QRCode.toDataURL(String(booking._id));
      const base64 = qrDataUrl.split(",")[1];
      const qrBuffer = Buffer.from(base64, "base64");
      doc.image(qrBuffer, { fit: [150, 150], align: "center" });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

async function sendEmailWithAttachment(to, subject, text, pdfBuffer) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    text,
    attachments: [{ filename: "ticket.pdf", content: pdfBuffer }],
  });
}

module.exports = { generateTicketPdfAndSendEmail, sendEmailWithAttachment };
