"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const PHISHING_QUIZ: Question[] = [
  {
    id: 1,
    question: "What is the primary goal of a phishing attack?",
    options: [
      "To steal sensitive personal or financial information",
      "To provide free services to users",
      "To improve network security",
      "To test email delivery systems",
    ],
    correctAnswer: 0,
    explanation:
      "Phishing attacks aim to deceive users into divulging sensitive information like passwords, credit card numbers, or personal data.",
  },
  {
    id: 2,
    question: "Which of the following is a common red flag for a phishing email?",
    options: [
      "A generic greeting like 'Dear User' instead of your name",
      "All emails from your company use generic greetings",
      "Formal business language",
      "Using the company logo",
    ],
    correctAnswer: 0,
    explanation:
      "Legitimate organizations typically personalize emails with your actual name. Generic greetings are a common indicator of phishing.",
  },
  {
    id: 3,
    question: "What should you do before clicking a link in an email?",
    options: [
      "Click it immediately to see where it goes",
      "Hover over the link to verify the actual URL matches the claimed destination",
      "Ask a colleague if it looks real",
      "Just click it if the sender name looks legitimate",
    ],
    correctAnswer: 1,
    explanation:
      "Always hover over links to see the actual URL before clicking. The displayed text and actual link can be different in phishing emails.",
  },
  {
    id: 4,
    question: "Which is the safest way to access your email account?",
    options: [
      "Click the link in a reminder email",
      "Use bookmarks or type the URL directly into your browser",
      "Click links from any email that appears to be from your email provider",
      "Use links from search results",
    ],
    correctAnswer: 1,
    explanation:
      "The safest method is to use bookmarks or type the URL directly. This ensures you're accessing the legitimate website, not a fake one.",
  },
  {
    id: 5,
    question: "What should you do if you receive an email asking for your password?",
    options: [
      "Reply with your password to confirm your identity",
      "Ignore it and never share your password via email",
      "Share your password only if it looks urgent",
      "Send it if the sender claims to be from IT support",
    ],
    correctAnswer: 1,
    explanation:
      "Legitimate organizations NEVER ask for passwords via email. Any such request is a red flag and should be ignored.",
  },
  {
    id: 6,
    question: "How can you verify if an unexpected attachment is safe?",
    options: [
      "Just open it and see what happens",
      "Check if the file extension looks normal",
      "Contact the sender through a known contact method before opening",
      "Run it through your email client's preview",
    ],
    correctAnswer: 2,
    explanation:
      "Always contact the sender through a separate communication method to verify they actually sent it. Don't rely on the sender field alone.",
  },
  {
    id: 7,
    question: "What do you notice about suspicious sender email addresses?",
    options: [
      "They always match the company name exactly",
      "They can contain slight variations or use similar-looking domains",
      "They never contain numbers",
      "The domain is always 'company.com'",
    ],
    correctAnswer: 1,
    explanation:
      "Attackers use domain spoofing to make addresses look legitimate. They might use 'amaz0n.com' instead of 'amazon.com' or similar tricks.",
  },
  {
    id: 8,
    question: "What is two-factor authentication (2FA)?",
    options: [
      "Using two different passwords",
      "A security method requiring two forms of verification",
      "Having two email accounts",
      "Logging in twice",
    ],
    correctAnswer: 1,
    explanation:
      "2FA requires a second form of verification (like a code from your phone) beyond your password, significantly improving security.",
  },
  {
    id: 9,
    question: "If you accidentally click a phishing link, what should you do?",
    options: [
      "Do nothing and hope for the best",
      "Immediately report it to IT security and change your password if needed",
      "Delete the email and forget about it",
      "Forward it to other employees as a warning",
    ],
    correctAnswer: 1,
    explanation:
      "Report it immediately to your IT security team so they can investigate and help prevent others from falling victim.",
  },
  {
    id: 10,
    question: "Which statement about password managers is true?",
    options: [
      "They are a security risk",
      "They help you use unique, strong passwords for each account",
      "They should be shared with colleagues",
      "They eliminate the need for strong passwords",
    ],
    correctAnswer: 1,
    explanation:
      "Password managers securely store unique, strong passwords for each account, making it easier to maintain good security practices.",
  },
  {
    id: 11,
    question:
      "What is email spoofing?",
    options: [
      "A type of spam filter",
      "Forging the sender's address to appear as someone else",
      "Blocking legitimate emails",
      "Encrypting email contents",
    ],
    correctAnswer: 1,
    explanation:
      "Email spoofing involves falsifying the sender's address to make the email appear to come from a trusted source.",
  },
  {
    id: 12,
    question: "What should you do if a website asks for your password?",
    options: [
      "Provide it if the site looks professional",
      "Only provide it if you initiated the action yourself",
      "Share it if it's a major company",
      "Never provide your original password",
    ],
    correctAnswer: 1,
    explanation:
      "Only enter your password on secure sites where you initiated the action. Legitimate password changes usually happen through secure procedures.",
  },
  {
    id: 13,
    question: "Which is a sign of a legitimate company email?",
    options: [
      "Generic greeting and urgent language",
      "Professional layout, personalization, and no suspicious links",
      "Asking for sensitive information",
      "Poor spelling and grammar",
    ],
    correctAnswer: 1,
    explanation:
      "Legitimate emails are professional, personalized to you, well-written, and never request sensitive information unexpectedly.",
  },
  {
    id: 14,
    question: "What does SPF record help prevent?",
    options: [
      "Phishing attacks",
      "Email spoofing by verifying sender authenticity",
      "Spam filters",
      "Password theft",
    ],
    correctAnswer: 1,
    explanation:
      "SPF (Sender Policy Framework) records help verify that an email actually comes from the claimed sender's domain.",
  },
  {
    id: 15,
    question: "What should be your immediate action if you suspect you've been phished?",
    options: [
      "Continue using the account normally",
      "Wait to see if anything bad happens",
      "Change your password and report to IT security immediately",
      "Tell other employees to change their passwords",
    ],
    correctAnswer: 2,
    explanation:
      "Immediately change your password and report the incident to IT security so they can assess any potential damage.",
  },
  {
    id: 16,
    question: "What is DKIM in email security?",
    options: [
      "A type of malware",
      "A cryptographic authentication method for emails",
      "A password strength checker",
      "A type of firewall",
    ],
    correctAnswer: 1,
    explanation:
      "DKIM (DomainKeys Identified Mail) uses cryptography to verify that emails haven't been forged or altered.",
  },
  {
    id: 17,
    question: "Why should you be cautious with shortened URLs?",
    options: [
      "They take longer to load",
      "They hide the actual destination URL, making it hard to verify",
      "They are always phishing links",
      "They slow down your internet",
    ],
    correctAnswer: 1,
    explanation:
      "Shortened URLs (like bit.ly) hide the actual destination, making it impossible to verify where the link actually goes before clicking.",
  },
  {
    id: 18,
    question: "What is the best practice for sharing sensitive information?",
    options: [
      "Send it via email",
      "Post it on public forums",
      "Use secure, encrypted channels or in-person methods",
      "Share through instant messaging apps",
    ],
    correctAnswer: 2,
    explanation:
      "Sensitive information should be shared through secure, encrypted channels or in person - never through regular email or messaging apps.",
  },
  {
    id: 19,
    question: "How often should you update your passwords?",
    options: [
      "Only when you suspect a breach",
      "Every 3-6 months or when using shared/weak credentials",
      "Never, if they're strong enough",
      "Only when your company requires it",
    ],
    correctAnswer: 1,
    explanation:
      "Regular password updates (every 3-6 months) reduce the risk of compromised credentials being used against you.",
  },
  {
    id: 20,
    question: "What should you do if you see suspicious activity in your email account?",
    options: [
      "Ignore it unless more bad things happen",
      "Change your password and immediately contact IT security",
      "Email the suspicious activity to yourself as documentation",
      "Wait a few days to see if it resolves itself",
    ],
    correctAnswer: 1,
    explanation:
      "Report suspicious activity immediately to IT security. Quick action can prevent serious security breaches.",
  },
];

