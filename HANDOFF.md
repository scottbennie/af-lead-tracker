# AF Online Lead Generator Tracker — Claude Code Handoff

## Project Overview
Internal lead tracking app for Action Furnace Inc. (Calgary, AB).
Tracks inbound leads from three online sources: GetSuite, FurnacePrices, and HomeStars.
Used by up to 4 coordinators simultaneously.

---

## Current Stack
- **Frontend:** Single HTML file (index.html) — vanilla JS, no framework
- **Database:** Supabase (Postgres) — hosted in Canada Central
- **AI parsing:** Anthropic API (claude-sonnet-4-20250514) — paste-to-parse email extraction
- **Hosting:** Moving from GitHub Pages → Netlify

## Target Stack (Claude Code migration)
- **Frontend:** Same single-file HTML, or optionally migrate to React if beneficial
- **Database:** Migrate from Supabase → Firebase Firestore
- **Hosting:** Netlify
- **Auth:** Optional — currently no auth, all coordinators share access via URL

---

## Supabase Credentials (CURRENT — to be migrated away from)
- **Project URL:** https://zyxcsaankwyafdghqfnz.supabase.co
- **Anon key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5eGNzYWFua3d5YWZkZ2hxZm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjY2MzksImV4cCI6MjA5NjYwMjYzOX0.XJIS6hLBR4vTZBw4KIAYk9xjaohSSWKM6AxndxWGFiA
- **Table:** leads (see schema below)

## Anthropic API
- **Key:** DEACTIVATED — generate a new one at console.anthropic.com
- **Model:** claude-sonnet-4-20250514
- **Use:** Email paste-to-parse for GetSuite and FurnacePrices leads

---

## Database Schema (Supabase → replicate in Firebase)

```
leads {
  id: string (primary key, uid)
  source: string          // "GetSuite" | "FurnacePrices" | "HomeStars"
  name: string
  phone: string
  email: string
  city: string            // dropdown: Calgary, Edmonton, Red Deer, Airdrie,
                          // Cochrane, Chestermere, Okotoks, St. Albert,
                          // Sherwood Park, Spruce Grove, Leduc,
                          // Fort Saskatchewan, Other
  address: string
  service: string         // "Furnace" | "AC" | "Furnace + AC" | "Duct Cleaning"
                          // | "Mini-Split" | "Water Softener" | "Maintenance" | "Other"
  urgency: string         // "Ready to book" | "Within weeks" | "Just pricing" | "Early research"
  received_at: timestamp
  first_contact_at: timestamp
  status: string          // "New" | "Contacted" | "Follow-Up" | "Booked" | "Disqualified"
  disq_reason: string     // "Out of Area" | "Wrong Equipment Type" | "Bad Contact Info"
                          // | "Customer Not Interested" | "Duplicate"
  notes: string
  gs_status: string       // GetSuite only: "Abandoned" | "Completed"
  gs_home_size: string    // GetSuite only: "Small" | "Medium" | "Large"
  gs_package: string      // GetSuite Completed only: selected package name
  gs_price: string        // GetSuite Completed only: e.g. "$13,552"
  followups: array        // [{date: ISO string, method: string, outcome: string}]
                          // method: "Call" | "LVM" | "Text" | "Email" | "In Person"
  created_at: timestamp
}
```

---

## App Features

### Views
1. **All Leads** — searchable/filterable table. Filters: source, status, city. Stats bar: total, booked, booking %, follow-up count. Response time auto-calculated and colour-coded (green <30min, orange <2hr, red >2hr).
2. **Follow-Up Queue** — auto-populated. Shows leads where: status = "Follow-Up", OR no activity in 24hrs, OR overdue (48hrs+). Sorted by urgency/overdue first.
3. **Add Lead** — source selector at top. GetSuite + FurnacePrices: paste-to-parse via Anthropic API. HomeStars: manual form only. City is a dropdown (not free text).
4. **Reports** — filterable by date range and city. Cards: overall booking rate, booked by source, booked by city, by service type, pipeline status breakdown.

