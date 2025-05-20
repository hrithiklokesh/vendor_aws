import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
    ArrowLeftIcon, ClockIcon, CurrencyRupeeIcon,
    ArrowUpTrayIcon as UploadIcon,
    DocumentArrowDownIcon as DownloadIcon,
    PaperClipIcon, CheckIcon, XMarkIcon, ArrowPathIcon
} from '@heroicons/react/24/solid';

// Placeholder Button component - replace with your actual Button if you have one
// Or style a regular button with Tailwind
const Button = ({ children, variant, className = '', ...props }) => {
    const baseStyle = "px-4 py-2 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150";
    let variantStyle = "";
    if (variant === "outline") {
        variantStyle = "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500";
        if (props.id === 'reject-button') { variantStyle = "border-red-300 bg-white text-red-600 hover:bg-red-50 focus:ring-red-500"; }
    } else if (props.id === 'upload-button') {
         variantStyle = `bg-gray-600 text-white hover:bg-gray-700 ${props.disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`;
    } else {
        variantStyle = "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500";
        if (props.disabled) { variantStyle += " opacity-50 cursor-not-allowed"; }
    }
    return ( <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}> {children} </button> );
};


const LeadDetailPage = () => {
    const { leadId } = useParams();
    const location = useLocation();
    const leadDetails = location.state?.projectData;

    if (!leadDetails) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6 text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Error: Lead Data Not Found</h2>
                <p className="text-gray-600 mb-4">Could not load lead details. Please go back to the leads list and try again.</p>
                <Link to="/leads" className="text-emerald-600 hover:underline">
                    Go back to Leads
                </Link>
            </div>
        );
    }

    const isPending = leadDetails.status === null;

    const getStatusStyles = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case null: return 'bg-yellow-100 text-yellow-800'; // Pending
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatStatus = (status) => {
        if (status === null) return 'Pending Review';
        return status ? status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 bg-white rounded-lg shadow mb-10">
            {/* Back Navigation */}
            <div className="mb-6">
                <Link to="/VendorDashboard/leads" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Leads
                </Link>
            </div>

            {/* Project Header */}
            <div className="flex flex-wrap justify-between items-start mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{leadDetails?.name || 'Unnamed Lead'}</h1>
                    <div className="mt-1">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                            Client ID: {leadDetails?.clientId || 'N/A'}
                        </span>
                    </div>
                </div>
                <div>
                    <span className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${getStatusStyles(leadDetails?.status)}`}>
                        {formatStatus(leadDetails?.status)}
                    </span>
                </div>
            </div>

            {/* Project Overview */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Project Overview</h2>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                    {leadDetails?.description || 'No description provided.'}
                </p>

                {/* Project Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mt-6">
                    {leadDetails?.duration && (
                        <div className="flex items-start">
                            <ClockIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div><p className="text-xs sm:text-sm text-gray-500">Duration</p><p className="text-sm sm:text-base font-semibold">{leadDetails.duration}</p></div>
                        </div>
                    )}
                    {leadDetails?.budget && (
                        <div className="flex items-start">
                            <CurrencyRupeeIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div><p className="text-xs sm:text-sm text-gray-500">Budget</p><p className="text-sm sm:text-base font-semibold">{leadDetails.budget}</p></div>
                        </div>
                    )}
                    {/* Placeholders */}
                    {/* ... Team Size, Start Date placeholders if needed ... */}
                </div>
            </div>

            {/* Project Documentation (BOQ Link from mock data) */}
            <div className="mb-10">
                 <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">Project Documentation</h2>
                    {leadDetails?.boqFileUrl ? ( // Check if mock data has this field
                        <a href={leadDetails.boqFileUrl} target="_blank" rel="noopener noreferrer" title={leadDetails?.boqFileName || 'Download BOQ'} className="flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                            <DownloadIcon className="mr-1 h-4 w-4" />
                            Download BOQ PDF
                        </a>
                    ) : ( <span className="text-sm text-gray-500 italic">No BOQ document</span> )}
                </div>
                <div className="border rounded-md p-4 bg-gray-50 text-sm text-gray-600">
                    Detailed Bill of Quantities (BOQ) is available in the downloadable PDF document linked above (if provided).
                </div>
            </div>

            {/* Upload/View Quotation (Placeholder - functionality removed) */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Quotation</h2>
                {leadDetails?.quotationFileUrl ? ( // Check mock data
                     <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50 mb-4">
                         <PaperClipIcon className="h-5 w-5 text-purple-600 flex-shrink-0"/>
                         <a href={leadDetails.quotationFileUrl} target="_blank" rel="noopener noreferrer" title={leadDetails?.quotationFileName || 'View Quotation'} className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline truncate">
                            {leadDetails?.quotationFileName || 'View Uploaded Quotation'}
                         </a>
                     </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-not-allowed bg-gray-50">
                        <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Quotation upload not available (Frontend Only)</p>
                         <p className="text-xs text-gray-400">Feature requires backend connection</p>
                    </div>
                )}
            </div>

            {/* Action Buttons (Removed/Disabled for frontend-only view) */}
             <div className="flex flex-wrap justify-end gap-3 sm:gap-4 mt-8">
                <p className="text-sm text-gray-500 italic">Approve/Reject actions require backend connection.</p>
                {/*
                <Button id="reject-button" variant="outline" disabled> Reject </Button>
                <Button disabled> Approve </Button>
                */}
            </div>

        </div>
    );
};

export default LeadDetailPage;