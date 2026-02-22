# Proof - Product Requirements Document

## Overview

**Product Name:** Proof  
**Tagline:** Apply with proof, not promises  
**Platform:** Web Application (React + Vite), Mobile Application (React Native)  
**Target Launch:** Q3 2024

---

## 1. Product Vision

Proof is a proof-first job marketplace that replaces resumes with validated work samples. Candidates demonstrate abilities through video explanations, live tasks, and peer-verified endorsements. Employers post challenges instead of job descriptions, ensuring both parties have concrete evidence of fit before any conversation begins.

---

## 2. Target Users

### Primary: Job Seekers
- **Segment 1:** Early-career professionals (0-3 years) seeking first break
- **Segment 2:** Career switchers with portfolio work but non-traditional backgrounds
- **Segment 3:** Experienced professionals (5+ years) tired of traditional application black holes

### Secondary: Employers
- **Segment 1:** Startups (10-100 employees) hiring technical/creative roles
- **Segment 2:** Mid-market companies (100-1000 employees) with high-volume hiring needs
- **Segment 3:** Enterprise talent acquisition teams seeking diverse pipelines

---

## 3. Core Value Proposition

For candidates: Get hired based on what you can actually do, not who you know or how well you write resumes.

For employers: See candidates perform real work before investing in interviews, eliminating 80% of unqualified applicants upfront.

---

## 4. Feature Requirements

### 4.1 Authentication & Onboarding

**User Story:** As a new user, I want to create an account and understand how Proof works so I can start building my credibility.

**Features:**
- Social login (Google, LinkedIn, GitHub)
- Email/password with verification
- Role selection (Candidate/Employer) with distinct onboarding flows
- Interactive product tour (3-step guided walkthrough)
- Profile completeness tracker with progress incentives

**Success Metrics:** 70% completion of onboarding flow, &lt;2 minute time-to-value

---

### 4.2 Candidate Profile & Proof Portfolio

**User Story:** As a candidate, I want to showcase my abilities through multiple proof types so employers can evaluate me accurately.

**Features:**

**Proof Types:**
- **Video Proof:** 90-second screen recording with voiceover explaining a project, walking through code, or presenting design work
- **Live Task:** 15-minute timed challenge selected from employer library or candidate-created
- **Work Sample:** Links to GitHub repos, Figma files, published articles, sales dashboards (with view-only access controls)
- **Peer Endorsement:** Colleagues verify specific skills via LinkedIn- authenticated short-form reviews (max 280 characters)

**Profile Components:**
- Headline with primary skill tag
- Proof cards organized by skill category
- "Best Work" pin feature (top 3 proofs highlighted)
- Availability status (actively looking, open to offers, not available)
- Preferred role types, locations, compensation ranges
- Proof engagement analytics (views, reactions, employer saves)

**Success Metrics:** Average 4.2 proofs per active candidate, 60% video proof upload rate

---

### 4.3 Challenge Marketplace

**User Story:** As an employer, I want to post work-sample challenges that attract qualified candidates and filter out unqualified applicants automatically.

**Features:**

**Challenge Creation:**
- Template library (debugging, design critique, sales pitch, writing sample, data analysis)
- Custom challenge builder with time limits (15 min, 30 min, 1 hour)
- Prize pool configuration ($0 for exposure, $200-2000 for competitive bounties)
- Scoring rubric builder (criteria: code quality, communication, creativity, speed)
- Automated plagiarism detection flagging

**Challenge Types:**
- **Open Bounty:** Public, anyone can submit, best solution wins prize + interview
- **Invite-Only:** Specific candidates invited based on proof portfolio match
- **Sponsored:** Proof features challenge to relevant candidate segments

**Candidate Experience:**
- Challenge discovery with difficulty ratings
- Practice mode (unscored trial runs)
- Submission portal with timer and auto-save
- Post-submission reflection video (optional 60-second explanation)

**Success Metrics:** 45% challenge completion rate, 30% of submissions rated "interview-worthy" by employers

---

### 4.4 Matching & Discovery

**User Story:** As a candidate, I want to discover relevant opportunities without keyword searching. As an employer, I want qualified candidates surfaced automatically.

**Features:**

**For Candidates:**
- "Proof Match" score indicating fit percentage
- Daily digest of new challenges matching skill proofs
- Employer "saves" and profile views notifications
- "Fast Track" alerts when employers request direct challenge invites

**For Employers:**
- Candidate search filtered by proof quality scores, not keywords
- "Similar to Hired" recommendations based on past successful hires
- Diversity filters (optional): underrepresented groups, non-traditional backgrounds
- Talent pipeline stages: Discovered → Challenged → Submitted → Interviewing → Hired

**Success Metrics:** 25% match-to-application conversion, 50% reduction in time-to-qualified-candidate vs. traditional job boards

---

### 4.5 Application Flow

**User Story:** As a candidate, I want to apply to roles by demonstrating ability, not writing cover letters. As an employer, I want to review demonstrated work before scheduling conversations.

**Features:**

**Application Types:**
- **Challenge-First:** Complete employer's challenge, auto-submitted upon completion
- **Proof-First:** Submit existing portfolio proofs for employer review
- **Hybrid:** Existing proofs + optional challenge for bonus consideration

**Candidate Side:**
- One-click apply using pre-selected "best work" proofs
- Application tracking dashboard with stage indicators
- Feedback requests (employers can provide 1-click feedback: "strong technical skills, weak communication")
- Withdrawal option with reason capture

