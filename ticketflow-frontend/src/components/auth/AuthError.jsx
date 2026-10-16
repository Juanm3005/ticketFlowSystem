import { AUTH_STYLES } from "./authStyles";

function AuthError({ variant, message }) {
    if (!message) return null;

    return (
        <p className={`mx-0 mb-0 rounded-lg bg-[#fff1f1] border border-[#ffd2d2] text-[#dc2626] text-[14px] ${AUTH_STYLES[variant].error}`}>
            {message}
        </p>
    );
}

export default AuthError;
