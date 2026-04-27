"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, Play } from "lucide-react";

type TrainingModule = {
  id: "phishing" | "email-safety" | "best-practices";
  title: string;
  description: string;
  completed: boolean;
};

export default function TrainingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trainingModules: TrainingModule[] = [
    {
      id: "phishing",
      title: "Phishing Attack Recognition",
      description: "Learn how to identify phishing emails and suspicious links",
      completed: completedModules.has("phishing"),
    },
    {
      id: "email-safety",
      title: "Email Security Best Practices",
      description: "Understand safe email handling and credential management",
      completed: completedModules.has("email-safety"),
    },
    {
      id: "best-practices",
      title: "Company Security Guidelines",
      description: "Follow our organization's security protocols and procedures",
      completed: completedModules.has("best-practices"),
    },
  ];

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules((prev) => new Set([...prev, moduleId]));
    setCurrentModule(null);
  };

  const allModulesCompleted = trainingModules.length === completedModules.size;

  const handleStartQuiz = async () => {
    if (!token || !allModulesCompleted) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/training/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });

      router.push(`/quiz?token=${token}`);
    } catch (error) {
      console.error("Error marking training complete:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Alert */}
        <Alert className="mb-8 border-orange-500/50 bg-orange-950/30">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <AlertDescription className="text-orange-100 ml-3">
            <strong>Security Alert:</strong> The email you received was a simulated phishing attack. 
            Please complete this mandatory security training to better protect yourself and our organization.
          </AlertDescription>
        </Alert>

        {/* Main Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-lg">
            <CardTitle className="text-white text-2xl">Phishing Awareness Training</CardTitle>
            <CardDescription className="text-slate-300">
              Complete all modules to proceed to the assessment quiz
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {/* Training Modules */}
            <div className="space-y-4 mb-8">
              {trainingModules.map((module) => (
                <div key={module.id}>
                  {currentModule === module.id ? (
                    <TrainingModule
                      module={module}
                      onComplete={() => handleModuleComplete(module.id)}
                      onCancel={() => setCurrentModule(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setCurrentModule(module.id)}
                      className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                            {module.completed ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                {module.title}
                              </>
                            ) : (
                              <>
                                <div className="h-5 w-5 rounded-full border-2 border-slate-500" />
                                {module.title}
                              </>
                            )}
                          </h3>
                          <p className="text-slate-300 text-sm">{module.description}</p>
                        </div>
                        {!module.completed && (
                          <Play className="h-5 w-5 text-blue-400 flex-shrink-0 ml-4" />
                        )}
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Progress</span>
                <span className="text-sm font-bold text-blue-400">
                  {completedModules.size} / {trainingModules.length} Complete
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedModules.size / trainingModules.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleStartQuiz}
              disabled={!allModulesCompleted || isSubmitting}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Proceed to Assessment Quiz"}
            </Button>

            {!allModulesCompleted && (
              <p className="text-center text-sm text-slate-400 mt-4">
                Complete all training modules to take the quiz
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrainingModule({
  module,
  onComplete,
  onCancel,
}: {
  module: TrainingModule;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollHeight, scrollTop, clientHeight } = contentRef.current;
      const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(scrolled, 100));
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const contentMap: Record<string, React.ReactNode> = {
    phishing: (
      <div className="space-y-6 text-slate-200">
        <div>
          <h4 className="font-bold text-lg text-white mb-3">What is Phishing?</h4>
          <p>
            Phishing is a type of social engineering attack where attackers impersonate legitimate
            organizations through email, messages, or websites to steal sensitive information like
            passwords, credit card numbers, and personal data.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">Common Phishing Tactics</h4>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-3">
              <span className="text-red-400">•</span>
              <span>
                <strong>Urgent Action Required:</strong> False claims that your account will be
                closed or compromised
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-400">•</span>
              <span>
                <strong>Suspicious Links:</strong> URLs that look legitimate but redirect to fake
                websites
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-400">•</span>
              <span>
                <strong>Spoofed Sender:</strong> Emails appearing to be from known contacts or
                trusted companies
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-400">•</span>
              <span>
                <strong>Attachments with Malware:</strong> Dangerous files disguised as legitimate
                documents
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">Red Flags to Watch For</h4>
          <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-4 space-y-2">
            <p>✗ Generic greetings (&quot;Dear User&quot; instead of your name)</p>
            <p>✗ Spelling and grammar errors</p>
            <p>✗ Mismatched sender email addresses</p>
            <p>✗ Requests for passwords or sensitive information</p>
            <p>✗ Unexpected attachments or urgent time pressure</p>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">What You Should Do</h4>
          <div className="bg-green-950/30 border border-green-500/30 rounded-lg p-4 space-y-2">
            <p>✓ Verify sender addresses carefully</p>
            <p>✓ Hover over links to see the actual URL</p>
            <p>✓ Never click links from unsolicited emails</p>
            <p>✓ Contact the organization directly using known contact information</p>
            <p>✓ Report suspicious emails to your IT security team</p>
          </div>
        </div>
      </div>
    ),
    "email-safety": (
      <div className="space-y-6 text-slate-200">
        <div>
          <h4 className="font-bold text-lg text-white mb-3">Email Security Fundamentals</h4>
          <p>
            Email is one of the most common attack vectors for cybercriminals. Understanding email
            security best practices is crucial for protecting yourself and your organization.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">Password Security</h4>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>
                <strong>Never share passwords</strong> via email, chat, or phone - even with IT
                staff
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>
                <strong>Use strong passwords</strong> with a mix of uppercase, lowercase, numbers,
                and symbols
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>
                <strong>Use unique passwords</strong> for each account (use a password manager)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>
                <strong>Enable two-factor authentication</strong> on all important accounts
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">Protecting Your Email Account</h4>
          <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4 space-y-3">
            <div>
              <p className="font-semibold text-white mb-1">Keep Software Updated</p>
              <p className="text-sm">Regularly update your browser and email client to patch security vulnerabilities</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Use Anti-Malware Software</p>
              <p className="text-sm">Install and maintain reputable antivirus and anti-malware software</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Verify Before Acting</p>
              <p className="text-sm">When in doubt, contact the sender using a different communication method</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">What NOT to Do</h4>
          <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-4 space-y-2">
            <p>✗ Don&apos;t use your work email for personal accounts</p>
            <p>✗ Don&apos;t open attachments from unknown senders</p>
            <p>✗ Don&apos;t click links without verifying the sender</p>
            <p>✗ Don&apos;t leave your computer unattended while logged in</p>
            <p>✗ Don&apos;t share sensitive information via unencrypted email</p>
          </div>
        </div>
      </div>
    ),
    "best-practices": (
      <div className="space-y-6 text-slate-200">
        <div>
          <h4 className="font-bold text-lg text-white mb-3">Our Security Culture</h4>
          <p>
            Security is everyone&apos;s responsibility. By following these best practices, you help
            protect not just yourself, but the entire organization.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">Incident Reporting</h4>
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4">
            <p className="mb-3">
              If you discover or suspect a security incident:
            </p>
            <ol className="space-y-2 ml-4">
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">1.</span>
                <span>Stop interacting with the suspicious email or link immediately</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">2.</span>
                <span>Do not forward the email or share sensitive information</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">3.</span>
                <span>Report it to your IT Security team right away</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">4.</span>
                <span>Preserve evidence (don&apos;t delete the email)</span>
              </li>
            </ol>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">Device Security</h4>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-3">
              <span className="text-cyan-400">•</span>
              <span>Lock your computer when you step away</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">•</span>
              <span>Use a VPN when connecting to public Wi-Fi networks</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">•</span>
              <span>Enable firewall and automatic security updates</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">•</span>
              <span>Be cautious with USB drives and external devices</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-3">Regular Training</h4>
          <p>
            Security training is ongoing. Stay informed about the latest threats and always be
            vigilant. If you&apos;re unsure about something, ask your IT security team - they&apos;re here
            to help!
          </p>
        </div>

        <div className="bg-green-950/30 border border-green-500/30 rounded-lg p-4">
          <p className="font-semibold text-green-300 mb-2">Key Takeaway</p>
          <p>
            You are the first line of defense against cyber attacks. Your awareness and vigilance
            protect our organization.
          </p>
        </div>
      </div>
    ),
  };

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden bg-slate-700/30">
      <div className="bg-slate-700/60 p-4 border-b border-slate-600">
        <h3 className="text-white font-semibold text-lg">{module.title}</h3>
      </div>

      <div
        ref={contentRef}
        className="h-96 overflow-y-auto p-6 scroll-smooth"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(100,116,139,0.03) 50%, rgba(15,23,42,0) 100%)",
        }}
      >
        {contentMap[module.id]}
      </div>

      <div className="bg-slate-700/50 border-t border-slate-600 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">
            Scroll to read more ({Math.round(scrollProgress)}%)
          </span>
          <div className="w-20 bg-slate-600 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full transition-all"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Back
          </Button>
          <Button
            onClick={onComplete}
            disabled={scrollProgress < 90}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scrollProgress < 90 ? `Complete (${Math.round(scrollProgress)}%)` : "Mark as Complete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
