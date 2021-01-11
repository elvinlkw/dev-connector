import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getPost } from '../../actions/post';

const Post = ({ match }) => {
  const dispatch = useDispatch();
  const postState = useSelector(state => state.post);
  const { post, loading } = postState;

  useEffect(() => {
    dispatch(getPost(match.params.id))
  }, []);
  return loading || post === null ? <Spinner /> : 
  <Fragment>
    <Link to="/posts" className="btn">Back To Posts</Link>
    <PostItem post={post} showActions={false} />
    <CommentForm postId={post._id} />
    <div className="comments">
      {post.comments.map(comment => (
        <CommentItem key={comment._id} comment={comment} postId={post._id} />
      ))}
    </div>
  </Fragment>
}

export default Post;