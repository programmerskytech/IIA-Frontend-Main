import React, { useState } from 'react';
import { Card, Radio, Input, Space, Typography, Button, message, Alert } from 'antd';
import { CheckCircleOutlined, ProjectOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const { TextArea } = Input;

/**
 * ROProjectDetermination Component
 * Allows Reporting Officer to confirm or change project status of an indent
 *
 * Props:
 * - indentId: string - The indent ID
 * - currentIsUnderProject: boolean - Current project status
 * - projectName: string - Current project name if under project
 * - onDeterminationComplete: function - Callback after determination is saved
 * - disabled: boolean - Whether the component is disabled
 */
const ROProjectDetermination = ({
  indentId,
  currentIsUnderProject = false,
  projectName = null,
  onDeterminationComplete,
  disabled = false
}) => {
  const [determination, setDetermination] = useState(currentIsUnderProject);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleDeterminationChange = (e) => {
    setDetermination(e.target.value);
    setSaved(false);
  };

  const handleSaveDetermination = async () => {
    if (!remarks.trim() && determination !== currentIsUnderProject) {
      message.warning('Please provide remarks when changing project classification');
      return;
    }

    setLoading(true);
    try {
      // Call API to save RO's determination
      await axios.put(`/api/indent/${indentId}/ro-determination`, {
        roProjectDetermination: determination,
        roProjectDeterminationRemarks: remarks,
        isUnderProject: determination
      });

      message.success('Project determination saved successfully');
      setSaved(true);

      if (onDeterminationComplete) {
        onDeterminationComplete({
          roProjectDetermination: determination,
          roProjectDeterminationRemarks: remarks
        });
      }
    } catch (error) {
      console.error('Error saving determination:', error);
      message.error('Failed to save project determination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      size="small"
      title={
        <Space>
          <ProjectOutlined style={{ color: '#722ed1' }} />
          <span>Project Classification (Reporting Officer)</span>
        </Space>
      }
      style={{
        marginBottom: '16px',
        border: '1px solid #d3adf7',
        backgroundColor: '#f9f0ff'
      }}
    >
      {/* Current Status Display */}
      <Alert
        message={
          <span>
            <strong>Current Classification:</strong>{' '}
            {currentIsUnderProject ? (
              <>
                <Text type="success">Under Project</Text>
                {projectName && <Text> - {projectName}</Text>}
              </>
            ) : (
              <Text type="warning">Non-Project</Text>
            )}
          </span>
        }
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: '16px' }}
      />

      {/* Determination Options */}
      <div style={{ marginBottom: '16px' }}>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
          Confirm Project Status:
        </Text>
        <Radio.Group
          value={determination}
          onChange={handleDeterminationChange}
          disabled={disabled || saved}
        >
          <Space direction="vertical">
            <Radio value={true}>
              <Space>
                <span>Yes, this is a project indent</span>
                {currentIsUnderProject && <Text type="secondary">(Current)</Text>}
              </Space>
            </Radio>
            <Radio value={false}>
              <Space>
                <span>No, change to non-project</span>
                {!currentIsUnderProject && <Text type="secondary">(Current)</Text>}
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      {/* Remarks Field */}
      <div style={{ marginBottom: '16px' }}>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
          Remarks {determination !== currentIsUnderProject && <Text type="danger">*</Text>}:
        </Text>
        <TextArea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder={
            determination !== currentIsUnderProject
              ? 'Please provide reason for changing project classification (required)'
              : 'Add any additional remarks (optional)'
          }
          rows={3}
          disabled={disabled || saved}
          maxLength={500}
          showCount
        />
      </div>

      {/* Save Button */}
      {!disabled && !saved && (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={handleSaveDetermination}
          loading={loading}
          style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
        >
          Save Determination
        </Button>
      )}

      {/* Saved Confirmation */}
      {saved && (
        <Alert
          message="Determination Saved"
          description={`Project status ${determination !== currentIsUnderProject ? 'changed' : 'confirmed'} successfully.`}
          type="success"
          showIcon
        />
      )}

      {/* Info about workflow routing */}
      <div style={{
        marginTop: '16px',
        padding: '8px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
        <Text type="secondary">
          {determination ? (
            'Project indents will be routed to the Project Head for approval within project budget.'
          ) : (
            'Non-project indents will be routed based on category (Computer/Non-Computer) and location.'
          )}
        </Text>
      </div>
    </Card>
  );
};

export default ROProjectDetermination;
