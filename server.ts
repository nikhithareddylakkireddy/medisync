import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email API Route
  app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.warn('SMTP credentials missing. Skipping email send.');
      return res.status(200).json({ message: 'Email skipped (no credentials)' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: `"MediSync Book" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        text,
      });
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: 'frontend',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
