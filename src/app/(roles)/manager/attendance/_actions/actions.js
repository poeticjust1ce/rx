// src/app/(roles)/manager/attendance/_actions/actions.js
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getTeamAttendance(from, to) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const filter = {
    user: {
      managerId: session.user.id,
    },
  };

  if (from && to) {
    filter.timeIn = {
      gte: new Date(from),
      lte: new Date(to),
    };
  }

  return await prisma.attendance.findMany({
    where: filter,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      timeIn: "desc",
    },
  });
}
