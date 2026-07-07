import React from "react";
import ApiKeyInput from "./ApiKeyInput";
import ModuleSelect from "./ModuleSelect";

export default function ConfigurationCard({
  apiKey,
  onApiKeyChange,
  modules,
  moduleId,
  moduleName,
  onModuleSelect,
  onModuleClear,
  disabled,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 font-mono text-xs font-bold text-blue-700">01</div>
        <div>
          <h3 className="text-[15px] font-bold tracking-tight">Configuration</h3>
          <div className="text-xs text-slate-500">Connect to your Jaz workspace</div>
        </div>
      </div>

      <ApiKeyInput value={apiKey} onChange={onApiKeyChange} disabled={disabled} />

      <ModuleSelect
        modules={modules}
        moduleId={moduleId}
        moduleName={moduleName}
        onSelect={onModuleSelect}
        onClearSelection={onModuleClear}
        disabled={disabled}
      />
    </div>
  );
}
