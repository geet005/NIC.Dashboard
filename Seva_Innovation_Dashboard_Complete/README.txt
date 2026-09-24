# Seva Innovation Challenge 2026 Dashboard

## Structure

seva_innovation_dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   └── app.js
├── images/
└── README.txt

## Run

Open the folder in VS Code and use Live Server on `index.html`.

## Where the data lives

Edit `js/data.js`.

The dashboard UI is separated from the data so that the eventual Python/API integration can replace the static data without rebuilding the design.

## Convenors

There are 37 convenor records in `js/data.js`.

Each record supports:
- state
- name
- phone
- photo
- appointmentStatus

Photos go into the `images/` folder, then use for example:

photo: "images/delhi-convenor.jpg"

## Nodal institutions

Nodal institutions are now state-wise.

Each state has an `institutions` array and can contain a maximum of 8 entries.

Each entry supports:
- name
- address
- contact
- status

Clicking a state in the Nodal Institutions panel opens a detailed modal containing the full information.

## Clickable cards

All four top cards are clickable:

1. Total Zones → long zone/state/in-charge table
2. Websites → website status, link and date
3. State Convenors → all 37 records, phone/photo/appointment status
4. Applications → state-wise application counts

The Edit button is only a temporary prototype control. In the final live version, the source data should come from the authorised backend/API/database.
