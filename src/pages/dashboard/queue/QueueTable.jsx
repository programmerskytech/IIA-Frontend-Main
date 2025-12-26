import React, { useEffect, useState } from "react";
import { Tabs, Typography, Row, Col } from "antd";
import { useSelector } from "react-redux";
import QueueRequest from "./QueueRequest";
import QueueAction from "./QueueAction";
import PendingGi from "./PendingGi";
import Queue3 from "./Queue3";
import Queue1 from "./Queue1";

const { Text } = Typography;
const RESTRICTED_USER_IDS = new Set([]);

const QueueTable = () => {
  const auth = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("request");
  const userId = auth.userId

  // Check if user is restricted
  const isRestricted = RESTRICTED_USER_IDS.has(userId);

  const {role} = useSelector(state => state?.auth);
  

  // Handle tab switching for restricted users
  useEffect(() => {
    if (isRestricted && activeTab === "request") {
      setActiveTab("action");
    }
  }, [isRestricted, activeTab]);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>Role ID:</Text> {auth.roleId || "N/A"}
        </Col>
        <Col>
          <Text strong>Role Name:</Text> {auth.role || "N/A"}
        </Col>
        <Col>
          <Text strong>User ID:</Text> {auth.userId}
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          ...(!isRestricted ? [{
            key: 'request',
            label: 'Procurement',
            children: <Queue1 />,
          }] : []),
          {
            key: 'action',
            label: 'Queue2',
            children: <QueueAction />,
          },
          ...((role === "Indent Creator" || role === "Store Purchase Officer" || role === "Store Person") ? [{
            key: 'inventory',
            label: 'Inventory',
            children: <Queue3 />,
          }] : []),
        ]}
      />
    </div>
  );
};

export default QueueTable;