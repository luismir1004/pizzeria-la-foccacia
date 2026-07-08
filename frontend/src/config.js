/**
 * Configuración central del sitio.
 * Un único lugar para datos de negocio y endpoints, sin valores mágicos repartidos.
 */
export const SITE = {
  name: 'Pizzería La Foccacia',
  url: 'https://pizzeria-la-foccacia.vercel.app',

  // Contacto / conversión
  whatsapp: '+19045550100', // formato internacional, sin espacios
  phone: '+1 (904) 555-0142',
  email: 'contacto@lafoccacia.com',

  // Redes sociales (dejar '' oculta el icono en lugar de enlazar a "#")
  social: {
    facebook: 'https://www.facebook.com/lafoccacia',
    instagram: 'https://www.instagram.com/lafoccacia',
  },

  // Horario (0 = domingo … 6 = sábado). Usado por el badge "Abierto ahora".
  hours: { openHour: 11, closeHour: 23, days: [0, 1, 2, 3, 4, 5, 6] },

  // Endpoint del formulario de contacto. Si queda '', el formulario cae a
  // WhatsApp/mailto en vez de fallar silenciosamente.
  contactEndpoint: import.meta.env?.VITE_CONTACT_ENDPOINT || '',

  // Backend. Se puede sobrescribir en build con VITE_API_URL.
  // Si queda vacío, el frontend usa el catálogo local (products.json).
  apiUrl: import.meta.env?.VITE_API_URL || '',

  // Sucursales reales
  branches: [
    {
      name: 'Riverside',
      city: 'Jacksonville, Florida',
      address: '1620 Margaret St #105',
      zip: 'FL 32204',
      phone: '+1 (904) 555-0142',
      mapEmbed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3450.9!2d-81.6879!3d30.3145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMargaret%20St%2C%20Jacksonville!5e0!3m2!1sen!2sus!4v1700000000000',
    },
    {
      name: 'San Marco',
      city: 'Jacksonville, Florida',
      address: '1958 San Marco Blvd',
      zip: 'FL 32207',
      phone: '+1 (904) 555-0173',
      mapEmbed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.6!2d-81.6556!3d30.3089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan%20Marco%20Blvd%2C%20Jacksonville!5e0!3m2!1sen!2sus!4v1700000000001',
    },
  ],
};

/** Número de WhatsApp en el formato que espera wa.me (solo dígitos). */
export const WHATSAPP_DIGITS = SITE.whatsapp.replace(/[^\d]/g, '');
