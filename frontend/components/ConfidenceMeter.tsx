"use client";

interface ConfidenceMeterProps {
  confidence: number;
}

export default function ConfidenceMeter({
  confidence,
}: ConfidenceMeterProps) {
  return (
    <div>

      <div className="flex justify-between mb-2">

        <span className="text-gray-400">
          AI Confidence
        </span>

        <span className="font-bold">
          {confidence}%
        </span>

      </div>

      <div className="w-full h-3 bg-gray-700 rounded-full">

        <div
  className={`h-3 rounded-full transition-all duration-500 ${
    confidence >= 80
      ? "bg-green-500"
      : confidence >= 50
      ? "bg-yellow-500"
      : "bg-red-500"
  }`}
          style={{
            width: `${confidence}%`,
          }}
        />

      </div>

    </div>
  );
}