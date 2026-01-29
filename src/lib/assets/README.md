Place `Manual_Book_Sistem_PEN.pdf` here so it can be served by the server route at `/assets/manual-book`.

Path: `src/lib/assets/Manual_Book_Sistem_PEN.pdf`

If you have the PDF elsewhere, copy it here (PowerShell):

Copy-Item -Path "C:\path\to\Manual_Book_Sistem_PEN.pdf" -Destination "src\lib\assets\Manual_Book_Sistem_PEN.pdf" -Force

Notes:
- The route `GET /assets/manual-book` returns the PDF with `Content-Type: application/pdf`.
- If you prefer the static approach, place the PDF at `static/assets/Manual_Book_Sistem_PEN.pdf` instead and revert the link in `src/routes/+page.svelte` to `/assets/Manual_Book_Sistem_PEN.pdf`.
