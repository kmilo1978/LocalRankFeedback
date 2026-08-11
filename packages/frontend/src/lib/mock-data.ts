// Mock data for local visualization without backend

export const mockLocationConfig = {
  id: '1',
  name: 'Clinica Dental Sonrisa - Sede Centro',
  feedbackSlug: 'clinica-sonrisa-centro',
  googleReviewUrl: 'https://g.page/r/example/review',
  branding: {
    primaryColor: '#2563eb',
    logo: null,
    showBanner: true,
    bannerColor: '#2563eb',
    backgroundColor: '#f0f4ff',
    thankYouTitle: 'Como fue tu experiencia?',
    thankYouSubtitle: 'Tu opinion es muy importante para nosotros',
    positiveMessage:
      'Nos alegra que hayas tenido una excelente experiencia! Te invitamos a compartirla.',
    negativeMessage:
      'Gracias por tu feedback. Tomaremos accion para mejorar tu proxima experiencia.',
  },
  settings: {
    reviewGateThreshold: 4,
    notifyEmail: 'admin@clinicasonrisa.com',
    showNameField: true,
    showEmailField: true,
    showPhoneField: true,
    nameRequired: false,
    emailRequired: false,
    phoneRequired: false,
    marketingConsentText: 'Acepto recibir promociones, novedades y beneficios exclusivos por email o WhatsApp. Puedo darme de baja en cualquier momento.',
    platformMode: 'buttons', // 'buttons' | 'single' | 'rotation'
    language: 'es', // 'es' | 'en' | 'pt'
  },
  active: true,
};

export const mockReviewPlatforms = [
  { id: '1', platform: 'google', name: 'Google Maps', url: 'https://g.page/r/example/review', icon: '🔍', priority: 10 },
  { id: '2', platform: 'doctoralia', name: 'Doctoralia', url: 'https://doctoralia.co/clinica-sonrisa', icon: '👨‍⚕️', priority: 5 },
  { id: '3', platform: 'facebook', name: 'Facebook', url: 'https://facebook.com/clinicasonrisa/reviews', icon: '📘', priority: 3 },
];

export const mockFeedbackList = [
  {
    id: '1',
    rating: 5,
    comment: 'Excelente atencion, muy profesionales y puntuales',
    directedToGoogle: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    contact: { id: '1', name: 'Maria Garcia', email: 'maria@email.com' },
  },
  {
    id: '2',
    rating: 4,
    comment: 'Buena experiencia, puntualidad perfecta',
    directedToGoogle: true,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    contact: { id: '2', name: 'Carlos Rodriguez', email: 'carlos@email.com' },
  },
  {
    id: '3',
    rating: 5,
    comment: 'El mejor dentista que he visitado, super recomendado',
    directedToGoogle: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    contact: { id: '3', name: 'Pedro Lopez', email: 'pedro@email.com' },
  },
  {
    id: '4',
    rating: 2,
    comment: 'Mucho tiempo de espera, mas de 40 minutos',
    directedToGoogle: false,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    contact: { id: '4', name: 'Ana Martinez', email: 'ana@email.com' },
  },
  {
    id: '5',
    rating: 3,
    comment: 'Regular, podria mejorar la comunicacion sobre los costos',
    directedToGoogle: false,
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    contact: { id: '5', name: 'Luis Perez', email: 'luis@email.com' },
  },
  {
    id: '6',
    rating: 5,
    comment: null,
    directedToGoogle: true,
    createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
    contact: { id: '6', name: 'Sofia Ramirez', email: 'sofia@email.com' },
  },
  {
    id: '7',
    rating: 4,
    comment: 'Muy amables todos, el doctor explica bien los procedimientos',
    directedToGoogle: true,
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
    contact: { id: '7', name: 'Diego Torres', email: 'diego@email.com' },
  },
  {
    id: '8',
    rating: 1,
    comment: 'Pesima experiencia, me cobraron de mas y no dieron explicacion',
    directedToGoogle: false,
    createdAt: new Date(Date.now() - 144 * 3600000).toISOString(),
    contact: null,
  },
  {
    id: '9',
    rating: 5,
    comment: 'Increible servicio, la clinica esta impecable',
    directedToGoogle: true,
    createdAt: new Date(Date.now() - 168 * 3600000).toISOString(),
    contact: { id: '8', name: 'Valentina Gomez', email: 'vale@email.com' },
  },
  {
    id: '10',
    rating: 4,
    comment: 'Buen servicio en general, solo un poco de espera',
    directedToGoogle: true,
    createdAt: new Date(Date.now() - 192 * 3600000).toISOString(),
    contact: { id: '9', name: 'Andres Morales', email: 'andres@email.com' },
  },
];

