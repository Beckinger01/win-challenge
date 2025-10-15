import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
    try {
        console.log('Testing email configuration...');
        console.log('Host:', process.env.EMAIL_SERVER_HOST);
        console.log('Port:', process.env.EMAIL_SERVER_PORT);
        console.log('User:', process.env.EMAIL_SERVER_USER);
        console.log('From:', process.env.EMAIL_FROM);
        console.log('Pass exists:', !!process.env.EMAIL_SERVER_PASSWORD);

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD
            },
            tls: {
                rejectUnauthorized: true
            },
            debug: true,
            logger: true
        });

        // Test Verbindung
        await transporter.verify();
        console.log('✅ SMTP Connection successful');

        // Test Email senden
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: 'test@example.com', // Ändere zu deiner Test-Email
            subject: 'Test Email from Railway',
            text: 'This is a test email',
            html: '<p>This is a test email</p>'
        });

        console.log('✅ Email sent:', info.messageId);

        return NextResponse.json({
            success: true,
            messageId: info.messageId,
            config: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                user: process.env.EMAIL_SERVER_USER,
                from: process.env.EMAIL_FROM
            }
        });
    } catch (error) {
        console.error('❌ Email test failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                code: error.code,
                command: error.command,
                stack: error.stack
            },
            { status: 500 }
        );
    }
}