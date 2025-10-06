/**
 * V0.2 — Gmail → Drive: Save attachments in ROOT and always REPLACE by filename
 *
 * What changed from V0.1:
 * - No dated subfolder; files go straight into the target folder's ROOT.
 * - No hashing/dedup. We ALWAYS replace files based on the original filename.
 * - Replacement rule: if a file with the same name exists in the target folder,
 *   it is TRASHED, then a fresh file is created.
 *
 * Fill these two values:
 *   - CONFIG.LABEL_TO_WATCH
 *   - CONFIG.DRIVE_FOLDER_ID  (your folder: 1wh13P1olz1JPYlonpoIFTw1aIMspfO0T)
 */

const CONFIG = {
  LABEL_TO_WATCH: 'YOUR_GMAIL_LABEL_HERE',                 // e.g. 'drive/export'
  DRIVE_FOLDER_ID: '1wh13P1olz1JPYlonpoIFTw1aIMspfO0T',    // Customers/Experian (Serasa)
  PROCESSED_LABEL_NAME: 'processed/attachments-saved',
  MAX_THREADS_PER_RUN: 50,
  TRASH_INSTEAD_OF_REMOVE: true // true = file.setTrashed(true); false = folder.removeFile(file)
};

function saveAttachments() {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const processedLabel = getOrCreateLabel_(CONFIG.PROCESSED_LABEL_NAME);
  const watchLabel = getOrCreateLabel_(CONFIG.LABEL_TO_WATCH);

  const threads = watchLabel.getThreads(0, CONFIG.MAX_THREADS_PER_RUN);

  threads.forEach(thread => {
    let savedAny = false;

    thread.getMessages().forEach(msg => {
      const attachments = msg.getAttachments({
        includeInlineImages: false,
        includeAttachments: true
      });

      attachments.forEach(att => {
        if (!att) return;
        const blob = att.copyBlob();
        if (!blob || blob.getBytes().length === 0) return;

        // V0.2 filename = ORIGINAL ONLY (sanitized) → enables true replacement by name
        const filename = sanitizeFileName_(att.getName());

        // REPLACE: if a file with the same name exists in the ROOT folder, remove/trash it
        const existing = folder.getFilesByName(filename);
        while (existing.hasNext()) {
          const file = existing.next();
          if (CONFIG.TRASH_INSTEAD_OF_REMOVE) {
            file.setTrashed(true); // sends to trash (safer)
          } else {
            // Removes the file from this folder only (it may still exist elsewhere in Drive)
            folder.removeFile(file);
          }
        }

        // Create the fresh file with the same name
        const newFile = folder.createFile(blob).setName(filename);

        // Optional: add a short description with original email context
        newFile.setDescription(`Saved from Gmail. Subject: "${(msg.getSubject() || 'no subject').trim()}" — From: ${msg.getFrom()}`);

        savedAny = true;
      });
    });

    if (savedAny) processedLabel.addToThread(thread);
  });
}

/* ---------- Helpers ---------- */
function getOrCreateLabel_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function sanitizeFileName_(name) {
  return (name || 'file')
    .replace(/[\/\\:\*\?"<>\|]/g, '·')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}
