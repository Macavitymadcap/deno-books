document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
      htmx.ajax('GET', '/login.html', '#content');
    }
});

document.addEventListener('htmx:beforeRequest', function(evt) {
    const token = localStorage.getItem('token');
    if (token) {
      evt.detail.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
});

globalThis.logout = function() {
    localStorage.removeItem('token');
    htmx.ajax('GET', '/login.html', '#content');
}