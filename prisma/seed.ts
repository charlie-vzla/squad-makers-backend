import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const users = [
    { name: 'Manolito' },
    { name: 'Pepe' },
    { name: 'Isabel' },
    { name: 'Pedro' },
  ];

  console.log('Creating users...');
  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { name: user.name },
        update: {},
        create: user,
      })
    )
  );
  console.log(`✓ Created ${createdUsers.length} users`);

  // Create topics
  const topics = [
    { name: 'humor negro' },
    { name: 'humor amarillo' },
    { name: 'chistes verdes' },
  ];

  console.log('Creating topics...');
  const createdTopics = await Promise.all(
    topics.map((topic) =>
      prisma.topic.upsert({
        where: { name: topic.name },
        update: {},
        create: topic,
      })
    )
  );
  console.log(`✓ Created ${createdTopics.length} topics`);

  // Create 3 jokes for each topic for each user
  console.log('Creating jokes...');
  let jokeCount = 0;

  for (const user of createdUsers) {
    for (const topic of createdTopics) {
      for (let i = 1; i <= 3; i++) {
        await prisma.joke.create({
          data: {
            text: `Este es el chiste ${i} de ${topic.name} por ${user.name}`,
            source: 'custom',
            userId: user.id,
            jokeTopics: {
              create: [
                {
                  topicId: topic.id,
                },
              ],
            },
          },
        });

        jokeCount++;
      }
    }
  }
  console.log(`✓ Created ${jokeCount} jokes`);

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
