const optionClass = "text-[#374151] bg-white";

function ActionSelect({ options, placeholder, ...props }) {
    return (
        <select
            className="h-[34px] min-w-[145px] pr-8 pl-[11px] border border-field rounded-[7px] bg-white text-[#4b5567] text-[12px] font-inherit outline-none cursor-pointer transition-[border-color,box-shadow,background-color] appearance-auto hover:border-[#b9c2d2] focus:border-brand focus:shadow-focus"
            {...props}
        >
            {placeholder && <option className={optionClass} value="">{placeholder}</option>}
            {options.map(({ value, label }) => (
                <option key={value} className={optionClass} value={value}>{label}</option>
            ))}
        </select>
    );
}

export default ActionSelect;
