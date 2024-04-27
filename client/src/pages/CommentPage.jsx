import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../context/authContext'

function Comment({ comment, currentUser, handleDeleteComment, handleDeleteReply, handleEditComment, handleAddReply, handleEditReply }) {
    const isAuthor = currentUser === comment.author;
    const [editedComment, setEditedComment] = useState(comment.text);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedReplyIndex, setEditedReplyIndex] = useState(null);
    const [editedReplyText, setEditedReplyText] = useState('');

    const handleDeleteClickReply = (replyIndex) => {
        handleDeleteReply(comment._id, replyIndex);
    };

    const handleReplyClick = () => {
        setIsReplying(true);
    };

    const handleCancelReply = () => {
        setIsReplying(false);
        setReplyText('');
    };

    const handleAddReplyClick = () => {
        handleAddReply(comment._id, {
            author: currentUser,
            text: replyText,
            profilePhoto: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png'
        });
        setIsReplying(false);
        setReplyText('');
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedComment(comment.text);
    };

    const handleSaveEdit = () => {
        handleEditComment(comment._id, editedComment);
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        handleDeleteComment(comment._id);
    };

    const handleEditClickReply = (replyIndex) => {
        setEditedReplyIndex(replyIndex);
        setEditedReplyText(comment.replies[replyIndex].text);
    };

    const handleSaveEditReply = () => {
        handleEditReply(comment._id, editedReplyIndex, editedReplyText);
        setEditedReplyIndex(null);
        setEditedReplyText('');
    };

    const handleCancelEditReply = () => {
        setEditedReplyIndex(null);
        setEditedReplyText('');
    };

    return (
        <div className="p-4 border border-gray-300 rounded-md mb-4">
            <div className="flex items-center space-x-4 mb-4">
                <img className="w-8 h-8 rounded-full" src={comment.profilePhoto} alt={comment.author} />
                <div className="text-gray-700">
                    <div className="font-medium">{comment.author}</div>
                    <div className="text-gray-500 text-xs">Comment</div>
                </div>
            </div>
            {isEditing ? (
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 shadow-md transition duration-300"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md transition duration-300 hover:bg-blue-600" onClick={handleSaveEdit}>
                        Save
                    </button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md transition duration-300 hover:bg-gray-600" onClick={handleCancelEdit}>
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="text-gray-700">{comment.text}</div>
            )}

            <div className="flex items-center space-x-4 mt-4">
                <button className="text-blue-500 text-xs hover:underline"><i class="fa-regular fa-heart"></i> Like</button>
                <button className="text-gray-500 text-xs hover:underline" onClick={handleReplyClick}><i class="fa-solid fa-reply"></i> Reply</button>
                {isAuthor && (
                    <button className="text-gray-500 text-xs hover:underline" onClick={handleEditClick}>
                        <i className="fas fa-edit mr-1"></i>   Edit
                    </button>
                )}
                {isAuthor && (
                    <button className="text-red-500 text-xs hover:underline" onClick={handleDeleteClick}>
                        <i className="fas fa-trash-alt mr-1"></i>    Delete
                    </button>
                )}
            </div>

            {isReplying && (
                <div className="flex items-center space-x-4 mt-4">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 shadow-md transition duration-300"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button className="px-2 py-2 bg-blue-500 text-white rounded-md shadow-md transition duration-300 hover:bg-blue-600" onClick={handleAddReplyClick}>
                        Add Reply
                    </button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md transition duration-300 hover:bg-gray-600" onClick={handleCancelReply}>
                        Cancel
                    </button>
                </div>
            )}



            {comment.replies.map((reply, index) => (
                <div key={index} className="p-4 ml-4 border-l-2 border-gray-200 border border-gray-300 rounded-md mb-4 mt-4">
                    <div className="flex items-center space-x-4 mb-4">
                        <img className="w-8 h-8 rounded-full" src={comment.profilePhoto} alt={comment.author} />
                        <div className="text-gray-700">
                            <div className="font-small">{comment.author}</div>
                            <div className="text-gray-500 text-xs">Reply</div>
                        </div>
                    </div>
                    {editedReplyIndex === index ? (
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 shadow-md transition duration-300"
                                value={editedReplyText}
                                onChange={(e) => setEditedReplyText(e.target.value)}
                            />
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md transition duration-300 hover:bg-blue-600" onClick={handleSaveEditReply}>
                                Save
                            </button>
                            <button className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md transition duration-300 hover:bg-gray-600" onClick={handleCancelEditReply}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="text-gray-700">{reply.text}</div>
                    )}
                    <div className="flex items-center space-x-4 mt-4">
                        <button className="text-blue-500 text-xs hover:underline"><i class="fa-regular fa-heart"></i> Like</button>
                        {currentUser === reply.author && (
                            <div>
                                <button className="text-gray-500 text-xs hover:underline mr-2" onClick={() => handleEditClickReply(index)}>
                                    <i className="fas fa-edit mr-1"></i>   Edit
                                </button>

                                <button className="text-red-500 text-xs hover:underline" onClick={() => handleDeleteClickReply(index)}>
                                    <i className="fas fa-trash-alt mr-1"></i>   Delete
                                </button>
                            </div>
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
        fetch('http://localhost:5000/api/comments')
            .then(response => response.json())
            .then(data => {
                const reversedComments = data.reverse();
                setComments(reversedComments);
            })
            .catch(error => console.error('Error fetching comments:', error));
    }, []);

    const handleAddComment = () => {
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
                setComments([data, ...comments]);
                setNewComment('');
            })
            .catch(error => console.error('Error adding comment:', error));
    };

    const handleDeleteComment = (commentId) => {
        fetch(`http://localhost:5000/api/comments/${commentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setComments(comments.filter(comment => comment._id !== commentId));
                } else {
                    console.error('Error deleting comment:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting comment:', error));
    };

    const handleDeleteReply = (commentId, replyIndex) => {
        fetch(`http://localhost:5000/api/comments/${commentId}/replies/${replyIndex}`, {
            method: 'DELETE',
        })
            .then(response => {
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

    const handleEditComment = (commentId, newText) => {
        fetch(`http://localhost:5000/api/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: newText,
            }),
        })
            .then(response => {
                if (response.ok) {
                    setComments(prevComments => {
                        return prevComments.map(comment => {
                            if (comment._id === commentId) {
                                return { ...comment, text: newText };
                            }
                            return comment;
                        });
                    });
                } else {
                    console.error('Error updating comment:', response.statusText);
                }
            })
            .catch(error => console.error('Error updating comment:', error));
    };



    const handleAddReply = (commentId, reply) => {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        replies: [...comment.replies, reply]
                    };
                }
                return comment;
            });
        });

        fetch(`http://localhost:5000/api/comments/${commentId}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reply),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add reply');
                }
                return response.json();
            })
            .catch(error => console.error('Error adding reply:', error));
    };

    // Inside the handleEditClickReply function, after updating the local state, send a PUT request to update the reply on the server

    const handleEditReply = (commentId, replyIndex, newText) => {
        fetch(`http://localhost:5000/api/comments/${commentId}/replies/${replyIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: newText,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update reply');
                }
                // Update the local state with the edited reply once the request is successful
                setComments(prevComments => {
                    const updatedComments = [...prevComments];
                    const commentToUpdate = updatedComments.find(comment => comment._id === commentId);
                    if (commentToUpdate) {
                        commentToUpdate.replies[replyIndex].text = newText;
                    }
                    return updatedComments;
                });
            })
            .catch(error => console.error('Error updating reply:', error));
    };


    const handleEditClickReply = (replyIndex, comment) => {
        const editedReply = comment.replies[replyIndex];
        const newText = prompt("Edit your reply:", editedReply.text);
        if (newText === null || newText.trim() === '') {
            return;
        }
        handleEditReply(comment._id, replyIndex, newText);
    };



    return (
        <div className="container-fluid mx-auto p-8">
            <div className="mb-4">
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 transition duration-300"
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                ></textarea>
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={handleAddComment}
                >
                    Add Comment
                </button>
            </div>
            {comments.map((comment, index) => (
                <Comment
                    key={comment._id} // Ensure each comment has a unique key
                    comment={comment}
                    currentUser={user.name}
                    handleDeleteComment={handleDeleteComment}
                    handleDeleteReply={handleDeleteReply}
                    handleEditComment={handleEditComment}
                    handleAddReply={handleAddReply}
                    handleEditReply={handleEditReply}
                />
            ))}
        </div>
    );
}

export default App;
