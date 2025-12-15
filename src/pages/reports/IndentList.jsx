import React, {useEffect,useState} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import IndentStatusBadge from '../../components/IndentStatusBadge';

const IndentList = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);
   const auth = useSelector((state) => state.auth);
    const userId = auth.userId;
     const roleName = auth.role; 

  const columns = [
    {
      title: 'Indent ID',
      dataIndex: 'indentId',
      key: 'indentId_INDENT',
      filterable: true,
    },
    {
      title: 'Indentor Name',
      dataIndex: 'indentorName',
      key: 'indentorName_INDENT',
      filterable: true,
    },
    {
      title: 'Indentor Mobile No',
      dataIndex: 'indentorMobileNo',
      key: 'indentorMobileNo_INDENT',
      filterable: true,
    },
    {
      title: 'Indentor Email',
      dataIndex: 'indentorEmailAddress',
      key: 'indentorEmailAddress_INDENT',
      filterable: true,
    },
    {
      title: 'Consignes Location',
      dataIndex: 'consignesLocation',
      key: 'consignesLocation_INDENT',
      filterable: true,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName_INDENT',
      filterable: true,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
      key: 'submittedDate_INDENT',
      filterable: true,
    },
    {
      title: 'Pending With',
      dataIndex: 'pendingWith',
      key: 'pendingWith_INDENT',
      filterable: true,
    },
    {
      title: 'Pending From',
      dataIndex: 'pendingFrom',
      key: 'pendingFrom_INDENT',
      filterable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status_INDENT',
      filterable: true,
    },
    {
      title: 'Current Status',
      dataIndex: 'currentStatus',
      key: 'currentStatus_INDENT',
      filterable: true,
      render: (text, record) => {
        if (!record.currentStatus) return '-';
        const indentData = {
          currentStatus: record.currentStatus,
          currentStage: record.currentStage,
          approvalLevel: record.approvalLevel
        };
        return <IndentStatusBadge indent={indentData} />;
      }
    },
    {
      title: 'Current Stage',
      dataIndex: 'currentStage',
      key: 'currentStage_INDENT',
      filterable: true,
      render: (text) => text ? text.replace(/_/g, ' ') : '-'
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version_INDENT',
      filterable: true,
      width: 80,
      align: 'center',
      render: (text) => text ? <Tag color="blue">v{text}</Tag> : '-'
    },
    {
      title: 'Editable',
      dataIndex: 'isEditable',
      key: 'isEditable_INDENT',
      filterable: true,
      width: 90,
      align: 'center',
      render: (text) => text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>
    },
    {
      title: 'Locked',
      dataIndex: 'isLockedForTender',
      key: 'isLockedForTender_INDENT',
      filterable: true,
      width: 90,
      align: 'center',
      render: (text) => text ? <Tag color="orange">Yes</Tag> : <Tag color="default">No</Tag>
    },
    {
      title: 'As On Date',
      dataIndex: 'asOnDate',
      key: 'asOnDate_INDENT',
      filterable: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy_INDENT',
      filterable: true,
    },
    {
      title: 'Indent Value',
      dataIndex: 'indentValue',
      key: 'indentValueBy_INDENT',
      filterable: true,
    },
    {
      title: 'Material Details',
      dataIndex: 'materialDetails',
      key: 'materialDetails_INDENT',
      render: (materialDetails) => (
        <Table
          dataSource={materialDetails}
          pagination={false}
          columns={[
            {
              title: 'Material Code',
              dataIndex: 'materialCode',
              key: 'materialCode',
            },
            {
              title: 'Material Description',
              dataIndex: 'materialDescription',
              key: 'materialDescription',
            },
            {
              title: 'Quantity',
              dataIndex: 'quantity',
              key: 'quantity',
            },
            {
              title: 'Unit Price',
              dataIndex: 'unitPrice',
              key: 'unitPrice',
            },
            {
              title: 'UOM',
              dataIndex: 'uom',
              key: 'uom',
            },
            {
              title: 'Total Price',
              dataIndex: 'totalPrice',
              key: 'totalPrice',
            },
            {
              title: 'Budget Code',
              dataIndex: 'budgetCode',
              key: 'budgetCode',
            },
            {
              title: 'Material Category',
              dataIndex: 'materialCategory',
              key: 'materialCategory',
            },
            {
              title: 'Material Sub Category',
              dataIndex: 'materialSubCategory',
              key: 'materialSubCategory',
            },
            {
              title: 'Mode of Procurement',
              dataIndex: 'modeOfProcurement',
              key: 'modeOfProcurement',
            },
            {
              title: 'Currency',
              dataIndex: 'currency',
              key: 'currency',
            },
            {
              title: 'Vendor Names',
              dataIndex: 'vendorNames',
              key: 'vendorNames',
            },
          ]}
        />
      ),
    },
  ];


  const api = "/api/reports/indentList-report";


const handleFetch = (startDate, endDate, data) => {
  const finalData = data || [];
  setReportData(finalData);
  generateChart(finalData);
};
const generateChart = (finalData) => {
  if (!finalData || finalData.length === 0) {
    if (onChartData) onChartData([], []);
    return;
  }

  // Bar Data
  const barDataMap = finalData.reduce((acc, item) => {
    const key = item[selectedBarKey] || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Pie Data
  const pieDataMap = finalData.reduce((acc, item) => {
    const key = item[selectedPieKey] || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
const barData = Object.keys(barDataMap).map(key => ({
  name: key,
  value: barDataMap[key]   // use value instead of count
}));

  const pieData = Object.keys(pieDataMap).map(key => ({
    name: key,
    value: pieDataMap[key]    // fixed value key for pie chart
  }));

  if (onChartData) onChartData(barData, pieData);
};


useEffect(() => {
  if (reportData && reportData.length > 0) {
    generateChart(reportData);
  }
}, [reportData, selectedBarKey, selectedPieKey]);


  return (
    <div>
      <CustomReport columns={columns} api={api} title="Indent List" filterType="date" storageKey="INDENTLIST_REPORT_COLUMNS" onFetch={handleFetch} userId={userId} roleName={roleName}/>
    </div>
  );
};

export default IndentList;
