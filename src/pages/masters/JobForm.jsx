import React, { useEffect, useState } from "react";
import FormContainer from "../../components/DKG_FormContainer";
import { Form, message } from "antd";
import FormInputItem from "../../components/DKG_FormInputItem";
import CustomSelect from "../../components/CustomSelect";
import Heading from "../../components/DKG_Heading";
import { useSelector } from "react-redux";
import { modeOfProcurementList } from "../../utils/Constants";
import axios from "axios";
import Btn from "../../components/DKG_Btn";
import { Option } from "antd/es/mentions";
import TextAreaComponent from "../../components/DKG_TextAreaComponent";
import {
  Button,
  Radio,
  Select,
  Modal,
  Input,
} from "antd";
import {
  ReloadOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useLOVValues } from "../../hooks/useLOVValues";



const JobForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [procurementMode, setProcurementMode] = useState("");
  const { categoryMaster, uomMaster, vendorMaster } = useSelector(
    (state) => state.masters
  );
  const { userId } = useSelector((state) => state.auth);
  const [jobList, setJobList] = useState([]);
  const [jobDetailsMap, setJobDetailsMap] = useState({});
  const [jobCategories, setJobCategories] = useState([]);
  const [jobSubcategories, setJobSubcategories] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  const [showJobCodePopup, setShowJobCodePopup] = useState(false);
  const [generatedJobCode, setGeneratedJobCode] = useState("");

  // ✅ Fetch dropdown values from LOV system (Form ID: 5 - JobMaster)
  const { lovValues: jobCategoryLOV, loading: loadingJobCategory } = useLOVValues(5, 'jobCategory');
  const { lovValues: jobSubcategoryLOV, loading: loadingJobSubcategory } = useLOVValues(5, 'jobSubcategory');
  const { lovValues: uomLOV, loading: loadingUom } = useLOVValues(5, 'uom');
  const { lovValues: currencyLOV, loading: loadingCurrency } = useLOVValues(5, 'currency');

  // Fetch data with Axios
  const fetchInitialData = async () => {
    try {
      const jobResponse = await axios.get(`api/job-master`);
      const data = jobResponse.data;

      if (!data.responseData) throw new Error("Invalid job data");

      const categories = [
        ...new Set(data.responseData.map((item) => item.category)),
      ];
      const subCategories = [
        ...new Set(data.responseData.map((item) => item.subCategory)),
      ];

      setJobCategories(categories);
      setJobSubcategories(subCategories);

      const jobMap = data.responseData.reduce(
        (acc, job) => ({
          ...acc,
          [job.jobCode]: {
            ...job,
            jobDescription: job.description,
            jobCategory: job.category,
            jobSubCategory: job.subCategory,
          },
        }),
        {}
      );

      setJobDetailsMap(jobMap);
      setJobList(Object.keys(jobMap));

      // Fetch UOM Data
      const uomResponse = await axios.get(`api/uom-master`);
      const uomData = uomResponse.data;

      if (!uomData.responseData) throw new Error("Invalid UOM data");

      const processedUom = uomData.responseData.map((uom) => ({
        value: uom.uomCode,
        label: uom.uomName,
      }));
      setUomOptions(processedUom);
    } catch (error) {
      console.error("Material fetch error:", error);
      message.error("Failed to load data from server");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Submit job data with Axios
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        category: values.category,
        createdBy: actionPerformer,
        currency: values.currency,
        jobDescription: values.description,
        indigenousOrImported: values.indigenousOrImported,
        subCategory: values.subCategory,
        uom: values.uom,
        assetId: values.assetId,
        value: values.value,
        estimatedPriceWithCcy: values.estimatedPrice,
        briefDescription: values.briefDescription,
        updatedBy: String(actionPerformer),
      };

      console.log("Payload sending:", payload);

      const response = await axios.post(`api/job-master`, payload);
      const result = response.data;

      if (!result.responseData) {
        throw new Error(result.responseStatus?.message || "Operation failed");
      }

      setGeneratedJobCode(result.responseData?.jobCode);
      setShowJobCodePopup(true);
      message.success("Job created successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      message.error(
        error.response?.data?.responseStatus?.message ||
          "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  // Job Code Popup
  const JobCodePopup = () => (
    <Modal
      title="Job Created Successfully"
      open={showJobCodePopup}
      onOk={() => setShowJobCodePopup(false)}
      onCancel={() => setShowJobCodePopup(false)}
      okText="OK"
    >
      <p>
        Generated Job Code: <strong>{generatedJobCode}</strong>
      </p>
      <p>Job created successfully! Job Code will be assigned after approval.</p>
    </Modal>
  );

  return (
    <FormContainer>
      <JobCodePopup />
      <Form
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
        onValuesChange={(changedValues) => {
          if (changedValues.modeOfProcurement) {
            setProcurementMode(changedValues.modeOfProcurement);
          }
        }}
      >
        <Heading title={"Job Details"} />
        <div className="form-section">
          <FormInputItem label="Job Code" name="jobCode" disabled />

          <Form.Item
            name="category"
            label="Job Category"
            rules={[
              { required: true, message: "Please select job category!" },
            ]}
          >
            <Select placeholder="Select Job Category" loading={loadingJobCategory}>
              {(jobCategoryLOV.length > 0 ? jobCategoryLOV : [
                { lovValue: "AMC", lovDisplayValue: "AMC (Annual Maintenance Contract)" },
                { lovValue: "Rate Contract", lovDisplayValue: "Rate Contract" },
                { lovValue: "Repair And Service", lovDisplayValue: "Repair & Service" },
                { lovValue: "Internet Service", lovDisplayValue: "Internet Service" },
                { lovValue: "Other Service", lovDisplayValue: "Other Service" }
              ]).map((item) => (
                <Option key={item.lovId || item.lovValue} value={item.lovValue}>
                  {item.lovDisplayValue}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subCategory"
            label="Job Subcategory"
            rules={[{ required: true, message: "Please select subcategory!" }]}
          >
            <Select placeholder="Select Job Subcategory" loading={loadingJobSubcategory}>
              {(jobSubcategoryLOV.length > 0 ? jobSubcategoryLOV : [
                { lovValue: "Chemicals", lovDisplayValue: "Chemicals" },
                { lovValue: "Computer & Peripherals", lovDisplayValue: "Computer & Peripherals" },
                { lovValue: "Electrical", lovDisplayValue: "Electrical" },
                { lovValue: "Electronic Items", lovDisplayValue: "Electronic Items" },
                { lovValue: "Equipment", lovDisplayValue: "Equipment" },
                { lovValue: "Furniture", lovDisplayValue: "Furniture" },
                { lovValue: "HARDWARE", lovDisplayValue: "HARDWARE" },
                { lovValue: "Miscellaneous", lovDisplayValue: "Miscellaneous" },
                { lovValue: "Software", lovDisplayValue: "Software" },
                { lovValue: "Stationary", lovDisplayValue: "Stationary" },
                { lovValue: "Vehicles", lovDisplayValue: "Vehicles" }
              ]).map((item) => (
                <Option key={item.lovId || item.lovValue} value={item.lovValue}>
                  {item.lovDisplayValue}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Job Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="uom"
            label="UOM"
            rules={[{ required: true, message: "Please select UOM!" }]}
          >
            <Select placeholder="Select Unit of Measure" loading={loadingUom}>
              {(uomLOV.length > 0 ? uomLOV.map(lov => ({value: lov.lovValue, label: lov.lovDisplayValue})) : uomOptions).map((uom) => (
                <Option key={uom.value} value={uom.value}>
                  {uom.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <TextAreaComponent
            label="Brief Description of Job"
            name="briefDescription"
            required
          />
        </div>

        <div className="form-section">
          <FormInputItem
            type="number"
            name="estimatedPrice"
            label="Estimated Price"
            required
          />
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, message: "Please select currency!" }]}
          >
            <Select placeholder="Select Currency" loading={loadingCurrency}>
              {(currencyLOV.length > 0 ? currencyLOV : [
                { lovValue: "USD", lovDisplayValue: "USD" },
                { lovValue: "INR", lovDisplayValue: "INR" },
                { lovValue: "EUR", lovDisplayValue: "EUR" },
                { lovValue: "GBP", lovDisplayValue: "GBP" }
              ]).map((item) => (
                <Option key={item.lovId || item.lovValue} value={item.lovValue}>
                  {item.lovDisplayValue}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="indigenousOrImported"
            label="Origin"
            rules={[{ required: true, message: "Please select origin!" }]}
          >
            <Radio.Group>
              <Radio value="indigenous">Indigenous</Radio>
              <Radio value="imported">Imported</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <Button type="default" htmlType="reset">
            <ReloadOutlined /> Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            <SendOutlined /> Create
          </Button>
          <Button type="dashed" htmlType="button">
            <SaveOutlined /> Save Draft
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default JobForm;
