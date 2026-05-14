const SMGToast = (() => {
    let container = null;

    function getContainer() {
        if (!container) {
            container = document.createElement('div');
            container.id = 'smg-toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function show(message, type = 'info', duration = 4000) {
        const c = getContainer();
        const toast = document.createElement('div');
        toast.className = `smg-toast smg-toast-${type}`;

        const icons = { success: '✓', error: '✕', warning: '!', info: 'i' };
        toast.innerHTML = `
            <span class="smg-toast-icon">${icons[type] || 'i'}</span>
            <span class="smg-toast-message">${message}</span>
            <button class="smg-toast-close" onclick="this.parentElement.classList.remove('smg-toast-show'); setTimeout(() => this.parentElement.remove(), 300)">×</button>
        `;

        c.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('smg-toast-show'));

        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('smg-toast-show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    function confirm(message, title = 'Confirmação') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'smg-dialog-overlay';
            overlay.innerHTML = `
                <div class="smg-dialog">
                    <div class="smg-dialog-header">
                        <span class="smg-dialog-icon smg-dialog-icon-warn">!</span>
                        <h3>${title}</h3>
                    </div>
                    <p class="smg-dialog-message">${message}</p>
                    <div class="smg-dialog-actions">
                        <button class="smg-dialog-cancel">Cancelar</button>
                        <button class="smg-dialog-confirm smg-dialog-confirm-danger">Confirmar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            requestAnimationFrame(() => overlay.classList.add('smg-dialog-show'));

            overlay.querySelector('.smg-dialog-confirm').addEventListener('click', () => {
                overlay.remove();
                resolve(true);
            });
            overlay.querySelector('.smg-dialog-cancel').addEventListener('click', () => {
                overlay.remove();
                resolve(false);
            });
        });
    }

    function prompt(message, title = 'Digite', placeholder = '') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'smg-dialog-overlay';
            overlay.innerHTML = `
                <div class="smg-dialog">
                    <div class="smg-dialog-header">
                        <span class="smg-dialog-icon smg-dialog-icon-info">i</span>
                        <h3>${title}</h3>
                    </div>
                    <p class="smg-dialog-message">${message}</p>
                    <input type="text" class="smg-dialog-input" placeholder="${placeholder}">
                    <div class="smg-dialog-actions">
                        <button class="smg-dialog-cancel">Cancelar</button>
                        <button class="smg-dialog-confirm">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            const input = overlay.querySelector('.smg-dialog-input');

            if (placeholder.includes('-')) {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '')
                        .replace(/(\d{5})(\d)/, '$1-$2')
                        .substring(0, 9);
                });
            }

            requestAnimationFrame(() => {
                overlay.classList.add('smg-dialog-show');
                input.focus();
            });

            const close = (value) => { overlay.remove(); resolve(value); };

            overlay.querySelector('.smg-dialog-confirm').addEventListener('click', () => close(input.value));
            overlay.querySelector('.smg-dialog-cancel').addEventListener('click', () => close(null));
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') close(input.value);
                if (e.key === 'Escape') close(null);
            });
        });
    }

    return { show, confirm, prompt };
})();
