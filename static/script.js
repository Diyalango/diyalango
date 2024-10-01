function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('Ad: ' + profile.getName());
    console.log('Email: ' + profile.getEmail());
}

function initGoogleAuth() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: '23693992648-p0drsrthglqjog4tlr5hndamg2adu0k0.apps.googleusercontent.com',
        }).then(function(auth2) {
            const loginButton = document.getElementById('login-button');
            loginButton.onclick = function() {
                auth2.signIn().then(onSignIn);
            };
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initGoogleAuth();
});
