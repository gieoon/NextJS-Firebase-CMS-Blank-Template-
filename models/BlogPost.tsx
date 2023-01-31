import Link from "next/link";
import { collectionNameToUrl, getFieldName, loadFromPath, stripHTML, truncate } from "../CMS/helpers";
import { ReactElement } from "react";
import { PROJECT_NAME } from "../constants";
import YouTube from 'react-youtube';

export default class BlogPost {
    title: string;
    date: string;
    content: any[];
    images: any[];

    constructor(
        title: string,
        date: string,
        author: string,
        content: any[],
        images: any[],
    ) {
        this.title = title;
        this.date = date;
        this.content = content;
        this.images = images;
    }

    // Find all [tripId], [activityId], [destinationId] in content, and replace with TripCard, ActivityCard, and DestinationCard.
    // Replace all image references with uploaded images.
    public static async init(json: any): Promise<BlogPost> {

        var content = json.content || "";

        // console.log("converting json: ", json);
        
        var newContent = await this.replaceWithCardServerside(content);
        newContent = this.checkYoutubeServerside(newContent);

        const typesOfMember = [];
        
        // for (var typeOfMemberPath of getFieldName(json.fields, 'typeOfMember', true)) {
        //     typesOfMember.push(
        //         await loadFromPath(typeOfMemberPath)
        //     );
        // }
        
        return new BlogPost(
            json.title,
            json.date,
            getFieldName(json.fields, 'author'),
            newContent,
            json.images,
        );
    }

    public static renderContent(contents: any[], styles: any, truncated?: boolean) {
        
        if (!contents) return '';
        
        if (truncated) {
            return truncate(stripHTML(contents.map(c => c.content.toString()).join('')), 250);
        }
        return contents.map((o, i) => (
            o.type === 'dangerouslyRender'
                ? <div key={'blog-content-'+i}>
                    <div className="blog-text" dangerouslySetInnerHTML={{__html: o.content}}/>
                </div>
                : o.type === 'youtube'
                    ? <div key={'blog-content-'+i}>{BlogPost.renderYoutube(o.content)}</div>
                    : <div key={'blog-content-'+i}>
                        {/* // React component */}
                        {BlogPost.getHTMLElementClientSide(o.type, o.content)}
                    </div>
        ))
    }

    public static renderYoutube(videoId: string): ReactElement {
        const opts = {
            height: '500',
            // width: '640',
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
            //   origin: 'http://localhost:3000',
            //   wmode: 'opaque', 
                modestbranding: 1,
                
            },
        };

