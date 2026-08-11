// Multi-language support for feedback forms

export type Language = 'es' | 'en' | 'pt';

export interface Translations {
  // Form
  title: string;
  subtitle: string;
  tapToRate: string;
  veryBad: string;
  excellent: string;
  change: string;
  whatDidYouLike: string;
  whatCanWeImprove: string;
  commentPlaceholderPositive: string;
  commentPlaceholderNegative: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  submit: string;
  sending: string;
  // Results
  thankYouPositive: string;
  thankYouNegative: string;
  defaultPositiveMessage: string;
  defaultNegativeMessage: string;
  redirecting: string;
  leaveReview: string;
  whereToLeaveReview: string;
  weWillContact: string;
  // Marketing consent
  marketingConsent: string;
}

const translations: Record<Language, Translations> = {
  es: {
    title: 'Como fue tu experiencia?',
    subtitle: 'Tu opinion es muy importante para nosotros',
    tapToRate: 'Toca una estrella para calificar',
    veryBad: 'Muy mal',
    excellent: 'Excelente',
    change: 'Cambiar',
    whatDidYouLike: 'Cuentanos que te gusto',
    whatCanWeImprove: 'Cuentanos que podemos mejorar',
    commentPlaceholderPositive: 'Tu experiencia nos motiva...',
    commentPlaceholderNegative: 'Tu opinion nos ayuda a mejorar...',
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    email: 'Email',
    emailPlaceholder: 'tu@email.com',
    phone: 'WhatsApp / Telefono',
    phonePlaceholder: '+57 300 123 4567',
    submit: 'Enviar mi opinion',
    sending: 'Enviando...',
    thankYouPositive: 'Muchas gracias!',
    thankYouNegative: 'Gracias por tu opinion',
    defaultPositiveMessage: 'Nos alegra tu experiencia! Te invitamos a compartirla.',
    defaultNegativeMessage: 'Gracias por tu feedback. Tomaremos accion para mejorar.',
    redirecting: 'Seras redirigido automaticamente...',
    leaveReview: 'Dejar mi opinion',
    whereToLeaveReview: 'Donde quieres compartir tu experiencia?',
    weWillContact: 'Nos pondremos en contacto contigo pronto para mejorar tu experiencia.',
    marketingConsent: 'Acepto recibir promociones, novedades y beneficios exclusivos por email o WhatsApp. Puedo darme de baja en cualquier momento.',
  },
  en: {
    title: 'How was your experience?',
    subtitle: 'Your opinion is very important to us',
    tapToRate: 'Tap a star to rate',
    veryBad: 'Very bad',
    excellent: 'Excellent',
    change: 'Change',
    whatDidYouLike: 'Tell us what you liked',
    whatCanWeImprove: 'Tell us what we can improve',
    commentPlaceholderPositive: 'Your experience motivates us...',
    commentPlaceholderNegative: 'Your feedback helps us improve...',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    phone: 'WhatsApp / Phone',
    phonePlaceholder: '+1 555 123 4567',
    submit: 'Send my feedback',
    sending: 'Sending...',
    thankYouPositive: 'Thank you!',
    thankYouNegative: 'Thanks for your feedback',
    defaultPositiveMessage: 'We\'re glad you had a great experience! Share it with others.',
    defaultNegativeMessage: 'Thank you for your feedback. We\'ll take action to improve.',
    redirecting: 'You will be redirected automatically...',
    leaveReview: 'Leave my review',
    whereToLeaveReview: 'Where would you like to share your experience?',
    weWillContact: 'We\'ll get in touch with you soon to improve your experience.',
    marketingConsent: 'I agree to receive promotions, news and exclusive benefits via email or WhatsApp. I can unsubscribe at any time.',
  },
  pt: {
    title: 'Como foi sua experiencia?',
    subtitle: 'Sua opiniao e muito importante para nos',
    tapToRate: 'Toque uma estrela para avaliar',
    veryBad: 'Muito ruim',
    excellent: 'Excelente',
    change: 'Mudar',
    whatDidYouLike: 'Conte-nos o que voce gostou',
    whatCanWeImprove: 'Conte-nos o que podemos melhorar',
    commentPlaceholderPositive: 'Sua experiencia nos motiva...',
    commentPlaceholderNegative: 'Seu feedback nos ajuda a melhorar...',
    name: 'Nome',
    namePlaceholder: 'Seu nome',
    email: 'Email',
    emailPlaceholder: 'voce@email.com',
    phone: 'WhatsApp / Telefone',
    phonePlaceholder: '+55 11 9999 8888',
    submit: 'Enviar minha opiniao',
    sending: 'Enviando...',
    thankYouPositive: 'Muito obrigado!',
    thankYouNegative: 'Obrigado pela sua opiniao',
    defaultPositiveMessage: 'Ficamos felizes com sua experiencia! Compartilhe com outros.',
    defaultNegativeMessage: 'Obrigado pelo seu feedback. Tomaremos medidas para melhorar.',
    redirecting: 'Voce sera redirecionado automaticamente...',
    leaveReview: 'Deixar minha avaliacao',
    whereToLeaveReview: 'Onde voce quer compartilhar sua experiencia?',
    weWillContact: 'Entraremos em contato em breve para melhorar sua experiencia.',
    marketingConsent: 'Aceito receber promocoes, novidades e beneficios exclusivos por email ou WhatsApp. Posso cancelar a qualquer momento.',
  },
};

export function getTranslations(lang: Language | string): Translations {
  return translations[lang as Language] || translations.es;
}

export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    es: 'Español',
    en: 'English',
    pt: 'Portugues',
  };
  return names[lang];
}
