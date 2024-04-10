import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../context/authContext";

function Comment({ comment, currentUser, handleDeleteComment, handleDeleteReply }) {
    const isAuthor = currentUser === comment.author;

    const handleDeleteClick = () => {
        // Call the handleDeleteComment function and pass the comment ID
        handleDeleteComment(comment._id);
    };

    const handleDeleteClickReply = (replyIndex) => {
        // Call the handleDeleteReply function and pass the comment ID and reply index
        handleDeleteReply(comment._id, replyIndex);
    };

    return (
        <div className="p-4 border border-gray-300 rounded-md mb-4">
            <div className="flex items-center space-x-2 mb-2">
                <img className="w-8 h-8 rounded-full" src={comment.profilePhoto} alt={comment.author} />
                <div>
                    <div className="text-gray-600 text-sm">{comment.author}</div>
                    <div className="text-gray-500 text-xs">Comment</div>
                </div>
            </div>
            <div className="text-gray-700">{comment.text}</div>
            <div className="flex items-center space-x-2 mt-2">
                <button className="text-blue-500 text-xs">Like</button>
                <button className="text-gray-500 text-xs">Reply</button>
                <button className="text-gray-500 text-xs">Edit</button>
                {isAuthor && (
                    <button className="text-red-500 text-xs" onClick={handleDeleteClick}>
                        Delete
                    </button>
                )}
            </div>
            {comment.replies.map((reply, index) => (
                <div key={index} className="p-4 ml-4 border-l-2 border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                        <img className="w-8 h-8 rounded-full" src={reply.profilePhoto} alt={reply.author} />
                        <div>
                            <div className="text-gray-600 text-sm">{reply.author}</div>
                            <div className="text-gray-500 text-xs">Reply</div>
                        </div>
                    </div>
                    <div className="text-gray-700">{reply.text}</div>
                    <div className="flex items-center space-x-2 mt-2">
                        <button className="text-blue-500 text-xs">Like</button>
                        <button className="text-gray-500 text-xs">Reply</button>
                        <button className="text-gray-500 text-xs">Edit</button>
                        {currentUser === reply.author && (
                            <button className="text-red-500 text-xs" onClick={() => handleDeleteClickReply(index)}>Delete</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function App() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Fetch comments from backend when component mounts
        fetch('http://localhost:5000/api/comments')
            .then(response => response.json())
            .then(data => {
                // Reverse the order of comments to display them in descending order
                const reversedComments = data.reverse();
                setComments(reversedComments);
            })
            .catch(error => console.error('Error fetching comments:', error));
    }, []);

    const handleAddComment = () => {
        // Send the new comment to the backend
        fetch('http://localhost:5000/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                author: user.name,
                text: newComment,
                profilePhoto: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png'
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Prepend the new comment to the existing comments array
                setComments([data, ...comments]);
                // Clear the text area
                setNewComment('');

                // Persist the comments in browser storage or backend for future refreshes
                // For example, you can store comments in localStorage
                localStorage.setItem('comments', JSON.stringify([data, ...comments]));
            })
            .catch(error => console.error('Error adding comment:', error));
    };

    const handleDeleteComment = (commentId) => {
        // Send DELETE request to delete the comment
        fetch(`http://localhost:5000/api/comments/${commentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                // Remove the comment from the state if delete request is successful
                if (response.ok) {
                    setComments(comments.filter(comment => comment._id !== commentId));
                } else {
                    console.error('Error deleting comment:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting comment:', error));
    };

    const handleDeleteReply = (commentId, replyIndex) => {
        // Send DELETE request to delete the reply
        fetch(`http://localhost:5000/api/comments/${commentId}/replies/${replyIndex}`, {
            method: 'DELETE',
        })
            .then(response => {
                // Remove the reply from the comment's replies array if delete request is successful
                if (response.ok) {
                    setComments(prevComments => {
                        const updatedComments = [...prevComments];
                        const commentToUpdate = updatedComments.find(comment => comment._id === commentId);
                        if (commentToUpdate) {
                            commentToUpdate.replies.splice(replyIndex, 1);
                        }
                        return updatedComments;
                    });
                } else {
                    console.error('Error deleting reply:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting reply:', error));
    };

    return (
        <div className="container-fluid mx-auto p-8">
            <div className="mb-4">
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                ></textarea>
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={handleAddComment}
                >
                    Add Comment
                </button>
            </div>
            {comments.map((comment, index) => (
                <Comment
                    key={index}
                    comment={comment}
                    currentUser={user.name}
                    handleDeleteComment={handleDeleteComment}
                    handleDeleteReply={handleDeleteReply} />
            ))}
        </div>
    );
}

export default App;