### Lead Detail Modal
- Full lead info display
- Status update buttons (New / Contacted / Follow-Up / Booked / Disqualified)
- Disqualify reason dropdown (shows when Disqualified selected)
- Multi-attempt follow-up log — each entry: date, method, outcome
- Edit Lead button — repopulates form for editing
- Delete button

### Email Paste-to-Parse (Anthropic API)
Coordinator pastes raw email from GetSuite or FurnacePrices.
Claude extracts: name, phone, email, address, city, service, urgency, receivedAt,
gsStatus (Abandoned/Completed), gsHomeSize, gsPackage, gsPrice.
Fields pre-populated in form. Coordinator reviews and saves.

### Follow-Up Logic
- Flag as needs follow-up if: status = "Follow-Up" OR no activity in 24hrs (and not Booked/Disqualified)
- Flag as overdue if: no activity in 48hrs (and not Booked/Disqualified)
- First contact timestamp auto-set when status changed to Contacted or first follow-up logged

### Reporting Metrics
- Overall booking rate (booked / total)
- Average response time
- Booked by source (GetSuite vs FurnacePrices vs HomeStars)
- Booked by city
- By service type
- Pipeline status breakdown

---

## Lead Sources

### GetSuite
- Online estimate builder. Customer enters info to get pricing.
- Two types: **Abandoned** (saw prices, didn't select) and **Completed** (selected a package)
- Both types get followed up
- Completed leads include: selected package name, price, home size, system type
- Email format: structured, all fields clearly labeled, highly parseable

### FurnacePrices
- Lead generation site. Single lead per email.
- Fields: Full Name, Email, Telephone, Address, When Needed, What Needed, Comments
- Email format: clean, all fields labeled, highly parseable

### HomeStars
- Digest email — multiple leads per email, NO contact info included
- Coordinator must log into HomeStars portal to get customer details
- Manual entry only — no paste-to-parse

---

## Brand (Action Furnace)
- **Navy:** #081644, #0D2572
- **Gold:** #FFB500
- **Red:** #9A1E1E
- **Light Blue:** #54C1EF
- **Orange:** #FB6828
- **Teal:** #1E9A9A
- **Fonts:** Oswald Bold (headings), Poppins Bold/Semibold (subheads), Roboto (body)
- **Logo:** https://actionfurnace.ca/wp2/wp-content/uploads/2025/09/AF_Logo-FullColor.svg

---

## Existing Data
124 leads already in Supabase from historical spreadsheet import.
When migrating to Firebase, export from Supabase and import to Firestore.

### Supabase export command:
Use Supabase dashboard → Table Editor → leads → Export as CSV
Or via API: GET https://zyxcsaankwyafdghqfnz.supabase.co/rest/v1/leads?select=*

---

## Known Issues / To Fix
- All 124 imported leads have service = "Furnace" (default from import — no service data in original spreadsheet). Coordinators will update as they work through queue.
- Run city_normalize.sql in Supabase before migrating if not already done.

---

## Migration Steps for Claude Code
1. Set up Firebase project, create Firestore database
2. Export leads from Supabase, import to Firestore
3. Replace Supabase REST calls in index.html with Firebase SDK calls
4. Generate new Anthropic API key, add to project (use environment variable, not hardcoded)
5. Deploy to Netlify (drag and drop or CLI)
6. Test all four views and paste-to-parse
7. Share Netlify URL with coordinators + pin as Teams tab

---

## Teams Integration
Once hosted on Netlify:
1. Open Teams channel
2. Click + tab → Website
3. Name: "Lead Tracker"
4. URL: your Netlify URL
5. Save

Note: netlify.toml already includes headers to allow iframe embedding in Teams.

---

## Files in This Package
- index.html — the full app
- package.json — project config
- netlify.toml — Netlify deployment config with Teams iframe headers
- .gitignore — standard ignores
- HANDOFF.md — this document
