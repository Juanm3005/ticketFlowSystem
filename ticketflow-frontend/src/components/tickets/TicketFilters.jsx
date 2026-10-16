import FilterBar from "../ui/FilterBar";
import { TICKET_STATES, toOptions } from "../../constants/options";

const STATUS_OPTIONS = [{ value: "ALL", label: "All Statuses" }, ...toOptions(TICKET_STATES)];

function TicketFilters({ searchTerm, onSearchChange, statusFilter, onStatusChange, onClear }) {
    return (
        <FilterBar
            searchPlaceholder="Search tickets by subject"
            searchValue={searchTerm}
            onSearchChange={onSearchChange}
            selectValue={statusFilter}
            onSelectChange={onStatusChange}
            options={STATUS_OPTIONS}
            onClear={onClear}
        />
    );
}

export default TicketFilters;
