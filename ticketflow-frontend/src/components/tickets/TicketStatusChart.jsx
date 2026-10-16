import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { SideCard } from "../ui/Card";

function TicketStatusChart({ open, inProgress, resolved, closed, total }) {
    const ticketStatusData = [
        { name: "Open", value: open || 0, color: "#3B82F6" },
        { name: "In Progress", value: inProgress || 0, color: "#F59E0B" },
        { name: "Resolved", value: resolved || 0, color: "#F97316" },
        { name: "Closed", value: closed || 0, color: "#22C55E" },
    ];

    return (
        <SideCard title="Tickets by Status">
            <div className="flex items-center gap-6">
                <div className="relative w-[200px] h-[200px]">
                    <PieChart width={200} height={200}>
                        <Pie
                            data={ticketStatusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                        >
                            {ticketStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-[24px] font-bold">
                            {total || 0}
                        </div>
                        <div className="text-[12px] text-[#666]">
                            Total
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {ticketStatusData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                            <span
                                className="inline-block w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span>
                                {entry.name}: {entry.value} ({total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </SideCard>
    );
}

export default TicketStatusChart;
