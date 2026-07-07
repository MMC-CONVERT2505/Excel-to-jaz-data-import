import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import Header from "./components/Header";
import PageIntro from "./components/PageIntro";
import ConfigurationCard from "./components/ConfigurationCard";
import UploadCard from "./components/UploadCard";
import FileSummary from "./components/FileSummary";
import EmptyState from "./components/EmptyState";
import SubmitBar from "./components/SubmitBar";
import MigrationLoader from "./components/MigrationLoader";
import ResultBanner from "./components/ResultBanner";
import ResultStats from "./components/ResultStats";
import ErrorBoard from "./components/ErrorBoard";
import ToastStack from "./components/ToastStack";
import GlobalKeyframes from "./components/GlobalKeyframes";

import { apiFetchModules, apiSubmitMigration } from "./lib/api";
import { useToasts } from "./lib/useToasts";
import { nowStr } from "./lib/utils";


const API_ROUTES = {
  charofaccount: "/charofaccount",
  supplire: "/supplire",
  customer: "/customer",
  item: "/item",
  cashIn: "/cashIn",
  cashout: "/cashout",
  bill: "/bill",
  invoice: "/invoice",
  "invoice-payment": "/invoice-payment",
  "customer-credit-note": "/customer-credit-note",
  "supplier-credit-note": "/supplire-credit-note",
  "bank-transfer": "/banktransefer",
  "bill-payment": "/bill-payment",
  journal: "/journal",
  tag: "/tag",
  "tax-profile": "/taxProfile",
};

export default function App() {
  const { toasts, push: toast } = useToasts();

  // config
  const [apiKey, setApiKey] = useState("");

  // modules
  const [modules, setModules] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const [moduleName, setModuleName] = useState("");

  // file
  const [file, setFile] = useState(null);
  const [workbookInfo, setWorkbookInfo] = useState(null);

  // migration
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0, pct: 0 });
  const [result, setResult] = useState(null);

  useEffect(() => {
    apiFetchModules().then(setModules);
  }, []);

  const ready = apiKey.trim().length > 0 && moduleId && file && workbookInfo;

  /* ---------------- file handling ---------------- */
  function handleFile(f) {
    if (!f) return;
    const okExt = /\.(xlsx|xls)$/i.test(f.name);
    if (!okExt) {
      toast("Only .xlsx and .xls files are supported", "error");
      return;
    }
    setFile(f);
    setWorkbookInfo(null);
    toast("Reading workbook…");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const totalRows = rows.length;
        const firstKey = rows.length ? Object.keys(rows[0])[0] : null;
        const refCount = firstKey ? rows.filter((r) => String(r[firstKey]).trim() !== "").length : totalRows;
        setWorkbookInfo({ totalRows, refCount, rows, uploadedAt: nowStr() });
        toast("Workbook parsed successfully");
      } catch (err) {
        toast("Could not read this file — is it a valid Excel workbook?", "error");
      }
    };
    reader.readAsArrayBuffer(f);
  }

  function removeFile() {
    setFile(null);
    setWorkbookInfo(null);
  }

  /* ---------------- migration submit ---------------- */
  async function startMigration() {
    if (!ready) return;
    setSubmitting(true);
    setResult(null);
    const total = workbookInfo.totalRows;
    setProgress({ processed: 0, total, pct: 0 });

    const endpoint = API_ROUTES[moduleId];


    const res = await apiSubmitMigration({ apiKey, endpoint, file, totalRows: total }, (processed, t) => {
      const pct = Math.min(100, Math.round((processed / t) * 100));
      setProgress({ processed, total: t, pct });
    });

    console.log("res", res.results)

    setSubmitting(false);
    setResult(res);

    toast(
      res.results[0].failedCount === 0 ? "Migration completed — all records imported" : `Migration completed with ${res.failed} failed record(s)`,
      res.results[0].failedCount > 0 ? "error" : "ok"
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 text-slate-900">
      <GlobalKeyframes />
      <Header />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-9">
        <PageIntro />

        <fieldset disabled={submitting} className="contents">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ConfigurationCard
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              modules={modules}
              moduleId={moduleId}
              moduleName={moduleName}
              onModuleSelect={(m) => {
                setModuleId(m.id);
                setModuleName(m.name);
              }}
              onModuleClear={() => {
                setModuleId(null);
                setModuleName("");
              }}
              disabled={submitting}
            />

            <UploadCard file={file} onFileSelected={handleFile} onRemoveFile={removeFile} disabled={submitting} />
          </div>

          {workbookInfo ? <FileSummary file={file} workbookInfo={workbookInfo} /> : <EmptyState />}

          <SubmitBar
            ready={ready}
            submitting={submitting}
            totalRows={workbookInfo?.totalRows || 0}
            moduleName={moduleName}
            onStart={startMigration}
          />
        </fieldset>

        {result && (
          <div className="mt-12">
            <ResultBanner result={result} />
            <ResultStats result={result} />
            <ErrorBoard failedRecords={result} onToast={toast} />
          </div>
        )}
      </main>

      {submitting && <MigrationLoader progress={progress} />}

      <ToastStack toasts={toasts} />
    </div>
  );
}