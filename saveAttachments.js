# Gmail → Drive: Save Attachments (V0.1)

**What it does (V0.1):**
- Finds Gmail threads with a specific label
- Creates a dated subfolder in Drive: `DXM MM-DD-YYYY`
- Saves all non-inline attachments there
- Skips duplicates by content hash (SHA-256)
- Labels processed threads with `processed/attachments-saved`

## Setup (Google Apps Script)

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project and paste `saveAttachments.js`.
3. Update:
   - `LABEL_TO_WATCH` → your Gmail label (e.g., `drive/export`)
   - `DRIVE_FOLDER_ID` → the ID of your target Google Drive folder
4. Click **Run → saveAttachments()** and authorize when prompted.
5. (Optional) Set a time-driven trigger:
   - Left menu: **Clock → Add Trigger**
   - Function: `saveAttachments`
   - Event: **Time-driven**
   - Suggested: every 10 minutes or daily

## Output

- Drive subfolder created per run: `DXM MM-DD-YYYY`
- Filenames: `YYYY-MM-DD — Subject — Sender — original.ext`

## Notes
- To get the Drive folder ID, open the folder in your browser and copy the long ID from the URL.
- Make sure your Gmail label is applied by your filter/rule before running.
