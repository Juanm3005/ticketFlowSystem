import logo from "../../assets/logo.png";
import { AUTH_STYLES } from "./authStyles";

function AuthHero({ variant, description }) {
    const styles = AUTH_STYLES[variant];

    return (
        <section className={`relative w-1/2 h-screen py-[50px] px-[8%] flex flex-col justify-center overflow-hidden bg-auth-hero ${styles.left}`}>
            <div className="absolute top-[70px] left-[8%]">
                <img src={logo} alt="TicketFlow Logo" className={`w-[260px] h-auto ${styles.logo}`} />
            </div>

            <div className={`relative z-[2] ${styles.hero}`}>
                <h1 className="m-0 text-[length:clamp(38px,4vw,58px)] leading-[1.08] font-bold tracking-[-2px] text-ink">
                    Manage tickets.<br />
                    <span className="text-accent">Deliver solutions.</span>
                </h1>
                <p className="mt-[25px] text-[19px] leading-[1.6] text-muted">{description}</p>
            </div>

            <div className="absolute rounded-full bg-[rgba(70,104,235,0.08)] w-[350px] h-[350px] -left-[180px] -top-[100px]"></div>
            <div className="absolute rounded-full bg-[rgba(70,104,235,0.08)] w-[300px] h-[300px] -right-[120px] -bottom-[120px]"></div>
            <div className="absolute right-[60px] top-[42%] w-[70px] h-[70px] bg-auth-dots opacity-70"></div>
        </section>
    );
}

function AuthLayout({ variant, heroDescription, title, subtitle, children }) {
    const styles = AUTH_STYLES[variant];

    return (
        <div className={`w-full h-screen flex overflow-hidden bg-[#f5f7ff] ${styles.page}`}>
            <AuthHero variant={variant} description={heroDescription} />

            <section className={`w-1/2 h-screen flex justify-center items-center overflow-hidden ${styles.right}`}>
                <div className={`w-full rounded-[20px] shadow-[0_15px_45px_rgba(31,51,104,0.10)] border border-white/80 ${styles.card}`}>
                    <div className={styles.header}>
                        <h2 className={`m-0 leading-[1.2] font-bold tracking-[-1px] text-ink ${styles.title}`}>{title}</h2>
                        <p className={`mt-3 mx-0 mb-0 text-[18px] text-muted ${styles.subtitle}`}>{subtitle}</p>
                    </div>

                    {children}
                </div>
            </section>
        </div>
    );
}

export default AuthLayout;
