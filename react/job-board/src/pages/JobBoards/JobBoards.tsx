import React, { useState, useEffect } from "react";
import "./JobBoards.css";

const PAGE_SIZE = 3;
const JOBS_API_URL = "https://hacker-news.firebaseio.com/v0/jobstories.json";
const ITEM_API_URL = "https://hacker-news.firebaseio.com/v0/item";

interface Job {
  id: number;
  title: string;
  by: string;
  score: number;
  type: string;
  url: string;
  time: number;
}

const JobBoard: React.FC = () => {
  const [jobIds, setJobIds] = useState<number[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobIds = async () => {
      try {
        const response = await fetch(JOBS_API_URL).then((res) => res.json());
        setJobIds(response);
      } catch {
        console.error("Error fetching job IDs");
      }
    };

    fetchJobIds();
  }, []);

  useEffect(() => {
    if (jobIds?.length === 0) return;

    let isMounted = true;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const jobsToFetchByIds = jobIds.slice(start, end);

        const jobsToFetchPromises = jobsToFetchByIds.map((jobId) =>
          fetch(`${ITEM_API_URL}/${jobId}.json`).then((res) => res.json()),
        );
        const jobsToFetch = await Promise.all(jobsToFetchPromises);
        if (isMounted) {
          setJobs((prevJobs) => [...prevJobs, ...jobsToFetch]);
        }
        setLoading(false);
      } catch {
        console.error("Error fetching jobs");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
        setLoading(false);
      }
    };
    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [page, jobIds]);

  const hasMore = (page + 1) * PAGE_SIZE < jobIds.length;

  return (
    <>
      <div className="container">
        <h1>Hacker News Job Board</h1>

        <div className="job-list">
          {jobs.length > 0
            ? jobs.map((job) => (
                <div key={job?.id} className="job-card">
                  <h2>
                    {job.url ? (
                      <a
                        href={job?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {job?.title}
                      </a>
                    ) : (
                      job?.title
                    )}
                  </h2>
                  <p className="job-meta">
                    By •{job?.by} {new Date(job?.time * 1000).toLocaleString()}
                  </p>
                </div>
              ))
            : !loading && <h2>No jobs available</h2>}
        </div>
        <div>
          {hasMore && (
            <button
              onClick={() => setPage((prevPage) => prevPage + 1)}
              className="load-more-btn"
              disabled={loading}
            >
              {loading ? "Loading" : "Load More Jobs"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default JobBoard;
