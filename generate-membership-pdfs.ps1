function New-FormPdf {
  param(
    [string]$Path,
    [string]$Title,
    [string[]]$Fields
  )

  $lines = @(
    'Agro Trade Hub Africa',
    $Title,
    'Complete this form offline and return it to your coordinator.',
    ''
  ) + $Fields

  $commands = @('BT', '/F1 16 Tf', '72 742 Td', "($($lines[0])) Tj", '/F1 13 Tf', '0 -24 Td', "($($lines[1])) Tj", '/F1 9 Tf', '0 -20 Td', "($($lines[2])) Tj", '/F1 10 Tf', '0 -34 Td')
  foreach ($line in $lines[3..($lines.Count - 1)]) {
    $safeLine = $line.Replace('\', '\\').Replace('(', '\(').Replace(')', '\)')
    $commands += "($safeLine) Tj"
    $commands += '0 -30 Td'
  }
  $commands += 'ET'
  $stream = ($commands -join "`n") + "`n"

  $objects = @(
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    "<< /Length $([Text.Encoding]::ASCII.GetByteCount($stream)) >>`nstream`n$stream`nendstream"
  )

  $pdf = "%PDF-1.4`n"
  $offsets = @(0)
  foreach ($index in 0..($objects.Count - 1)) {
    $offsets += [Text.Encoding]::ASCII.GetByteCount($pdf)
    $pdf += "$($index + 1) 0 obj`n$($objects[$index])`nendobj`n"
  }
  $xrefOffset = [Text.Encoding]::ASCII.GetByteCount($pdf)
  $pdf += "xref`n0 $($objects.Count + 1)`n0000000000 65535 f `n"
  foreach ($offset in $offsets[1..$objects.Count]) {
    $pdf += "$('{0:D10}' -f $offset) 00000 n `n"
  }
  $pdf += "trailer`n<< /Size $($objects.Count + 1) /Root 1 0 R >>`nstartxref`n$xrefOffset`n%%EOF`n"
  [IO.File]::WriteAllBytes($Path, [Text.Encoding]::ASCII.GetBytes($pdf))
}

New-FormPdf 'forms/farmer-membership-form.pdf' 'Farmer Membership Form' @(
  'Full name: _______________________________________________',
  'National Identity Number (NIN): ___________________________',
  'Phone number: _____________________________________________',
  'Alternative phone number: _________________________________',
  'State: ____________________  Local government area: ________',
  'Community / village: ______________________________________',
  'Primary crop: _____________________________________________',
  'Farm business name: _______________________________________',
  'Farm size: __________________  Cooperative: _______________',
  'Signature: __________________  Date: ______________________'
)

New-FormPdf 'forms/new-cooperative-registration-form.pdf' 'New Multi-Purpose Co-operative Society Registration' @(
  'Cooperative Name: _________________________________________',
  'Type (e.g. Association or Clubs): _________________________',
  'State: ____________________  Local government area: ________',
  "Leader's full name: _______________________________________",
  "Leader's National Identity Number (NIN): _________________",
  "Leader's date of birth: ___________________________________",
  "Leader's address: _________________________________________",
  'Contact person: ___________________________________________',
  'Phone number: _____________________________________________',
  'Email address: ____________________________________________',
  'Number of members (minimum 35): ___________________________',
  'Business registration number (if applicable): ______________',
  'Enter CAC / cooperative registration number if applicable.',
  'Purpose and activities: ___________________________________',
  '__________________________________________________________',
  'Attach member register (35 members minimum), listing each',
  "member's name, phone, address, crops farmed, and farm size.",
  'Signature: __________________  Date: ______________________'
)

New-FormPdf 'forms/cooperative-revalidation-form.pdf' 'Old Cooperative Society Revalidation Form' @(
  'Old cooperative society name: ______________________________',
  'Registration number: _______________________________________',
  'State of registration: __________  Year established: _______',
  "Leader's full name: _______________________________________",
  "Leader's National Identity Number (NIN): _________________",
  'Contact person: ___________________________________________',
  'Phone number: _____________________________________________',
  'Email address: ____________________________________________',
  'Number of members: ________________________________________',
  'Reason for revalidation / update: __________________________',
  '__________________________________________________________',
  'Signature: __________________  Date: ______________________'
)

New-FormPdf 'forms/partner-registration-form.pdf' 'Partner Registration Form' @(
  'Organisation name: ________________________________________',
  'Type of organisation: _____________________________________',
  'Contact person: ___________________________________________',
  'Phone number: _____________________________________________',
  'Email: ___________________________________________________',
  'Business location: ________________________________________',
  'Website address: _________________________________________',
  'Business registration number: ______________________________',
  'Nature of partnership: ____________________________________',
  '__________________________________________________________',
  'Signature: __________________  Date: ______________________'
)

New-FormPdf 'forms/sponsor-registration-form.pdf' 'Sponsor Registration Form' @(
  'Organisation / individual name: ____________________________',
  'Sponsor category: _________________________________________',
  'Contact person: ___________________________________________',
  'Phone number: _____________________________________________',
  'Email: ___________________________________________________',
  'Preferred support area: ___________________________________',
  'Website address: _________________________________________',
  'Funding interest level: ___________________________________',
  'Details of sponsorship interest: ___________________________',
  '__________________________________________________________',
  'Signature: __________________  Date: ______________________'
)