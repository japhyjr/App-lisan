// netlify/functions/subscribe.js
// TRIPLE BACKUP VERSION - EmailOctopus + Notion + GitHub

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
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

    // Get all environment variables
    const EMAILOCTOPUS_API_KEY = process.env.EMAILOCTOPUS_API_KEY;
    const EMAILOCTOPUS_LIST_ID = process.env.EMAILOCTOPUS_LIST_ID;
    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO; // format: "username/repo"
    const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || "subscribers.txt";

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    const results = {
      emailoctopus: false,
      notion: false,
      github: false,
      discord: false
    };

    // === BACKUP 1: EmailOctopus ===
    if (EMAILOCTOPUS_API_KEY && EMAILOCTOPUS_LIST_ID) {
      try {
        const octopusUrl = `https://emailoctopus.com/api/1.6/lists/${EMAILOCTOPUS_LIST_ID}/contacts`;
        const octopusResponse = await fetch(octopusUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: EMAILOCTOPUS_API_KEY,
            email_address: email,
            status: 'SUBSCRIBED'
          })
        });

        if (octopusResponse.ok || octopusResponse.status === 409) {
          results.emailoctopus = true;
          console.log('✅ EmailOctopus: Success');
        }
      } catch (error) {
        console.error('❌ EmailOctopus error:', error.message);
      }
    }

    // === BACKUP 2: Notion ===
    if (NOTION_API_KEY && NOTION_DATABASE_ID) {
      try {
        const notionUrl = 'https://api.notion.com/v1/pages';
        const notionResponse = await fetch(notionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify({
            parent: { database_id: NOTION_DATABASE_ID },
            properties: {
              Email: {
                title: [
                  {
                    text: {
                      content: email
                    }
                  }
                ]
              },
              Status: {
                select: {
                  name: 'Subscribed'
                }
              },
              Date: {
                date: {
                  start: new Date().toISOString()
                }
              }
            }
          })
        });

        if (notionResponse.ok) {
          results.notion = true;
          console.log('✅ Notion: Success');
        }
      } catch (error) {
        console.error('❌ Notion error:', error.message);
      }
    }

    // === BACKUP 3: Discord Notification ===
    if (DISCORD_WEBHOOK_URL) {
      try {
        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '🎉 New Subscriber!',
              description: `**Email:** ${email}`,
              color: 5763719, // Green color
              timestamp: new Date().toISOString(),
              footer: {
                text: 'App-lisan Waitlist'
              }
            }]
          })
        });

        if (discordResponse.ok) {
          results.discord = true;
          console.log('✅ Discord: Success');
        }
      } catch (error) {
        console.error('❌ Discord error:', error.message);
      }
    }

    // === BACKUP 4: GitHub (Append to file) ===
    if (GITHUB_TOKEN && GITHUB_REPO) {
      try {
        // First, get the current file (if exists)
        const getFileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
        const getResponse = await fetch(getFileUrl, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        let sha = null;
        let currentContent = '';

        if (getResponse.ok) {
          const fileData = await getResponse.json();
          sha = fileData.sha;
          currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');
        }

        // Append new email with timestamp
        const timestamp = new Date().toISOString();
        const newLine = `${email},${timestamp}\n`;
        const updatedContent = currentContent + newLine;
        const encodedContent = Buffer.from(updatedContent).toString('base64');

        // Update file
        const updateUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
        const updateResponse = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Add subscriber: ${email}`,
            content: encodedContent,
            sha: sha // null if file doesn't exist (will create it)
          })
        });

        if (updateResponse.ok) {
          results.github = true;
          console.log('✅ GitHub: Success');
        }
      } catch (error) {
        console.error('❌ GitHub error:', error.message);
      }
    }

    // Log results
    console.log('Backup Results:', results);

    // Success if at least ONE backup worked
    const anySuccess = results.emailoctopus || results.notion || results.github || results.discord;

    if (anySuccess) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true,
          message: 'Successfully subscribed!',
          backups: results
        })
      };
    } else {
      // All failed - still return success to user but log it
      console.error('⚠️ All backups failed');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true,
          message: 'Subscription received'
        })
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true,
        message: 'Subscription received'
      })
    };
  }
};