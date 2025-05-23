// import React, { useState } from 'react';

// export const ProjectRow = ({ project }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const statusColors = {
//     "Completed": "bg-[#58FF4C4F] text-[#00C110E6]",
//     "InProgress": "bg-[#FFBD4C4F] text-[#FFA725]",
//     "Pending": "bg-[#FF4C4C4F] text-[#F90B0BEB]"
//   };

//   const formatDateForDisplay = (date) => {
//     if (date instanceof Date && !isNaN(date.getTime())) {
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     }
//     return typeof date === 'string' ? date : 'N/A';
//   };

//   return (
//     <>
//       <tr 
//         className={`text-xs sm:text-sm font-medium border-b border-gray-200 cursor-pointer hover:bg-gray-200 rounded-lg ${
//           isExpanded ? 'bg-gray-100' : 'hover:bg-gray-100'
//         }`}
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{project.id}</td>
//         <td className="py-2 px-2 sm:px-4">{project.name}</td>
//         <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{project.clientId}</td>
//         <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{formatDateForDisplay(project.createdAt)}</td>
//         <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{formatDateForDisplay(project.completedAt)}</td>
//         <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
//           <span className={`px-2 sm:px-4 py-1 rounded-xl text-[9px] sm:text-[10px] font-semibold ${statusColors[project.status]}`}>
//             {project.status}
//           </span>
//         </td>
//         <td className="py-2 px-2 sm:px-4">
//           <img 
//             src="https://c.animaapp.com/VmmSqCQF/img/ri-arrow-drop-down-line-4.svg" 
//             alt="More" 
//             className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${isExpanded ? '-rotate-180' : '-rotate-90'}`}
//           />
//         </td>
//       </tr>
//       {/* Accordion Content */}
//       <tr className={`transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
//         <td colSpan="7" className="px-4 py-2 bg-gray-100">
//         <div 
//             className={`overflow-hidden transition-all duration-700 ease-in-out bg-white/50 rounded-lg shadow-xl ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
//           >
//           <div className="p-4 align">
//             <div>
//               {/* <h4 className="font-semibold">Description</h4> */}
//               <p className="text-sm text-gray-500 mb-6">{project.description || 'N/A'}</p>
//             </div>
          
//             <div className="flex flex-wrap justify-between items-end gap-4">
//                 <div className="flex gap-6 text-sm">
//                     <div>
//                         <p className="text-[.7vw] text-gray-500 ">Project Manager</p>
//                         <p className="text-[.8vw] font-medium text-gray-700">{project.manager}</p>
//                     </div>
//                     <div>
//                         <p className="text-[.7vw] text-gray-500 ">Last Updated</p>
//                         <p className="text-[.8vw] font-medium text-gray-700">{project.lastUpdate}</p>
//                     </div>
//                 </div>
//                 <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md transition duration-150 ease-in-out">
//                     Workspace
//                 </button>
//             </div>
//           </div>
//           </div>
//         </td>
//       </tr>
//     </>
//   );
// };















import React, { useState } from 'react';

export const ProjectRow = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusColors = {
    "Completed": "bg-[#58FF4C4F] text-[#00C110E6]",
    "InProgress": "bg-[#FFBD4C4F] text-[#FFA725]",
    "Pending": "bg-[#FF4C4C4F] text-[#F90B0BEB]"
  };

  const formatDateForDisplay = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return typeof date === 'string' ? date : 'N/A';
  };

  return (
    <>
      <tr
        className={`text-xs sm:text-sm font-medium border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
          isExpanded ? 'bg-gray-50' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{project.id}</td>
        <td className="py-2 px-2 sm:px-4">{project.name}</td>
        <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{project.clientId}</td>
        <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{formatDateForDisplay(project.createdAt)}</td>
        <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{formatDateForDisplay(project.completedAt)}</td>
        <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
          <span className={`inline-block px-2 sm:px-4 py-1 rounded-xl text-[9px] sm:text-[10px] font-semibold ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </td>
        <td className="py-2 px-2 sm:px-4 text-right sm:text-left">
          <img
            src="https://c.animaapp.com/VmmSqCQF/img/ri-arrow-drop-down-line-4.svg"
            alt={isExpanded ? "Collapse" : "Expand"}
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 inline-block ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          />
        </td>
      </tr>
      <tr>
        <td colSpan="7" className="p-0">
          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{project.description || 'N/A'}</p>
              </div>
              <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-sm">
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 ">Project Manager</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">{project.manager || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 ">Last Updated</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">{project.lastUpdate || 'N/A'}</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg shadow-md transition duration-150 ease-in-out flex-shrink-0">
                  Workspace
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};