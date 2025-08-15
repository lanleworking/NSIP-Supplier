import nodemailer from 'nodemailer';
import { Supplier } from '../models/sync/Supplier';
import { loadEmailTemplate } from '../utils/mail';

const transporter = nodemailer.createTransport({
    host: process.env.DEFAULT_SMTP_HOST,
    port: Number(process.env.DEFAULT_SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.DEFAULT_SMTP_USER,
        pass: String(process.env.DEFAULT_SMTP_PASS),
    },
    tls: {
        rejectUnauthorized: false,
    },
});
export const sendResetPassMail = async (email: string, token: string, originUrl: string | undefined) => {
    const resetURL = `${originUrl}/reset-password?token=${token}`;

    const html = await loadEmailTemplate('resetPassword.html', {
        appName: 'VasPort',
        resetURL,
        expiresMinutes: '5',
    });

    const mailOptions = {
        from: process.env.DEFAULT_SMTP_USER,
        to: email,
        subject: 'Yêu cầu đặt lại mật khẩu',
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reset password email sent to ${resetURL}`);
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email');
    }

    return { message: 'Reset password email sent successfully' };
};

export const sendConfirmMail = async (
    email: string,
    requestId: number,
    supplier: Partial<Supplier>,
    confirmDate: string,
) => {
    const html = await loadEmailTemplate('confirmMail.html', {
        appName: 'VasPort',
        requestId: String(requestId),
        supplierName: supplier.CompanyName || String(supplier.SupplierID) || supplier.Email || 'Nhà cung cấp',
        confirmationTime: confirmDate,
    });
    const mailOptions = {
        from: process.env.DEFAULT_SMTP_USER,
        to: email,
        subject: 'Xác nhận giá thành công',
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email');
    }
};
