document.addEventListener('DOMContentLoaded', () => {
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.error("Lucide icons library not loaded.");
    }
    
    const backToTop = document.getElementById('back-to-top');
    const heroSection = document.getElementById('home');

    const toggleBackToTop = () => {
    
        if (window.scrollY > 500) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    };

    window.addEventListener('scroll', toggleBackToTop);
    
    toggleBackToTop();

    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});