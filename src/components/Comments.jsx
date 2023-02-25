import { formatDistance, parseISO, subDays } from "date-fns";
import { useQuery } from "react-query";
import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function Comments({ issueNumber }) {
    const { isLoading, isSuccess, data: comments } = useQuery(["comments", issueNumber], fetchComments);
    async function fetchComments() {
        const response = await fetch(
            `https://api.github.com/repos/facebook/create-react-app/issues/${issueNumber}/comments`
        );
        return await response.json();
    }

    return (
        <>
            {isLoading && <div>Loading...</div>}

            {isSuccess && (
                <div>
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment-container">
                            <a href={comment.user.html_url}>
                                <img src={comment.user.avatar_url} alt="avatar" className="avatar" />
                            </a>
                            <div className="comment">
                                <div className="comment-heading">
                                    <a href={comment.user.html_url}>{comment.user.login}</a> commented{" "}
                                    {formatDistance(subDays(new Date(), 7), parseISO(comment.created_at), {
                                        addSuffix: true,
                                    })}
                                </div>
                                <div className="comment-body markdown-body">
                                    <ReactMarkdown children={comment.body} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
