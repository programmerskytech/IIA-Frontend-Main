import { Card, message, Select, Row, Col, Tag, Button, Alert, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { HistoryOutlined } from '@ant-design/icons'
import Heading from '../../../components/DKG_Heading'
import { renderFormFields } from '../../../utils/CommonFunctions'
import CustomForm from '../../../components/DKG_CustomForm'
import ButtonContainer from '../../../components/ButtonContainer'
import { useReactToPrint } from 'react-to-print'
import axios from 'axios'
import CustomModal from '../../../components/CustomModal'
import PurchaseHistoryModal from '../../../components/PurchaseHistoryModal'
import IndentCancellationModal from '../../../components/IndentCancellationModal'
import PrintFormate from '../../../utils/PrintFormate'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

// File upload configuration
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const proprietaryLimitedDeclarationLabel = "The budgetary quote was obtained informing the vendor about:  (i) IIA's Payment Terms - 100% payment within 30 days from acceptance (ii). Applicability of providing performance & warranty security. (iii) Applicability of LD Clause."

const modeOfProcurementOptions = [
    { label: "GEM", value: "GEM" },
    { label: "Brand PAC", value: "Brand PAC" },
    { label: "Proprietary/Single Tender", value: "Proprietary/Single Tender" },
    { label: "Limited Pre Approved Vendor Tender", value: "Limited Pre Approved Vendor Tender" },
    { label: "Open Tender", value: "Open Tender" },
    { label: "Global Tender", value: "Global Tender" }
];

const reasonDropdown = [
    {
        label: "It is in the knowledge of the user department that only a particular firm is the manufacturer of the required goods",
        value: "It is in the knowledge of the user department that only a particular firm is the manufacturer of the required goods",
    },
    {
        label: "In a case of emergency, the required goods are necessarily to be purchased from a particular source",
        value: "In a case of emergency, the required goods are necessarily to be purchased from a particular source",
    },
    {
        label: "For standardization of machinery or spare parts to be compatible to the existing sets of equipment, the required item is to be purchased only from a selected firm",
        value: "For standardization of machinery or spare parts to be compatible to the existing sets of equipment, the required item is to be purchased only from a selected firm",
    },
];

// Job category options
const jobCategoryOptions = [
    { label: "AMC (Annual Maintenance Contract)", value: "AMC" },
    { label: "Rate Contract", value: "Rate Contract" },
    { label: "Repair & Service", value: "Repair And Service" },
    { label: "Internet Service", value: "Internet Service" },
    { label: "Other Service", value: "Other Service" }
];

// Job subcategory options
const jobSubcategoryOptions = [
    { label: "Chemicals", value: "Chemicals" },
    { label: "Computer & Peripherals", value: "Computer & Peripherals" },
    { label: "Electrical", value: "Electrical" },
    { label: "Electronic Items", value: "Electronic Items" },
    { label: "Equipment", value: "Equipment" },
    { label: "Furniture", value: "Furniture" },
    { label: "HARDWARE", value: "HARDWARE" },
    { label: "Miscellaneous", value: "Miscellaneous" },
    { label: "Software", value: "Software" },
    { label: "Stationary", value: "Stationary" },
    { label: "Vehicles", value: "Vehicles" }
];

// Currency options
const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "INR", value: "INR" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" }
];

