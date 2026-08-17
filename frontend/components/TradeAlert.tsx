type Props = {
  alert: {
    type: "SUCCESS" | "WARNING" | "INFO" | "ERROR";
    title: string;
    message: string;
  } | null;
};

export default function TradeAlert({
  alert,
}: Props) {
  if (!alert) return null;

  const borderColor =
    alert.type === "SUCCESS"
      ? "border-green-500"
      : alert.type === "WARNING"
      ? "border-yellow-500"
      : alert.type === "ERROR"
      ? "border-red-500"
      : "border-cyan-500";

  const textColor =
    alert.type === "SUCCESS"
      ? "text-green-400"
      : alert.type === "WARNING"
      ? "text-yellow-400"
      : alert.type === "ERROR"
      ? "text-red-400"
      : "text-cyan-400";

  return (
    <div
      className={`fixed top-5 right-5 z-50 w-[340px] rounded-xl border ${borderColor} bg-gray-900 px-4 py-3 shadow-xl`}
    >
      <p
        className={`text-sm font-bold ${textColor}`}
      >
        {alert.title}
      </p>

      <p className="text-xs text-gray-300 mt-1">
        {alert.message}
      </p>
    </div>
  );
}