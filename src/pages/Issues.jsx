import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

import { formatDistance, subDays, parseISO } from "date-fns";


import IconClosed from "../components/IconClosed";
import IconComment from "../components/IconComment";
import IconOpen from "../components/IconOpen";

export default function Issues() {
    const [filter, setFilter] = useState("open");

    const { isLoading, isSuccess, data: issues } = useQuery(["issues", filter], fetchIssues);
    async function fetchIssues() {
        const response = await fetch(
            `https://api.github.com/repos/facebook/create-react-app/issues?per_page=20&state=${filter}`
        );
        return await response.json();
    }

    const { isSuccess: isOpenIssueCountSuccess, data: issuesOpenCount } = useQuery(
        "issueCountOpen",
        fetchIssueCountOpen
    );

    async function fetchIssueCountOpen() {
        const response = await fetch(
            `https://api.github.com/search/issues?q=repo:facebook/create-react-app+type:issue+state:open&per_page=1`
        );

        return response.json();
    }

    const { isSuccess: isClosedIssueCountSuccess, data: issuesClosedCount } = useQuery(
        "issueCountClosed",
        fetchIssueCountClose
    );

    async function fetchIssueCountClose() {
        const response = await fetch(
            `https://api.github.com/search/issues?q=repo:facebook/create-react-app+type:issue+state:closed&per_page=1`
        );

        return response.json();
    }

    return (
        <div className="issues-container">
            {isLoading && <h1>Loading Issues...</h1>}

            {isSuccess && (
                <>
                    <div className="issues-heading">
                        <a href="https://github.com/facebook/create-react-app">facebook / create-react-app</a>
                        <div className="open-closed-buttons">
                            <button onClick={() => setFilter("open")}>
                                <IconOpen />
                                <span className={filter === "open" ? "font-bold" : ""}>
                                    {issuesOpenCount?.total_count ?? 95} Open
                                </span>
                            </button>

                            <button onClick={() => setFilter("closed")}>
                                <IconClosed />
                                <span className={filter !== "open" ? "font-bold" : ""}>
                                    {issuesClosedCount?.total_count ?? 247} Closed
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="issues-table">
                        {issues.map((issue) => (
                            <div key={issue.id} className="issues-entry">
                                <div className="issues-entry-title-container">
                                    {issue.state === "open" ? <IconOpen /> : <IconClosed />}
                                    <div className="issues-title">
                                        <Link to={`/issues/${issue.number}`}>{issue.title}</Link>
                                        <div className="issues-title-details">
                                            #{issue.number} opened &nbsp;
                                            {formatDistance(subDays(new Date(), 7), parseISO(issue.created_at), {
                                                addSuffix: true,
                                            })}
                                            &nbsp; by {issue.user.login}
                                        </div>
                                    </div>
                                </div>
                                {issue.comments > 0 && (
                                    <Link to={`/issues/${issue.number}`} href="#" className="comments-count-container">
                                        <IconComment />
                                        <div className="comments-count">{issue.comments}</div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
