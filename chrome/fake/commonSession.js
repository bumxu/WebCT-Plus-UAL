var newuid = Math.random();

function cookieCheck() {
   // var myCookie = getCookie("uid2");
   // var uidexist = "";
   // if (myCookie != null && myCookie.length >= 1) {
   //     uidexist = myCookie.substring(0, 1);
   // }
   // if (uidexist != "0") {
   //     Set_Cookie("uid2", newuid);
   // } else if (document.cookie.indexOf(newuid) == -1) {
   //     writeError();
   // }
}

function Set_Cookie(name, value) {
    document.cookie = name + "=" + escape(value);
}

function clearCookie() {
    if (document.cookie.indexOf(newuid) > 1) {
        Set_Cookie("uid2", "");
    }
}

function writeError() {
    document.location = "/webct/errors/errorSession.jsp";
}

function getCookie(name) {
    // cookies are separated by semicolons
    var crumbs = document.cookie.split("; ");
    for (var i = 0; i < crumbs.length; i++) {
        // a name/value pair (a crumb) is separated by an equals sign
        var crumb = crumbs[i].split("=");
        if (name == crumb[0]) {
            if (crumb[1]) {
                return unescape(crumb[1]);
            } else {
                return "";
            }
        }
    }
    // a cookie with the requested name does not exist
    return null;
}