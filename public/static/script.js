document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem("token")) {
        htmx.ajax("GET", "search.html", { target: "#content"});
    } else {
        htmx.ajax("GET", "login.html", { target: "#content"});
    }
});

document.addEventListener('htmx:beforeRequest', function(evt) {
    const token = localStorage.getItem('token');
    if (token) {
      evt.detail.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
});

document.addEventListener('htmx:afterRequest', function(evt) {
    if (evt.detail.requestConfig.url === "/login" && evt.detail.xhr.status === 200) {
        htmx.ajax("GET", "/nav.html", { target: "#main-nav" });
    }
});

globalThis.logout = function() {
    localStorage.removeItem('token');
    htmx.ajax('GET', '/login.html', '#content');
}