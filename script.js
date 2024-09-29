let googleUser = {};

document.addEventListener("DOMContentLoaded", () => {
    const productsLink = document.getElementById("products-link");
    const aboutLink = document.getElementById("about-link");
    const contactLink = document.getElementById("contact-link");
    const homeLink = document.getElementById("home-link");

    const sections = {
        home: document.getElementById("home"),
        products: document.getElementById("products"),
        about: document.getElementById("about"),
        contact: document.getElementById("contact"),
    };

    function hideAllSections() {
        for (const section in sections) {
            sections[section].style.display = "none";
        }
    }

    // Sekme tıklama olayları
    homeLink.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();
        sections.home.style.display = "block"; // Ana sayfayı göster
    });

    productsLink.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();
        sections.products.style.display = "block"; // Ürünler sayfasını göster
    });

    aboutLink.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();
        sections.about.style.display = "block"; // Hakkımızda sayfasını göster
    });

    contactLink.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();
        sections.contact.style.display = "block"; // İletişim sayfasını göster
    });

    // Gmail ile giriş yapma
    document.getElementById("login-button").addEventListener("click", () => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signIn().then(() => {
            const user = authInstance.currentUser.get();
            const profile = user.getBasicProfile();
            alert(`Giriş Yapıldı: ${profile.getName()}`);
        }).catch((error) => {
            console.error("Giriş hatası:", error);
        });
    });
});

// Google API'yi yüklemek için
function onLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client.init({
        clientId: "23693992648-p0drsrthglqjog4tlr5hndamg2adu0k0.apps.googleusercontent.com", // Buraya kendi Client ID'nizi ekleyin
        scope: "profile email"
    }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(authInstance.isSignedIn.get());
    }).catch((error) => {
        console.error("API hatası:", error);
    });
    
}

// Kullanıcı giriş durumunu güncelle
function updateSigninStatus(isSignedIn) {
    // Kullanıcı giriş yaptıysa gerekli işlemleri yapabilirsiniz
}

// Sayfa yüklendiğinde onLoad fonksiyonunu çalıştır
window.onload = onLoad;