**Employer Side:**
- Proof review interface with side-by-side comparison
- Rating system: Technical Ability, Communication, Culture Add, Overall Fit
- Collaboration tools: hiring team comments, @mentions, score aggregation
- Automated rejection with personalized feedback (using templates + specific proof references)
- Interview scheduling integration (Calendly, Greenhouse, Lever)

**Success Metrics:** 3-day average employer response time, 40% of rejections include feedback

---

### 4.6 Trust & Verification

**User Story:** As a user, I want to trust that proofs are authentic and endorsements are genuine.

**Features:**
- LinkedIn OAuth for identity verification and employment history sync
- GitHub/Behance/Dribbble account linking with contribution verification
- Peer endorsement fraud detection (flags reciprocal endorsement rings)
- Video proof liveness detection (prevent pre-recorded submissions)
- "Verified Employer" badge for companies with confirmed domain emails and funding status
- Dispute resolution portal for challenge prize disagreements

**Success Metrics:** &lt;2% fraud rate, 85% user trust score in quarterly surveys

---

### 4.7 Communication

**User Story:** As a matched candidate and employer, I want to communicate within the platform before sharing personal contact details.

**Features:**
- In-app messaging with read receipts
- Video call scheduling (native or Zoom integration)
- Template library for common messages (interview invites, offer negotiations)
- Communication analytics: response time, message sentiment
- Export conversation history upon hire

**Success Metrics:** 70% of hires complete at least one interview via platform

---

### 4.8 Monetization & Payments

**User Story:** As a candidate, I want transparent pricing. As an employer, I want to pay for results, not postings.

**Features:**

**Candidate Tiers:**
- **Free:** 3 applications/month, 2 video proofs, basic analytics
- **Pro ($9/month):** Unlimited applications, unlimited proofs, priority matching, detailed analytics, profile boost
- **Teams (coming later):** Agency/recruiter features

**Employer Tiers:**
- **Pay-Per-Hire:** 5% of first-year salary, no upfront costs
- **Growth ($999/month):** Unlimited postings, 10 active challenges, dedicated account manager
- **Enterprise (custom):** API access, SSO, custom challenge development, advanced analytics

**Payment Infrastructure:**
- Stripe integration for subscriptions and challenge prizes
- Escrow for bounty challenges (released upon employer confirmation of valid submission)
- Automated invoicing for enterprise contracts

---

## 5. User Flows

### Candidate Journey
1. Sign up → LinkedIn/GitHub connect → Profile creation
2. Upload first proof (video walkthrough of past work)
3. Complete practice challenge (unscored, learn platform)
4. Discover challenges via daily digest
5. Submit to 3-5 relevant opportunities
6. Receive employer interest → Schedule interview via platform
7. Accept offer → Platform marks success, requests review

### Employer Journey
1. Company verification → Team member invites
2. Create first challenge using template
3. Review submissions with hiring team
4. Invite top 3 candidates to interview
5. Extend offer through platform
6. Pay success fee or subscription invoice

---

## 6. Success Metrics & KPIs

### North Star Metric
**Monthly Validated Hires:** Number of candidates hired where both parties confirm the hire originated from Proof

### Supporting Metrics
- **Candidate Side:** Proof upload rate, application-to-interview rate, time-to-offer vs. traditional methods
- **Employer Side:** Challenge submission quality score, time-to-hire reduction, cost-per-hire vs. LinkedIn/Indeed
- **Platform Health:** Net Revenue Retention, viral coefficient (candidates inviting peers), marketplace liquidity ratio (open challenges : active candidates)

---

## 7. Technical Constraints

- Video proof storage and streaming optimization (compressed without quality loss)
- Real-time challenge environment (code execution, design tools) with anti-cheat measures
- LinkedIn API rate limits for verification features
- GDPR/CCPA compliance for EU/California users
- Accessibility: WCAG 2.1 AA compliance for video captions and screen readers

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Low employer adoption (chicken-egg) | Launch with 10 anchor employers offering guaranteed $500+ bounties |
| Candidates won't create video proofs | Offer AI-assisted recording tips, practice mode, and proof review service |
| Employers steal challenge solutions without hiring | Watermarked submissions, 30-day exclusivity period, legal terms |
| Proof quality variance | Community moderation + employer rating system for proof helpfulness |

---

## 9. Future Roadmap

**Phase 2 (Months 4-6):** Mobile app launch, AI-powered proof improvement suggestions, team hiring (collaborative challenges)

**Phase 3 (Months 7-12):** Skills passport (universal credential verification), internal mobility tools for enterprises, global expansion (localized challenges)

**Phase 4 (Year 2):** Proof API for LMS integration, automated reference checking, salary benchmarking based on proof quality scores

---

## 10. Appendices

### A. Glossary
- **Proof:** Any validated demonstration of work ability (video, task completion, peer endorsement)
- **Challenge:** Employer-created work sample task with defined criteria and optional prize
- **Proof Match:** Algorithmic score indicating candidate-employer fit based on proof analysis

### B. Competitive Analysis
- **LinkedIn:** Resume-based, no validation, quantity over quality
- **HackerRank/LeetCode:** Technical only, no employer-candidate marketplace
- **Turing/Toptal:** Vetted talent, high fees, limited to elite candidates
- **Proof differentiator:** Accessible to all skill levels, proof-first for every role type, transparent and fair

---

**Document Version:** 1.0  
**Last Updated:** February 2024  
**Product Owner:** [Founder Name]  
**Next Review:** March 2024