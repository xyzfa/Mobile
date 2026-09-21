Add-Type -AssemblyName System.Drawing

$outputPath = Join-Path $PSScriptRoot "..\public\preloved-logo-transparent.png"
$size = 2048
$viewBoxWidth = 60.0
$viewBoxHeight = 70.0
$scale = $size * 0.76 / $viewBoxHeight
$offsetX = ($size - ($viewBoxWidth * $scale)) / 2
$offsetY = ($size - ($viewBoxHeight * $scale)) / 2

$bitmap = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.TranslateTransform([float]$offsetX, [float]$offsetY)
$graphics.ScaleTransform([float]$scale, [float]$scale)

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 2.2
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

$hangerLoop = New-Object System.Drawing.Drawing2D.GraphicsPath
$hangerLoop.StartFigure()
$hangerLoop.AddBezier(30, 10, 30, 4, 38, 4, 38, 10)
$hangerLoop.AddBezier(38, 10, 38, 16, 30, 16, 30, 10)
$hangerLoop.CloseFigure()
$graphics.DrawPath($pen, $hangerLoop)

$graphics.DrawLine($pen, 30, 10, 30, 22)

$mark = New-Object System.Drawing.Drawing2D.GraphicsPath
$mark.StartFigure()
$mark.AddBezier(30, 22, 30, 22, 8, 30, 6, 46)
$mark.AddBezier(6, 46, 4, 56, 14, 58, 24, 54)
$mark.AddLine(24, 54, 30, 50)
$mark.AddLine(30, 50, 36, 54)
$mark.AddBezier(36, 54, 46, 58, 56, 56, 54, 46)
$mark.AddBezier(54, 46, 52, 30, 30, 22, 30, 22)
$mark.CloseFigure()
$graphics.DrawPath($pen, $mark)

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$pen.Dispose()
$hangerLoop.Dispose()
$mark.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Host "Exported $outputPath"
