# Proof - Screen Specifications & UI/UX Requirements

## Design System Overview

**Design Philosophy:** Trust through transparency, credibility through clarity  
**Primary Colors:** Deep Navy (#0A192F), Electric Blue (#64FFDA), Cloud White (#F8F9FA)  
**Typography:** Inter (headings), Source Sans Pro (body)  
**Elevation:** Subtle shadows for cards, flat for proof displays  
**Animation:** Smooth transitions (300ms), progress indicators for async actions

---

## Web Application Screens (React + Vite)

### 1. Landing Page

**URL:** `/`  
**Purpose:** Convert visitors to signups by demonstrating the proof-first concept

**Sections:**
- Hero: Split screen with candidate video proof example on left, employer challenge example on right
- Social proof: Rotating ticker of recent hires ("Sarah got hired at Stripe via Proof")
- How it works: 3-step visual (Upload Proof → Complete Challenge → Get Hired)
- Role selection: Two prominent CTAs (I'm Job Seeking / I'm Hiring)
- Trust indicators: Logos of partner companies, security badges, "No resumes needed" guarantee

**Interactions:**
- Video proof examples play on hover with sound off by default
- CTA buttons pulse subtly every 5 seconds
- Scroll-triggered animations for feature reveals

---

### 2. Authentication Flow

**Screens:**
- `/signup` - Role selection (Candidate/Employer) with visual differentiation
- `/onboarding/candidate` - 3-step: Connect accounts → Upload first proof → Set preferences
- `/onboarding/employer` - Company verification, team invites, challenge template selection

**Components:**
- Progress stepper at top
- Smart defaults (auto-detect skills from GitHub/LinkedIn)
- Inline validation with helpful error messages
- Skip option with "You can complete this later" messaging

---

### 3. Candidate Dashboard

**URL:** `/dashboard`  
**Layout:** Sidebar navigation + main content area

**Sidebar:**
- Profile completeness indicator (circular progress)
- Navigation: My Proofs, Challenges, Applications, Messages, Analytics
- Upgrade CTA (if on free tier)

**Main Content - Default View:**
- Daily digest: New matching challenges (3-5 cards)
- Recent activity: Profile views, proof reactions, application status updates
- Quick actions: Upload new proof, Browse challenges, Share profile

**Challenge Cards:**
- Company logo, role title, prize amount (if any)
- Match percentage badge
- Time to complete estimate
- "Start Challenge" or "View Details" buttons
- Save for later (bookmark icon)

---

### 4. Proof Portfolio Builder

**URL:** `/proofs`  
**Purpose:** Create, manage, and organize work demonstrations

**Layout:** Grid of proof cards with "Add New" prominent

**Proof Card States:**
- Draft: Grayed out, edit button
- Published: Color-coded by type (Video=purple, Task=green, Endorsement=blue)
- Featured: Star badge, appears in "Best Work" section
- Analytics: View count, average watch time, employer saves

**Add Proof Modal - Video Type:**
- Screen recording option (browser extension required) or upload
- 90-second timer with countdown
- Teleprompter for key talking points
- Preview before publish
- Thumbnail selection from video frames

**Add Proof Modal - Live Task:**
- Task library browser (categorized by skill)
- Difficulty filter (Beginner/Intermediate/Advanced)
- Practice mode toggle
- Start official attempt (limited attempts per task)

**Add Proof Modal - Peer Endorsement:**
- LinkedIn contact importer
- Skill selection dropdown
- Pre-written request templates
- Pending/Completed status tracking

---

### 5. Challenge Interface

**URL:** `/challenge/:id`  
**Purpose:** Complete employer challenges in controlled environment

**Pre-Challenge Screen:**
- Challenge overview and requirements
- Time limit warning
- Prize details (if applicable)
- Equipment check (camera, microphone, screen sharing permissions)
- Practice mode option

**Active Challenge Screen:**
- Split view: Instructions left, workspace right
- Timer (prominent, turns red under 2 minutes)
- Submit button (with "Are you sure?" confirmation)
- Emergency pause (medical/technical issues, flagged for review)

**Workspaces by Type:**
- **Code:** Embedded IDE with syntax highlighting, test case runner
- **Design:** Figma-like interface with component library
- **Writing:** Rich text editor with word count
- **Sales:** Mock CRM interface with contact records
- **Analysis:** Data visualization tools with dataset upload

**Post-Submission:**
- Optional 60-second reflection video upload
- Confirmation screen with submission ID
- Expected response timeline (powered by employer average)
- Share to social media option

---

### 6. Application Tracker

**URL:** `/applications`  
**Purpose:** Monitor all active applications and their status

**Layout:** Kanban board (Mobile: list view)

**Columns:**
- Applied (proof submitted)
- Under Review (employer viewing)
- Challenge Stage (awaiting completion or under evaluation)
- Interviewing (scheduled or completed)
- Decision (offer, rejection, or withdrawn)

**Card Details:**
- Company logo and role
- Submitted date
- Current stage duration
- Next expected action
- Employer messaging thread access

**Rejection Handling:**
- Feedback display (if provided)
- "Was this feedback helpful?" rating
- Suggested improvements based on feedback
- Re-apply eligibility date (if applicable)

---

### 7. Employer Dashboard

**URL:** `/employer/dashboard`  
**Layout:** Analytics header + tabbed interface

**Analytics Header:**
- Active challenges count
- Total submissions this month
- Average time to hire (vs. industry benchmark)
- Quality score (candidate ratings aggregated)

**Tabs:**
- **Challenges:** Active, Draft, Completed challenges list
- **Submissions:** Inbox-style list with filtering (unread, starred, rejected)
- **Pipeline:** Visual funnel of candidates by stage
- **Team:** Member management and permissions

**Challenge Creation Wizard:**
- Step 1: Select template or start from scratch
- Step 2: Configure rubric (add/remove criteria, set weights)
- Step 3: Set prize and visibility
- Step 4: Preview and publish

---

### 8. Submission Review Interface

**URL:** `/employer/review/:submissionId`  
**Purpose:** Evaluate candidate work with team collaboration

**Layout:** Three-column (Proof display, Rubric scoring, Team discussion)

**Left Column - Proof Display:**
- Video player with speed control and timestamp comments
- Code/design workspace with version history
- Work sample links (open in new tab or embedded preview)

**Center Column - Scoring:**
- Rubric criteria with 1-5 star rating
- Weighted total calculation
- Compare to past hires toggle
- Overall fit rating (Strong Yes / Yes / Maybe / No)
- Optional: Request additional proof (specific follow-up task)

**Right Column - Collaboration:**
- Team member comments with @mentions
- Score aggregation (if multiple reviewers)
- Previous submissions from same candidate
- Schedule interview button (auto-populates candidate availability)

**Bulk Actions:**
- Send rejection with feedback template
- Move to interview stage
- Save to talent pool for future roles
- Download submission assets (PDF report)

---

### 9. Messaging Center

**URL:** `/messages`  
**Purpose:** Platform-native communication between candidates and employers

**Layout:** Conversation list left, active conversation right

**Features:**
- Read receipts and typing indicators
- Video call scheduling with calendar integration
- File attachment (limited to challenge-related documents)
- Message templates for common scenarios
- Translation for international candidates (optional)

---

### 10. Analytics & Insights

**Candidate URL:** `/analytics`  
**Employer URL:** `/employer/analytics`

**Candidate Analytics:**
- Profile view trends (last 30/60/90 days)
- Proof performance (completion rates, average ratings)
- Application funnel (applied → viewed → interviewed → offered)
- Benchmarking: How you compare to similar candidates

**Employer Analytics:**
- Challenge performance (submission rate, quality distribution)
- Source effectiveness (which channels bring best candidates)
- Time-to-hire trends
- Diversity metrics (optional tracking)
- ROI calculator (cost per hire vs. previous methods)

---

## Mobile Application Screens (React Native)

### Core Navigation Structure

**Bottom Tab Bar (Candidate):**
- Home (challenges digest)
- Proofs (portfolio management)
- Apply (camera-first quick apply)
- Track (applications)
- Profile

**Bottom Tab Bar (Employer):**
- Dashboard
- Challenges
- Review (submissions inbox)
- Messages
- Team

---

### Mobile-Specific Screens

### 1. Quick Proof Capture

**Screen:** `QuickProof`  
**Trigger:** Floating action button or deep link

**Flow:**
- Open camera directly (front/back toggle)
- 90-second countdown overlay
- Pause/resume capability
- Quick retake or proceed
- Add title and skill tags
- Publish immediately or save draft

**Optimizations:**
- Vertical video format (9:16) supported
- Auto-stabilization
- Low-light enhancement
- Background upload (continue browsing while processing)

---

### 2. Challenge Discovery (Mobile)

**Screen:** `ChallengeFeed`  
**Format:** TikTok-style vertical scroll or card stack

**Card Content:**
- Full-screen company branding
- Role title and compensation
- Swipe up for details (requirements, time estimate)
- Quick apply button (uses default proofs)
- Save for later (swipe right)

**Gestures:**
- Tap to pause/play preview video
- Double tap to save
- Share to external apps

---

### 3. Mobile Challenge Completion

**Screen:** `ActiveChallenge`  
**Constraints:** Optimized for small screens, touch input

**Adaptations:**
- Simplified IDE with autocomplete and syntax highlighting
- Voice-to-text for written challenges
- Photo upload for design/whiteboard tasks
- Offline mode with sync (for commute completion)

---

### 4. Push Notification Center

**Screen:** `Notifications`  
**Categories:**
- New matching challenges (personalized)
- Application status updates
- Employer messages
- Proof engagement (someone viewed/liked)
- System: Profile incomplete, subscription renewal

**Actions:**
- Swipe to dismiss
- Tap to deep link to relevant screen
- Batch actions (mark all read)

---

### 5. Employer Quick Review

**Screen:** `QuickReview`  
**Purpose:** Review submissions during commute/downtime

**Format:**
- Card stack of pending submissions
- Swipe right: Advance to interview
- Swipe left: Reject with template
- Swipe up: Save for desktop review
- Tap: View full details

**Audio Feature:**
- Text-to-speech for code comments or written submissions
- Voice memo feedback recording

---

## Responsive Design Breakpoints

- **Mobile:** 320px - 767px (React Native primary, web responsive)
- **Tablet:** 768px - 1023px (hybrid layouts, sidebar collapses)
- **Desktop:** 1024px+ (full feature set, multi-column layouts)

---

## Accessibility Requirements

- All videos require captions (auto-generated + editable)
- Screen reader optimized navigation
- Keyboard-only navigation support
- Color contrast ratios 4.5:1 minimum
- Focus indicators for all interactive elements
- Alt text for all images and non-text content

---

## Animation Specifications

**Micro-interactions:**
- Button presses: Scale 0.95, 100ms
- Page transitions: Slide left/right, 300ms ease-in-out
- Loading states: Skeleton screens, not spinners
- Success states: Checkmark animation, subtle haptic feedback (mobile)
- Real-time updates: Smooth number counting, progress bars

**Performance:**
- 60fps animations mandatory
- Reduced motion respect for accessibility settings
- Lazy loading for video proofs (thumbnail first, auto-play on viewport entry)

---

## Empty States & Error Handling

**Empty States:**
- No proofs yet: Illustrated guide with "Record your first proof" CTA
- No applications: "Discover challenges" with suggested starting points
- No submissions (employer): "Create your first challenge" wizard launch

**Error States:**
- Video upload failed: Retry with exponential backoff, offline queue
- Challenge timeout: Graceful save of partial work, appeal process
- Payment failure: Soft decline with retry, account suspension warning
- 404/500: Friendly illustrations, automatic error reporting, support contact

---

**Document Version:** 1.0  
**Last Updated:** February 2024  
**Design Lead:** [Name]  
**Next Review:** Post-user testing round 1