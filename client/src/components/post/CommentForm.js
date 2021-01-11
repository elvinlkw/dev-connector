import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ postId }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  return (
    <div class="post-form" onSubmit={e => {
      e.preventDefault();
      dispatch(addComment(postId, { text }))
      setText('')
    }}>
      <div class="bg-primary p">
        <h3>Leave a Comment</h3>
      </div>
      <form class="form my-1">
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          required
          value={text}
          onChange={e => setText(e.target.value)}
        ></textarea>
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  )
}

export default CommentForm;