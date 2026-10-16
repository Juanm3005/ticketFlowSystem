import StatCard from "./StatCard";
import { SectionTitle } from "../ui/Card";
import UserIcon from "../icons/UserIcon";

function DashboardOverview({ totalUsers, stats }) {
    return (
        <section id="dashboard">
            <SectionTitle title="Dashboard" description="Overview of your TicketFlow system." />

            <div className="grid grid-cols-5 gap-4 mb-[18px] xl-down:grid-cols-3 md-down:grid-cols-2 sm-down:grid-cols-1">
                <StatCard icon={<UserIcon />} color="blue" label="Total Users" value={totalUsers} />
                <StatCard icon="▣" color="green" label="Total Tickets" value={stats.total} />
                <StatCard icon="□" color="orange" label="Open Tickets" value={stats.open} showNote />
                <StatCard icon="↻" color="cyan" label="In Progress" value={stats.inProgress} showNote />
                <StatCard icon="✓" color="purple" label="Closed Tickets" value={stats.closed} showNote />
            </div>

            <div>
                <span>
                    Dashboard content
                </span>
            </div>
        </section>
    );
}

export default DashboardOverview;
