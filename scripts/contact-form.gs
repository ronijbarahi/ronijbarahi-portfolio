/**
 * Contact form for ronijbarahi.com
 *
 * This runs as a Google Apps Script web app inside the "ronijbarahi.com enquiries" Google Sheet
 * (Extensions > Apps Script). Every enquiry from the site's contact form becomes a new row
 * in the "Enquiries" tab, and you get an email you can reply to directly.
 *
 * If you change this code: Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy.
 * The web app address stays the same, so the website doesn't need changing.
 */
const SHEET_NAME = 'Enquiries';
const HEADERS = ['Received', 'Name', 'Email', 'Website', 'Looking for', 'Start', 'Message', 'Sent from'];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // The form has a hidden "company" field that people never see. Bots fill it in, so skip those.
  if (p.company) return ContentService.createTextOutput('ok');

  // Stop anything typed into the form being read as a spreadsheet formula.
  const clean = v => String(v || '').trim().slice(0, 5000).replace(/^[=+\-@]/, "'$&");
  const row = [new Date(), clean(p.name), clean(p.email), clean(p.website), clean(p.need), clean(p.timeline), clean(p.message), clean(p.page)];

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME, 0);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  const email = String(p.email || '').trim();
  const lines = [
    'New enquiry from ronijbarahi.com',
    '',
    'Name: ' + (p.name || ''),
    'Email: ' + email,
    p.website ? 'Website: ' + p.website : null,
    'Looking for: ' + (p.need || ''),
    'Start: ' + (p.timeline || ''),
    '',
    p.message || '',
    '',
    'Reply to this email to answer them directly. Every enquiry is also saved in your "ronijbarahi.com enquiries" Google Sheet.'
  ].filter(l => l !== null);
  const mail = {
    to: Session.getEffectiveUser().getEmail(),
    subject: 'New enquiry from ' + (p.name || 'your website') + (p.need ? ' (' + p.need + ')' : ''),
    body: lines.join('\n')
  };
  if (/^\S+@\S+\.\S+$/.test(email)) mail.replyTo = email;
  MailApp.sendEmail(mail);

  return ContentService.createTextOutput('ok');
}

// Opening the web app address in a browser shows this, which is a quick way to check it is running.
function doGet() {
  return ContentService.createTextOutput('ronijbarahi.com contact form is running.');
}
