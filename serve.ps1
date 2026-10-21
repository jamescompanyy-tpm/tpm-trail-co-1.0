param([int]$Port = 3333)
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $base on http://localhost:$Port/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $path = $req.Url.LocalPath
  if ($path -eq '/') { $path = '/index.html' }
  $file = Join-Path $base $path.TrimStart('/')
  # Mirror Netlify: an extensionless path tries <path>.html (so /trips serves
  # trips.html), then falls back to index.html for the /* rewrite (/journal).
  # Functions are left to 404 here — there's no Netlify runtime locally.
  if (-not (Test-Path $file -PathType Leaf) -and -not [System.IO.Path]::GetExtension($file) -and
      -not $path.StartsWith('/.netlify/')) {
    if (Test-Path "$file.html" -PathType Leaf) { $file = "$file.html" }
    else { $file = Join-Path $base 'index.html' }
  }
  if (Test-Path $file -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($file)
    $mime = switch ($ext) {
      '.html' { 'text/html; charset=utf-8' }
      '.css'  { 'text/css' }
      '.js'   { 'application/javascript' }
      '.jpg'  { 'image/jpeg' }
      '.webp' { 'image/webp' }
      '.png'  { 'image/png' }
      default { 'application/octet-stream' }
    }
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $res.ContentType = $mime
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
  }
  $res.Close()
}
