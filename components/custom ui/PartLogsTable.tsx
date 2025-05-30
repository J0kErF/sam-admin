import { useState, useMemo } from "react";

export default function PartLogsTable({ logs }: { logs: any[] }) {
  const [fieldFilter, setFieldFilter] = useState<string>("");

  // כל השדות האפשריים
  const fieldOptions = useMemo(() => {
    const fields = new Set<string>();
    logs.forEach(log => {
      log.updates?.forEach((update: any) => {
        if (update.field) fields.add(update.field);
      });
    });
    return Array.from(fields).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (!fieldFilter) return logs;
    return logs.map(log => {
      const updates = log.updates?.filter((u: any) => u.field === fieldFilter) || [];
      return { ...log, updates };
    }).filter(log => log.updates.length > 0 || log.reason === "כללי");
  }, [logs, fieldFilter]);

  return (
    logs.length > 0 && (
      <div className="bg-white mt-10 p-6 shadow-md rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">היסטוריית שינויים</h3>

          <div className="flex items-center gap-2">
            <label htmlFor="fieldFilter" className="text-sm text-gray-600">
              סינון לפי שדה:
            </label>
            <select
              id="fieldFilter"
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">הצג הכל</option>
              {fieldOptions.map((field, i) => (
                <option key={i} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-right">תאריך</th>
                <th className="px-4 py-2 text-right">שדה</th>
                <th className="px-4 py-2 text-right">ישן</th>
                <th className="px-4 py-2 text-right">חדש</th>
                <th className="px-4 py-2 text-right">סיבה</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => {
                const hasUpdates = Array.isArray(log.updates) && log.updates.length > 0;

                if (!hasUpdates) {
                  return (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("he-IL")}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-500" colSpan={4}>
                        ללא שינוי
                      </td>
                    </tr>
                  );
                }

                return log.updates.map((update: any, j: number) => (
                  <tr key={`${i}-${j}`} className="border-t">
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("he-IL")}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">{update.field}</td>
                    <td
                      className="px-4 py-2 text-right max-w-[200px] overflow-hidden text-ellipsis"
                      title={String(update.oldValue)}
                    >
                      {String(update.oldValue)}
                    </td>
                    <td
                      className="px-4 py-2 text-right max-w-[200px] overflow-hidden text-ellipsis"
                      title={String(update.newValue)}
                    >
                      {String(update.newValue)}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">{log.reason}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
}
