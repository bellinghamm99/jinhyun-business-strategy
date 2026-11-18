param([string]$SourceFolder="")
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($SourceFolder)) {
  Add-Type -AssemblyName System.Windows.Forms
  $dlg = New-Object System.Windows.Forms.FolderBrowserDialog
  $dlg.Description = "기존에 공개 완료한 포트폴리오 폴더(hwang-jinhyun-portfolio)를 선택하세요"
  $dlg.ShowNewFolderButton = $false
  if ($dlg.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { Write-Host '취소했습니다.'; exit 1 }
  $SourceFolder = $dlg.SelectedPath
}
$SourceFolder = [System.IO.Path]::GetFullPath($SourceFolder)
if (-not (Test-Path (Join-Path $SourceFolder 'assets\work'))) { throw "잘못된 폴더입니다. assets\work가 있는 최종 공개용 포트폴리오 폴더를 선택해주세요: $SourceFolder" }
$files = Get-Content -Path (Join-Path $root 'required-public-files.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$missing = New-Object System.Collections.ArrayList
foreach ($relative in $files) {
  $sourceFile = Join-Path $SourceFolder $relative
  if (-not (Test-Path -LiteralPath $sourceFile -PathType Leaf)) { [void]$missing.Add($relative) }
}
if ($missing.Count -gt 0) {
  Write-Host "다음 필수 파일이 기존 포트폴리오에 없습니다:"
  $missing | ForEach-Object { Write-Host " - $_" }
  throw '파일 복사를 중단했습니다. 최신 공개용 사이트 폴더가 맞는지 확인하세요.'
}
foreach ($relative in $files) {
  $sourceFile = Join-Path $SourceFolder $relative
  $targetFile = Join-Path $root $relative
  $parent = Split-Path -Parent $targetFile
  if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Force $parent | Out-Null }
  Copy-Item -LiteralPath $sourceFile -Destination $targetFile -Force
}
# Use the covers/previews/profile from final, published portfolio when present.
foreach ($p in @('assets\profile.jpg')) {
  $src=Join-Path $SourceFolder $p; if(Test-Path $src){Copy-Item -LiteralPath $src -Destination (Join-Path $root $p) -Force}
}
foreach ($folder in @('assets\projects')) {
  $src = Join-Path $SourceFolder $folder
  if(Test-Path $src){Copy-Item -Path (Join-Path $src '*') -Destination (Join-Path $root $folder) -Recurse -Force}
}
Write-Host "완료: 공개용 작업물 20개와 이력서 2개를 복사했습니다."
Write-Host "새 포트폴리오 위치: $root"
Write-Host "보안 주의: 해당 파일은 새 GitHub Public 저장소에 다시 업로드됩니다."