const PASSING_SCORE = 15; // 75%

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(PHISHING_QUIZ.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = PHISHING_QUIZ[currentQuestion];
  const answered = selectedAnswers[currentQuestion] !== null;
  const allAnswered = selectedAnswers.every((answer) => answer !== null);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < PHISHING_QUIZ.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    PHISHING_QUIZ.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = async () => {
    if (!allAnswered || !token) return;

    setShowResults(true);
  };

  const handleFinish = async () => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const score = calculateScore();
      const passed = score >= PASSING_SCORE;

      await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, score, passed }),
      });

      router.push(`/result?status=${passed ? "passed" : "failed"}&score=${score}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    return <QuizResults score={calculateScore()} onFinish={handleFinish} isSubmitting={isSubmitting} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-white text-2xl">Phishing Awareness Quiz</CardTitle>
                <CardDescription className="text-slate-300">
                  Question {currentQuestion + 1} of {PHISHING_QUIZ.length}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-400">
                  {selectedAnswers.filter((a) => a !== null).length}/{PHISHING_QUIZ.length}
                </div>
                <div className="text-sm text-slate-400">answered</div>
              </div>
            </div>
            <Progress value={((currentQuestion + 1) / PHISHING_QUIZ.length) * 100} className="h-2" />
          </CardHeader>

          <CardContent className="pt-8">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">{currentQ.question}</h2>

              {/* Options */}
              <RadioGroup value={selectedAnswers[currentQuestion]?.toString() ?? ""} onValueChange={(v) => handleSelectAnswer(parseInt(v))}>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border border-slate-600 hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} className="text-blue-500" />
                      <Label htmlFor={`option-${index}`} className="text-slate-200 cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Previous
              </Button>

              {currentQuestion < PHISHING_QUIZ.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!answered}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Review & Submit
                </Button>
              )}
            </div>

            {/* Quick Navigation */}
            <div className="mt-8 p-4 bg-slate-700/30 rounded-lg">
              <p className="text-sm text-slate-400 mb-3">Quick Navigation</p>
              <div className="grid grid-cols-10 gap-2">
                {PHISHING_QUIZ.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`h-10 rounded-lg font-semibold text-sm transition-all ${
                      index === currentQuestion
                        ? "bg-blue-600 text-white"
                        : selectedAnswers[index] !== null
                          ? "bg-green-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuizResults({
  score,
  onFinish,
  isSubmitting,
}: {
  score: number;
  onFinish: () => void;
  isSubmitting: boolean;
}) {
  const passed = score >= PASSING_SCORE;
  const percentage = Math.round((score / PHISHING_QUIZ.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
      <Card className={`w-full max-w-md bg-slate-800/50 border-slate-700 ${passed ? "border-green-500/30" : "border-red-500/30"}`}>
        <CardContent className="pt-8">
          <div className="text-center">
            {passed ? (
              <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            )}

            <h2 className={`text-3xl font-bold mb-2 ${passed ? "text-green-400" : "text-red-400"}`}>
              {passed ? "Congratulations!" : "Almost There!"}
            </h2>

            <p className="text-slate-300 mb-6">
              {passed
                ? "You've successfully passed the phishing awareness quiz!"
                : "You need at least 75% to pass. Review the training and try again."}
            </p>

            <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
              <div className="text-5xl font-bold text-blue-400 mb-2">{percentage}%</div>
              <div className="text-slate-300">
                {score} out of {PHISHING_QUIZ.length} correct
              </div>
            </div>

            {!passed && (
              <div className="bg-orange-950/30 border border-orange-500/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-orange-200">
                  Review the training materials to improve your understanding of phishing threats and best practices.
                </p>
              </div>
            )}

            {passed && (
              <div className="bg-green-950/30 border border-green-500/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-green-200">
                  Your training completion will be recorded in the dashboard. Thank you for your commitment to security!
                </p>
              </div>
            )}

            <Button
              onClick={onFinish}
              disabled={isSubmitting}
              className={`w-full h-12 text-base font-semibold ${
                passed
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? "Processing..." : passed ? "Finish" : "Review Training"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