export const mockStats = {
  total: 47,
  averageRating: 4.2,
  directedToGoogle: 35,
  distribution: { 1: 2, 2: 3, 3: 5, 4: 12, 5: 25 },
};

export const mockTickets = [
  {
    id: '1',
    status: 'open',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    feedback: {
      id: '4',
      rating: 2,
      comment: 'Mucho tiempo de espera, mas de 40 minutos',
      contact: { id: '4', name: 'Ana Martinez', email: 'ana@email.com', phone: '+57 300 111 2222' },
    },
  },
  {
    id: '2',
    status: 'open',
    createdAt: new Date(Date.now() - 144 * 3600000).toISOString(),
    feedback: {
      id: '8',
      rating: 1,
      comment: 'Pesima experiencia, me cobraron de mas y no dieron explicacion',
      contact: null,
    },
  },
  {
    id: '3',
    status: 'in_progress',
    notes: 'Se contacto al paciente por telefono, esperando respuesta',
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    feedback: {
      id: '5',
      rating: 3,
      comment: 'Regular, podria mejorar la comunicacion sobre los costos',
      contact: { id: '5', name: 'Luis Perez', email: 'luis@email.com', phone: '+57 310 333 4444' },
    },
  },
  {
    id: '4',
    status: 'resolved',
    notes: 'Se ofrecio descuento en proxima visita. Paciente satisfecha.',
    createdAt: new Date(Date.now() - 240 * 3600000).toISOString(),
    resolvedAt: new Date(Date.now() - 192 * 3600000).toISOString(),
    feedback: {
      id: '11',
      rating: 2,
      comment: 'No me explicaron bien el tratamiento',
      contact: { id: '10', name: 'Camila Ruiz', email: 'camila@email.com', phone: '+57 320 555 6666' },
    },
  },
];

export const mockContacts = [
  { id: '1', name: 'Maria Garcia', email: 'maria@email.com', phone: '+57 300 111 2222', source: 'feedback', feedbackCount: 3, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '2', name: 'Carlos Rodriguez', email: 'carlos@email.com', phone: '+57 310 333 4444', source: 'feedback', feedbackCount: 1, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '3', name: 'Pedro Lopez', email: 'pedro@email.com', phone: '+57 320 555 6666', source: 'referral', feedbackCount: 3, createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
  { id: '4', name: 'Ana Martinez', email: 'ana@email.com', phone: null, source: 'feedback', feedbackCount: 1, createdAt: new Date(Date.now() - 72 * 3600000).toISOString() },
  { id: '5', name: 'Luis Perez', email: 'luis@email.com', phone: '+57 300 777 8888', source: 'feedback', feedbackCount: 2, createdAt: new Date(Date.now() - 96 * 3600000).toISOString() },
  { id: '6', name: 'Sofia Ramirez', email: 'sofia@email.com', phone: '+57 310 999 0000', source: 'feedback', feedbackCount: 1, createdAt: new Date(Date.now() - 120 * 3600000).toISOString() },
  { id: '7', name: 'Diego Torres', email: 'diego@email.com', phone: '+57 320 111 3333', source: 'manual', feedbackCount: 2, createdAt: new Date(Date.now() - 168 * 3600000).toISOString() },
  { id: '8', name: 'Valentina Gomez', email: 'vale@email.com', phone: '+57 300 444 5555', source: 'feedback', feedbackCount: 1, createdAt: new Date(Date.now() - 192 * 3600000).toISOString() },
  { id: '9', name: 'Andres Morales', email: 'andres@email.com', phone: null, source: 'referral', feedbackCount: 1, createdAt: new Date(Date.now() - 240 * 3600000).toISOString() },
  { id: '10', name: 'Camila Ruiz', email: 'camila@email.com', phone: '+57 310 666 7777', source: 'feedback', feedbackCount: 2, createdAt: new Date(Date.now() - 288 * 3600000).toISOString() },
];

export const mockLocations = [
  {
    id: '1',
    name: 'Sede Centro',
    address: 'Calle 50 #10-20, Bogota',
    phone: '+57 601 234 5678',
    feedbackSlug: 'clinica-sonrisa-centro',
    googleReviewUrl: 'https://g.page/r/example/review',
    feedbackCount: 32,
    averageRating: 4.3,
    active: true,
  },
  {
    id: '2',
    name: 'Sede Norte',
    address: 'Carrera 15 #100-45, Bogota',
    phone: '+57 601 987 6543',
    feedbackSlug: 'clinica-sonrisa-norte',
    googleReviewUrl: 'https://g.page/r/example2/review',
    feedbackCount: 15,
    averageRating: 4.5,
    active: true,
  },
];
