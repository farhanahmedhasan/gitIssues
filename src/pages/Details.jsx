import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { formatDistance, parseISO, subDays } from "date-fns";

import Comments from "../components/Comments";

export default function Details() {
    const params = useParams();

    const { isLoading, isSuccess, data: issue } = useQuery(["issue", params.id], fetchIssue);
    async function fetchIssue() {
        const response = await fetch(`https://api.github.com/repos/facebook/create-react-app/issues/${params.id}`);
        return await response.json();
    }

    return (
        <div className="comments-container">
            {isLoading && <div>Loading...</div>}

            {isSuccess && (
                <>
                    <h2>
                        {issue.title} <span>#{issue.number}</span>
                    </h2>
                    <div className="issue-details">
                        <a href={issue.user.html_url}>{issue.user.login}</a> opened this issue{" "}
                        {formatDistance(subDays(new Date(), 7), parseISO(issue.created_at), {
                            addSuffix: true,
                        })}
                    </div>

                    {issue.body && (
                        <div className="comment-container">
                            <a href={issue.user.html_url}>
                                <img src={issue.user.avatar_url} alt="avatar" className="avatar" />
                            </a>
                            <div className="comment">
                                <div className="comment-heading">
                                    <a href={issue.user.html_url}>{issue.user.login}</a> commented{" "}
                                    {formatDistance(subDays(new Date(), 7), parseISO(issue.created_at), {
                                        addSuffix: true,
                                    })}
                                </div>
                                <div className="comment-body">{issue.body}</div>
                            </div>
                        </div>
                    )}
                    <div className="border"></div>

                    <Comments issueNumber={issue.number} />
                </>
            )}
        </div>
    );
}
