import { collectionNameToUrl, createDateFromDDMMYYYY } from "./CMS/helpers";

export function truncate(str: string, n: number){
    if (!str) return '';
    // return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + "..." : str;
};

export function handleEvents(events: any[]): any[] {
    // Filter out past meetings.
    var meetingDates = events.map((m: any[]) => m[0]);
    
    meetingDates = meetingDates.map((m: string) => createDateFromDDMMYYYY(m));

    meetingDates.forEach((m: Date, i: number) => {
        events[i][0] = m;
    })
    // console.log("futureMeetings 0: ", futureMeetings);
    for (var i in events) {
        if (isNaN(events[i][0]) || !events[i][0].toString().length) events[i][0] = new Date('9999 09 09') 
    };
    var d = new Date(); d.setDate(d.getDate()-1);
    events = events.filter((f: any[]) => f[0] >= d);
    return events;
}

export function dateDisplay(date: Date): string {
    
    if (!date) return '';

    return `${date.getFullYear()} ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];


export function addDays(date: Date, daysToAdjust: number): Date {
    date.setDate(date.getDate() + daysToAdjust);
    return date;
}

export function isDateInPast(date: Date): boolean {
    return date < new Date();
}

export function firebaseTimestamp2Date(o: any): Date {
    
    if (!o.seconds) {
        return new Date(o);
    }
    return new Date(o.seconds * 1000);
}

// https://stackoverflow.com/questions/43100718/typescript-enum-to-object-array
// Needs to match {label: , value: } format for react-select dropdown.
export function enums2Map(_enum: any) {
    const entries = Object.entries(_enum);
    const out = [];
    for (var entry of entries) {
        out.push({
            value: entry[0],
            label: entry[1]
        });
    }
    return out;
}

// Random N indexes from array.
export const randomNIndexes = (arr: any[], n: number): any[] => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export const isValidUrl = (url: string) => {
    try {
      new URL(url);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
};

// Used for enums
export const enum2Object = (_enum: any, forceCollectionUrlName: boolean): any => {
    const out: any = {};
    // Swap the keys around.
    // Also preserve the original structure/
    for (var o of Object.entries(_enum)) {
        var key = o[0];
        var value: string = o[1] as string;

        if (forceCollectionUrlName) {
            value = collectionNameToUrl(value);
        }
        
        out[value] = key;
        out[key] = value;
    }

    return out;
} 
