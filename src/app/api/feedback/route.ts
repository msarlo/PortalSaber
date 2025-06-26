import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/schemas/feedbackSchemas";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { isAuthenticated, user } = await verifyToken(req);
    const body = await req.json();

    const feedback = feedbackSchema.parse({
      ...body,
      userId: user?.id,
      createdAt: new Date(),
    });

    // Check for existing feedback based on session or user
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        tutorialId: feedback.tutorialId,
        OR: [
          { userId: user?.id },
          { sessionId: body.sessionId, userId: null }, // Only check sessionId for anonymous users
        ],
      },
    });

    // Get current stats
    const stats = await prisma.tutorialStats.findUnique({
      where: { tutorialId: feedback.tutorialId },
    });

    // Handle vote removal or change
    const result = await prisma.$transaction(async (tx) => {
      let updatedFeedback;
      let statsUpdate = {};

      if (existingFeedback) {
        // If same interaction type, remove the vote
        if (existingFeedback.interaction === feedback.interaction) {
          // Decrement the previous vote
          statsUpdate = {
            [existingFeedback.interaction === "like" ? "likes" : "dislikes"]: {
              decrement: 1,
            },
          };

          // Delete the feedback
          await tx.feedback.delete({
            where: { id: existingFeedback.id },
          });
          updatedFeedback = null;
        } else {
          // Different interaction - allow vote change for both anonymous and authenticated users
          statsUpdate = {
            [existingFeedback.interaction === "like" ? "likes" : "dislikes"]: {
              decrement: 1,
            },
            [feedback.interaction === "like" ? "likes" : "dislikes"]: {
              increment: 1,
            },
          };

          updatedFeedback = await tx.feedback.update({
            where: { id: existingFeedback.id },
            data: { interaction: feedback.interaction },
          });
        }
      } else {
        // New vote
        statsUpdate = {
          [feedback.interaction === "like" ? "likes" : "dislikes"]: {
            increment: 1,
          },
        };

        updatedFeedback = await tx.feedback.create({
          data: {
            ...feedback,
            sessionId: !isAuthenticated ? body.sessionId : undefined,
          },
        });
      }

      // Update stats
      const updatedStats = await tx.tutorialStats.upsert({
        where: { tutorialId: feedback.tutorialId },
        create: {
          tutorialId: feedback.tutorialId,
          likes: feedback.interaction === "like" ? 1 : 0,
          dislikes: feedback.interaction === "dislike" ? 1 : 0,
          lastUpdated: new Date(),
        },
        update: {
          ...statsUpdate,
          lastUpdated: new Date(),
        },
      });

      return { feedback: updatedFeedback, stats: updatedStats };
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal error processing feedback" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorialId = searchParams.get("tutorialId");
  const sessionId = req.cookies.get("sessionId")?.value;

  if (!tutorialId) {
    return NextResponse.json(
      { error: "Tutorial ID is required" },
      { status: 400 }
    );
  }

  try {
    const { isAuthenticated, user } = await verifyToken(req);

    // Get feedback and stats
    const [feedback, stats] = await Promise.all([
      prisma.feedback.findFirst({
        where: {
          tutorialId,
          OR: [{ userId: user?.id }, { sessionId }],
        },
      }),
      prisma.tutorialStats.findUnique({
        where: { tutorialId },
      }),
    ]);

    return NextResponse.json({
      feedback,
      stats: stats || { likes: 0, dislikes: 0, lastUpdated: new Date() },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal error fetching feedback" },
      { status: 500 }
    );
  }
}
