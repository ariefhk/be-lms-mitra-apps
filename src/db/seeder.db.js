import { db } from "./connector.db.js";
import { faker } from "@faker-js/faker";
import { createBcryptPassword } from "../helper/bcrypt.helper.js";

const name = faker.person.fullName();
const username = faker.internet.userName();
const email = faker.internet.email();
const phoneNumber = faker.phone.number();
const university = faker.company.name();
const major = faker.person.jobType();
const avatar = faker.image.avatar();

async function createUser(role) {
  const user = await db.user.create({
    data: {
      username: faker.internet.userName().toLowerCase(),
      password: await createBcryptPassword("rahasia"),
      token: null,
      role: role,
    },
  });

  return user;
}

async function createAdmin(userId) {
  return await db.admin.create({
    data: {
      userId: userId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      profilePicture: faker.image.avatar(),
    },
  });
}

async function createSeniorMentor(userId) {
  return await db.seniorMentor.create({
    data: {
      userId: userId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      profilePicture: faker.image.avatar(),
    },
  });
}

async function createMentor(userId, seniorMentorId) {
  return await db.mentor.create({
    data: {
      seniorMentorId: seniorMentorId,
      userId: userId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      profilePicture: faker.image.avatar(),
    },
  });
}

async function seedAdmins(count) {
  for (let i = 0; i < count; i++) {
    const user = await createUser("ADMIN");
    await createAdmin(user.id);
  }
}

// Function to seed senior mentors and mentors
async function seedSeniorMentorsAndMentor(count) {
  for (let i = 0; i < count; i++) {
    const user = await createUser("SENIOR_MENTOR");
    const seniorMentor = await createSeniorMentor(user.id);
    const mentorUser = await createUser("MENTOR");
    await createMentor(mentorUser.id, seniorMentor.id);
  }
}

async function seedingData() {
  await seedAdmins(3);
  await seedSeniorMentorsAndMentor(4);
}

seedingData()
  .then(() => {
    console.log("Seeding process completed successfully!");
  })
  .catch((e) => {
    console.error("Seeding process failed:", e);
    process.exit(1);
  });
