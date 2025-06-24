"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import InteractiveButton from "./InteractiveButton";
import type { FeedbackData } from "@/schemas/feedbackSchemas";

interface InteractionButtonsProps {
  tutorialId: string;
  initialLikes?: number;
  initialDislikes?: number;
}

// Interface para armazenar contadores
interface TutorialStats {
  likes: number;
  dislikes: number;
  lastUpdated: Date;
}

const feedbackOptions = [
  "Tutorial muito bom, claro e objetivo.",
  "Ajudou a resolver meu problema.",
  "Gostei muito do conteúdo, bem explicado.",
  "Precisa de mais detalhes.",
  "Faltou explicar alguns pontos importantes.",
  "Não gostei, o conteúdo é confuso.",
  "Difícil de entender.",
];

export default function InteractionButtons({
  tutorialId,
  initialLikes = 0,
  initialDislikes = 0,
}: InteractionButtonsProps) {
  const { user, isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [stats, setStats] = useState<TutorialStats>({
    likes: initialLikes,
    dislikes: initialDislikes,
    lastUpdated: new Date(),
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Try to get session feedback first
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
          const newSessionId = crypto.randomUUID();
          localStorage.setItem("sessionId", newSessionId);
        }

        const response = await fetch(`/api/feedback?tutorialId=${tutorialId}`);
        if (response.ok) {
          const data = await response.json();
          setFeedback(data.feedback);
          setStats({
            likes: data.stats.likes,
            dislikes: data.stats.dislikes,
            lastUpdated: new Date(data.stats.lastUpdated),
          });
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [tutorialId, isAuthenticated]);

  const handleInteraction = async (type: "like" | "dislike") => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const sessionId = localStorage.getItem("sessionId");
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isAuthenticated && {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }),
        },
        body: JSON.stringify({
          tutorialId,
          interaction: type,
          sessionId: !isAuthenticated ? sessionId : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback(data.feedback);
        setStats({
          likes: data.stats.likes,
          dislikes: data.stats.dislikes,
          lastUpdated: new Date(data.stats.lastUpdated),
        });
        // Só mostra o formulário de feedback se houver uma interação ativa
        setShowFeedbackForm(!!data.feedback);
      } else {
        alert(data.error || "Erro ao processar interação");
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    const updatedFeedback = {
      ...feedback,
      createdAt: new Date(),
    };

    localStorage.setItem(
      `feedback_${tutorialId}`,
      JSON.stringify(updatedFeedback)
    );
    setShowFeedbackForm(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <InteractiveButton
          type="like"
          initialCount={stats.likes}
          isActive={feedback?.interaction === "like"}
          onInteraction={() => handleInteraction("like")}
        />
        <InteractiveButton
          type="dislike"
          initialCount={stats.dislikes}
          isActive={feedback?.interaction === "dislike"}
          onInteraction={() => handleInteraction("dislike")}
        />
      </div>

      {showFeedbackForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Nos ajude a melhorar!</h4>

          <div className="space-y-2">
            {feedbackOptions.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="feedback"
                  value={option}
                  checked={feedback?.feedbackType === option}
                  onChange={(e) =>
                    setFeedback((prev) =>
                      prev
                        ? { ...prev, feedbackType: e.target.value }
                        : {
                            tutorialId,
                            interaction: "null",
                            createdAt: new Date(),
                            feedbackType: e.target.value,
                          }
                    )
                  }
                  className="text-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <textarea
            placeholder="Comentário adicional (opcional)"
            value={feedback?.comment || ""}
            onChange={(e) =>
              setFeedback((prev) =>
                prev
                  ? { ...prev, comment: e.target.value }
                  : {
                      tutorialId,
                      interaction: "null",
                      createdAt: new Date(),
                      comment: e.target.value,
                    }
              )
            }
            className="mt-4 w-full p-2 border rounded-md"
            rows={3}
          />

          <button
            onClick={handleFeedbackSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Enviar Feedback
          </button>
        </div>
      )}
    </div>
  );
}
