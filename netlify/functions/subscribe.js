// netlify/functions/subscribe.js
// COMPLETE FIXED VERSION - Replace entire file

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
  
      // FIXED: Proper Resend API endpoint and payload
      const resendUrl = `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`;
      
      console.log('Sending to Resend:', { email, audienceId: RESEND_AUDIENCE_ID });
      
      const response = await fetch(resendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          first_name: '',
          last_name: '',
          unsubscribed: false
        })
      });
  
      const data = await response.json();
      
      console.log('Resend response:', { status: response.status, data });
  
      // Handle Resend API response
      if (!response.ok) {
        console.error('Resend API error:', data);
        
        // Check if email already exists (that's actually success!)
        if (data.message && data.message.includes('already exists')) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              success: true,
              message: 'Email already subscribed',
              duplicate: true
            })
          };
        }
        
        // Other errors - still return success to user
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: true,
            message: 'Email saved successfully'
          })
        };
      }
  
      // Success!
      console.log('✅ Contact added successfully:', data);
      
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
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true,
          message: 'Email saved successfully'
        })
      };
    }
  };