        return <YouTube
            videoId={videoId}                  // defaults -> ''
            opts={opts}
            // id={string}                       // defaults -> ''
            className={'youtube-video-embed'}                // defaults -> ''
            // iframeClassName={string}          // defaults -> ''
            // style={object}                    // defaults -> {}
            // title={string}                    // defaults -> ''
            // loading={string}                  // defaults -> undefined
            // opts={obj}                        // defaults -> {}
            // onReady={func}                    // defaults -> noop
            // onPlay={func}                     // defaults -> noop
            // onPause={func}                    // defaults -> noop
            // onEnd={func}                      // defaults -> noop
            // onError={func}                    // defaults -> noop
            // onStateChange={func}              // defaults -> noop
            // onPlaybackRateChange={func}       // defaults -> noop
            // onPlaybackQualityChange={func}    // defaults -> noop
        />;
    }

    // React components cannot be passed from serverside to clientside, hence replacing like this.
    // Retrieve JSON data and render component directly.
    public static getHTMLElementClientSide(elType: string, jsonData: any): ReactElement {
        // console.log("elType: ", elType, jsonData);
        // return <></>;
        // if (elType === 'RotaryAreaOfFocus') {
        //     // return <AreaOfFocusCard areaOfFocus={jsonData} />;
        //     return <RotaryGoalCard focus={getFieldName(jsonData.fields, 'focus')} title={jsonData.title} content={jsonData.content} />;
        // }
        // if (elType === 'Statistics') {
        //     return Statistic.render(jsonData);
        // }
        // if (elType === 'Trips') {
        //     return <TripCard trip={jsonData} insideBlog={true}/>;
        // }
        // else if (elType === 'Activities') {
        //     return <ActivityCard activity={jsonData} insideBlog={true}/>
        // }
        // else if (elType === 'Destinations') {
        //     return <DestinationCard destination={jsonData} insideBlog={true}/>
        // }
        // else if (elType === 'Blogs') {
        //     return <Link href={"/blogs/" + collectionNameToUrl(jsonData.title)}>{stripHTML(jsonData.title)}</Link>
        // }
        // else {
            return <></>;
        // }
    }

    private static checkYoutubeServerside(c: any[]) {
        for (var i=c.length-1;i>=0;i--) {
            if (c[i].type !== "dangerouslyRender") 
                continue;

            var content = c[i].content;
            
            const youtubeRegex = [
                /(https:\/\/www.youtube.com\/[a-zA-Z0-9?=]+)/,
                /(https:\/\/youtu.be\/[a-zA-Z0-9?=]+)/
            ];
            for (var reg of youtubeRegex) {
                var count = 0;
                var youtubeMatch = c[i].content.match(reg);
                while (youtubeMatch !== null && count < 200) {
                    count++;

                    // console.log('youtubeMatch: ', youtubeMatch);

                    var youtubeURL = youtubeMatch![1];
                    var startIndex = youtubeMatch.index!;
                    var endIndex = startIndex + youtubeMatch[0].length;

                    var videoId = Array.from(new URLSearchParams(youtubeURL).values())[0]; // First value is id.
                    // ShortURL version
                    if (!videoId || !videoId.length) {
                        var m = youtubeURL.match(/\.be\/(.+)/);
                        if (m !== null) {
                            videoId = m[1];
                        }
                    } 

                    // el = `
                    //     <iframe 
                    //         width="560" 
                    //         height="315" 
                    //         src="https://www.youtube.com/embed/${videoId}"
                    //         title="YouTube video player" 
                    //         frameborder="0" 
                    //         allow="accelerometer; 
                    //         autoplay; 
                    //         clipboard-write; 
                    //         encrypted-media; 
                    //         gyroscope; 
                    //         picture-in-picture" 
                    //         allowfullscreen>
                    //     </iframe>
                    //     `


                    // Remove the start.
                    c[i].content = content.substring(0, startIndex);

                    c.splice(i, 0, {
                        type: 'dangerouslyRender',
                        content: content.substring(endIndex),
                    });

                    // This is inserted before the previous one.
                    c.splice(i, 0, {
                        type: 'youtube',
                        // content: content.slice(endIndex), // endIndex to End
                        content: videoId,
                    });
                    
                    // console.log("c[i].content: ", c[i].content);
                    // console.log("c[i].content.substring(0, startIndex): ", c[i].content.substring(0, startIndex));
                    // console.log("c[i].content.slice(endIndex): ", c[i].content.slice(endIndex));

                    youtubeMatch = content.slice(endIndex).match(reg);

                }
            }
        }

        return c;
    }

    // Must be done serverside
    private static async replaceWithCardServerside(content: string/*, regexPattern: RegExp, elType: string, 
        memoizedActivities, memoizedDestinations, memoizedItineraryDays, memoizedReviews, memoizedSupportedLanguages, memoizedTrips*/){

        // Because TripCard and components can't be rendered properly, even after renderToString, they become static without CSS styles.
        // So, turn these into an array of content and cards.

        const memoizedPartnerships = {};
        const memoizedProjects = {};
        const memoizedStories = {};
        const memoizedMembers = {};

        const out = [];
        
        // console.log("content: ", content)

        const regexPattern = /\[([A-Za-z]+):(.+?)\]/;

        // var matches = content.matchAll(regexPattern); // pattern should have /g
        var objMatch = content.match(regexPattern); // Pattern without /g
        var count = 0;

        while (objMatch !== null && count < 200) {
            count++;
        // for (var objMatch of Array.from(matches).reverse() ) {
            
            // console.log('objMatch: ', objMatch);

            var elType = objMatch[1];
            var objId = objMatch[2];

            var startIndex = objMatch.index!;
            var endIndex = startIndex + objMatch[0].length;

            // Replace
            
            // Convert <TripCard /> to HTML, and render it inside content.
            var el;
            var pathRoot = '/CMS/' + PROJECT_NAME + '/';

            if (elType === 'RotaryAreaOfFocus') {
                
                el = await loadFromPath(pathRoot + elType + '/' + objId);
                // console.log("found type: RotaryAreaOfFocus: ", el)
            }
            else if (elType === 'Statistics') {
                el = await loadFromPath(pathRoot + elType + '/' + objId);
            }
            // if (elType === 'Trips') {
            //     el = await Trip.init(await loadFromPath(pathRoot + 'Trips/'+objId), memoizedItineraryDays, memoizedSupportedLanguages, memoizedActivities, memoizedDestinations, memoizedReviews);
            // }
            // else if (elType === 'Activities') {
            //     el = await Activity.init(await loadFromPath(pathRoot + 'Activities/' + objId), memoizedSupportedLanguages, memoizedDestinations);
            // }
            // else if (elType === 'Destinations') {
            //     el = await Destination.init(await loadFromPath(pathRoot + 'Destinations/' + objId));
            // }
            // else if (elType === 'Blogs') {
            //     el = await BlogPost.init(await loadFromPath(pathRoot + 'Blogs/' + objId), memoizedActivities, memoizedDestinations, memoizedItineraryDays, memoizedReviews, memoizedSupportedLanguages, memoizedTrips);
            // }
            else {
                continue;
            }
            
            // Replace with element
            // var html = renderToString(el);
            // content = content.slice(0, startIndex) + html + content.slice(endIndex);
                        
            out.push({
                type: 'dangerouslyRender',
                // content: content.slice(endIndex), // endIndex to End
                content: content.slice(0, startIndex),
            });

            out.push({
                type: elType,
                content: el,
            });

            // Slice off the end to ignore it in the next loop.
            // content = content.slice(0, startIndex);
            content = content.slice(endIndex);
            // console.log('content.length: ', content.length);

            objMatch = content.match(regexPattern);
        }

        // Add remainder
        out.push({
            type: 'dangerouslyRender',
            content: content
        });

        return out//.reverse();
    }
}
