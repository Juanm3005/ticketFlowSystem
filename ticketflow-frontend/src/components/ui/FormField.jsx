export const fieldClass =
    "w-full px-3 border border-field rounded-[7px] bg-white text-[#374151] font-inherit text-[12px] outline-none transition-[border-color,box-shadow] placeholder:text-[#a4acba] focus:border-brand focus:shadow-focus";

function FormField({ label, className = "mb-4", children }) {
    return (
        <div className={`flex flex-col gap-[7px] ${className}`}>
            <label className="text-[#374151] text-[12px] font-semibold">{label}</label>
            {children}
        </div>
    );
}

export default FormField;
