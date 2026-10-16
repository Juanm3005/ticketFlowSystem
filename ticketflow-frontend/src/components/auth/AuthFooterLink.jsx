import { Link } from "react-router-dom";
import { AUTH_STYLES } from "./authStyles";

function AuthFooterLink({ variant, text, to, linkText }) {
    return (
        <div className={`flex justify-center gap-[7px] text-[15px] text-muted ${AUTH_STYLES[variant].footer}`}>
            <span>{text}</span>
            <Link to={to} className="text-accent font-semibold no-underline hover:underline">{linkText}</Link>
        </div>
    );
}

export default AuthFooterLink;
