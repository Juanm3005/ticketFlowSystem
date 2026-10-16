import Button from "./Button";

function FilterBar({ searchPlaceholder, searchValue, onSearchChange, selectValue, onSelectChange, options, onClear }) {
    return (
        <div className="flex gap-2 mb-2.5 flex-wrap sm-down:flex-col">
            <div className="h-[31px] min-w-[180px] flex items-center gap-[7px] px-[9px] border border-[#e0e5ee] rounded-md bg-white sm-down:w-full">
                <span className="text-[#8a94a7]">⌕</span>

                <input
                    type="text"
                    className="w-full border-none outline-none text-[10px] text-[#263149] placeholder:text-[#9aa3b4]"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <select
                className="h-[31px] px-2.5 border border-[#e0e5ee] rounded-md bg-white text-[#536078] text-[10px] outline-none sm-down:w-full"
                value={selectValue}
                onChange={(e) => onSelectChange(e.target.value)}
            >
                {options.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>

            <Button variant="filter" onClick={onClear}>
                ↻ Clear Filters
            </Button>
        </div>
    );
}

export default FilterBar;
