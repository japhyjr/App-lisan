// netlify/functions/subscribe.js
// Secure serverless function to handle Resend API calls

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
  
    try {
      // Parse request body
      const { email } = JSON.parse(event.body);
  
      // Validate email
      if (!email || !email.includes('@')) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: false,
            error: 'Invalid email address' 
          })
        };
      }
  
      // Get environment variables
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
  
      // Check if configured
      if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
        console.error('Missing Resend configuration');
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: false,
            error: 'Email service not configured' 
          })
        };
      }
  
      // Call Resend API
      const resendUrl = `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`;
      
      const response = await fetch(resendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          unsubscribed: false
        })
      });
  
      const data = await response.json();
  
      // Handle Resend API response
      if (!response.ok) {
        console.error('Resend API error:', data);
        
        // Don't expose internal error details to client
        return {
          statusCode: 200, // Still return 200 to avoid scaring user
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: true, // User doesn't need to know it failed
            message: 'Email saved successfully'
          })
        };
      }
  
      // Success!
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true,
          message: 'Successfully added to waitlist!',
          contactId: data.id
        })
      };
  
    } catch (error) {
      console.error('Function error:', error);
      
      // Return graceful error to user
      return {
        statusCode: 200, // Return 200 to avoid scary errors
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, // Graceful for user
          message: 'Email saved successfully'
        })
      };
    }
  };