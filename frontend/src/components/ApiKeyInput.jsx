
import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const BASE_URL = __BASE_URL__;

export default function ApiKeyInput({ value, onChange, disabled }) {
  const [showKey, setShowKey] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyApiKey = async () => {
    if (!value.trim()) return;

    console.log("value", value)

    try {
      setLoading(true);

      const res = await axios.get( `${BASE_URL}/organization`, {
        params: {
          apiKey: value,
        },
      });


      console.log("organization name", res.data)

      setOrganizationName(res.data.name);
    } catch (err) {
      setOrganizationName("");
      alert("Invalid API Key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-xs font-semibold text-slate-900">
        Jaz API Key
      </label>

      <div className="flex items-center gap-2">
        {/* API Key Input */}
        <div className="relative flex-1">
          <input
            type={showKey ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter Jaz API Key"
            autoComplete="off"
            disabled={disabled}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
          />

          <button
            type="button"
            onClick={() => setShowKey((s) => !s)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Verify Button */}
        <button
          type="button"
          onClick={verifyApiKey}
          disabled={loading || !value.trim() || disabled}
          className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>

      {/* Organization Name */}
      {organizationName && (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xs text-slate-500">Organization</p>
          <p className="text-sm font-semibold text-green-700">
            {organizationName}
          </p>
        </div>
      )}

      <div className="mt-2 text-[11px] text-slate-400">
        Used only for this session, never stored in the browser.
      </div>
    </div>
  );
}