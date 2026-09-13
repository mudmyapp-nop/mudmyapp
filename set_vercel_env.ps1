# Script to set Vercel environment variables
$project = "mudmy/mudmyapp"

$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL"      = "https://tmuhhvlfllmkqjqawhsv.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtdWhodmxmbGxta3FqcWF3aHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODk5ODksImV4cCI6MjEwMzY2NTk4OX0.dUFWj9iVL3SiV-rxa-K47Zip4s2UVt8P4S47BOmUtTw"
    "NEXT_PUBLIC_APP_NAME"           = "Mudmy"
    "NEXT_PUBLIC_APP_URL"            = "https://www.mudmy.app"
    "NEXT_PUBLIC_ENABLE_ADMIN_PANEL" = "false"
    "NEXT_PUBLIC_ENABLE_ANALYTICS"   = "true"
}

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Setting $key..."
    $value | vercel env add $key production --scope mudmy --yes 2>&1
    $value | vercel env add $key preview --scope mudmy --yes 2>&1
}

Write-Host "Done! Remember to set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and SUPABASE_SERVICE_ROLE_KEY manually."
