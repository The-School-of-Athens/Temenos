const VALID = "valid";
const ERROR = "error";
const LOADING = "loading";
const INFO = "info";
const WARNING = "warning";

const util = require("util");

s_print = (type, msg) => {
    let reset_color = "\x1b[0m";
    let icon = undefined;
    let icon_color = undefined;

    switch (type) {
        case VALID:
            icon_color = "\x1b[32m";
            icon = "\u2713";
            break;
        case ERROR:
            icon_color = "\x1b[31m";
            icon = "\u2717";
            break;
        case LOADING:
            icon_color = "\x1b[36m";
            icon = "\u25CC";
            break;
        case INFO:
            icon_color = "\x1b[35m";
            icon = "\u25BB";
            break; 
        case WARNING:
            icon_color = "\x1b[33m";
            icon = "\u26A0";
            break; 
    }

    let str = util.format("    %s%s %s%s", icon_color, icon, reset_color, msg);

    process.stdout.write(str + "\n");
}