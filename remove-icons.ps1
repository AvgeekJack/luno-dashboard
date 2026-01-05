$files = @(
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\setup\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\general\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\commands\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\logs\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\announcements\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\custom-commands\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\fun\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\member-management\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\moderation\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\notifications\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\role-management\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\security\page.tsx",
  "c:\Users\Jackr\OneDrive\Desktop\Luno Website\app\servers\[guildId]\modules\utilities\page.tsx"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    # Remove dashboard icon img tags (with flexible whitespace)
    $content = $content -replace '<img\s+src="/dashboard-icon\.png"\s+alt=""\s+className="h-5\s+w-5\s+object-contain"\s*/>\s*', ''
    # Remove all span icon placeholders (both bg-orange-50 and bg-orange-100, with flexible whitespace)
    $content = $content -replace '<span\s+className="h-5\s+w-5\s+rounded-md\s+bg-orange-(50|100)"\s+aria-hidden\s*/>\s*', ''
    Set-Content $file $content -NoNewline
    Write-Host "Processed: $file"
  }
}
Write-Host "`nCompleted removing all icons from $($files.Count) files"
