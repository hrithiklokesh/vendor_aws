import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, CheckBadgeIcon, EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import ProjectRequestCard from '../../components/ProjectRequestCard/ProjectRequestCard';
import { VendorContext } from '../../context/VendorContext';
import ComparisonModal from '../../components/ComparisonModal/ComparisonModal';

// Define API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const LeadsPage = () => {
    // Get the current vendor from context
    const { currentUser } = useContext(VendorContext);
    
    // State for project requests
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Reset activeTab to 'All' as statuses are null, approved, rejected
    const [activeTab, setActiveTab] = useState('All');
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [selectedRequests, setSelectedRequests] = useState([]);
    
    // State for comparison modal
    const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

    // Fetch leads from the API
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                
                // If no user is logged in or both vendor ID and user ID are missing, show error
                if (!currentUser || (!currentUser.vendorId && !currentUser.id)) {
                    setError("You must be logged in to view leads.");
                    setLoading(false);
                    return;
                }
                
                // Fetch leads assigned to this vendor
                // Get vendor ID from either vendorId or id property
                const vendorId = currentUser.vendorId || currentUser.id;
                console.log("Using vendor ID for API request:", vendorId);
                const response = await fetch(`${API_BASE_URL}/api/project-leads/vendor/${vendorId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Map the data to match the expected format
                const formattedData = data.map(lead => ({
                    _id: lead._id || lead.leadId,
                    name: lead.name,
                    clientId: lead.clientId,
                    description: lead.description,
                    duration: lead.duration,
                    budget: lead.budget,
                    status: lead.status === 'new' ? null : lead.status, // Convert 'new' status to null for compatibility
                    boqFileUrl: lead.boqFileUrl || '#',
                    boqFileName: lead.boqFileName || 'No file',
                    quotationFileUrl: lead.quotationFileUrl,
                    quotationFileName: lead.quotationFileName,
                    assignedVendorId: lead.assignedVendorId,
                    sentByPmId: lead.sentByPmId // Include project manager ID
                }));
                
                setRequests(formattedData);
                setError(null);
            } catch (err) {
                console.error("Error fetching leads:", err);
                setError("Failed to load project requests. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchLeads();
    }, [currentUser]);

    // --- Stats Calculation (Based on current state) ---
    const stats = useMemo(() => {
        // If no user is logged in, return zeros
        if (!currentUser) {
            return {
                pending: 0,
                approved: 0,
                rejected: 0
            };
        }
        
        // Filter leads for the current vendor
        // Get vendor ID from either vendorId or id property
        const vendorId = currentUser.vendorId || currentUser.id;
        // Convert both IDs to strings for comparison to avoid type mismatches
        const vendorLeads = requests.filter(lead => 
            String(lead.assignedVendorId) === String(vendorId)
        );
        
        const calculatedStats = {
            pending: vendorLeads.filter(r => r.status === null).length,
            approved: vendorLeads.filter(r => r.status === 'approved').length,
            rejected: vendorLeads.filter(r => r.status === 'rejected').length,
        };
        return calculatedStats;
    }, [requests, currentUser]);

    // --- Handlers (Update in Database and State) ---
    const handleApprove = async (id) => {
        try {
            // Find the lead to be approved
            const leadToApprove = requests.find(req => req._id === id);
            
            if (!leadToApprove) {
                throw new Error("Lead not found");
            }
            
            // Update lead status in the database
            const updateResponse = await fetch(`${API_BASE_URL}/api/project-leads/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'approved' }),
            });

            if (!updateResponse.ok) {
                throw new Error(`HTTP error updating lead! Status: ${updateResponse.status}`);
            }
            
            // Create a new project in the projects collection
            const vendorId = currentUser.vendorId || currentUser.id;
            
            const projectData = {
                name: leadToApprove.name,
                description: leadToApprove.description,
                clientId: leadToApprove.clientId,
                vendorId: vendorId,
                pmId: leadToApprove.sentByPmId, // Include project manager ID
                budget: leadToApprove.budget,
                duration: leadToApprove.duration,
                status: 'active',
                originalLeadId: leadToApprove._id,
                boqFileUrl: leadToApprove.boqFileUrl,
                boqFileName: leadToApprove.boqFileName,
                quotationFileUrl: leadToApprove.quotationFileUrl,
                quotationFileName: leadToApprove.quotationFileName,
                startDate: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
            
            console.log("Creating project with data:", projectData);
            
            const projectResponse = await fetch(`${API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });
            
            if (!projectResponse.ok) {
                console.error("Warning: Lead was approved but project creation failed");
                // We don't throw an error here because the lead approval was successful
            } else {
                const projectResult = await projectResponse.json();
                console.log("Project created successfully:", projectResult);
            }

            // Update local state if API call was successful
            setRequests(prevRequests =>
                prevRequests.map(req =>
                    req._id === id ? { ...req, status: 'approved' } : req
                )
            );
            
            // Show success message
            alert("Lead approved and project created successfully!");
        } catch (error) {
            console.error("Error approving lead:", error);
            alert("Failed to approve the lead. Please try again.");
        }
    };

    const handleReject = async (id) => {
        try {
            // Update in the database
            const response = await fetch(`${API_BASE_URL}/api/project-leads/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'rejected' }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Update local state if API call was successful
            setRequests(prevRequests =>
                prevRequests.map(req =>
                    req._id === id ? { ...req, status: 'rejected' } : req
                )
            );
        } catch (error) {
            console.error("Error rejecting lead:", error);
            alert("Failed to reject the lead. Please try again.");
        }
    };

    // --- Comparison Handlers ---
    const handleSelectRequest = (id) => { setSelectedRequests(prev => prev.includes(id) ? prev.filter(reqId => reqId !== id) : [...prev, id]); };
    const handleClearSelection = () => { setSelectedRequests([]); };
    const toggleCompareMode = () => { setIsCompareMode(!isCompareMode); if (isCompareMode) { setSelectedRequests([]); } };
    
    // Updated compare selection handler to open the modal
    const handleCompareSelection = () => {
        if (selectedRequests.length >= 2) {
            setIsComparisonModalOpen(true);
        } else {
            alert('Please select at least 2 projects to compare');
        }
    };
    
    // Get the data for selected leads
    const selectedLeadsData = useMemo(() => {
        return requests.filter(req => selectedRequests.includes(req._id));
    }, [requests, selectedRequests]);
    
    // Simple algorithm to recommend a lead (can be expanded with more complex logic)
    const recommendedLead = useMemo(() => {
        if (selectedLeadsData.length < 2) return null;
        
        // Example simple algorithm: recommend the lead with the lowest budget
        // You can replace this with more complex logic
        return [...selectedLeadsData].sort((a, b) => {
            const budgetA = parseFloat(a.budget?.replace(/[^0-9.-]+/g, '') || 0);
            const budgetB = parseFloat(b.budget?.replace(/[^0-9.-]+/g, '') || 0);
            return budgetA - budgetB;
        })[0];
    }, [selectedLeadsData]);

    // --- Filter displayed requests (Adjust for statuses) ---
    const filteredRequests = useMemo(() => {
        // If no user is logged in, return empty array
        if (!currentUser) {
            return [];
        }
        
        // Filter leads for the current vendor
        // Get vendor ID from either vendorId or id property
        const vendorId = currentUser.vendorId || currentUser.id;
        // Convert both IDs to strings for comparison to avoid type mismatches
        const vendorLeads = requests.filter(lead => 
            String(lead.assignedVendorId) === String(vendorId)
        );
        
        // Keep minimal logging for troubleshooting
        console.log(`Found ${vendorLeads.length} leads for vendor ID: ${vendorId}`);
        
        switch (activeTab) {
            case 'Pending':
                return vendorLeads.filter(r => r.status === null);
            case 'Approved':
                return vendorLeads.filter(r => r.status === 'approved');
            case 'Rejected':
                return vendorLeads.filter(r => r.status === 'rejected');
            case 'All':
            default:
                return vendorLeads;
        }
    }, [requests, activeTab, currentUser]);

    // --- Tab Counts (Use calculated stats) ---
    const tabCounts = useMemo(() => {
        // If no user is logged in, return zeros
        if (!currentUser) {
            return {
                all: 0,
                pending: 0,
                approved: 0,
                rejected: 0
            };
        }
        
        // Filter leads for the current vendor
        // Get vendor ID from either vendorId or id property
        const vendorId = currentUser.vendorId || currentUser.id;
        // Convert both IDs to strings for comparison to avoid type mismatches
        const vendorLeads = requests.filter(lead => 
            String(lead.assignedVendorId) === String(vendorId)
        );
        
        return {
            all: vendorLeads.length,
            pending: stats.pending,
            approved: stats.approved,
            rejected: stats.rejected,
        };
    }, [requests, stats, currentUser]);

    // --- Tab Class Helpers (Remain the same, adjust keys if needed) ---
     const getTabClassName = (tabName) => {
        return `px-2 sm:px-4 py-2 text-sm font-medium focus:outline-none flex items-center gap-1 sm:gap-1.5 ${activeTab === tabName && !isCompareMode ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'} ${isCompareMode ? 'opacity-50 cursor-not-allowed' : ''}`;
     };
     const getTabCountClassName = (tabName) => {
        return `ml-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tabName && !isCompareMode ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`;
     };

    return (
        <div className="p-4 sm:p-5 space-y-6">
            {/* Back Navigation */}
            <div className="mb-6">
                <Link to="/VendorDashboard/projects" className="flex items-center text-lg font-medium text-gray-700 hover:text-black">
                    <ChevronLeftIcon className="mr-2 h-5 w-5" />
                    Project Requests
                </Link>
            </div>
            
            {/* Welcome Message */}
            {currentUser && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h3 className="text-emerald-800 font-medium mb-2">
                        Welcome, {currentUser.name || currentUser.email || 'Vendor'}
                    </h3>
                    <p className="text-sm text-emerald-700">
                        This page shows all project leads assigned to you. You can view details, approve or reject leads, and track their status.
                    </p>
                </div>
            )}

            {/* Approval Status Card */}
            <div className="bg-white rounded-xl shadow-sm mb-6 p-4 sm:p-6">
                 <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center text-gray-700">
                        <CheckBadgeIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        <h2 className="text-lg font-medium">Approval Status</h2>
                     </div>
                     <button className="text-gray-500 hover:bg-gray-100 rounded-full p-1"><EllipsisHorizontalIcon className="h-6 w-6" /></button>
                 </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200">
                    <div className="px-2 sm:px-4 text-center"><div className="text-sm sm:text-base font-medium mb-1 text-gray-600">Pending</div><div className="text-xl sm:text-3xl font-bold text-gray-800">{stats.pending}</div></div>
                    <div className="px-2 sm:px-4 text-center"><div className="text-sm sm:text-base font-medium mb-1 text-gray-600">Approved</div><div className="text-xl sm:text-3xl font-bold text-gray-800">{stats.approved}</div></div>
                    <div className="px-2 sm:px-4 text-center"><div className="text-sm sm:text-base font-medium mb-1 text-gray-600">Rejected</div><div className="text-xl sm:text-3xl font-bold text-gray-800">{stats.rejected}</div></div>
                    <div className="px-2 sm:px-4 text-center"><div className="text-sm sm:text-base font-medium mb-1 text-gray-600">Total</div><div className="text-xl sm:text-3xl font-bold text-gray-800">{requests.length}</div></div>
                </div>
            </div>

            {/* Comparison Bar */}
            {isCompareMode && (
                <div className="w-full bg-teal-100/50 border-2 border-teal-400 rounded-xl p-4 sm:p-6 mb-6 flex flex-wrap justify-between items-center gap-3 sm:gap-4">
                    <div className="flex-grow">
                        <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                            {selectedRequests.length} Project{selectedRequests.length !== 1 ? 's' : ''} selected
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 opacity-80 mt-1">
                            Select at least 2 projects to compare
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button
                            onClick={handleClearSelection}
                            className="bg-white text-gray-700 text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-md shadow-sm hover:bg-gray-50 border border-gray-300 transition"
                        >
                            Clear selection
                        </button>
                        <button
                            onClick={handleCompareSelection}
                            disabled={selectedRequests.length < 2}
                            className={`bg-emerald-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-md shadow-sm transition ${selectedRequests.length < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'}`}
                        >
                            Compare selection
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Tabs & Compare Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-2">
                <div className="flex space-x-2 sm:space-x-4">
                    <button onClick={() => setActiveTab('All')} disabled={isCompareMode} className={getTabClassName('All')}> All <span className={getTabCountClassName('All')}>{tabCounts.all}</span> </button>
                    <button onClick={() => setActiveTab('Pending')} disabled={isCompareMode} className={getTabClassName('Pending')}> Pending <span className={getTabCountClassName('Pending')}>{tabCounts.pending}</span> </button>
                    <button onClick={() => setActiveTab('Approved')} disabled={isCompareMode} className={getTabClassName('Approved')}> Approved <span className={getTabCountClassName('Approved')}>{tabCounts.approved}</span> </button>
                    <button onClick={() => setActiveTab('Rejected')} disabled={isCompareMode} className={getTabClassName('Rejected')}> Rejected <span className={getTabCountClassName('Rejected')}>{tabCounts.rejected}</span> </button>
                </div>
                <button onClick={toggleCompareMode} className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition flex items-center gap-1 sm:gap-1.5 ${isCompareMode ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}> {isCompareMode ? (<><XMarkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Cancel Compare</>) : ('Compare Leads')} </button>
            </div>

            {/* Project Request Cards */}
            <div className="space-y-4">
                {!currentUser ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-8 rounded-lg text-center">
                        <p>You need to be logged in to view your project leads.</p>
                        <Link 
                            to="/login" 
                            className="mt-4 inline-block px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md transition"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center">
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredRequests.length > 0 ? (
                    filteredRequests.map(project => (
                        <ProjectRequestCard
                            key={project._id}
                            project={project}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            isCompareMode={isCompareMode}
                            isSelected={selectedRequests.includes(project._id)}
                            onSelectRequest={handleSelectRequest}
                        />
                    ))
                ) : (
                    <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
                        <p>No project leads found for the "{activeTab}" filter.</p>
                        <p className="mt-2 text-sm text-gray-500">
                            {activeTab === 'All' 
                                ? "You don't have any project leads assigned to you yet." 
                                : `You don't have any ${activeTab.toLowerCase()} project leads.`}
                        </p>
                        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm text-left">
                            <p className="text-sm font-medium text-gray-700">Debugging Information:</p>
                            <p className="text-xs text-gray-600 mt-1">Your Vendor ID: <span className="font-mono">{currentUser.id}</span></p>
                            <p className="text-xs text-gray-600 mt-1">Total leads loaded: {requests.length}</p>
                            <p className="text-xs text-gray-600 mt-1">Filtered leads for your vendor ID: {filteredRequests.length}</p>
                            <p className="text-xs text-gray-600 mt-1">
                                To create a test lead, go to the <Link to="/pmleads" className="text-blue-500 underline">Project Lead Form</Link> and 
                                use your Vendor ID: <span className="font-mono bg-gray-100 px-1">{currentUser.id}</span> as the "Assigned Vendor ID".
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Comparison Modal */}
            <ComparisonModal
                isOpen={isComparisonModalOpen}
                onClose={() => setIsComparisonModalOpen(false)}
                selectedLeadsData={selectedLeadsData}
                recommendedLead={recommendedLead}
            />
        </div>
    );
};

export default LeadsPage;