# Excel to Jaz Migration Tool — Component Structure

```
jaz-migration/
├── App.jsx                     # Composes everything together (state lives here)
├── components/
│   ├── Header.jsx               # Top bar with logo + connection status
│   ├── PageIntro.jsx            # "Step 01–03" heading + description
│   ├── ConfigurationCard.jsx    # Card 01: wraps ApiKeyInput + ModuleSelect
│   ├── ApiKeyInput.jsx          # Password field with show/hide toggle
│   ├── ModuleSelect.jsx         # Searchable module dropdown
│   ├── UploadCard.jsx           # Card 02: drag & drop + browse + file chip
│   ├── FileSummary.jsx          # Stat cards shown after a file is parsed
│   ├── EmptyState.jsx           # Placeholder shown before any file is uploaded
│   ├── StatCard.jsx             # Generic small stat tile, reused everywhere
│   ├── SubmitBar.jsx            # "Start Migration" button + helper text
│   ├── MigrationLoader.jsx      # Fullscreen overlay: spinner, pipeline, progress bar
│   ├── ResultBanner.jsx         # Success / warning / error banner after completion
│   ├── ResultStats.jsx          # 5-stat results grid (total, success, failed, time, rate)
│   ├── ErrorBoard.jsx           # Failed records table: search, sort, paginate, copy, download
│   ├── ToastStack.jsx           # Bottom-right toast notifications
│   └── GlobalKeyframes.jsx      # Shared CSS @keyframes (fadeIn, toastIn, pulseDot)
└── lib/
    ├── api.js                   # apiFetchModules() + apiSubmitMigration() — MOCKED
    ├── utils.js                 # bytesToSize(), nowStr()
    └── useToasts.js             # Toast state hook
```

## Wiring up the real backend

Everything talks to the backend through two functions in `lib/api.js`:

- `apiFetchModules()` → should call your Jaz endpoint and resolve an array of
  `{ id, name }` module objects.
- `apiSubmitMigration({ apiKey, moduleId, file, totalRows }, onProgress)` → should
  upload the file (e.g. as `FormData`) along with the API key and module id, then
  either stream progress or poll a job-status endpoint, calling
  `onProgress(processed, total)` as it goes. It must resolve with:

```js
{
  total: number,
  success: number,
  failed: number,
  timeTakenSec: number,
  failedRecords: [{ ref, reason, status, row }]
}
```

No other file needs to change — `App.jsx` and `ErrorBoard.jsx` only depend on
this shape.

## Dependencies

- `lucide-react` — icons
- `xlsx` (SheetJS) — parsing the uploaded workbook and generating the failed-records download
- Tailwind CSS — only core utility classes are used, no custom config required
