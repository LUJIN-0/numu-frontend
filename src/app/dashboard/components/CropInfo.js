export default function CropInfo() {
  const data = [
    { param: "Temp (Day)", range: "21–27°C" },
    { param: "Temp (Night)", range: "17–20°C" },
    { param: "Humidity", range: "60–70%" },
    { param: "AQI", range: "0–50" },
  ];

  return (
<div>
  <h2 className="font-light text-md mb-2 text-gray-600">Crop Info</h2>

  {/* Title */}
  <p className="text-sm text-gray-700 mb-4">
    <span className="font-semibold text-gray-700">Name:</span>{" "}
    <span className="font-medium text-gray-700">Tomatoes</span>
  </p>

  {/* table box */}
  <div className="max-w-[280px] mx-auto rounded-sm overflow-hidden border border-gray-300">
    <table className="w-full text-sm text-center font-light">
      {/* header */}
      <thead className="bg-[#efefdc]">
        <tr>
          <th className="py-3 px-4 text-gray-500 font-semibold border-r border-gray-300">
            Parameter
          </th>
          <th className="py-3 px-4 text-gray-500 font-semibold">Ideal range</th>
        </tr>
      </thead>

      {/* body */}
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t border-gray-300">
            <td className="py-3 px-4 text-gray-700 border-r border-gray-300">
              {row.param}
            </td>
            <td className="py-3 px-4 text-gray-700">{row.range}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}
