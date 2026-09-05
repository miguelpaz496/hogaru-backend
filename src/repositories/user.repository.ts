import prisma from '../config/db'

export const findUserByGoogleId = async (googleId: string) => {
  return prisma.user.findUnique({
    where: { googleId },
  })
}

export const createUser = async (
  name: string,
  email: string,
  avatar: string,
  googleId: string
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      avatar,
      googleId,
    },
  })
}

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  })
}