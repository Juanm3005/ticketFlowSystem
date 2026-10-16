const base =
    "border-none rounded-[10px] bg-[linear-gradient(135deg,#304be9,#2544d8)] text-white text-[17px] font-semibold cursor-pointer shadow-[0_7px_18px_rgba(48,75,233,0.25)] hover:shadow-[0_10px_25px_rgba(48,75,233,0.32)] hover:-translate-y-px";

const VARIANTS = {
    login: "w-[86%] h-[58px] transition-[translate,box-shadow,background] hover:bg-[linear-gradient(135deg,#2642dc,#1d38c5)] active:translate-y-0 xs-down:h-[52px]",
    register: "w-full h-14 transition-[translate,box-shadow] disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-none",
};

function AuthSubmitButton({ variant, ...props }) {
    return <button type="submit" className={`${base} ${VARIANTS[variant]}`} {...props} />;
}

export default AuthSubmitButton;
