import { Tabs } from 'antd'
import React from 'react'
import QueueRequest from './QueueRequest'

const Queue1 = () => {
  return (
    <Tabs
      items={[
        {
          key: 'IND',
          label: 'Indent',
          children: <QueueRequest workflowId={1} />,
        },
        {
          key: 'T',
          label: 'Tender',
          children: <QueueRequest requestType="Tender" />,
        },
        {
          key: 'CP',
          label: 'Contingency Purchase',
          children: <QueueRequest workflowId={2} />,
        },
        {
          key: 'PO',
          label: 'Purchase Order',
          children: <QueueRequest workflowId={3} />,
        },
        {
          key: 'SO',
          label: 'Service Order',
          children: <QueueRequest workflowId={5} />,
        },
        {
          key: 'M',
          label: 'Material',
          children: <QueueRequest requestType="M" />,
        },
        {
          key: 'V',
          label: 'Vendor',
          children: <QueueRequest requestType="V" />,
        },
        {
          key: 'C',
          label: 'Cancelled Indents',
          children: <QueueRequest requestType="C" />,
        },
        {
          key: 'PV',
          label: 'Payment Voucher',
          children: <QueueRequest requestType="PV" />,
        },
      ]}
    />
  )
}

export default Queue1