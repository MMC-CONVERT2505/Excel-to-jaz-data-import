import React, { useMemo, useState } from "react";
import { ChevronDown, Copy, Download, Search } from "lucide-react";
import * as XLSX from "xlsx";

const PAGE_SIZE = 8;

export default function ErrorBoard({ failedRecords, onToast }) {
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);


  console.log("failedRecod", failedRecords)


  const filtered = useMemo(() => {

    // let list = failedRecords?.results?.filter(
    //   (r) =>  r?.error?.toLowerCase().includes(query.toLowerCase()) || ""
    // );

    let list = failedRecords?.results?.filter(
      (r) => r?.error?.error?.error_type?.toLowerCase() || r?.error?.toLowerCase()
    );



    // list = [...list]?.sort((a, b) => (sortAsc ? a?.ref?.localeCompare(b?.ref) : b?.ref?.localeCompare(a?.ref)));
    // return list;

    console.log("field data", list)

    list = [...(list || [])].sort((a, b) =>
      sortAsc
        ? (a?.reference || a?.name || a?.internalName || a?.billName || "Upload sheet not valid").localeCompare(b?.reference || b?.name || b?.internalName || b?.billName ||  "Upload sheet not valid")
        : (b?.reference || b?.name || b?.internalName || b?.billName || "Upload sheet not valid").localeCompare(a?.reference || a?.name || a?.internalName || a?.billName ||  "Upload sheet not valid")
    );

    return list;


  }, [failedRecords, query, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function copyError(ref, reason) {
    navigator.clipboard?.writeText(`${ref}\t${reason}`);
    onToast?.("Error copied to clipboard");
  }

  // function downloadFailedExcel() {
  //   const rows = failedRecords?.results?.filter((r) => ({
  //     "Reference Number": r.reference || r.name || r.internalName,
  //     "Error Message": r.error?.error?.error_type?.toLowerCase() ||  r?.error?.toLowerCase(),
  //   }));
  //   console.log("row", rows)
  //   const ws = XLSX.utils.json_to_sheet(rows);
  //   ws["!cols"] = [{ wch: 18 }, { wch: 50 }, { wch: 45 }];
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Failed Records");
  //   XLSX.writeFile(wb, "jaz-migration-failed-records.xlsx");
  //   onToast?.("Downloading failed records workbook");
  // }


  function downloadFailedExcel() {
    const rows = (failedRecords?.results || [])
      .filter(
        (r) =>
          r.error?.error?.error_type ||
          r.error
      )
      .map((r) => ({
        "Reference Number":
          r.reference || r.name || r.internalName,

        "Error Message":
          r.error?.error?.error_type?.toLowerCase() ||
          (typeof r.error === "string"
            ? r.error.toLowerCase()
            : "Unknown Error"),
      }));

    console.log("rows", rows);

    if (rows.length === 0) {
      onToast?.("No failed records found.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 30 }, // Reference Number
      { wch: 60 }, // Error Message
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failed Records");
    XLSX.writeFile(wb, "jaz-migration-failed-records.xlsx");

    onToast?.("Downloading failed records workbook");
  }

  if (!failedRecords?.results?.length) return null;

  return (
    <div className="mt-9">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold">Failed Records</h3>
        <button
          onClick={downloadFailedExcel}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-green-600 to-green-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-700/25 hover:-translate-y-0.5 transition-transform"
        >
          <Download className="h-4 w-4" />
          Download Failed Excel
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3.5 border-b border-slate-200 px-5 py-4">
          <div className="relative max-w-xs flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search reference or error…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/40 py-2 pl-8 pr-3 text-[13px] focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div className="text-xs text-slate-500">
            {filtered.length} of {failedRecords.length} failed records
          </div>
        </div>

        {/* table */}
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th
                  onClick={() => setSortAsc((s) => !s)}
                  className="sticky top-0 z-10 cursor-pointer select-none whitespace-nowrap bg-slate-50 px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500"
                >
                  Reference No
                  <ChevronDown className={`ml-1 inline h-3 w-3 transition-transform ${sortAsc ? "" : "rotate-180"}`} />
                </th>
                <th className="sticky top-0 z-10 bg-slate-50 px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Error Reason
                </th>
                <th className="sticky top-0 z-10 bg-slate-50 px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="sticky top-0 z-10 bg-slate-50 px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    No matching records.
                  </td>
                </tr>
              ) : (
                pageRows.map((r) => (
                  <tr key={r.ref || r.name || r?.internalName || r?.billName} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-[12.5px] font-semibold">{r.reference || r.name || r?.internalName || r?.billName || "Upload sheet not valid"}</td>
                    <td className="max-w-[340px] px-5 py-3 text-slate-500">{r?.error?.error?.error_type || r?.error}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => copyError(r.ref, r.error || r?.error?.error?.error_type)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-[11.5px] font-semibold text-slate-500 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-200 px-5 py-3.5">
          <div className="text-xs text-slate-500">{filtered.length > 0 ? `Page ${currentPage} of ${totalPages}` : ""}</div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 w-8 rounded-md border border-slate-200 text-xs font-semibold text-slate-500 hover:border-blue-600 hover:text-blue-700 disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              if (totalPages > 7 && n !== 1 && n !== totalPages && Math.abs(n - currentPage) > 1) {
                if (n === 2 || n === totalPages - 1)
                  return (
                    <span key={n} className="px-1 text-slate-400">
                      …
                    </span>
                  );
                return null;
              }
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 w-8 rounded-md border text-xs font-mono font-semibold ${n === currentPage
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-700"
                    }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 w-8 rounded-md border border-slate-200 text-xs font-semibold text-slate-500 hover:border-blue-600 hover:text-blue-700 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
