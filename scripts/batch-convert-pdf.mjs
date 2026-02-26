#!/usr/bin/env node

/**
 * Batch convert .doc/.docx submissions to PDF using LibreOffice.
 *
 * Usage:
 *   node scripts/batch-convert-pdf.mjs
 *
 * Environment variables (or edit the constants below):
 *   SUPABASE_URL        - Supabase project URL
 *   SUPABASE_SERVICE_KEY - Supabase service_role key
 */

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { mkdirSync, rmSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

// ── Configuration ──────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bcgdqepzakcufaadgnda.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZ2RxZXB6YWtjdWZhYWRnbmRhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0NjIyOCwiZXhwIjoyMDg3MTIyMjI4fQ.YVhGvM7iZE5_X_JQTSEWNMIIo6aoPa3Yzo94Hr_aliE';
const LIBREOFFICE = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
const BUCKET = 'manuscripts';
const TMP_DIR = join(import.meta.dirname, '../.tmp-pdf-convert');

// ── Supabase client (service role bypasses RLS) ────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ── Helpers ────────────────────────────────────────────────────
function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function cleanDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

async function fetchAllSubmissions() {
  const all = [];
  let from = 0;
  const pageSize = 100;

  while (true) {
    const { data, error } = await supabase
      .from('submissions')
      .select('id, file_path, file_name, pdf_path')
      .order('created_at', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`Failed to fetch submissions: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return all;
}

async function downloadFile(filePath) {
  // Use signed URL + fetch instead of .download() which is unreliable in Node.js
  const { data: urlData, error: urlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 300);

  if (urlError || !urlData?.signedUrl) {
    throw new Error(`Signed URL failed for ${filePath}: ${urlError?.message || 'no URL'}`);
  }

  const resp = await fetch(urlData.signedUrl);
  if (!resp.ok) {
    throw new Error(`Download failed for ${filePath}: HTTP ${resp.status}`);
  }

  return Buffer.from(await resp.arrayBuffer());
}

function convertToPdf(inputPath, outputDir) {
  execSync(`"${LIBREOFFICE}" --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`, {
    timeout: 60_000,
    stdio: 'pipe',
  });
}

async function uploadPdf(pdfBuffer, storagePath) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
}

async function updatePdfPath(submissionId, pdfPath) {
  const { error } = await supabase
    .from('submissions')
    .update({ pdf_path: pdfPath })
    .eq('id', submissionId);

  if (error) throw new Error(`DB update failed for ${submissionId}: ${error.message}`);
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log('Fetching all submissions...');
  const submissions = await fetchAllSubmissions();
  console.log(`Found ${submissions.length} submissions total.`);

  // Filter: only those without pdf_path and with a file_path
  const toConvert = submissions.filter(s => s.file_path && !s.pdf_path);
  console.log(`${toConvert.length} need PDF conversion (${submissions.length - toConvert.length} already done or no file).\n`);

  if (toConvert.length === 0) {
    console.log('Nothing to convert!');
    return;
  }

  ensureDir(TMP_DIR);

  let success = 0;
  let failed = 0;
  const failures = [];

  for (let i = 0; i < toConvert.length; i++) {
    const sub = toConvert[i];
    const progress = `[${i + 1}/${toConvert.length}]`;
    const workDir = join(TMP_DIR, sub.id);

    try {
      cleanDir(workDir);

      // 1. Download
      process.stdout.write(`${progress} Downloading ${sub.file_path}...`);
      const buffer = await downloadFile(sub.file_path);
      const localFile = join(workDir, basename(sub.file_path));
      writeFileSync(localFile, buffer);
      process.stdout.write(' OK\n');

      // 2. Convert
      process.stdout.write(`${progress} Converting to PDF...`);
      convertToPdf(localFile, workDir);

      // Find the generated PDF
      const pdfFiles = readdirSync(workDir).filter(f => f.endsWith('.pdf'));
      if (pdfFiles.length === 0) throw new Error('No PDF generated');
      const pdfLocalPath = join(workDir, pdfFiles[0]);
      process.stdout.write(' OK\n');

      // 3. Upload PDF
      const pdfStoragePath = `${sub.id}/paper.pdf`;
      process.stdout.write(`${progress} Uploading ${pdfStoragePath}...`);
      const pdfBuffer = readFileSync(pdfLocalPath);
      await uploadPdf(pdfBuffer, pdfStoragePath);
      process.stdout.write(' OK\n');

      // 4. Update DB
      await updatePdfPath(sub.id, pdfStoragePath);
      console.log(`${progress} ✓ Done\n`);
      success++;
    } catch (err) {
      console.error(`\n${progress} ✗ FAILED: ${err.message}\n`);
      failures.push({ id: sub.id, file: sub.file_path, error: err.message });
      failed++;
    } finally {
      rmSync(workDir, { recursive: true, force: true });
    }
  }

  // Cleanup
  rmSync(TMP_DIR, { recursive: true, force: true });

  // Summary
  console.log('═'.repeat(50));
  console.log(`Done! Success: ${success}, Failed: ${failed}`);
  if (failures.length > 0) {
    console.log('\nFailed submissions:');
    failures.forEach(f => console.log(`  - ${f.id} (${f.file}): ${f.error}`));
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
