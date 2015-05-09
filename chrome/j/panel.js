if (typeof localStorage.allowapplet == "undefined") {
    localStorage.allowapplet = 'false';
}

if (localStorage.allowapplet == 'false') {
    document.getElementById('but').innerHTML = 'No';
} else {
    document.getElementById('but').innerHTML = 'Sí';
}

document.getElementById('but').addEventListener("click", function() {

    if (localStorage.allowapplet == 'false') {
        localStorage.allowapplet = 'true';
        document.getElementById('but').innerHTML = 'Sí';
    } else {
        localStorage.allowapplet = 'false';
        document.getElementById('but').innerHTML = 'No';
    }

});