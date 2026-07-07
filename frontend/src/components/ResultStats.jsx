import React from "react";
import { CheckCircle2, Gauge, Hash, Timer, XCircle } from "lucide-react";
import StatCard from "./StatCard";

export default function ResultStats({ result }) {
  return (
    <>
      <h3 className="mb-3.5 mt-9 text-base font-bold">Migration Results</h3>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-3">
        <StatCard color="blue" icon={Hash} label="Total Records" value={result?.totalRecords?.toLocaleString()} />
        <StatCard color="green" icon={CheckCircle2} label="Imported" value={result?.successCount?.toLocaleString()} />
        <StatCard color="red" icon={XCircle} label="Failed" value={result?.failedCount?.toLocaleString()} />
        {/* <StatCard color="orange" icon={Timer} label="Time Taken" value={`${result?.timeTakenSec}s`} />
        <StatCard color="slate" icon={Gauge} label="Success Rate" value={`${((result?.success / result?.total) * 100).toFixed(1)}%`} /> */}
      </div>
    </>
  );
}
