"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Result() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const score = searchParams.get("score");

  const passed = status === "passed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className={`w-full max-w-lg ${passed ? "border-green-500/30" : "border-orange-500/30"}`}>
        <CardHeader className={`${passed ? "bg-green-950/30" : "bg-orange-950/30"} border-b`}>
          <div className="flex items-center gap-3">
            {passed ? (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-orange-500" />
            )}
            <CardTitle className={passed ? "text-green-400" : "text-orange-400"}>
              {passed ? "Training Complete" : "Training Required"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          {passed ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
                <p className="text-slate-300">
                  You have successfully completed the phishing awareness training and quiz. Your achievement
                  will be recorded in the security dashboard.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Your Score</div>
                <div className="text-3xl font-bold text-green-400">{score}%</div>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong className="text-white">Next Steps:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Continue to follow email security best practices</li>
                  <li>Stay alert to phishing threats</li>
                  <li>Report suspicious emails to IT security</li>
                  <li>Keep your software and antivirus updated</li>
                </ul>
              </div>

              <div className="bg-green-950/30 border border-green-500/30 rounded-lg p-4 text-sm text-green-200">
                Your training completion has been recorded and is now visible on the admin dashboard.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Review Required</h2>
                <p className="text-slate-300">
                  You need to achieve at least 75% on the quiz to complete the training. Please review
                  the training materials and try again.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-orange-500/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Your Score</div>
                <div className="text-3xl font-bold text-orange-400">{score}%</div>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong className="text-white">Tips for Improvement:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Pay close attention to the phishing recognition section</li>
                  <li>Review email security best practices</li>
                  <li>Learn about company security guidelines</li>
                  <li>Take notes while reading the training materials</li>
                </ul>
              </div>

              <div className="bg-orange-950/30 border border-orange-500/30 rounded-lg p-4 text-sm text-orange-200">
                Go back to the training page to retake the quiz. You can access it from the campaign dashboard.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
  