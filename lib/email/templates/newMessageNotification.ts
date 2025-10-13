import { createBaseTemplate } from './base';

interface NewMessageNotificationData {
  recipientName: string;
  senderName: string;
  orderNumber: string;
  message: string;
  orderUrl: string;
}

export const createNewMessageNotificationEmailHtml = (data: NewMessageNotificationData) => {
  const title = `New Message on Order #${data.orderNumber}`;
  
  const content = `
    <p>Hi ${data.recipientName},</p>
    <p>You have received a new message from <strong>${data.senderName}</strong> regarding order <strong>#${data.orderNumber}</strong>.</p>
    <div class="card">
      <p><strong>Message:</strong></p>
      <p><em>"${data.message}"</em></p>
    </div>
    <p>You can view the full conversation and reply to the message by clicking the button below:</p>
    <a href="${data.orderUrl}" class="button">View Order & Reply</a>
  `;

  return createBaseTemplate(content, title);
};