$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function Convert-1bitFS {
  param([string]$src, [string]$dst, [int]$tw, [int]$th)
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    # 1. Draw scaled into 24bpp with nearest-neighbor (keeps pixel-art crispness)
    $tmp = New-Object System.Drawing.Bitmap($tw, $th, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($tmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.Clear([System.Drawing.Color]::White)
    $g.DrawImage($img, 0, 0, $tw, $th)
    $g.Dispose()

    $rect = New-Object System.Drawing.Rectangle(0, 0, $tw, $th)
    $d = $tmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $stride = $d.Stride
    $srcBuf = New-Object byte[] ($stride * $th)
    [System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $srcBuf, 0, $srcBuf.Length)
    $tmp.UnlockBits($d)
    $tmp.Dispose()

    # 2. Floyd-Steinberg error diffusion into a grayscale working buffer
    $gray = New-Object float[] ($tw * $th)
    for ($y = 0; $y -lt $th; $y++) {
      $base = $y * $stride
      for ($x = 0; $x -lt $tw; $x++) {
        $i = $base + $x * 3
        $gray[$y * $tw + $x] = ($srcBuf[$i] + $srcBuf[$i+1] + $srcBuf[$i+2]) / 3.0
      }
    }
    $rowBytes = [int]([Math]::Ceiling($tw / 8.0))
    $rowBytes = [int]([Math]::Ceiling($rowBytes / 4.0) * 4)   # 1bpp stride pads to 4 bytes
    $out = New-Object byte[] ($rowBytes * $th)                 # 0 bits = white

    for ($y = 0; $y -lt $th; $y++) {
      for ($x = 0; $x -lt $tw; $x++) {
        $i = $y * $tw + $x
        $old = $gray[$i]
        $black = $old -lt 128
        $new = if ($black) { 0 } else { 255 }
        if ($black) {
          $byteIdx = $y * $rowBytes + ($x -shr 3)
          $out[$byteIdx] = $out[$byteIdx] -bor ([byte](1 -shl (7 - ($x -band 7))))
        }
        $err = $old - $new
        if ($x + 1 -lt $tw) { $gray[$i + 1] += $err * 0.4375 }               # 7/16
        if ($y + 1 -lt $th) {
          if ($x -gt 0)          { $gray[$i + $tw - 1] += $err * 0.1875 }     # 3/16
          $gray[$i + $tw] += $err * 0.3125                                    # 5/16
          if ($x + 1 -lt $tw)    { $gray[$i + $tw + 1] += $err * 0.0625 }     # 1/16
        }
      }
    }

    # 3. Write 1bpp bitmap with palette [White, Black] so set bit = black
    $bmp = New-Object System.Drawing.Bitmap($tw, $th, [System.Drawing.Imaging.PixelFormat]::Format1bppIndexed)
    $pal = $bmp.Palette
    $pal.Entries[0] = [System.Drawing.Color]::White
    $pal.Entries[1] = [System.Drawing.Color]::Black
    $bmp.Palette = $pal
    $d2 = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format1bppIndexed)
    [System.Runtime.InteropServices.Marshal]::Copy($out, 0, $d2.Scan0, $out.Length)
    $bmp.UnlockBits($d2)
    $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output ("{0}  {1}x{2}  {3:N1}KB" -f (Split-Path $src -Leaf), $tw, $th, ((Get-Item $dst).Length / 1KB))
  } finally { $img.Dispose() }
}

New-Item -ItemType Directory -Force -Path "scripts\gen" | Out-Null
Convert-1bitFS "public\logo\cardstacks-logo.png"    "scripts\gen\logo.png"  480 480
Convert-1bitFS "public\logo\cardstacks-mark.png"    "scripts\gen\mark.png"  160 107
Convert-1bitFS "public\stacks\birthday-cake.png"    "scripts\gen\cake.png"  320 214
Convert-1bitFS "public\stacks\lighthouse.png"       "scripts\gen\lighthouse.png" 180 270
Convert-1bitFS "public\stacks\adventure-coast.png"  "scripts\gen\coast.png" 340 283
Convert-1bitFS "public\stacks\adventure-hall.png"   "scripts\gen\hall.png"  340 284
Convert-1bitFS "public\stacks\adventure-lamp.png"   "scripts\gen\lamp.png"  340 284
Convert-1bitFS "public\stacks\adventure-boats.png"  "scripts\gen\boats.png" 340 283
Convert-1bitFS "public\stacks\adventure-lost.png"   "scripts\gen\lost.png"  340 283
