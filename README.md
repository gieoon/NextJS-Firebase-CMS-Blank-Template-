Blank template to help create websites and update them through Firebase.

- Hosted by Vercel
- Firestore and Firebase Storage as a CMS with basic editing capabilities.

This is a framework I'm using to make JAM stack websites for clients.
If this repo gets 5 stars, I'll fix existing bugs, add in documentation for integration with firebase and add in more features.

1. Create a Firebase Project
2. Paste the config details in /firebase/firebase.js
3. Email is configured through SendGrid via an external Server. This is agnostic, you can use any third party SMTP email provider.
4. Images are stored in Firebase Storage. Currently there is no CDN.
5. The frontend is deployed via Vercel, with serverless functions as well.