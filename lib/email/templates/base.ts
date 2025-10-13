export const createBaseTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
    .header { background: linear-gradient(to right, #000000, #434343); color: #ffffff; padding: 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -1px; }
    .content { padding: 40px; color: #1f2937; line-height: 1.7; }
    .footer { background-color: #f5f5f7; padding: 24px 40px; text-align: center; font-size: 12px; color: #6b7280; }
    .button { display: inline-block; padding: 14px 28px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background-color 0.2s; }
    .button:hover { background-color: #374151; }
    .card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-top: 24px; }
    p { margin: 0 0 16px; }
    p:last-child { margin-bottom: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Koopi. All rights reserved.</p>
      <p>If you did not expect this email, you can safely ignore it.</p>
    </div>
  </div>
</body>
</html>
`;