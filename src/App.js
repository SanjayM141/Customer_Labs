import React, { useState } from "react";
import { Button, Modal, Input, Select, Form, Space } from "antd";
import axios from "axios";

const { Option } = Select;

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedSchemas([]);
    setSelectedOption(null);
  };

  const handleSchemaSelect = (value) => {
    setSelectedOption(value); 
  };

  const handleAddSchema = () => {
    if (selectedOption) {
      const selectedSchema = schemaOptions.find((schema) => schema.value === selectedOption);
      setSelectedSchemas([...selectedSchemas, selectedSchema]);

      form.resetFields(["newSchema"]);
      setSelectedOption(null);
    }
  };

  const handleSchemaChange = (value, index) => {
    const updatedSchemas = [...selectedSchemas];
    updatedSchemas[index] = schemaOptions.find((schema) => schema.value === value);
    setSelectedSchemas(updatedSchemas);
  };

  const getAvailableSchemas = (index) => {
    const usedValues = selectedSchemas.map((schema, i) => (i !== index ? schema.value : null));
    return schemaOptions.filter((option) => !usedValues.includes(option.value));
  };

  const handleSaveSegment = (values) => {
    const segmentData = {
      segment_name: values.segmentName,
      schema: selectedSchemas.map((schema) => ({
        [schema.value]: schema.label,
      })),
    };

    // Send data to the webhook URL
    axios.post("https://webhook.site/YOUR-WEBHOOK-URL", segmentData)
      .then((response) => {
        console.log("Segment saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving segment:", error);
      });

    handleCancel(); 
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={showModal}>
        Save Segment
      </Button>
      <Modal
        title="Saving Segment"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSaveSegment}>
          <Form.Item
            label="Enter the Name of the Segment"
            name="segmentName"
            rules={[{ required: true, message: "Please enter the segment name" }]}
          >
            <Input placeholder="Name of the segment" />
          </Form.Item>

          <div style={{ border: "1px solid #d9d9d9", padding: "10px", marginBottom: "10px" }}>
            {selectedSchemas.map((schema, index) => (
              <Select
                key={index}
                value={schema.value}
                onChange={(value) => handleSchemaChange(value, index)}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                {getAvailableSchemas(index).map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            ))}
          </div>

          <Form.Item name="newSchema" label="Add schema to segment">
            <Select
              placeholder="Add schema to segment"
              onSelect={handleSchemaSelect}
              style={{ width: "100%" }}
            >
              {getAvailableSchemas(null).map((schema) => (
                <Option key={schema.value} value={schema.value}>
                  {schema.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Space style={{ marginBottom: 10 }}>
            <Button type="link" onClick={handleAddSchema} disabled={!selectedOption}>
              + Add new schema
            </Button>
          </Space>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save the Segment
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
