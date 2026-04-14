const express = require('express');
const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Store in database
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (adminEmail) {
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Submitted at ${new Date().toISOString()}</small></p>
      `;

      await sendEmail(
        adminEmail,
        `Contact Form: ${subject}`,
        `New contact from ${name} (${email}): ${message}`,
        emailHtml
      );
    }

    res.status(201).json({ message: 'Message sent successfully. We\'ll get back to you soon!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all contact submissions (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;

    const query = {};
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Mark contact as read (admin only)
router.patch('/:id/read', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact submission (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    res.json({ message: 'Contact submission deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
