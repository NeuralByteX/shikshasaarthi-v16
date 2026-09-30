# V17 Diagnostic Update

The diagnostic now uses three supporting signals instead of raw MCQ accuracy alone:

1. Correctness
2. Self-reported confidence (guess / somewhat sure / very sure)
3. Response time

Questions also receive a local difficulty level (foundation/practice/challenge).

The app computes an evidence score per answer and an evidence-based topic score. A correct answer with low confidence and very fast response contributes less evidence, reducing the chance that a lucky guess immediately becomes “mastered”.

A topic that looks strong but contains likely-guess/low-confidence evidence is marked `verificationNeeded` rather than being declared mastered.

This is still a deterministic offline diagnostic engine, not a trained ML model. Gemini/n8n remains an optional online enhancement.
