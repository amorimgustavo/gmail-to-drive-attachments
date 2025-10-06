# Gmail → Drive: Automatically Save Email Attachments

A **Google Apps Script** to automatically download attachments from Gmail emails with a specific label and save them into a Google Drive folder.  
It organizes files by date and avoids duplicates.

---

## 🚀 How to Use

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project and paste the content of `saveAttachments.js`.
3. Update:
   - `LABEL_TO_WATCH` with the Gmail label you use.
   - `DRIVE_FOLDER_ID` with the ID of your target Google Drive folder.
4. Save and click **Run → saveAttachments()** (authorize when prompted).
5. Set up a trigger to automate:
   - Left menu: **Clock → Add Trigger**
   - Function: `saveAttachments`
   - Event type: **Time-driven**
   - Suggested frequency: every 10 minutes or daily.

---

## 🗂 Output Structure

Automatically creates a subfolder inside your Drive folder with the format:

```

DXM MM-DD-YYYY

```

Inside that folder, it saves attachments renamed as:

```

YYYY-MM-DD — Subject — Sender — originalFilename.ext

```

---

## 🔒 Features

- Avoids duplicates (using SHA-256 hash of attachment content).
- Marks processed emails with the label `processed/attachments-saved`.

---

## ⚡️ Customization

- Change trigger frequency (e.g., hourly, daily).
- Modify the file naming pattern.
- Organize into subfolders by sender or domain instead of by date.

---

✍️ Maintained by [Luiz Gustavo Amorim]
  return sanitizeFileName_(`${date} — ${subject} — ${from} — ${originalName}`);
}
