// Sample of a model catering to Dynamic CMS Data.
// This has a title, description, image content, and a custom field that are added through the CMS.
// Ths custom field was added as a field through the database, and content was populated through the /login page in the CMS.

import { getFieldName } from "../CMS/helpers";

export default class DynamicList {
    title: string;
    description: string;
    images: string[];
    customField: string;

    constructor(
        title: string,
        description: string,
        images: string[],
        customField: string,
    ){
        this.title = title;
        this.description = description;
        this.images = images;
        this.customField = customField;
    }

    public static async init(json: any, 
        memoizedData): Promise<DynamicList> {
        return new DynamicList(
            json['title'],
            json['content'],
            json.images,
            getFieldName(json.fields, 'customField'), // Load the custom field. If it's an array, add the last parameter and make it `true`
        );
    }
}