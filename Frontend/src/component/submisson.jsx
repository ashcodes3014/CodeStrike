import { useState } from 'react';
import moment from 'moment';
import {
  Clock,
  Languages,
  ScrollText,
  AlertCircle,
  BadgeCheck,
  XCircle,
  TimerReset,
  TerminalSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function Submission({ submisson }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full h-full p-5 text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
        <ScrollText className="w-6 h-6 text-blue-400" />
        My Submissions
      </h2>

      {submisson.length > 0 ? (
        <div className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
          {submisson.map((sub, idx) => (
            <div
              key={sub._id || idx}
              className="bg-[#0f172a] border border-gray-700/60 rounded-2xl shadow-md hover:shadow-blue-700/30 transition duration-300"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center px-5 py-4 cursor-pointer rounded-t-2xl hover:bg-gray-900/40"
                onClick={() => toggleIndex(idx)}
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-white">Submission {idx + 1}</h3>
                  <div className="flex gap-4 text-sm text-gray-400 items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {moment(sub.createdAt).format('MMM Do YYYY, h:mm A')}
                    </div>
                    <div
                      className={`flex items-center gap-1 font-medium ${
                        sub.status?.toLowerCase() === 'accepted' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {sub.status?.toLowerCase() === 'accepted' ? (
                        <>
                          <BadgeCheck className="w-4 h-4" />
                          Accepted
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          {sub.status}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
                    <Languages className="w-4 h-4" />
                    {sub.language}
                  </div>
                  {openIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expandable Body */}
              {openIndex === idx && (
                <div className="px-5 pb-5 pt-3">
                  {/* Code */}
                  <div className="relative">
                    <div className="absolute top-2 right-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300 flex items-center gap-1">
                      <TerminalSquare className="w-3 h-3 text-blue-300" />
                      Code
                    </div>
                    <pre className="whitespace-pre-wrap text-sm bg-[#020617] rounded-lg p-4 overflow-x-auto text-blue-100 font-mono border border-gray-700/70">
{`${sub.code}`}
                    </pre>
                  </div>

                  {/* Runtime */}
                  <div className="mt-4 text-sm text-gray-300 flex items-center gap-2">
                    <TimerReset className="w-4 h-4 text-yellow-400" />
                    Runtime:
                    <span className="ml-1 text-white font-semibold">{sub.runtime || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 text-gray-500 mt-8">
          <AlertCircle className="w-6 h-6 text-yellow-400" />
          No submissions found for this problem.
        </div>
      )}
    </div>
  );
}
