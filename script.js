document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer для анимаций появления (Fade-in)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // 2. Бургер меню для мобильной версии
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');

    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Закрывать меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Scroll Spy (подсветка активного пункта меню)
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current) && current !== '') {
                a.classList.add('active');
            }
        });
    });

    // 4. Фильтрация проектов
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Удаляем active у всех
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category.includes(filter)) {
                        card.style.display = 'flex';
                        // Перезапуск анимации
                        card.classList.remove('visible');
                        setTimeout(() => card.classList.add('visible'), 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 5. Лайтбокс — открытие на весь экран при клике на главный медиа
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <button class="lightbox-close" id="lightboxClose">&times;</button>
        <div class="lightbox-content" id="lightboxContent"></div>
    `;
    document.body.appendChild(overlay);

    const lightboxContent = overlay.querySelector('#lightboxContent');
    const lightboxClose   = overlay.querySelector('#lightboxClose');

    function openLightbox(src, isVideo) {
        lightboxContent.innerHTML = isVideo
            ? `<video controls autoplay style="max-width:92vw;max-height:92vh;">
                   <source src="${src}" type="video/quicktime">
                   <source src="${src}" type="video/mp4">
               </video>`
            : `<img src="${src}" alt="Preview" style="max-width:92vw;max-height:92vh;display:block;">`;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        lightboxContent.innerHTML = '';
    }

    // Навешиваем клик напрямую на контейнер
    function bindLightbox() {
        const mc = document.getElementById('mainMediaContainer');
        if (!mc || mc._lightboxBound) return;
        mc._lightboxBound = true;
        mc.style.cursor = 'zoom-in';
        mc.addEventListener('click', () => {
            const img      = mc.querySelector('img');
            const vidSrc   = mc.querySelector('video source');
            if (vidSrc) {
                openLightbox(vidSrc.getAttribute('src'), true);
            } else if (img) {
                openLightbox(img.getAttribute('src'), false);
            }
        });
    }

    bindLightbox();

    // Следим за изменениями в DOM (на случай если thumbnail-скрипт заменяет innerHTML)
    const mc = document.getElementById('mainMediaContainer');
    if (mc) {
        new MutationObserver(() => {
            mc._lightboxBound = false;
            bindLightbox();
        }).observe(mc, { childList: true, subtree: false });
    }

    // Закрытие
    lightboxClose.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});
