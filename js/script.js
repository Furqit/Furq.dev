document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', e => 
        e.ctrlKey && ['+', '-', '='].includes(e.key) && e.preventDefault()
    );

    document.addEventListener('wheel', e => 
        e.ctrlKey && e.preventDefault()
    , { passive: true });

    const minecraft = document.querySelector('.minecraft');
    const stuff = document.querySelector('.stuff');
    
    function createParticles(element, count = 10) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            const tx = (Math.random() - 0.5) * 100;
            const ty = (Math.random() - 0.5) * 100;
            
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            element.appendChild(particle);
            
            setTimeout(() => particle.remove(), 800);
        }
    }

    let state = 0;
    function cycleText() {
        switch(state) {
            case 0:
                minecraft.classList.add('text-change');
                minecraft.classList.add('show-alternate');
                stuff.classList.add('hidden');
                setTimeout(() => {
                    stuff.classList.remove('show-alternate');
                }, 500);
                createParticles(minecraft);
                break;
            case 1:
                minecraft.classList.add('text-change');
                stuff.classList.add('text-change');
                minecraft.classList.remove('show-alternate');
                stuff.classList.remove('show-alternate');
                stuff.classList.remove('hidden');
                createParticles(minecraft);
                createParticles(stuff);
                break;
            case 2:
                stuff.classList.add('text-change');
                stuff.classList.add('show-alternate');
                stuff.classList.remove('hidden');
                createParticles(stuff);
                break;
        }

        setTimeout(() => {
            minecraft.classList.remove('text-change');
            stuff.classList.remove('text-change');
        }, 500);

        state = (state + 1) % 3;
    }

    setInterval(cycleText, 5000);
    cycleText();

    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    let lastHighlightedElement = null;

    document.addEventListener('mousemove', (e) => {
        if (!lastHighlightedElement) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!lastHighlightedElement && e.touches[0]) {
            cursor.style.left = e.touches[0].clientX + 'px';
            cursor.style.top = e.touches[0].clientY + 'px';
        }
    }, { passive: true });

    function updateCursorPosition(element) {
        const rect = element.getBoundingClientRect();
        cursor.style.width = rect.width + 'px';
        cursor.style.height = rect.height + 'px';
        cursor.style.left = (rect.left + rect.width/2) + 'px';
        cursor.style.top = (rect.top + rect.height/2) + 'px';
    }

    const preloadImages = () => 
        Promise.all(
            Array.from(document.querySelectorAll('img')).map(img => 
                img.complete ? Promise.resolve() : new Promise((resolve, reject) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', reject);
                })
            )
        );

    const preloadFonts = () => 
        document.fonts.ready.then(() => 
            document.fonts.check('1em "Jersey 10"') ? 
            Promise.resolve() : 
            new Promise(resolve => {
                const testElement = document.createElement('span');
                Object.assign(testElement.style, {
                    fontFamily: 'Jersey 10',
                    visibility: 'hidden'
                });
                testElement.textContent = 'Test';
                document.body.appendChild(testElement);
                document.fonts.onloadingdone = () => {
                    document.body.removeChild(testElement);
                    resolve();
                };
            })
        );

    Promise.all([preloadImages(), preloadFonts()])
        .then(() => {
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 5000);
        })
        .catch(error => {
            console.error('Error loading resources:', error);
            document.body.classList.add('loaded');
        });

    const menus = document.querySelectorAll('.popup-menu');
    const menuButtons = [
        document.querySelector('.item-wrapper:has(.projects-menu)'),
        document.querySelector('.cardboard-item')
    ];

    function closeAllMenus() {
        menus.forEach(menu => {
            menu.classList.remove('active');
            const tooltip = menu.closest('.item-wrapper').querySelector('.tooltip');
            tooltip.style.opacity = '';
        });
    }

    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            
            e.preventDefault();
            const menu = button.querySelector('.popup-menu');
            const tooltip = button.querySelector('.tooltip');
            closeAllMenus();
            menu.classList.toggle('active');
            tooltip.style.opacity = menu.classList.contains('active') ? '0' : '';
        });

        button.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const menu = button.querySelector('.popup-menu');
                const tooltip = button.querySelector('.tooltip');
                closeAllMenus();
                menu.classList.toggle('active');
                tooltip.style.opacity = menu.classList.contains('active') ? '0' : '';
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.item-wrapper')) {
            closeAllMenus();
        }
    });
});