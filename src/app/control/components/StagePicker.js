"use client";

export default function StagePicker({
  greenhouses,
  greenhouseId,
  onGreenhouseChange,
  crops = [],
  stage,
  onStageChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Greenhouse</span>
        <select
          value={greenhouseId}
          onChange={(e) => onGreenhouseChange(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white"
        >
          {greenhouses.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

       {/* Crop */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Crop</span>
        <select
          value={stage.crop}
          onChange={(e) => onStageChange({ ...stage, crop: e.target.value })}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white text-gray-800"
        >
          {crops.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Stage</span>
        <select
          value={stage.stage}
          onChange={(e) => onStageChange({ ...stage, stage: e.target.value })}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white"
        >
          {["Germination", "Vegetative Growth", "Flowering", "Fruiting", "Maturation"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}
