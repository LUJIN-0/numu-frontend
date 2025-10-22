'use client'

export default function CropInfo() {
  const data = [
    { param: "Temp (Day)", range: "21–27°C" },
    { param: "Temp (Night)", range: "17–20°C" },
    { param: "Humidity", range: "60–70%" },
    { param: "AQI", range: "0–50" },
  ];

  return (
<div>
  <h2 className="font-light text-md mb-2 text-gray-600 truncate">Crop Info</h2>

  {/* Title */}
  <p className="text-sm text-gray-700 mb-4 wrap-break-word max-w-full">
    <span className="font-semibold text-gray-700">Name:</span>{" "}
    <span className="font-medium text-gray-700 wrap-break-word">
      Tomatoes
    </span>
  </p>

  {/* table box */}
  <div className="max-w-[280px] mx-auto rounded-sm overflow-hidden border border-gray-300">
    <table className="w-full text-sm text-center font-light table-fixed">
      {/* header */}
      <thead className="bg-[#efefdc]">
        <tr>
          <th className="py-3 px-4 text-gray-500 font-semibold border-r border-gray-300 wrap-break-word">
            Parameter
          </th>
          <th className="py-3 px-4 text-gray-500 font-semibold wrap-break-word">
            Ideal Range
          </th>
        </tr>
      </thead>

      {/* body */}
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t border-gray-300">
            <td className="py-3 px-4 text-gray-700 border-r border-gray-300 wrap-break-word">
              {row.param}
            </td>
            <td className="py-3 px-4 text-gray-700 wrap-break-word">
              {row.range}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}
