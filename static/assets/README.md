Place the Manual_Book_Sistem_PEN.pdf here so it is served at /assets/Manual_Book_Sistem_PEN.pdf

SvelteKit serves files from the `static/` folder at the site root. If you have the PDF elsewhere, copy it here (example PowerShell command):

Copy-Item -Path "C:\path\to\Manual_Book_Sistem_PEN.pdf" -Destination "static\assets\Manual_Book_Sistem_PEN.pdf" -Force

After adding the PDF, restart the dev server if necessary and visit `/assets/Manual_Book_Sistem_PEN.pdf` to verify.