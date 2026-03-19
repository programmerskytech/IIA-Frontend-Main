import React, { useState, useEffect } from "react";
import { Form, Button, message, Select, Input } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import FormContainer from "../../components/DKG_FormContainer";
import Heading from "../../components/DKG_Heading";
import { useLOVValues } from "../../hooks/useLOVValues";

const { Option } = Select;

const VendorMasterForm = () => {
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [vendorType, setVendorType] = useState("");
  const [loading, setLoading] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [vendorStatus, setVendorStatus] = useState("");

  // 🔐 Only Store Purchase Officer can edit
  const canEdit = auth.role === "Store Purchase Officer";

  // ✅ Fetch dropdown values from LOV system (Form ID: 7 - VendorMaster)
  const { lovValues: primaryBusinessLOV, loading: loadingPrimaryBusiness } = useLOVValues(7, 'primaryBusiness');

  // Load all countries
  useEffect(() => {
    setCountryList(Country.getAllCountries());
  }, []);

  // Load vendor IDs + names
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          "/api/vendor-master/vendorIdVendorName"
        );
        setVendorList(response.data?.responseData || []);
      } catch (err) {
        message.error("Failed to load vendors");
      }
    };
    fetchVendors();
  }, []);

  // Fetch vendor details by ID
  const handleVendorSelect = async (vendorId) => {
    try {
      const response = await axios.get(
        `/api/vendor-master/vendor/${vendorId}`
      );
      const vendor = response.data?.responseData;
      if (!vendor) return message.error("No vendor details found");

      // Autofill form fields
      form.setFieldsValue({
        ...vendor,
        city: vendor.place,
        status: vendor.statusOfVendorActiveOrDebar,
        registeredPlatform: vendor.registeredPlatform ? true : false,
      });
      setVendorStatus(vendor.statusOfVendorActiveOrDebar);
      setVendorType(vendor.vendorType || "");

      if (vendor.country) {
        setSelectedCountry(vendor.country);
        setStateList(State.getStatesOfCountry(vendor.country));
      }
      if (vendor.state) {
        setSelectedState(vendor.state);
        setCityList(City.getCitiesOfState(vendor.country, vendor.state));
      }
    } catch (err) {
      message.error("Failed to fetch vendor details");
    }
  };

  // Handle country change
  const handleCountryChange = (val) => {
    setSelectedCountry(val);
    setSelectedState(undefined);
    setStateList(State.getStatesOfCountry(val));
    setCityList([]);
    form.setFieldsValue({ state: undefined, city: undefined });
  };

  // Handle state change
  const handleStateChange = (val) => {
    setSelectedState(val);
    setCityList(City.getCitiesOfState(selectedCountry, val));
    form.setFieldsValue({ city: undefined });
  };

  // UPDATE API integration
  const handleUpdate = async (values) => {
    console.log("roleName: " + auth.role);

    // Extra safety: backend call only for Store Purchase Officer
    if (auth.role !== "Store Purchase Officer") {
      message.warning("You are not authorized to update vendor details.");
      return;
    }

    if (!values.vendorId) {
      return message.error("Please select a Vendor to update");
    }

    setLoading(true);
    try {
      const payload = {
        vendorName: values.vendorName,
        vendorType: values.vendorType,
        contactNo: values.contactNo,
        emailAddress: values.emailAddress,
        registeredPlatform: values.registeredPlatform,
        pfmsVendorCode: values.pfmsVendorCode,
        primaryBusiness: values.primaryBusiness,
        address: values.address,
        alternateEmailOrPhoneNumber: values.alternateEmailOrPhoneNumber,
        panNo: values.panNo,
        gstNo: values.gstNo,
        bankName: values.bankName,
        accountNo: values.accountNo,
        ifscCode: values.ifscCode,
        purchaseHistory: values.purchaseHistory,
        swiftCode: values.swiftCode,
        bicCode: values.bicCode,
        ibanAbaNumber: values.ibanAbaNumber,
        sortCode: values.sortCode,
        bankRoutingNumber: values.bankRoutingNumber,
        bankAddress: values.bankAddress,
        country: values.country,
        state: values.state,
        place: values.city,
        updatedBy: actionPerformer,
        status: values.status,
        reasonForDebar: values.reasonForDebar || null,
      };

      await axios.put(
        `/api/vendor-master/update/${values.vendorId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      message.success("Vendor updated successfully!");
    } catch (err) {
      message.error("Failed to update vendor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("vendorStatus: " + vendorStatus);

  return (
    <FormContainer>
      <Heading title="Vendor Master" />

      {!canEdit && (
        <p style={{ color: "#faad14", marginTop: 8 }}>
          You can view vendor details, but only Store Purchase Officer can edit
          them.
        </p>
      )}

      <Form
        layout="vertical"
        form={form}
        onFinish={handleUpdate}
        onFinishFailed={() => message.error("Please fill all required fields")}
      >
        {/* Vendor selection + status */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Form.Item
            label="Vendor ID"
            name="vendorId"
            rules={[{ required: true, message: "Vendor ID is required" }]}
          >
            <Select
              showSearch
              placeholder="Search by ID, Name, Business, Purchase History, or Status (Active/Debar)"
              onChange={handleVendorSelect}
              optionFilterProp="data-search"
              filterOption={(input, option) =>
                option?.props["data-search"]
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {vendorList.map((v) => (
                <Option
                  key={v.vendorId}
                  value={v.vendorId}
                  data-search={`${v.vendorId} ${v.vendorName} ${
                    v.primaryBusiness || ""
                  } ${v.purchaseHistory || ""} ${
                    v.statusOfVendorActiveOrDebar || ""
                  }`}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{`${v.vendorId} - ${v.vendorName}`}</span>
                    {v.statusOfVendorActiveOrDebar && (
                      <span
                        style={{
                          marginLeft: "8px",
                          color:
                            v.statusOfVendorActiveOrDebar === "Active"
                              ? "#52c41a"
                              : "#ff4d4f",
                          fontSize: "11px",
                          fontWeight: "500",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor:
                            v.statusOfVendorActiveOrDebar === "Active"
                              ? "#f6ffed"
                              : "#fff2f0",
                        }}
                      >
                        {v.statusOfVendorActiveOrDebar}
                      </span>
                    )}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select
              disabled={!canEdit}
              onChange={(value) => setVendorStatus(value)}
            >
              <Option value="Active">Active</Option>
              <Option value="Debar">Debar</Option>
            </Select>
          </Form.Item>
        </div>

        {vendorStatus === "Debar" && (
          <Form.Item
            label="Reason for Debar"
            name="reasonForDebar"
            rules={[
              {
                required: true,
                message: "Please provide a reason for debar",
              },
            ]}
          >
            <Input disabled={!canEdit} />
          </Form.Item>
        )}

        {/* Vendor Basic Info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Form.Item
            label="Vendor Name"
            name="vendorName"
            rules={[
              { required: true, message: "Vendor name is required" },
              { min: 3, message: "Vendor name must be at least 3 characters" },
              {
                max: 100,
                message: "Vendor name cannot exceed 100 characters",
              },
              {
                pattern: /^[a-zA-Z\s.&'-]+$/,
                message:
                  "Vendor name can only contain letters, spaces, and characters . & ' -",
              },
            ]}
          >
            <Input disabled={!canEdit} />
          </Form.Item>

          <Form.Item
            label="Vendor Type"
            name="vendorType"
            rules={[{ required: true, message: "Vendor Type is required" }]}
          >
            <Select
              disabled={!canEdit}
              value={vendorType}
              onChange={(value) => setVendorType(value)}
            >
              <Option value="Domestic">Domestic</Option>
              <Option value="International">International</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Vendor Email"
            name="emailAddress"
            rules={[
              { required: true, message: "Vendor email is required" },
              { type: "email", message: "Please enter a valid email address" },
              {
                pattern:
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email format",
              },
            ]}
          >
            <Input disabled={!canEdit} />
          </Form.Item>

          <Form.Item
            label="Contact Number"
            name="contactNo"
            rules={[
              {
                required: true,
                message: "Vendor mobile number is required",
              },
              {
                pattern: /^[6-9]\d{9}$/,
                message:
                  "Please enter a valid 10-digit Indian mobile number starting with 6-9",
              },
            ]}
          >
            <Input disabled={!canEdit} maxLength={10} />
          </Form.Item>

          <Form.Item
            label="Registered in GeM/ CPP Portal"
            name="registeredPlatform"
          >
            <Select disabled={!canEdit}>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="PFMS Vendor Code"
            name="pfmsVendorCode"
            rules={[
              {
                pattern: /^[A-Z0-9]{6,20}$/,
                message:
                  "PFMS Vendor Code must be 6-20 alphanumeric characters in uppercase",
              },
            ]}
          >
            <Input disabled={!canEdit} />
          </Form.Item>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Form.Item
            label="Primary Business"
            name="primaryBusiness"
            rules={[
              { required: true, message: "Primary Business is required" },
            ]}
          >
            <Select disabled={!canEdit} placeholder="Select Primary Business" loading={loadingPrimaryBusiness}>
              {primaryBusinessLOV.map((item) => (
                <Option key={item.lovId || item.lovValue} value={item.lovValue}>
                  {item.lovDisplayValue}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Alternate Email / Phone Number"
            name="alternateEmailOrPhoneNumber"
            rules={[
              {
                required: true,
                message: "Alternate Email/Phone Number is required",
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const emailPattern =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                  const phonePattern = /^[6-9]\d{9}$/;
                  if (
                    emailPattern.test(value) ||
                    phonePattern.test(value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Please enter a valid email address or 10-digit phone number"
                  );
                },
              },
            ]}
          >
            <Input disabled={!canEdit} />
          </Form.Item>

          <Form.Item
            label="PAN Number"
            name="panNo"
            rules={[
              {
                required: vendorType === "Domestic",
                message: "PAN Number is required",
              },
              {
                min: 10,
                max: 10,
                message: "PAN Number must be 10 characters",
              },
              {
                pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message:
                  "PAN Number must be in format: ABCDE1234F (5 uppercase letters, 4 digits, 1 uppercase letter)",
              },
            ]}
          >
            <Input
              disabled={!canEdit || vendorType === "International"}
              maxLength={10}
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>

          <Form.Item
            label="GST Number"
            name="gstNo"
            rules={[
              {
                required: vendorType === "Domestic",
                message: "GST Number is required",
              },
              {
                pattern:
                  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                message:
                  "GST Number must be in valid format (e.g., 22AAAAA0000A1Z5)",
              },
            ]}
          >
            <Input
              disabled={!canEdit || vendorType === "International"}
              maxLength={15}
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>
        </div>

        {/* Bank Info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={[
              { required: true, message: "Bank Name is required" },
              { min: 3, message: "Bank name must be at least 3 characters" },
              {
                max: 100,
                message: "Bank name cannot exceed 100 characters",
              },
              {
                pattern: /^[a-zA-Z\s&'-]+$/,
                message:
                  "Bank name can only contain letters, spaces, and characters & ' -",
              },
            ]}
          >
            <Input disabled={!canEdit} />
          </Form.Item>

          <Form.Item
            label="Account Number"
            name="accountNo"
            rules={[
              { required: true, message: "Account Number is required" },
              {
                pattern: /^[0-9]{9,18}$/,
                message: "Account Number must be 9-18 digits",
              },
            ]}
          >
            <Input disabled={!canEdit} maxLength={18} />
          </Form.Item>

          <Form.Item
            label="IFSC Code"
            name="ifscCode"
            rules={[
              {
                required: vendorType === "Domestic",
                message: "IFSC Code is required",
              },
              {
                pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                message:
                  "IFSC Code must be in format: ABCD0123456 (4 uppercase letters, 0, then 6 alphanumeric)",
              },
            ]}
          >
            <Input
              disabled={!canEdit || vendorType === "International"}
              maxLength={11}
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>

          {vendorType === "International" && (
            <>
              <Form.Item
                label="SWIFT Code"
                name="swiftCode"
                rules={[
                  { required: true, message: "SWIFT Code is required" },
                  {
                    pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
                    message:
                      "SWIFT Code must be 8 or 11 characters (e.g., AAAABBCC or AAAABBCCXXX)",
                  },
                ]}
              >
                <Input
                  disabled={!canEdit}
                  maxLength={11}
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Item>

              <Form.Item
                label="BIC Code"
                name="bicCode"
                rules={[
                  { required: true, message: "BIC Code is required" },
                  {
                    pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
                    message:
                      "BIC Code must be 8 or 11 characters (e.g., AAAABBCC or AAAABBCCXXX)",
                  },
                ]}
              >
                <Input
                  disabled={!canEdit}
                  maxLength={11}
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Item>

              <Form.Item
                label="IBAN/ABA Number"
                name="ibanAbaNumber"
                rules={[
                  { required: true, message: "IBAN/ABA Number is required" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const ibanPattern =
                        /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
                      const abaPattern = /^[0-9]{9}$/;
                      if (
                        ibanPattern.test(value) ||
                        abaPattern.test(value)
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Please enter a valid IBAN (e.g., GB82WEST12345698765432) or ABA number (9 digits)"
                      );
                    },
                  },
                ]}
              >
                <Input
                  disabled={!canEdit}
                  maxLength={34}
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Item>

              <Form.Item
                label="Sort Code"
                name="sortCode"
                rules={[
                  { required: true, message: "Sort Code is required" },
                  {
                    pattern: /^[0-9]{6}$/,
                    message: "Sort Code must be 6 digits",
                  },
                ]}
              >
                <Input disabled={!canEdit} maxLength={6} />
              </Form.Item>

              <Form.Item
                label="Bank Routing Number"
                name="bankRoutingNumber"
                rules={[
                  {
                    required: true,
                    message: "Bank Routing Number is required",
                  },
                  {
                    pattern: /^[0-9]{9}$/,
                    message: "Bank Routing Number must be 9 digits",
                  },
                ]}
              >
                <Input disabled={!canEdit} maxLength={9} />
              </Form.Item>

              <Form.Item
                label="Bank Address"
                name="bankAddress"
                rules={[
                  { required: true, message: "Bank Address is required" },
                  {
                    min: 10,
                    message: "Bank address must be at least 10 characters",
                  },
                  {
                    max: 200,
                    message: "Bank address cannot exceed 200 characters",
                  },
                ]}
              >
                <Input disabled={!canEdit} />
              </Form.Item>
            </>
          )}
        </div>

        {/* Address & Location */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Form.Item
            label="Full Address"
            name="address"
            rules={[
              { required: true, message: "Full Address is required" },
              { min: 10, message: "Address must be at least 10 characters" },
              {
                max: 250,
                message: "Address cannot exceed 250 characters",
              },
            ]}
          >
            <Input disabled={!canEdit} />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Country is required" }]}
          >
            <Select
              disabled={!canEdit}
              value={selectedCountry}
              onChange={handleCountryChange}
              placeholder="Select Country"
            >
              {countryList.map((c) => (
                <Option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "State is required" }]}
          >
            <Select
              disabled={!canEdit}
              value={selectedState}
              onChange={handleStateChange}
              placeholder="Select State"
            >
              {stateList.map((s) => (
                <Option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "City is required" }]}
          >
            <Select
              disabled={!canEdit}
              placeholder="Select City"
            >
              {cityList.map((c, index) => (
                <Option key={index} value={c.name}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <Button
            icon={<ReloadOutlined />}
            htmlType="reset"
            disabled={!canEdit}
          >
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!canEdit}
          >
            Update
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default VendorMasterForm;