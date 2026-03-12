import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const questions = [
  {
    question: "How would you describe your overall mood in the past two weeks?",
    options: ["Very positive", "Mostly good", "Neutral", "Often low", "Consistently down"],
  },
  {
    question: "How well have you been sleeping recently?",
    options: ["Very well", "Fairly well", "It varies", "Poorly", "Barely sleeping"],
  },
  {
    question: "How often do you feel overwhelmed or anxious?",
    options: ["Rarely", "Occasionally", "Sometimes", "Often", "Almost always"],
  },
  {
    question: "How connected do you feel to the people around you?",
    options: ["Very connected", "Mostly connected", "Somewhat", "Disconnected", "Very isolated"],
  },
  {
    question: "How motivated do you feel to do daily tasks or activities you enjoy?",
    options: ["Highly motivated", "Fairly motivated", "Neutral", "Low motivation", "No motivation at all"],
  },
];

const VITE_N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Index = () => {
  const [step, setStep] = useState<"info" | "quiz" | "done">("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartQuiz = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    let valid = true;

    if (!trimmedName) {
      setNameError("Please enter your name.");
      valid = false;
    } else if (trimmedName.length > 100) {
      setNameError("Name must be less than 100 characters.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!trimmedEmail) {
      setEmailError("Please enter your email.");
      valid = false;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (valid) {
      setStep("quiz");
    }
  };

  const handleNext = async () => {
    if (!selected) return;

    const newAnswers = [...answers, { question: questions[currentQ].question, answer: selected }];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setLoading(true);
      try {
        await fetch(VITE_N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), responses: newAnswers }),
        });
        setStep("done");
        toast.success("Your responses have been submitted!");
      } catch {
        toast.error("Failed to submit. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (step === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-8 pb-8">
            <div className="text-4xl mb-4">🙏</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Thank you, {name.trim()}!</h2>
            <p className="text-muted-foreground">Your responses have been recorded. Take care of yourself.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "info") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground">Before we begin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(""); }}
                maxLength={100}
              />
              {nameError && <p className="text-sm text-destructive">{nameError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                maxLength={255}
              />
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </div>
            <Button onClick={handleStartQuiz} className="w-full mt-2">
              Start 
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <p className="text-sm text-muted-foreground mb-1">
            Question {currentQ + 1} of {questions.length}
          </p>
          <CardTitle className="text-lg font-medium text-foreground">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                selected === option
                  ? "bg-accent border-primary text-accent-foreground font-medium"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              {option}
            </button>
          ))}
          <Button
            onClick={handleNext}
            disabled={!selected || loading}
            className="w-full mt-4"
          >
            {loading ? "Submitting..." : currentQ < questions.length - 1 ? "Next" : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
