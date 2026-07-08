/**
 * ContactForm
 * Formulario de contacto funcional con validación y dos modos de envío:
 *  - Si SITE.contactEndpoint está definido → POST JSON.
 *  - Si no → compone el mensaje y abre WhatsApp (fallback), sin fallar en silencio.
 */
import { SITE, WHATSAPP_DIGITS } from '../config.js';

export class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;
        this.status = document.getElementById('form-status');
        this.submitBtn = document.getElementById('contact-submit');
        this.form.addEventListener('submit', (e) => this.onSubmit(e));
    }

    setStatus(msg, type) {
        if (!this.status) return;
        this.status.textContent = msg;
        this.status.style.color =
            type === 'error' ? 'var(--color-primary-dark)'
            : type === 'ok' ? 'var(--color-accent)'
            : 'var(--color-text-muted)';
    }

    validate(data) {
        if (!data.nombre.trim()) return { field: 'nombre', msg: 'Escribe tu nombre.' };
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return { field: 'email', msg: 'Correo no válido.' };
        if (data.mensaje.trim().length < 10) return { field: 'mensaje', msg: 'Cuéntanos un poco más (mín. 10 caracteres).' };
        return null;
    }

    async onSubmit(e) {
        e.preventDefault();
        const data = {
            nombre: this.form.nombre.value,
            email: this.form.email.value,
            mensaje: this.form.mensaje.value,
        };

        const error = this.validate(data);
        if (error) {
            this.setStatus(error.msg, 'error');
            this.form[error.field]?.focus();
            return;
        }

        this.submitBtn.disabled = true;

        // Modo 1: endpoint real
        if (SITE.contactEndpoint) {
            this.setStatus('Enviando…', 'info');
            try {
                const res = await fetch(SITE.contactEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                this.setStatus('¡Gracias! Te responderemos muy pronto.', 'ok');
                this.form.reset();
            } catch (err) {
                console.warn('[contact] endpoint falló, usando WhatsApp:', err.message);
                this.openWhatsApp(data);
            } finally {
                this.submitBtn.disabled = false;
            }
            return;
        }

        // Modo 2: fallback a WhatsApp
        this.openWhatsApp(data);
        this.submitBtn.disabled = false;
    }

    openWhatsApp(data) {
        const msg =
            `Hola, soy ${data.nombre} (${data.email}).\n\n${data.mensaje}`;
        this.setStatus('Te llevamos a WhatsApp para completar el envío…', 'ok');
        window.open(`https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(msg)}`, '_blank');
        this.form.reset();
    }
}

/** Pinta el badge "Abierto ahora / Cerrado" según SITE.hours. */
export function renderOpenNow() {
    const el = document.getElementById('open-now');
    if (!el) return;
    const { openHour, closeHour, days } = SITE.hours;
    const now = new Date();
    const open = days.includes(now.getDay()) && now.getHours() >= openHour && now.getHours() < closeHour;
    el.innerHTML = open
        ? `<span style="color: var(--color-accent)">● Abierto ahora</span> <span class="text-text-muted font-normal">· hasta las ${closeHour}:00</span>`
        : `<span style="color: var(--color-primary)">● Cerrado</span> <span class="text-text-muted font-normal">· abrimos a las ${openHour}:00</span>`;
}
