const { sendVerificationEmail } = require('./utils/email');

async function testEmail() {
  try {
    console.log('Testing email sending...');
    console.log('Using email config:', require('./config/config').emailUser);
    
    await sendVerificationEmail('test@example.com', '123456');
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();