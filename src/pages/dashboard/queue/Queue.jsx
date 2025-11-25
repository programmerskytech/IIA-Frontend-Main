// App.js
import React from "react";
import QueueTable from "./QueueTable";

const Queue = () => {
  return (
    <div className="form-container">
      <h2>Pending Requests Queue</h2>
      <QueueTable />
    </div>
  );
};

export default Queue;