Blank template to create websites and update them through Firebase.

Our agency website, [webbi.co.nz](https://www.webbi.co.nz) is built with this template.

- Hosted by Vercel
- Firestore and Firebase Storage as a CMS with basic editing capabilities.

This is a framework I'm using to make JAM stack websites for clients. 
The way it is set up is via one main firebase projects with multi-tenancy of sub-projects per client.
If this repo gets attention, I'll fix existing bugs, add in a demo and documentation to help you integrate your own version with firebase.

# Getting Started

### Create a [Firebase Project](https://console.firebase.google.com/)

### Paste the config details in /firebase/firebase.js

### Create a PROJECT_NAME
Edit `PROJECT_NAME`, under `./contants.js`. This should be a unique name of the document in Firestore.
`APP_TITLE`: Title of the website
`SITE_URL`: The live website's URL.
`APP_ICON`: favicon url, can be absolute or relative.
`SUPPORT_EMAIL`: Destination mailbox to send enquiries or admin data to.

### Run commands in the repo
$ npm i
$ npm run dev

This will launch the default website at [localhost:3000](http://localhost:3000)

3. Update Firestore and Firebase Storage rules. (Needs documentation)
4. Add Firebase fields in to define custom fields that clients can edit via CMS. (Done manually for now, can create an interface for this.)
5. Email is configured through SendGrid via an external Server. This is platform agnostic, you can use any third party SMTP email provider.
6. Images are stored in Firebase Storage. Currently there is no CDN, (Cloudinary looks good.)
7. The frontend is deployed via Vercel with serverless API functions as needed.
8. I have plans to add serverless functions for Stripe payments. It's just that I have yet to encounter a client who needs this.

## Types of Content

There are two types of content. 
1. Page content, which is edited directly via a WYSIWYG editor in the CMS, at the /login page. 
1. Dynamic content. This is useful for lists, or blog posts, anything that is not hardcoded into a page.

In the Database, page content is saved under one document called __websiteContent__. Dynamic content is stored as multiple documents under a separate subcollection.

### Adding Page Content

To add a string, which is a simple piece of text.
<CMS_String_Field ...>

To add raw formatted text which comes from draft-js in the CMS.
<CMS_HTML_Field ...>

To add an image,
<CMS_Image_Field ...>

#### CMS fields

Each of the CMS fields must have a __unique id__ prop. This is the key that the document saves the content under. If it is not unique, it will be overridden by the next field to be edited. 

The __placeholder__ prop shows the default data in case it has not been edited.

Lists of items can be added that can be edited through the WYSIWYG editor.
However, a __cmsTemplates__ must be created and passed in through the __app.jsx__ __<CMS ... />__ initialization. This lets the CMS know what kind of structure the list item has. How many text fields, or images are to be added to it.

```

<div id="uniqueArray" className="cp-editable-array">
    { 
        // Loop through the array of this field.
        websiteContent['uniqueArray'].map((item, i) => (
            <div key={'item-'+i}>
                <span id={"uniqueArray-"+i+"-title"} className="cp-editable" 
                    style={{pointerEvents:"none"}}>
                    {stripHTML(item.title)}
                </span>
            </div>
        ))

    }
</div>

```

In this case, a the following cmsTemplates object was created
```
export const cmsTemplates = {
    // The name of the key in the CMS.
    uniqueArray: [
      {
        // Type of DOM element
        type: "span", 
        // The name of the key in the array subobject.
        value: "title"
      },
    ]
};
```

This can be easier for users to edit rather than creating a new collection and editing this list through a separate page. I tend to use this method of adding lists if it is small and doesn't require any raw text inputs.

##### Alternative CMS content

Any text can be turned into CMS content via simply adding the __className__ `cp-editable` and a unique __id__. This is what <CMS_String_Field ... /> is doing under the hood.

### Adding Dynamic Content

Currently, the types of dynamic content are hardcoded into Firebase. This lets the CMS load specific data and structure it accordingly. Each of these is defined by a model class, which transforms the data into a useable format.

##### Blog posts, or raw text content

Raw text content that was created via the CMS can be either rendered as a string (ugly) with `stripHTML`, or as HTML, with `BlogPost.renderContent(rawHTMLContent, [])`

Sometimes, a truncated version of the content is desired, such as when listing blog posts without displaying everything. In this case you can use the same function with an additional parameter `BlogPost.renderContent(rawHTMLContent, [], true)`.

`BlogPost` is a specific model that takes raw HTML strings and turns it into an array of content to be rendered. You can intialize your custom data through this class to render it as a blog post, or you can rewrite the class to suit your own usecase with your own specific fields.

## Authentication

The CMS uses Firebase authentication and currently supports gmail or username + password logins. The login is verified through a custom readonly document in the database. You need to manually add a login user to the database to ensure only this email address can modify the database. 

## How users/clients login

You can instruct your clients to go to `/login` of the website, then login through their email.
There is also a link to this at the bottom of every page of their website (In /components/Footer.js).

## Setting up Firebase

For now, this is done manually. Basically, Firestore rules need to be created to authenticate certain users to certain projects, and Firebase storage needs to also read and repeat from these same rules.

## Analytics

Google Analytics is used. Anytime a button press should trigger an event, use `ANALYTICS_logEvent(eventName: string, [options: any])` to create the event.
Pageviews can be created in the same way with `ANALYTICS_screenView(pageName: string)`

## Sitemap

`next-sitemap` is included by default. This automatically generates a sitemap after `npm run build`.
Make sure to go into `/next-sitemap.config.js` and update the `siteURL` to match your domain. You can then include this fiel in Google Search Console.

## Helpful methods

The helper class has a variety of useful methods. 

#### sendData

This takes an array of 'field', 'value' objects, and sends it through an email client to a destination. I have configures an email server to ingest this specific data format, but you can provide any structure information to any email address.

I currently have set up SendGrid templates that ingest data and turn it into a generic enquiry form to be viewed by clients. As such, this takes name, email address, and sets up reply email addresses, etc.


#### stripHTML
This simply strips HTML tags out of raw text.
__e.g. <p>Hello world</p> => Hello world__

#### displayFirebaseDate
Displays a Firebase serverTimestamp date in a certain format, otherwise in a normal way.

## Backups

I have setup an automatic weekly and monthly backup system for all content via Google Cloud File Transfers.

## TODO

1. Edit cp-editable-array content
1. Add in images describing each section
1. Create `/admin` screen to edit the CMS dataflow and authentication easily via NodeJS firebase-admin API.
1. Add Live URL demo link.
