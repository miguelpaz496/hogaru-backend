import prisma from '../config/db';

export const createHousehold = async (name: string, createdBy: number) => {
  return prisma.household.create({
    data: { name, createdBy }
  });
};

export const findHouseholdById = async (id: number) => {
  return prisma.household.findUnique({
    where: { id },
    include: { members: { include: { user: true } } }
  });
};

export const findHouseholdsByUserId = async (userId: number) => {
  return prisma.household.findMany({
    where: {
      members: { some: { userId, status: 'active' } }
    },
    include: { members: { include: { user: true } } }
  });
};

export const addMemberToHousehold = async (userId: number, householdId: number) => {
  return prisma.userHousehold.create({
    data: { userId, householdId }
  });
};

export const removeMemberFromHousehold = async (userId: number, householdId: number) => {
  return prisma.userHousehold.delete({
    where: { userId_householdId: { userId, householdId } }
  });
};

export const findAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, avatar: true, color: true }
  });
};
