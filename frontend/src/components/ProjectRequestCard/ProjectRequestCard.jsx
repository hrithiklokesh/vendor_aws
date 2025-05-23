import React from 'react';
// Import Link from react-router-dom
import { Link } from 'react-router-dom';
// Using Heroicons consistent with the project
import { CheckIcon, XMarkIcon, ClockIcon, DocumentArrowDownIcon, PaperClipIcon } from '@heroicons/react/24/solid'; // Removed file upload icons

// Expect 'project' prop and onApprove/onReject from LeadsPage
const ProjectRequestCard = ({ project, onApprove, onReject, isCompareMode, isSelected, onSelectRequest }) => {

    // Use 'project' prop now
    const isPending = project.status === null; // Check based on mock data status

    const handleCheckboxChange = () => {
        if (onSelectRequest) {
            onSelectRequest(project._id); // Use project._id from mock data
        }
    };

    // Robustness checks
    if (!project) {
        return <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-red-200">Error: Project data missing.</div>;
    }

    return (
        <div className="relative bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200/80">
            {/* Checkbox */}
            {isCompareMode && (
                <div className="absolute top-3 right-3 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
                        aria-label={`Select ${project.name || 'project'} for comparison`}
                    />
                </div>
            )}

            {/* Top Section */}
            <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div className={`${isCompareMode ? 'pr-8' : ''}`}>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">{project.name || 'Unnamed Project'}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {/* Use project.id from mock */}
                        <span className="bg-gray-100 px-2 py-0.5 rounded">Project ID: {project._id || 'N/A'}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">Client ID: {project.clientId || 'N/A'}</span>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap pt-1 ${isCompareMode ? 'pr-8' : ''}`}>
                    <ClockIcon className="h-3.5 w-3.5" />
                    <span>Status:</span>
                    <span className={`font-medium ${
                        project.status === 'approved' ? 'text-green-600' :
                        project.status === 'rejected' ? 'text-red-600' :
                        project.status === null ? 'text-yellow-600' : // Pending (null)
                        'text-gray-500'
                    }`}>
                        {project.status === null ? 'Pending Review' : project.status === 'approved' ? 'Approved' : project.status === 'rejected' ? 'Rejected' : 'Unknown'}
                    </span>
                </div>
            </div>

            {/* Middle Section */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description || 'No description.'}</p>

            {/* File Section Preview (Check if fields exist in mock) */}
            <div className="flex flex-wrap gap-4 mb-4 border-t border-gray-100 pt-3 text-xs">
                {project.boqFileUrl && (
                    <div className="flex items-center gap-1 text-blue-600">
                        <DocumentArrowDownIcon className="h-3.5 w-3.5" /> BOQ Added
                    </div>
                )}
                {project.quotationFileUrl && (
                    <div className="flex items-center gap-1 text-purple-600">
                        <PaperClipIcon className="h-3.5 w-3.5" /> Quotation Added
                    </div>
                )}
                {/* Show message only if NEITHER exists */}
                {!project.boqFileUrl && !project.quotationFileUrl && (
                    <span className="text-gray-400 italic">No documents available.</span>
                )}
            </div>


            {/* Bottom Section */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex-grow">
                    <div className="flex gap-6 text-sm mb-4">
                        <div><p className="text-xs text-gray-500 mb-0.5">Duration</p><p className="font-medium text-gray-700">{project.duration || 'N/A'}</p></div>
                        <div><p className="text-xs text-gray-500 mb-0.5">Budget</p><p className="font-medium text-gray-700">{project.budget || 'N/A'}</p></div>
                    </div>
                     {/* Learn More Link - Passes project state */}
                     <Link
                        to={`/leads/${project._id}`} // Link to detail page
                        state={{ projectData: project }} // <-- Pass project data in state
                        className="bg-gray-100 text-gray-700 text-xs sm:text-sm px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors"
                     >
                        Learn more
                     </Link>
                </div>

                {/* --- Restore Action Buttons --- */}
                <div className="flex space-x-3 mt-4 sm:mt-0 flex-shrink-0">
                    {isPending ? ( // Only show buttons if status is null (pending)
                        <>
                            <button
                                onClick={() => onApprove(project._id)} // Use _id
                                // Disable button in compare mode
                                disabled={isCompareMode}
                                title={isCompareMode ? "Cancel Compare mode to approve" : "Approve this lead"}
                                className={`flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md transition duration-150 ease-in-out ${
                                    isCompareMode ? 'opacity-50 cursor-not-allowed hover:from-emerald-500 hover:to-teal-600' : 'hover:from-emerald-600 hover:to-teal-700'
                                }`}
                            >
                                <CheckIcon className="h-4 w-4" /> Approve
                            </button>
                            <button
                                onClick={() => onReject(project._id)} // Use _id
                                // Disable button in compare mode
                                disabled={isCompareMode}
                                title={isCompareMode ? "Cancel Compare mode to reject" : "Reject this lead"}
                                className={`flex items-center justify-center gap-3 bg-[#b73d1f] text-white px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                                    isCompareMode ? 'opacity-50 cursor-not-allowed hover:bg-[#b73d1f]' : 'hover:bg-[#ff7a5a]/90'
                                }`}
                            >
                                <XMarkIcon className="h-4 w-4" /> Reject
                            </button>
                        </>
                    ) : (
                        // Optionally show status chip again if not pending
                        <span className={`text-sm font-medium px-4 py-2 rounded-md ${project.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           {project.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                    )}
                </div>
                {/* --- End Action Buttons --- */}
            </div>
        </div>
    );
};

export default ProjectRequestCard;