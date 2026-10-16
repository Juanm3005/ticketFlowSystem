import { AUTH_STYLES } from "./authStyles";

// `Icon` es un componente SVG; si no se pasa se usa `iconText` (p. ej. "✉")
function AuthInput({ variant, id, label, Icon, iconText, hint, ...inputProps }) {
    const styles = AUTH_STYLES[variant];
    const iconClass = `absolute left-5 top-1/2 -translate-y-1/2 text-[20px] text-[#8e98aa] pointer-events-none ${styles.icon}`;

    return (
        <div className={`flex flex-col ${styles.field}`}>
            <label htmlFor={id} className="text-[16px] font-semibold text-[#151c2f]">{label}</label>

            <div className="relative w-[85%]">
                {Icon ? <Icon className={iconClass} /> : <span className={iconClass}>{iconText}</span>}

                <input
                    id={id}
                    className={`w-full h-[58px] pr-5 pl-[60px] border border-[#dce1eb] rounded-[10px] outline-none bg-white text-[#182033] text-[16px] placeholder:text-[#9aa3b5] focus:border-[#3155e7] focus:shadow-[0_0_0_4px_rgba(49,85,231,0.1)] ${styles.input}`}
                    {...inputProps}
                />
            </div>

            {hint && <p className="m-0 text-[14px] text-[#7d8799]">{hint}</p>}
        </div>
    );
}

export default AuthInput;
