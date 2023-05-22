import { NextPage } from "next";
import { collectionNameToUrl, loadDynamicData, loadFromPath, stripHTML } from "../../CMS/helpers";
import { PROJECT_NAME } from "../../constants";
import { randomNIndexes } from "../../helpers";
import BlogPost from "../../models/BlogPost";
import styles from '../../styles/BlogPostName.module.scss';

export default function BlogPostName ({
    blogPost,
    otherBlogPosts,
}) {

    const _blogPost = JSON.parse(blogPost);
    const _otherBlogPosts = JSON.parse(otherBlogPosts || "[]");

    return (
        <div>
            <h2 className="mini-title">{stripHTML(_blogPost.title)}</h2>

            { /* <div className={styles.content} dangerouslySetInnerHTML={{
                __html: _blogPost.content,
            }} /> *. }
            
            { BlogPost.renderContent(_blogPost.content, []) }

            <RelatedBlogPosts blogPosts={_otherBlogPosts} />
        </div>
    );
}

const RelatedBlogPosts = ({ blogPosts }) => {
    return (
        <div className={styles.RelatedBlogPosts}>
            { blogPosts.map((post, i) => (
                <></>
                // <BlogPostCard blogPost={post} />
            ))}
        </div>
    );
}


export async function getStaticPaths() {
    
    const loadBlogPosts = async () => {
        return await loadDynamicData(PROJECT_NAME, 'Blogs');
    }

    const blogPostNames = await loadBlogPosts()
        .then((blogPosts) =>   
            blogPosts.map(blogPost => {
                
                return { params: { postName: collectionNameToUrl(blogPost.title) }, };
            })
        );

    return {
        paths: blogPostNames,
        fallback: 'blocking'//true,
    }
}

export async function getStaticProps(context) {
    const blogPostName = context.params.postName;

    var blogPosts = await loadDynamicData(PROJECT_NAME, 'Blogs');
    var foundBlogs = blogPosts.filter((b) => collectionNameToUrl(b.title) === blogPostName);
    var blogPost: BlogPost;

    if (foundBlogs.length > 0) {
        
        blogPost = await BlogPost.init(
            await loadFromPath(foundBlogs[0].path),
        );
    } else {
        return {
            notFound: true,
        }
    }
    
    var otherBlogPosts = randomNIndexes(blogPosts.filter(f => f.title !== blogPost.title), 5);

    return {
        props: {
            blogPost: JSON.stringify(blogPost),
            otherBlogPosts: JSON.stringify(otherBlogPosts),
        },
        revalidate: 1440,
    }

}
