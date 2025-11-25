// QueueList.js
import React from "react";
import { List } from "antd";
import QueueItem from "./QueueItem";

const QueueList = ({ data }) => {
  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <QueueItem item={item} />
        </List.Item>
      )}
    />
  );
};

export default QueueList;