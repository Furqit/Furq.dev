document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
            e.preventDefault();
        }
    });

    document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    const elements = ['.minecraft', '.stuff'].map(selector => 
        document.querySelector(selector)
    );
    
    elements.forEach(element => {
        element.addEventListener('click', () => {
            element.classList.add('show-alternate');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('show-alternate');
        });
    });

    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    let lastHighlightedElement = null;
    
    const clickables = document.querySelectorAll('.minecraft, .stuff');
    clickables.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('highlight');
            lastHighlightedElement = element;
            updateCursorPosition(element);
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('highlight');
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            lastHighlightedElement = null;
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!lastHighlightedElement) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    function updateCursorPosition(element) {
        const rect = element.getBoundingClientRect();
        cursor.style.width = rect.width + 'px';
        cursor.style.height = rect.height + 'px';
        cursor.style.left = (rect.left + rect.width/2) + 'px';
        cursor.style.top = (rect.top + rect.height/2) + 'px';
    }

    const preloadImages = () => {
        const images = document.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve, reject) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', reject);
                }
            });
        });
        return Promise.all(imagePromises);
    };

    const preloadFonts = () => {
        return document.fonts.ready.then(() => {
            return new Promise((resolve) => {
                if (document.fonts.check('1em "Jersey 10"')) {
                    resolve();
                } else {
                    const testElement = document.createElement('span');
                    testElement.style.fontFamily = 'Jersey 10';
                    testElement.style.visibility = 'hidden';
                    testElement.textContent = 'Test';
                    document.body.appendChild(testElement);
                    
                    document.fonts.onloadingdone = () => {
                        document.body.removeChild(testElement);
                        resolve();
                    };
                }
            });
        });
    };

    Promise.all([preloadImages(), preloadFonts()])
        .then(() => {
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 500);
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
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.item-wrapper')) {
            closeAllMenus();
        }
    });
});