const Indent1 = () => {
    const navigate = useNavigate();
    const { userName, mobileNumber, email, userId, employeeDepartment } = useSelector(state => state.auth)

    console.log(employeeDepartment);
    const printRef = useRef();

    const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
    const location = useLocation();
    const { indentId } = location.state || {};

    console.log("Request ID:", indentId);

    // Indent Type State (Material or Job)
    const [indentType, setIndentType] = useState("material"); // "material" or "job"
    
    // Material Category Type State (Computer or Non-Computer)
    const [materialCategoryType, setMaterialCategoryType] = useState("computer");

    // Job Codes Master State for Rate Contract dropdown
    const [jobCodesMaster, setJobCodesMaster] = useState([]);

    // Updated handleCancel - Now opens cancellation request modal instead of direct cancel
    const handleCancel = () => {
        if (!formData.indentId) {
            message.warning('No indent selected for cancellation');
            return;
        }
        setCancellationModalOpen(true);
    };

    // Handle successful cancellation request submission
    const handleCancellationSuccess = () => {
        // Reset form after successful request
        setFormData({
            indentorName: userName,
            indentorMobileNo: mobileNumber,
            indentorEmailAddress: email,
            indentorDepartment: '',
            projectName: "",
            consignesLocation: "",
            materialDetails: [{}],
            jobDetails: [{}],
            rateContractJobCodes: []
        });
        setSearchDone(false);
        setIndentIdDropdown([]);
    };

    const [formData, setFormData] = useState({
        indentorName: userName,
        indentorMobileNo: mobileNumber,
        indentorEmailAddress: email,
        indentorDepartment: '', // ✅ CHANGED: Start empty, will be fetched based on name
        projectName: "",
        consignesLocation: "",
        materialDetails: [{}],
        jobDetails: [{}],
        rateContractJobCodes: [],
        // Bug fix fields
        isEditable: true,
        isLockedForTender: false,
        lockedReason: null,
        version: 1,
        parentIndentId: null,
        currentStatus: 'DRAFT',
        currentStage: 'INDENT_CREATION',
        approvalLevel: 0
    })

    const { locationMaster, projectMaster, materialMaster, vendorMaster } = useSelector(state => state.masters)

    const [materialMasterState, setMaterialMasterState] = useState(materialMaster)
    const [jobMasterState, setJobMasterState] = useState([])
    const [uomOptions, setUomOptions] = useState([])

    const [selectedModeOfProcurement, setSelectedModeOfProcurement] = useState("")
    const [indentIdDropdown, setIndentIdDropdown] = useState([]);
    const [searchDone, setSearchDone] = useState(false);

    // ✅ NEW: State for department computer price limit
    const [departmentPriceLimit, setDepartmentPriceLimit] = useState(null);

    const locationDropdown = locationMaster.map((item) => {
        return {
            label: item.locationName,
            value: item.locationCode
        }
    })

    const projectDropdown = projectMaster.map((item) => {
        return {
            label: item.projectNameDescription,
            value: item.projectCode
        }
    })

    const vendorDropdown = vendorMaster.map((item) => {
        return {
            label: item.vendorName,
            value: item.vendorId
        }
    })

    const budgetCodeDropdown = [...new Set(projectMaster.map(p => p.budgetType))].map(bt => ({ label: bt, value: bt }))

    const [modalOpen, setModalOpen] = useState(false);

    // Purchase History Modal State
    const [purchaseHistoryModalOpen, setPurchaseHistoryModalOpen] = useState(false);
    const [selectedMaterialForHistory, setSelectedMaterialForHistory] = useState({
        materialCode: '',
        materialDescription: ''
    });

    // Cancellation Request Modal State
    const [cancellationModalOpen, setCancellationModalOpen] = useState(false);

    // Handle opening purchase history modal
    const handleOpenPurchaseHistory = (materialCode, materialDescription) => {
        if (!materialCode) {
            message.warning('Please select a material first');
            return;
        }
        setSelectedMaterialForHistory({
            materialCode,
            materialDescription
        });
        setPurchaseHistoryModalOpen(true);
    };

    const printComponentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printComponentRef.current,
        documentTitle: `Indent - ${formData?.indentId || "Draft"}`
    });

    const handleSearchIndentIds = async () => {
        const { searchType, searchValue } = formData;

        if (!searchValue || !searchType) {
            message.warning("Please select search type and enter value.");
            return;
        }

        try {
            const { data } = await axios.get(`/api/indents/search`, {
                params: {
                    type: searchType,
                    value: searchValue
                }
            });

            const indentList = data?.responseData || [];

            const dropdownOptions = indentList.map((item) => ({
                label: item.indentId,
                value: item.indentId
            }));

            setIndentIdDropdown(dropdownOptions);

            if (dropdownOptions.length === 0) {
                message.warning("No indent IDs found.");
            } else {
                message.success(`${dropdownOptions.length} Please Select Indent Id in Indent Id Drop Down.`);
            }
        } catch (error) {
            message.error("Error fetching indent IDs.");
        }
    };

    // ✅ NEW: Fetch department for a given employee name
    const fetchDepartmentByName = async (employeeName) => {
        if (!employeeName || employeeName.trim() === '') {
            return '';
        }

        try {
            const { data } = await axios.get('/api/employee-department-master/department/by-name', {
                params: { employeeName: employeeName.trim() }
            });

            return data?.responseData?.departmentName || '';
        } catch (error) {
            console.error('Error fetching department:', error);
            return '';
        }
    };

    // ✅ NEW: Fetch department computer price limit
    const fetchDepartmentPriceLimit = async (departmentName) => {
        if (!departmentName || departmentName.trim() === '') {
            setDepartmentPriceLimit(null);
            return null;
        }

        try {
            const { data } = await axios.get(`/api/department-computer-price-limit/department/${departmentName.trim()}`);
            const limit = data?.responseData?.priceLimit || null;
            setDepartmentPriceLimit(limit);
            return limit;
        } catch (error) {
            // No price limit configured for this department
            console.log('No price limit found for department:', departmentName);
            setDepartmentPriceLimit(null);
            return null;
        }
    };

    // ✅ NEW: Validate unit price against department limit for computer items
    const validateComputerItemPrice = (materialSubCategory, unitPrice, departmentName) => {
        // Only validate for Computer & Peripherals category
        if (materialSubCategory !== "Computer & Peripherals") {
            return true;
        }

        // If no department, cannot validate
        if (!departmentName) {
            message.warning('Department not found. Please ensure indentor name is correct.');
            return false;
        }

        // If no price limit configured, allow
        if (!departmentPriceLimit) {
            return true;
        }

        // Validate unit price against limit
        const price = Number(unitPrice);
        const limit = Number(departmentPriceLimit);

        if (price > limit) {
            message.error(`Unit price ₹${price.toLocaleString()} exceeds the department limit of ₹${limit.toLocaleString()} for Computer & Peripherals category.`);
            return false;
        }

        return true;
    };

    // Auto-fetch department based on indentor name
    const handleIndentorNameChange = async (indentorName) => {
        if (!indentorName || indentorName.trim() === '') {
            // Clear department if name is empty
            setFormData({
                ...formData,
                indentorName: indentorName,
                indentorDepartment: ''
            });
            setDepartmentPriceLimit(null);
            return;
        }

        const department = await fetchDepartmentByName(indentorName);

        setFormData({
            ...formData,
            indentorName: indentorName,
            indentorDepartment: department
        });

        if (!department) {
            message.warning('No department found for this employee name');
            setDepartmentPriceLimit(null);
        } else {
            // ✅ Fetch price limit for the department
            await fetchDepartmentPriceLimit(department);
        }
    };

    // Fetch Job Master Data (for both Job Indent and Rate Contract Job Codes dropdown)
    const fetchJobMaster = async () => {
        try {
            const { data } = await axios.get("/api/job-master");
            if (data?.responseData) {
                setJobMasterState(data.responseData);
                setJobCodesMaster(data.responseData);
            }
        } catch (error) {
            console.error("Error fetching job master:", error);
            message.error("Failed to load job master data");
        }
    };

    // Fetch UOM Master Data
    const fetchUomMaster = async () => {
        try {
            const { data } = await axios.get("/api/uom-master");
            if (data?.responseData) {
                const uomList = data.responseData.map(uom => ({
                    label: uom.uomName,
                    value: uom.uomCode
                }));
                setUomOptions(uomList);
            }
        } catch (error) {
            console.error("Error fetching UOM master:", error);
        }
    };

    // ✅ NEW: Auto-fetch department when component loads with userName
    useEffect(() => {
        const initializeDepartment = async () => {
            if (userName) {
                const department = await fetchDepartmentByName(userName);
                setFormData(prev => ({
                    ...prev,
                    indentorDepartment: department
                }));

                // ✅ Fetch price limit for the department
                if (department) {
                    await fetchDepartmentPriceLimit(department);
                }
            }
        };

        initializeDepartment();
        fetchJobMaster();
        fetchUomMaster();
    }, [userName]);

    // Filter materials based on category type (Computer / Non-Computer)
    const getFilteredMaterialMaster = () => {
        if (!materialMasterState || materialMasterState.length === 0) {
            return [];
        }

        if (materialCategoryType === "computer") {
            return materialMasterState.filter(item => 
                item.subCategory === "Computer & Peripherals" || 
                item.category === "Computer & Peripherals"
            );
        } else if (materialCategoryType === "non-computer") {
            return materialMasterState.filter(item => 
                item.subCategory !== "Computer & Peripherals" && 
                item.category !== "Computer & Peripherals"
            );
        }
        
        return materialMasterState;
    };

    // Get job codes dropdown options for Rate Contract (multiple selection)
    const getJobCodesDropdownOptions = () => {
        return jobCodesMaster.map(job => ({
            label: `${job.jobCode} - ${job.jobDescription}`,
            value: job.jobCode
        }));
    };

    // Get job dropdown options for Job Indent
    const getJobDropdownOptions = () => {
        return jobMasterState.map(job => ({
            label: `${job.jobCode} - ${job.jobDescription}`,
            value: job.jobCode
        }));
    };

    // Material Details Input Fields
    const getMaterialInputFields = () => {
        const filteredMaterials = getFilteredMaterialMaster();

        return {
            heading: "Material Details",
            addButton: true,
            name: "materialDetails",
            children: [
                {
                    name: "materialCode",
                    label: "Material Code",
                    type: "select",
                    required: true,
                    options: filteredMaterials.map((item) => {
                        return {
                            label: item.materialCode + " - " + item.description,
                            value: item.materialCode
                        }
                    })
                },
                {
                    name: "purchaseHistoryButton",
                    label: " ",
                    type: "custom",
                    render: (index) => {
                        const materialCode = formData.materialDetails?.[index]?.materialCode;
                        const materialDescription = formData.materialDetails?.[index]?.materialDescription;
                        return (
                            <div style={{ marginTop: '30px' }}>
                                <Button
                                    type="default"
                                    icon={<HistoryOutlined />}
                                    onClick={() => handleOpenPurchaseHistory(materialCode, materialDescription)}
                                    disabled={!materialCode}
                                    size="middle"
                                    style={{ width: '100%' }}
                                >
                                    Purchase History
                                </Button>
                            </div>
                        );
                    }
                },
                {
                    name: "materialDescription",
                    label: "Material Description",
                    type: "text",
                    span: 2,
                    required: true,
                    disabled: true
                },
                {
                    name: "materialCategory",
                    label: "Material Category",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "materialSubCategory",
                    label: "Material Sub Category",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "uom",
                    label: "UOM",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "quantity",
                    label: "Quantity",
                    type: "text",
                    required: true
                },
                {
                    name: "unitPrice",
                    label: (
                        <span>
                            Unit Price inclusive of all taxes, duties and free door delivery
                            {departmentPriceLimit && materialCategoryType === "computer" && (
                                <span style={{
                                    color: '#1890ff',
                                    fontSize: '12px',
                                    fontWeight: 'normal',
                                    marginLeft: '10px'
                                }}>
                                    (Dept. Limit: ₹{Number(departmentPriceLimit).toLocaleString()})
                                </span>
                            )}
                        </span>
                    ),
                    type: "text",
                    required: true
                },
                {
                    name: "totalPrice",
                    label: "Total Price",
                    type: "text",
                    disabled: true,
                    dependencies: ["quantity", "unitPrice"],
                    value: (formData, index) => {
                        const quantity = Number(formData.materialDetails[index]?.quantity) || 0;
                        const unitPrice = Number(formData.materialDetails[index]?.unitPrice) || 0;
                        return (quantity * unitPrice).toFixed(2);
                    }
                },
                {
                    name: "currency",
                    label: "Currency",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "modeOfProcurement",
                    label: "Mode of Procurement",
                    type: "select",
                    span: 2,
                    options: modeOfProcurementOptions,
                    required: true
                },
                {
                    name: "budgetCode",
                    label: "Budget Code",
                    type: "select",
                    options: budgetCodeDropdown,
                },
                {
                    name: "vendorNames",
                    label: "Vendor Names",
                    type: selectedModeOfProcurement === "Proprietary/Single Tender" ? "select" : "multiselect",
                    options: vendorDropdown,
                    span: 2,
                    disabled: selectedModeOfProcurement !== "Proprietary/Single Tender" && selectedModeOfProcurement !== "Limited Pre Approved Vendor Tender",
                }
            ]
        };
    };

    // Job Details Input Fields (for Job Indent type)
    const getJobInputFields = () => {
        return {
            heading: "Job/Service Details",
            addButton: true,
            name: "jobDetails",
            children: [
                {
                    name: "jobCode",
                    label: "Job Code",
                    type: "select",
                    required: true,
                    options: getJobDropdownOptions()
                },
                {
                    name: "jobDescription",
                    label: "Job Description",
                    type: "text",
                    span: 2,
                    required: true,
                    disabled: true
                },
                {
                    name: "category",
                    label: "Job Category",
                    type: "select",
                    required: true,
                    options: jobCategoryOptions,
                    disabled: true
                },
                {
                    name: "subCategory",
                    label: "Job Subcategory",
                    type: "select",
                    required: true,
                    options: jobSubcategoryOptions,
                    disabled: true
                },
                {
                    name: "uom",
                    label: "UOM",
                    type: "select",
                    required: true,
                    options: uomOptions,
                    disabled: true
                },
                {
                    name: "quantity",
                    label: "Quantity",
                    type: "text",
                    required: true
                },
                {
                    name: "estimatedPrice",
                    label: "Estimated Price",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "totalPrice",
                    label: "Total Price",
                    type: "text",
                    disabled: true,
                    dependencies: ["quantity", "estimatedPrice"],
                    value: (formData, index) => {
                        const quantity = Number(formData.jobDetails[index]?.quantity) || 0;
                        const estimatedPrice = Number(formData.jobDetails[index]?.estimatedPrice) || 0;
                        return (quantity * estimatedPrice).toFixed(2);
                    }
                },
                {
                    name: "currency",
                    label: "Currency",
                    type: "select",
                    required: true,
                    options: currencyOptions,
                    disabled: true
                },
                {
                    name: "briefDescription",
                    label: "Brief Description of Job",
                    type: "text",
                    span: 2,
                    disabled: true
                }
            ]
        };
    };

    // Build input fields dynamically based on indent type
    const inputFields = [
        {
            heading: "Search Indent",
            colCnt: 2,
            fieldList: [
                {
                    name: "searchValue",
                    label: "Search Value",
                    type: "indentSearch",
                    onSearch: () => handleSearchIndentIds(),
                },
            ]
        },
        {
            heading: "Status",
            colCnt: 4,
            fieldList: [
                ...(searchDone ? [
                    {
                        name: "currentStatus",
                        label: "Current Status",
                        type: "text",
                        disabled: true
                    },
                    {
                        name: "currentStage",
                        label: "Current Stage",
                        type: "text",
                        disabled: true
                    },
                    {
                        name: "version",
                        label: "Version",
                        type: "text",
                        disabled: true
                    },
                    {
                        name: "approvalLevel",
                        label: "Approval Level",
                        type: "text",
                        disabled: true
                    }
                ] : [])
            ]
        },
        {
            heading: "Indentor Details",
            colCnt: 4,
            fieldList: [
                {
                    name: "indentId",
                    label: "Indent ID",
                    type: "select",
                    options: indentIdDropdown,
                },
                {
                    name: "indentorName",
                    label: "Indentor Name",
                    type: "text",
                    required: true
                },
                {
                    name: "indentorMobileNo",
                    label: "Mobile No",
                    type: "text",
                    required: true
                },
                {
                    name: "indentorEmailAddress",
                    label: "Email",
                    type: "text",
                    required: true
                },
                {
                    name: "indentorDepartment",
                    label: "Department",
                    type: "text",
                    required: true,
                    disabled: true, // Auto-filled, read-only
                }
            ]
        },
        {
            heading: "Project and Location Details",
            fieldList: [
                {
                    name: "projectName",
                    label: "Project Name",
                    type: "select",
                    options: projectDropdown,
                },
                {
                    name: "consignesLocation",
                    label: "Consignee Location",
                    type: "select",
                    options: locationDropdown,
                    required: true
                }
            ]
        },
        // Conditionally add Material or Job Details based on indent type
        indentType === "material" ? getMaterialInputFields() : getJobInputFields(),
        {
            heading: (
                <span>
                    Document Uploads 
                    <span style={{ color: '#ff4d4f', fontSize: '12px', fontWeight: 'normal', marginLeft: '10px' }}>
                        (Maximum upload limit: {MAX_FILE_SIZE_MB}MB per file)
                    </span>
                </span>
            ),
            colCnt: 2,
            fieldList: [
                {
                    name: "uploadingPriorApprovalsFileName",
                    label: "Upload Prior Approvals if any",
                    type: "multiImage",
                },
                {
                    name: "technicalSpecificationsFileName",
                    label: "Upload Technical Specifications/ Budgetary Quote",
                    type: "multiImage",
                },
                {
                    name: "draftEOIOrRFPFileName",
                    label: "Draft EOI/RFP",
                    type: "multiImage",
                },
                {
                    name: "quarter",
                    label: "Quarter",
                    type: "select",
                    options: [
                        { label: "Q1", value: "Q1" },
                        { label: "Q2", value: "Q2" },
                        { label: "Q3", value: "Q3" },
                        { label: "Q4", value: "Q4" }
                    ]
                },
                {
                    name: "purpose",
                    label: "Purpose",
                    type: "text",
                    span: 2,
                    required: true,
                },
                ...(selectedModeOfProcurement === "Proprietary/Single Tender" ? [
                    {
                        name: "reason",
                        label: "Reason",
                        type: "select",
                        span: 2,
                        options: reasonDropdown,
                        required: true
                    },
                    {
                        name: "proprietaryJustification",
                        label: "Proprietary Justification",
                        type: "text",
                        span: 2,
                        required: true
                    }
                ] : []),
                ...((selectedModeOfProcurement === "Proprietary/Single Tender" || selectedModeOfProcurement === "Limited Pre Approved Vendor Tender") ? [
                    {
                        name: "proprietaryAndLimitedDeclaration",
                        label: proprietaryLimitedDeclarationLabel,
                        type: "checkbox",
                        span: 2,
                        required: true
                    }
                ] : []),
                {
                    name: "buyBack",
                    type: "checkbox",
                    label: "Buy Back",
                },
                ...(formData.buyBack ? [{
                    name: "uploadBuyBackFileNames",
                    label: "Upload Buy Back File",
                    type: "multiImage",
                    required: true
                }, {
                    name: "modelNumber",
                    label: "Model Number",
                    type: "text",
                    required: true,
                }, {
                    name: "serialNumber",
                    label: "Serial Number",
                    type: "text",
                    required: true,
                }, {
                    name: "dateOfPurchase",
                    label: "Date Of Purchase",
                    type: "date",
                    required: true,
                }, {
                    name: "buyBackAmount",
                    label: "Buy Back Amount",
                    type: "text",
                    required: true,
                }
                ] : []),
                {
                    name: "brandPac",
                    type: "checkbox",
                    label: "Is a Brand PAC?",
                    required: selectedModeOfProcurement === "Brand PAC"
                },
                ...(formData.brandPac ? [{
                    name: "uploadPACOrBrandPACFileName",
                    label: "Upload PAC",
                    type: "multiImage",
                    required: true,
                }, {
                    name: "brandAndModel",
                    label: "Brand and Model",
                    type: "text",
                    required: true,
                },
                {
                    name: "justification",
                    label: "It is known that as per the Rule 144 of GFR, where in the Fundamental principles of public buying states that the description of the subject matter of procurement to the extent practicable should not indicate a requirement for a particular trade mark, trade name or brand. However in the subject requirement, it is required to prefer the above mentioned brand for the following reasons:",
                    type: "text",
                    placeholder: "Declaration",
                    required: true,
                    span: 2
                }
                ] : []),
                {
                    name: "isPreBidMeetingRequired",
                    type: "checkbox",
                    label: "Pre-Bid Meeting Required?",
                },
                ...(formData.isPreBidMeetingRequired ? [{
                    name: "preBidMeetingDate",
                    label: "Tentative Meeting Date",
                    type: "date",
                    required: true,
                }, {
                    name: "preBidMeetingVenue",
                    label: "Tentative Meeting Location",
                    type: "select",
                    required: true,
                    options: locationDropdown,
                }
                ] : []),
                {
                    name: "isItARateContractIndent",
                    type: "checkbox",
                    label: "Is it a Rate Contract Indent",
                },
                // Rate Contract fields
                ...(formData.isItARateContractIndent ? [
                    {
                        name: "estimatedRate",
                        label: "Estimated Rate",
                        type: "text",
                        required: true,
                    },
                    {
                        name: "periodOfContract",
                        label: "Contract Period (Months)",
                        type: "text",
                        required: true,
                    },
                    {
                        name: "rateContractJobCodes",
                        label: "Job Codes",
                        type: "multiselect",
                        required: true,
                        options: getJobCodesDropdownOptions(),
                        span: 2,
                        placeholder: "Select one or more job codes",
                    }
                ] : []),
            ].filter(Boolean),
        },
    ]

    useEffect(() => {
        if (selectedModeOfProcurement === "Brand PAC") {
            setFormData({
                ...formData,
                brandPac: true
            })
        }
        else {
            setFormData({
                ...formData,
                brandPac: false
            })
        }
    }, [selectedModeOfProcurement])

    const replaceMaterial = (prevMaterial, newMaterial) => {
        const prevMtlrDtl = materialMaster.find((item) => item.materialCode === prevMaterial.materialCode)
        setMaterialMasterState(prev => {
            let newMaterialMaster = [...prev]
            newMaterialMaster = newMaterialMaster.filter((item) => item.materialCode !== newMaterial.materialCode)
            newMaterialMaster.push(prevMtlrDtl)
            return newMaterialMaster
        })
    }

    // Handle Job Selection for Job Indent
    const handleJobSelect = (job) => {
        const filteredJobs = jobMasterState.filter(item => item.category === job.category && item.jobCode !== job.jobCode);
        setJobMasterState(prev => {
            const jobToAdd = jobMasterState.find(item => item.jobCode === job.jobCode);
            if (jobToAdd) {
                return filteredJobs;
            }
            return prev;
        });
    };

    const handleChange = (fieldName, value) => {
        console.log("Fieldname, value: ", fieldName, value)
        
        if (fieldName === "indentId") {
            setFormData({
                ...formData,
                indentId: value
            });
            handleSearch(value);
            return;
        }

        // Handle indentorName with auto-fetch
        if (fieldName === "indentorName") {
            handleIndentorNameChange(value);
            return;
        }

        // Handle rateContractJobCodes
        if (fieldName === "rateContractJobCodes") {
            setFormData({
                ...formData,
                rateContractJobCodes: value
            });
            return;
        }

        if (typeof fieldName === "string") {
            setFormData({
                ...formData,
                [fieldName]: value
            })
            return
        }

        const name = fieldName[2]
        const index = fieldName[1]
        const section = fieldName[0]

        // Handle Material Details
        if (section === "materialDetails") {
            if (name === "materialCode") {
                const prevMaterialCode = formData.materialDetails[index]?.materialCode || null;
                const material = materialMasterState.find((item) => item.materialCode === value)
                if (prevMaterialCode) {
                    replaceMaterial(formData.materialDetails[index], material)
                }
                else {
                    handleMaterialSelect(material)
                }
                const { materialDetails } = formData;
                materialDetails[index].materialCode = value
                materialDetails[index].materialDescription = material.description
                materialDetails[index].materialCategory = material.category
                materialDetails[index].materialSubCategory = material.subCategory
                materialDetails[index].uom = material.uom
                materialDetails[index].quantity = ""
                materialDetails[index].unitPrice = material.unitPrice
                materialDetails[index].currency = material.currency

                setFormData({
                    ...formData,
                    materialDetails: materialDetails
                })
            }
            else if (name === "modeOfProcurement") {
                const { materialDetails } = formData;
                const updatedMaterialDetails = materialDetails.map(item => ({ ...item, modeOfProcurement: value, vendorNames: [] }))

                setSelectedModeOfProcurement(value)

                setFormData({
                    ...formData,
                    materialDetails: updatedMaterialDetails
                })
            }
            else if (name === "quantity" || name === "unitPrice") {
                const { materialDetails } = formData;
                materialDetails[index][name] = value

                // ✅ Validate unit price for computer items
                if (name === "unitPrice") {
                    const materialSubCategory = materialDetails[index].materialSubCategory;
                    const isValid = validateComputerItemPrice(
                        materialSubCategory,
                        value,
                        formData.indentorDepartment
                    );

                    if (!isValid) {
                        // Price validation failed, still update the field but user is warned
                        materialDetails[index][name] = value;
                    }
                }

                materialDetails[index].totalPrice = (Number(materialDetails[index].quantity || 0) * Number(materialDetails[index].unitPrice || 0)).toFixed(2)
                setFormData({
                    ...formData,
                    materialDetails: materialDetails
                })
            }
            else {
                const { materialDetails } = formData;

                if (name === "vendorNames" && formData.materialDetails[index]?.modeOfProcurement === "Proprietary/Single Tender") {
                    materialDetails[index][name] = []
                    materialDetails[index][name].push(value)
                } else {
                    materialDetails[index][name] = value
                }

                setFormData({
                    ...formData,
                    materialDetails: materialDetails
                })
            }
        }
        // Handle Job Details
        else if (section === "jobDetails") {
            if (name === "jobCode") {
                const job = jobMasterState.find((item) => item.jobCode === value)
                if (job) {
                    const { jobDetails } = formData;
                    jobDetails[index].jobCode = value
                    jobDetails[index].jobDescription = job.jobDescription
                    jobDetails[index].category = job.category
                    jobDetails[index].subCategory = job.subCategory
                    jobDetails[index].uom = job.uom
                    jobDetails[index].quantity = ""
                    jobDetails[index].estimatedPrice = job.estimatedPriceWithCcy
                    jobDetails[index].currency = job.currency
                    jobDetails[index].briefDescription = job.briefDescription

                    setFormData({
                        ...formData,
                        jobDetails: jobDetails
                    })
                }
            }
            else if (name === "quantity" || name === "estimatedPrice") {
                const { jobDetails } = formData;
                jobDetails[index][name] = value
                jobDetails[index].totalPrice = (Number(jobDetails[index].quantity || 0) * Number(jobDetails[index].estimatedPrice || 0)).toFixed(2)
                setFormData({
                    ...formData,
                    jobDetails: jobDetails
                })
            }
            else {
                const { jobDetails } = formData;
                jobDetails[index][name] = value
                setFormData({
                    ...formData,
                    jobDetails: jobDetails
                })
            }
        }
    }

    const handleMaterialSelect = (material) => {
        const { materialCode, category } = material
        const newMaterialMasterState = materialMasterState.filter((item) => {
            return item.category === category && item.materialCode !== materialCode
        })
        setMaterialMasterState(newMaterialMasterState)
    }

    const handleMaterialDeselect = (index) => {
        const { materialDetails } = formData;
        const material = materialDetails[index]

        if (material.materialCode) {
            if (formData.materialDetails.length === 1) {
                setMaterialMasterState(materialMaster)
            }
            else {
                const newMaterialDtl = materialMaster.find((item) => item.materialCode === material.materialCode)
                const newMaterialMasterState = [...materialMasterState, newMaterialDtl]
                setMaterialMasterState(newMaterialMasterState)
            }
        }
    }

    // Handle Job Deselect
    const handleJobDeselect = (index) => {
        const { jobDetails } = formData;
        const job = jobDetails[index]

        if (job.jobCode) {
            fetchJobMaster();
        }
    }

    // ✅ UPDATED: Fetch department when loading existing indent
    const handleSearch = async (value) => {
        try {
            const { data } = await axios.get(`/api/indents/indentData/${value}`)
            const responseData = data.responseData || {};

            // Ensure rateContractJobCodes is always an array
            if (!responseData.rateContractJobCodes) {
                responseData.rateContractJobCodes = [];
            }

            // ✅ NEW: Fetch department based on indentor name from loaded indent
            if (responseData.indentorName) {
                const department = await fetchDepartmentByName(responseData.indentorName);
                responseData.indentorDepartment = department;

                // ✅ Fetch price limit for the department
                if (department) {
                    await fetchDepartmentPriceLimit(department);
                }
            }

            setFormData(responseData);
            setSearchDone(true);
        }
        catch (error) {
            message.error("Error while fetching indent data.")
        }
    }

    useEffect(() => {
        if (indentId) {
            handleSearch(indentId);
        }
    }, [indentId]);

    const onFinish = async () => {
        // Bug Fix 1 & 2: Check if indent can be edited
        if (formData?.indentId) {
            if (formData.isLockedForTender) {
                message.error({
                    content: formData.lockedReason || 'Indent is locked as tender has been created',
                    duration: 5
                });
                return;
            }

            if (!formData.isEditable) {
                message.error({
                    content: 'Indent is not editable. It can only be edited when sent back by an approver for revision.',
                    duration: 5
                });
                return;
            }
        }

        if (indentType === "material") {
            if (selectedModeOfProcurement === "Limited Pre Approved Vendor Tender") {
                let minFourVendorSelected = true;

                formData.materialDetails.forEach((item) => {
                    if (item.vendorNames.length < 4) {
                        message.error("At least 4 vendors should be selected for Limited Pre Approved Vendor Tender.");
                        minFourVendorSelected = false;
                        return;
                    }
                });

                if (!minFourVendorSelected) return;
            }

            let proprietaryInvalid = false;

            formData.materialDetails.forEach((item, index) => {
                if (item.modeOfProcurement === "Proprietary/Single Tender") {
                    if (!item.vendorNames || item.vendorNames.length !== 1) {
                        message.error(`Material ${index + 1}: Please select one vendor for Proprietary/Single Tender.`);
                        proprietaryInvalid = true;
                        return;
                    }
                }
            });

            if (proprietaryInvalid) return;

            // ✅ NEW: Validate computer item prices before submission
            let priceLimitExceeded = false;
            formData.materialDetails.forEach((item) => {
                if (item.materialSubCategory === "Computer & Peripherals") {
                    const isValid = validateComputerItemPrice(
                        item.materialSubCategory,
                        item.unitPrice,
                        formData.indentorDepartment
                    );

                    if (!isValid) {
                        priceLimitExceeded = true;
                    }
                }
            });

            if (priceLimitExceeded) {
                message.error("Cannot submit indent. One or more computer items exceed the department price limit.");
                return;
            }
        }

        // Validate rate contract job codes
        if (formData.isItARateContractIndent) {
            if (!formData.rateContractJobCodes || formData.rateContractJobCodes.length === 0) {
                message.error("Please select at least one job code for Rate Contract Indent.");
                return;
            }
        }

        const payload = {
            ...formData,
            indentType: indentType,
            materialCategoryType: indentType === "material" ? materialCategoryType : null,
            fileType: "Indent",
            uploadBuyBackFileNames: formData.buyBack ? formData.uploadBuyBackFileNames : null,
            uploadPACOrBrandPACFileName: formData.brandPac ? formData.uploadPACOrBrandPACFileName : null,
            brandAndModel: formData.brandPac ? formData.brandAndModel : null,
            preBidMeetingDate: formData.isPreBidMeetingRequired ? formData.preBidMeetingDate : null,
            preBidMeetingVenue: formData.isPreBidMeetingRequired ? formData.preBidMeetingVenue : null,
            estimatedRate: formData.isItARateContractIndent ? formData.estimatedRate : null,
            periodOfContract: formData.isItARateContractIndent ? formData.periodOfContract : null,
            rateContractJobCodes: formData.isItARateContractIndent ? formData.rateContractJobCodes : null,
            justification: formData.brandPac ? formData.justification : null,
            reason: selectedModeOfProcurement === "Proprietary/Single Tender" ? formData.reason : null,
            proprietaryJustification: selectedModeOfProcurement === "Proprietary/Single Tender" ? formData.proprietaryJustification : null,
            createdBy: userId,
            employeeDepartment: formData.indentorDepartment, // Use the auto-fetched department
            materialDetails: indentType === "material" ? formData.materialDetails : null,
            jobDetails: indentType === "job" ? formData.jobDetails : null,
        };

        // Remove old field that's no longer used
        delete payload.singleAndMultipleJob;

        try {
            setSubmitBtnLoading(true);
            let response;

            if (formData?.indentId) {
                response = await axios.put(`/api/indents/${formData.indentId}`, payload);
                message.success("Indent updated successfully");
                navigate("/queue");
            } else {
                response = await axios.post("/api/indents", payload);
            }

            setFormData({
                ...formData,
                indentId: response?.data?.responseData?.indentId
            });

            setModalOpen(true);
        } catch (error) {
            // Handle file size error specifically
            if (error.response?.status === 413 ||
                error.response?.data?.responseStatus?.errorType === "FILE_TOO_LARGE") {
                message.error(`File size too large. Maximum ${MAX_FILE_SIZE_MB}MB per file allowed.`);
            }
            // Bug Fix: Handle edit validation errors from backend
            else if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.responseStatus?.message || error.response?.data?.message;

                if (errorMessage?.includes("locked for editing")) {
                    message.error({
                        content: "Cannot edit: Tender already created for this indent",
                        duration: 5
                    });
                } else if (errorMessage?.includes("not editable")) {
                    message.error({
                        content: "Cannot edit: Indent is in approval workflow",
                        duration: 5
                    });
                } else {
                    message.error(errorMessage || "Validation error occurred");
                }
            }
            else {
                message.error(error.response?.data?.responseStatus?.message || error.message || "Error submitting indent.");
            }
        } finally {
            setSubmitBtnLoading(false);
        }
    };

    const addMaterialFunc = () => {
        if (indentType === "material") {
            setFormData({
                ...formData,
                materialDetails: [...formData.materialDetails, {}]
            })
        } else {
            setFormData({
                ...formData,
                jobDetails: [...formData.jobDetails, {}]
            })
        }
    }

    const additionalFunc = {
        "addMaterialSection": addMaterialFunc,
        "materialDeselect": (index) => indentType === "material" ? handleMaterialDeselect(index) : handleJobDeselect(index)
    }

    // Handle Indent Type Change
    const handleIndentTypeChange = (value) => {
        setIndentType(value);
        
        if (value === "job") {
            setMaterialCategoryType("all");
        }
        
        setFormData({
            ...formData,
            materialDetails: value === "material" ? [{}] : formData.materialDetails,
            jobDetails: value === "job" ? [{}] : formData.jobDetails
        });
    };

    // Handle Material Category Type Change
    const handleMaterialCategoryTypeChange = (value) => {
        setMaterialCategoryType(value);
        
        setFormData({
            ...formData,
            materialDetails: [{}]
        });
        
        setMaterialMasterState(materialMaster);
    };

    return (
        <Card className='a4-container' ref={printRef}>
            <Heading title="Indent Creation" />

            {/* Bug Fix: Show lock status and version information */}
            {formData?.indentId && (
                <Space direction="vertical" style={{ width: '100%', marginTop: '16px', marginBottom: '16px' }}>
                    {formData.isLockedForTender && (
                        <Alert
                            message="Indent Locked"
                            description={formData.lockedReason || "This indent is locked for editing as tender has been created"}
                            type="warning"
                            showIcon
                            closable={false}
                        />
                    )}
                    {!formData.isEditable && !formData.isLockedForTender && (
                        <Alert
                            message="Indent Not Editable"
                            description="This indent is currently in approval workflow. It can only be edited when sent back for revision."
                            type="info"
                            showIcon
                            closable={false}
                        />
                    )}
                    {formData.version > 1 && (
                        <Alert
                            message={`Version ${formData.version}`}
                            description={`This indent has been revised ${formData.version - 1} time(s)`}
                            type="info"
                            showIcon
                            closable={false}
                        />
                    )}
                </Space>
            )}

            {/* Indent Type and Category Selection */}
            <Row gutter={16} style={{ marginBottom: '20px', marginTop: '16px' }}>
                <Col span={6}>
                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ 
                            fontSize: '14px', 
                            color: 'rgba(0, 0, 0, 0.85)',
                            fontWeight: 'normal'
                        }}>
                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                            Indent Type
                        </label>
                    </div>
                    <Select
                        value={indentType}
                        onChange={handleIndentTypeChange}
                        style={{ width: '100%' }}
                        placeholder="Select Indent Type"
                    >
                        <Option value="material">Material Indent</Option>
                        <Option value="job">Job/Service Indent</Option>
                    </Select>
                </Col>
                
                {indentType === "material" && (
                    <Col span={6}>
                        <div style={{ marginBottom: '8px' }}>
                            <label style={{ 
                                fontSize: '14px', 
                                color: 'rgba(0, 0, 0, 0.85)',
                                fontWeight: 'normal'
                            }}>
                                Material Category
                            </label>
                        </div>
                        <Select
                            value={materialCategoryType}
                            onChange={handleMaterialCategoryTypeChange}
                            style={{ width: '100%' }}
                            placeholder="Select Category"
                        >
                            <Option value="computer">Computer</Option>
                            <Option value="non-computer">Non-Computer</Option>
                        </Select>
                    </Col>
                )}
            </Row>

            <CustomForm formData={formData} onFinish={onFinish}>
                {renderFormFields(inputFields, handleChange, formData, "", null, setFormData, handleSearch, additionalFunc)}
                <ButtonContainer
                    onFinish={onFinish}
                    formData={formData}
                    draftDataName="indentDraft"
                    submitBtnLoading={submitBtnLoading}
                    submitBtnEnabled
                    printBtnEnabled
                    draftBtnEnabled
                    handlePrint={handlePrint}
                    showCancel={searchDone}
                    onCancel={handleCancel}
                    cancelButtonText="Request Cancellation"
                />
            </CustomForm>
            <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Indent" processNo={formData?.indentId} />
            <PurchaseHistoryModal
                visible={purchaseHistoryModalOpen}
                onClose={() => setPurchaseHistoryModalOpen(false)}
                materialCode={selectedMaterialForHistory.materialCode}
                materialDescription={selectedMaterialForHistory.materialDescription}
            />
            <IndentCancellationModal
                visible={cancellationModalOpen}
                onClose={() => setCancellationModalOpen(false)}
                indentId={formData.indentId}
                requestedBy={userId}
                requestedByName={userName}
                onSuccess={handleCancellationSuccess}
            />
            <div style={{ display: "none" }}>
                <PrintFormate ref={printComponentRef} data={formData} />
            </div>
        </Card>
    )
}

export default Indent1