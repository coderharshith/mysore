$lines = Get-Content 'index.html'
$headPositions = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim() -eq '</head>') {
        $headPositions += $i
    }
}
Write-Host ("Found /head at lines: " + ($headPositions | ForEach-Object { $_ + 1 }) -join ', ')
Write-Host ("Total lines before: " + $lines.Count)
if ($headPositions.Count -ge 2) {
    $firstHead = $headPositions[0]
    $lastHead  = $headPositions[-1]
    $kept = $lines[0..$firstHead] + $lines[($lastHead + 1)..($lines.Count - 1)]
    $kept | Set-Content -Encoding UTF8 'index.html'
    Write-Host ("Done. New line count: " + $kept.Count)
} else {
    Write-Host 'Only one or zero /head found - nothing to fix.'
}
