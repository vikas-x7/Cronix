export default function TableWrapper({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="border border-neutral-800 overflow-x-auto my-4">
      <table className="w-full text-[14px]">
        <thead>
          <tr className="bg-neutral-900/50 border-b border-neutral-800">
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left font-medium text-neutral-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-neutral-800/50 last:border-0 hover:bg-neutral-900/30 transition"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-3 text-neutral-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
