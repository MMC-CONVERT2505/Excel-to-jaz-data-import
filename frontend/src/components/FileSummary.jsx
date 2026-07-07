import React from "react";
import { Check, Clock, FileSpreadsheet, Hash, Rows3 } from "lucide-react";
import StatCard from "./StatCard";
import { bytesToSize } from "../lib/utils";

export default function FileSummary({ file, workbookInfo }) {
  return (
    <div className="mt-7">
      <h3 className="mb-3.5 text-base font-bold">File Summary</h3>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          color="blue"
          icon={FileSpreadsheet}
          label="File Name"
          value={file.name.length > 16 ? file.name.slice(0, 14) + "…" : file.name}
        />
        <StatCard color="slate" icon={Hash} label="File Size" value={bytesToSize(file.size)} />
        <StatCard color="blue" icon={Rows3} label="Total Rows" value={workbookInfo.totalRows.toLocaleString()} />
        <StatCard color="blue" icon={Hash} label="Reference Count" value={workbookInfo.refCount.toLocaleString()} />
        <StatCard color="orange" icon={Clock} label="Upload Time" value={workbookInfo.uploadedAt} />
        <StatCard color="green" icon={Check} label="File Status" value="Ready" />
      </div>
    </div>
  );
}
