"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-40"
      >
        <ChevronLeft size={16} /> Previous
      </button>

      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </div>

      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-40"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
