/*
 * Login y Register comparten la misma estructura pero con pequeñas
 * diferencias de medidas y breakpoints; aquí se centralizan por variante.
 */
export const AUTH_STYLES = {
    login: {
        page: "md-down:overflow-y-auto",
        left: "md-down:hidden",
        logo: "object-contain",
        hero: "mt-20",
        right: "p-[30px] md-down:w-full md-down:min-h-screen md-down:p-[25px] xs-down:p-[15px]",
        card: "max-w-[620px] py-10 px-[55px] bg-white/96 md-down:max-w-[500px] md-down:py-10 md-down:px-[30px] xs-down:py-[30px] xs-down:px-[22px] xs-down:rounded-[15px]",
        header: "mb-10",
        title: "text-[38px] xs-down:text-[30px]",
        subtitle: "xs-down:text-[16px]",
        field: "gap-2.5",
        input: "transition-[border-color,box-shadow,background] xs-down:h-[52px]",
        icon: "z-[2]",
        error: "-mt-2 py-3 px-[15px]",
        footer: "mt-[30px]",
    },
    register: {
        page: "",
        left: "lg-down:hidden",
        logo: "",
        hero: "mt-[70px]",
        right: "p-[25px] lg-down:w-full sm-down:p-[15px] sm-down:overflow-y-auto",
        card: "max-w-[740px] py-[38px] px-[60px] bg-white/97 lg-down:max-w-[600px] sm-down:py-[30px] sm-down:px-[22px] sm-down:rounded-[15px]",
        header: "mb-8",
        title: "text-[36px] sm-down:text-[30px]",
        subtitle: "sm-down:text-[16px]",
        field: "gap-[9px]",
        input: "transition-[border-color,box-shadow]",
        icon: "",
        error: "-mt-[5px] py-2.5 px-3.5",
        footer: "mt-[22px]",
    },
};
