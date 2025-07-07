import ReactPlayer from 'react-player';
import { Code } from 'lucide-react';

export default function EditorialSection({url}) {

  return (
    <div className="prose max-w-none text-gray-300">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Code className="h-5 w-5 text-blue-400" />
        Editorial
      </h2>
      <p className="text-sm text-gray-400 mb-8">
        {url.length>0 
          ? "# This editorial video explains the thought process and optimized approach to solve the problem."
          : "# The code solves the problem, but the editorial teaches the mind."
        }
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-auto shadow-md flex flex-col justify-between">
        {url.length>0
          ?<div className="flex-1 overflow-hidden">
          <div className={`transition-opacity duration-300 h-full`}>
            <ReactPlayer
              src={url}
              controls
              width="100%"
              height="100%"
              className="rounded-md overflow-hidden"
            />
          </div>
        </div>
        : <p>Video solution will be provided soon ... </p>
        }
      </div>
    </div>
  );
}
