import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo account
  const account = await prisma.account.upsert({
    where: { email: 'demo@localrankfeedback.com' },
    update: {},
    create: {
      name: 'Clinica Dental Sonrisa',
      email: 'demo@localrankfeedback.com',
      phone: '+57 601 234 5678',
      plan: 'advanced',
      settings: {
        timezone: 'America/Bogota',
        language: 'es',
      },
    },
  });

  console.log(`Created account: ${account.name}`);

  // Create demo user (password: Demo1234!)
  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@localrankfeedback.com' },
    update: {},
    create: {
      accountId: account.id,
      email: 'admin@localrankfeedback.com',
      passwordHash,
      name: 'Dr. Juan Perez',
      role: 'owner',
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create demo locations
  const location1 = await prisma.location.upsert({
    where: { feedbackSlug: 'clinica-sonrisa-centro' },
    update: {},
    create: {
      accountId: account.id,
      name: 'Sede Centro',
      address: 'Calle 50 #10-20, Bogota',
      phone: '+57 601 234 5678',
      feedbackSlug: 'clinica-sonrisa-centro',
      googleReviewUrl: 'https://g.page/r/example/review',
      branding: {
        primaryColor: '#2563eb',
        logo: null,
        positiveMessage: 'Nos alegra que hayas tenido una excelente experiencia! Te invitamos a compartirla en Google.',
        negativeMessage: 'Lamentamos que tu experiencia no haya sido la mejor. Tu feedback nos ayuda a mejorar.',
        thankYouTitle: 'Gracias por tu visita!',
        thankYouSubtitle: 'Tu opinion es muy importante para nosotros',
      },
      settings: {
        reviewGateThreshold: 4,
        notifyEmail: 'admin@localrankfeedback.com',
        notifyWhatsapp: '+57 300 123 4567',
      },
    },
  });

  const location2 = await prisma.location.upsert({
    where: { feedbackSlug: 'clinica-sonrisa-norte' },
    update: {},
    create: {
      accountId: account.id,
      name: 'Sede Norte',
      address: 'Carrera 15 #100-45, Bogota',
      phone: '+57 601 987 6543',
      feedbackSlug: 'clinica-sonrisa-norte',
      googleReviewUrl: 'https://g.page/r/example2/review',
      branding: {
        primaryColor: '#2563eb',
        logo: null,
        positiveMessage: 'Gracias por confiar en nosotros! Nos encantaria que compartas tu experiencia en Google.',
        negativeMessage: 'Sentimos mucho que no hayas tenido la mejor experiencia. Tomaremos accion.',
        thankYouTitle: 'Gracias por visitarnos!',
        thankYouSubtitle: 'Queremos saber como fue tu experiencia',
      },
      settings: {
        reviewGateThreshold: 4,
        notifyEmail: 'admin@localrankfeedback.com',
      },
    },
  });

  console.log(`Created locations: ${location1.name}, ${location2.name}`);

  // Create some demo feedback
  const feedbackData = [
    { rating: 5, comment: 'Excelente atencion, muy profesionales', directedToGoogle: true },
    { rating: 4, comment: 'Buena experiencia, puntualidad perfecta', directedToGoogle: true },
    { rating: 5, comment: 'El mejor dentista que he visitado', directedToGoogle: true },
    { rating: 2, comment: 'Mucho tiempo de espera', directedToGoogle: false },
    { rating: 3, comment: 'Regular, podria mejorar la comunicacion', directedToGoogle: false },
    { rating: 5, comment: null, directedToGoogle: true },
    { rating: 4, comment: 'Muy amables todos', directedToGoogle: true },
    { rating: 1, comment: 'Pesima experiencia, me cobraron de mas', directedToGoogle: false },
  ];

  for (const fb of feedbackData) {
    const feedback = await prisma.feedback.create({
      data: {
        locationId: location1.id,
        rating: fb.rating,
        comment: fb.comment,
        directedToGoogle: fb.directedToGoogle,
      },
    });

    // Create ticket for negative feedback
    if (fb.rating < 4) {
      await prisma.internalTicket.create({
        data: {
          locationId: location1.id,
          feedbackId: feedback.id,
          status: 'open',
        },
      });
    }
  }

  console.log(`Created ${feedbackData.length} demo feedback entries`);
  console.log('Seeding completed!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email: admin@localrankfeedback.com');
  console.log('  Password: Demo1234!');
  console.log('');
  console.log('Feedback form URL: /feedback/clinica-sonrisa-centro');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
