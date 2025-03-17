import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { Role } from '../src/types'

const prisma = new PrismaClient()

async function main() {
  // Create 1 admin user
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await bcrypt.hash('Admin@123', 10),
      role: Role.ADMIN
    },
  })

  // Create 2 employee users
  for (let i = 1; i <= 2; i++) {
    await prisma.user.create({
      data: {
        email: `employee${i}@example.com`,
        name: `Employee ${i}`,
        password: await bcrypt.hash('Employee@123', 10),
        role: Role.EMPLOYEE
      },
    })
  }

  // Create 10 regular users
  for (let i = 1; i <= 10; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: await bcrypt.hash('User@123', 10),
        role: Role.USER
      },
    })
  }

  console.log('Seed data inserted successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })