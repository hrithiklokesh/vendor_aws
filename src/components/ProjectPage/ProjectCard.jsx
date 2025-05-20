// import React from 'react';
// import { ClockIcon } from '@heroicons/react/outline'; // Example icon

// const ProjectCard = ({ project }) => {
//     return (
//         <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200/80">
//             {/* Top Section */}
//             <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
//                 <div>
//                     <h2 className="text-lg font-semibold text-gray-800 mb-1">{project.name}</h2>
//                     <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                         <span className="bg-gray-100 px-2 py-0.5 rounded">Project id : {project.id}</span>
//                         <span className="bg-gray-100 px-2 py-0.5 rounded">Client id : {project.clientId}</span>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap pt-1">
//                     <ClockIcon className="h-3.5 w-3.5" />
//                     <span>Last update</span>
//                     <span>{project.lastUpdate}</span>
//                 </div>
//             </div>

//             {/* Middle Section */}
//             <p className="text-sm text-gray-600 mb-4">{project.description}</p>
//             <p className="text-sm mb-4">
//                 <span className="text-gray-500">Project Manager from Caasdi Global:</span>{' '}
//                 <a href="#" className="font-medium text-emerald-600 hover:underline">{project.manager}</a>
//             </p>

//             {/* Bottom Section */}
//             <div className="flex flex-wrap justify-between items-end gap-4">
//                 <div className="flex gap-6 text-sm">
//                     <div>
//                         <p className="text-xs text-gray-500 mb-0.5">Start Date</p>
//                         <p className="font-medium text-gray-700">{project.startDate}</p>
//                     </div>
//                     <div>
//                         <p className="text-xs text-gray-500 mb-0.5">Close Date</p>
//                         <p className="font-medium text-gray-700">{project.closeDate}</p>
//                     </div>
//                 </div>
//                 <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md transition duration-150 ease-in-out">
//                     Workspace
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ProjectCard;




























// import React from 'react';
// // Updated Heroicons v2 import (using 24px outline)
// import { ClockIcon } from '@heroicons/react/24/outline';

// const ProjectCard = ({ project }) => {
//     return (
//         <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200/80">
//             {/* Top Section */}
//             <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
//                 <div>
//                     <h2 className="text-lg font-semibold text-gray-800 mb-1">{project.name}</h2>
//                     <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                         <span className="bg-gray-100 px-2 py-0.5 rounded">Project id : {project.id}</span>
//                         <span className="bg-gray-100 px-2 py-0.5 rounded">Client id : {project.clientId}</span>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap pt-1">
//                     {/* Using ClockIcon (size adjusted via className) */}
//                     <ClockIcon className="h-3.5 w-3.5" />
//                     <span>Last update</span>
//                     <span>{project.lastUpdate}</span>
//                 </div>
//             </div>

//             {/* Middle Section */}
//             <p className="text-sm text-gray-600 mb-4">{project.description}</p>
//             <p className="text-sm mb-4">
//                 <span className="text-gray-500">Project Manager from Caasdi Global:</span>{' '}
//                 <a href="#" className="font-medium text-emerald-600 hover:underline">{project.manager}</a>
//             </p>

//             {/* Bottom Section */}
//             <div className="flex flex-wrap justify-between items-end gap-4">
//                 <div className="flex gap-6 text-sm">
//                     <div>
//                         <p className="text-xs text-gray-500 mb-0.5">Start Date</p>
//                         <p className="font-medium text-gray-700">{project.startDate}</p>
//                     </div>
//                     <div>
//                         <p className="text-xs text-gray-500 mb-0.5">Close Date</p>
//                         <p className="font-medium text-gray-700">{project.closeDate}</p>
//                     </div>
//                 </div>
//                 <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md transition duration-150 ease-in-out">
//                     Workspace
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ProjectCard;












import React from 'react';
// Updated Heroicons v2 import (using 24px outline)
import { ClockIcon } from '@heroicons/react/24/outline';

const ProjectCard = ({ project }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200/80 ">
            {/* Top Section */}
            <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">{project.name}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">Project id : {project.id}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">Client id : {project.clientId}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap pt-1">
                    {/* Using ClockIcon (size adjusted via className) */}
                    <ClockIcon className="h-3.5 w-3.5" />
                    <span>Last update</span>
                    <span>{project.lastUpdate}</span>
                </div>
            </div>

            {/* Middle Section */}
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <p className="text-sm mb-4">
                <span className="text-gray-500">Project Manager from Caasdi Global:</span>{' '}
                <a href="#" className="font-medium text-emerald-600 hover:underline">{project.manager}</a>
            </p>

            {/* Bottom Section */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex gap-6 text-sm">
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">Start Date</p>
                        <p className="font-medium text-gray-700">{project.startDate}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">Close Date</p>
                        <p className="font-medium text-gray-700">{project.closeDate}</p>
                    </div>
                </div>
                <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md transition duration-150 ease-in-out">
                    Workspace
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;