const Message = require("../models/Message");
const transporter = require("../config/mailer");

// POST /api/messages  (already discussed)
exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `
From: ${name} <${email}>

${message}
      `,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(201).json({
          message: "Message saved but email not sent",
          data: newMessage,
        });
      }

      console.log("Email sent:", info.messageId);
      return res.status(201).json({
        message: "Message sent successfully",
        data: newMessage,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// GET /api/admin/messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// PUT /api/admin/messages/:id  (mark as read)
exports.markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({
      message: "Message marked as read",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message",
      error: error.message,
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
    });
  }
};