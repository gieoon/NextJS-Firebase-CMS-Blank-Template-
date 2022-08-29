import { loadFromPath } from "../CMS/helpers";
import ActivityCard from "../components/cards/ActivityCard";
import DestinationCard from "../components/cards/DestinationCard";
import TripCard from "../components/cards/TripCard";
import Activity from "./Activity";
import Destination from "./Destination";
import Trip from "./Trip";

export default class BlogPost {
    title: string;
    content: string;
    images: any[];

    // Replace content tripId's with actual trips.
    trips: Trip[];
    activities: Activity[];
    destinations: Destination[];

    constructor(
        title: string,
        content: string,
        images: any[],
    ) {
        this.title = title;
        this.content = content;
        this.images = images;
    }

    // Find all [tripId], [activityId], [destinationId] in content, and replace with TripCard, ActivityCard, and DestinationCard.
    // Replace all image references with uploaded images.
    public static async init(json: any, memoizedActivities, memoizedDestinations, memoizedItineraryDays, memoizedReviews, memoizedSupportedLanguages, memoizedTrips): Promise<BlogPost> {

        var content = json.content;
        
        var tripPattern = /\[tripId:(.)+?\]/g;
        content = await this.replaceWithCard(content, tripPattern, 'TripCard',
            memoizedActivities, memoizedDestinations, memoizedItineraryDays, memoizedReviews, memoizedSupportedLanguages, memoizedTrips);

        var activityPattern = /\[activityId:(.)+?\]/g;
        content = await this.replaceWithCard(content, tripPattern, 'ActivityCard',
            memoizedActivities, memoizedDestinations, memoizedItineraryDays, memoizedReviews, memoizedSupportedLanguages, memoizedTrips);

        var destinationPattern = /\[destinationId:(.)+?\]/g;
        content = await this.replaceWithCard(content, tripPattern, 'DestinationCard',
            memoizedActivities, memoizedDestinations, memoizedItineraryDays, memoizedReviews, memoizedSupportedLanguages, memoizedTrips);

        return new BlogPost(
            json.title,
            content,
            json.images,
        );
    }

    private static async replaceWithCard(content: string, regexPattern: RegExp, elType: string, 
        memoizedActivities, memoizedDestinations, memoizedItineraryDays, memoizedReviews, memoizedSupportedLanguages, memoizedTrips){

        var matches = content.matchAll(regexPattern);
        
        for (var objPath of Array.from(matches)) {
            // Replace
            
            // Convert <TripCard /> to HTML, and render it inside content.
            var el;
            if (elType === 'TripCard') {
                var trip = await Trip.init(await loadFromPath(objPath), memoizedItineraryDays, memoizedSupportedLanguages, memoizedActivities, memoizedDestinations, memoizedReviews);
                el = <TripCard trip={trip} />;
            }
            else if (elType === 'ActivityCard') {
                var activity = await Activity.init(await loadFromPath(objPath), memoizedSupportedLanguages, memoizedDestinations);
                el = <ActivityCard activity={activity} />
            }
            else if (elType === 'DestinationCard') {
                var destination = await Destination.init(await loadFromPath(objPath));
                el = <DestinationCard destination={destination} />
            }
            
            // Replace with element
        }
        return content;
    }
}