// Owned by: Part 2, Person B (shared with Part 3, which owns the
// comments and like/dislike section of this same page)
// See: docs/part-2-listings-page/
//
// Shows the full details of one listing.

// this are part 3 imports for comments and reactions person b
import ReactionControls from '../components/ReactionControls';
import CommentSection from '../components/CommentSection';

// add your part 2 listing info block here.


/** 
 * Wherever Part 2's component currently ends its listing-info JSX (likely right before the closing tag of the main container), add:
 */
<div className="mt-4">
  <ReactionControls
    postId={post._id}
    likes={post.likes?.length ?? post.likesCount ?? 0}
    dislikes={post.dislikes?.length ?? post.dislikesCount ?? 0}
    userReaction={post.userReaction ?? null}
  />
</div>

<CommentSection postId={post._id} />