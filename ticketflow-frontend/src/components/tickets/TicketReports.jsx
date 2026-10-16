import { SectionTitle } from "../ui/Card";

function TicketReports({ children }) {
    return (
        <section id="reports">
            <SectionTitle title="Reports" description="System reports and statistics." />

            <div>
                {children}
            </div>
        </section>
    );
}

export default TicketReports;
