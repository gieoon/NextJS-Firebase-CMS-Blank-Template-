Blank template to help create websites and update them through Firebase.

- Hosted by Vercel
- Firestore and Firebase Storage as a CMS with basic editing capabilities.

This is a framework I'm using to make JAM stack websites for clients. 
The way it is set up is via one main firebase projects with multi-tenancy of sub-projects per client.
If this repo gets attention, I'll fix existing bugs, add in a demo and documentation to help you integrate your own version with firebase.

1. Create a Firebase Project
2. Paste the config details in /firebase/firebase.js
3. Update Firestore and Firebase Storage rules. (Needs documentation)
3. Email is configured through SendGrid via an external Server. This is agnostic, you can use any third party SMTP email provider.
4. Images are stored in Firebase Storage. Currently there is no CDN, (But am looking at Cloudinary)
5. The frontend is deployed via Vercel, with serverless API functions as needed.
