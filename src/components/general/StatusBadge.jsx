import { getStatusMeta } from "@/lib/orderStatus";

function StatusBadge({ status }) {
  const meta = getStatusMeta(status);
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-semibold"
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      {meta.label}
    </span>
  );
}

export default StatusBadge;