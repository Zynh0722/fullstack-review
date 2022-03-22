import React from 'react';

const Repo = ({ repo }) => (
  <div className="repo-entry-container">
    <a href={`https://github.com/${repo.owner.name}/${repo.name}`}>{repo.name}</a>
  </div>
);

export default Repo;