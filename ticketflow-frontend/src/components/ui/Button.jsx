const VARIANTS = {
    primary:
        "h-[34px] px-[15px] border-none rounded-md bg-[#304be9] text-white text-[11px] cursor-pointer hover:bg-[#253ed1]",
    create:
        "h-9 px-4 rounded-[7px] font-inherit text-[12px] font-semibold cursor-pointer transition-all border-none bg-brand text-white hover:bg-brand-hover hover:shadow-brand",
    cancel:
        "h-9 px-4 rounded-[7px] font-inherit text-[12px] font-semibold cursor-pointer transition-all border border-field bg-white text-[#596273] hover:bg-[#f5f6f8]",
    execute:
        "h-[34px] px-3.5 border-none rounded-[7px] bg-brand text-white text-[12px] font-semibold font-inherit cursor-pointer transition-[background-color,scale,box-shadow] enabled:hover:bg-brand-hover enabled:hover:shadow-[0_3px_8px_rgba(88,101,242,0.20)] enabled:active:scale-[0.97] disabled:bg-[#d9deea] disabled:text-[#9aa3b5] disabled:cursor-not-allowed disabled:shadow-none",
    filter:
        "h-[31px] px-2.5 border border-[#e0e5ee] rounded-md bg-white text-[#536078] text-[10px] outline-none cursor-pointer hover:bg-[#f7f8fb] sm-down:w-full",
    createTicket:
        "w-full h-[35px] rounded-[7px] font-inherit text-[12px] font-semibold cursor-pointer transition-all border-none bg-brand text-white hover:bg-brand-hover hover:shadow-brand",
    deleteSelected:
        "w-full h-[35px] rounded-[7px] font-inherit text-[12px] font-semibold cursor-pointer transition-all border border-[#f0c7c7] bg-[#fff5f5] text-[#d95353] hover:bg-[#ffe8e8] hover:border-[#e7aaaa]",
};

function Button({ variant = "primary", className = "", ...props }) {
    return <button className={`${VARIANTS[variant]} ${className}`} {...props} />;
}

export default Button;
