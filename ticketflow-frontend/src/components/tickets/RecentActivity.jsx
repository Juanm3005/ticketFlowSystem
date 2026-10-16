import { SideCard } from "../ui/Card";

function RecentActivity({ entries }) {
    return (
        <SideCard title="Recent Activity">
            <div>
                {entries.map((entry, index) => (
                    <div
                        key={entry.ID}
                        className={`py-3 px-1 ${index < entries.length - 1 ? "border-b border-[#e5e7eb]" : ""}`}
                    >
                        <p className="text-[15px] font-medium mb-1">
                            Ticket #{entry.TICKET_ID}: {entry.OLD_STATE || "N/A"} → {entry.NEW_STATE}
                        </p>
                        <small className="text-[13px] text-[#6b7280]">
                            {entry.CHANGED_BY} — {new Date(entry.CHANGED_AT).toLocaleString()}
                        </small>
                    </div>
                ))}
            </div>
        </SideCard>
    );
}

export default RecentActivity;
