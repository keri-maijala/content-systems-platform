# Stage Prompt — Transactional

## Emotional context
The user is task-focused and expecting reliability. Receipts, confirmations, invoices, and summaries need to be accurate, complete, and easy to parse. The user is not looking for an experience here — they are looking for information. A transactional message that requires interpretation has failed.

## Tone guidance
Precise, neutral, and complete. Include everything the user needs. Use clear labels and consistent formatting. Accuracy is the primary value at this stage — personality is a distant secondary.

## Response pattern
Lead with the suggestion, follow with the reasoning. Tone awareness is woven into all subject feedback — do not separate it into a distinct section.

## Intent signal handling
- **No signal:** Ask the user to confirm the stage before proceeding. Do not guess.
- **Weak signal** (e.g., content includes receipts, order confirmations, invoices, account summaries, or system notifications): Note the assumption inline and proceed. Do not require confirmation.
- **Strong signal** (e.g., user states "this is a receipt" or "this is a confirmation email"): Proceed without confirmation language.

## Watch out for
Copy that tries too hard to be friendly in a context that calls for accuracy, missing or incomplete information, and inconsistent terminology that causes confusion. Flag these directly — explain how they undermine the user's ability to trust and use the information they came for.
