// pages/api/revalidate.js
// Webhook for clients to revalidate their pages.

export default async function handler(req, res) {
    // Check for secret to confirm this is a valid request
    // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    //   return res.status(401).json({ message: 'Invalid token' })
    // }
    var spreadsheetName = req.query.spreadsheetName;
    console.log('spreadsheetName: ', spreadsheetName);
    
    if (!spreadsheetName) return res.status(301).send("Must provide a spreadsheet name");
    else spreadsheetName = spreadsheetName.toLowerCase();
  
    try {
      // this should be the actual path not a rewritten path
      // e.g. for "/blog/[slug]" this should be "/blog/post-1"
      if (spreadsheetName === 'futuremeetings')
        await res.revalidate('/meetings');
      else if (spreadsheetName === 'upcomingprojects') {
        await res.revalidate('/join-us');
        await res.revalidate('/');
      }
      else if (spreadsheetName === 'areasofinterest') {
        await res.revalidate('/');
      }
      else if (spreadsheetName === 'areasofexperience')
        await res.revalidate('/');
      
      return res.json({ revalidated: true })
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send('Error revalidating: ' + err.toString());
    }
  }
