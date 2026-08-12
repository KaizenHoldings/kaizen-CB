/**
 * PDF mínimo pero estructuralmente válido.
 *
 * La colección de archivos valida firma, MIME y estructura, así que las
 * pruebas necesitan un PDF real —con tabla de referencias cruzadas y `%%EOF`—
 * y no un buffer con la cabecera falsificada.
 */
export const samplePdfBuffer = (): Buffer => {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Resources << >> >>',
  ]

  const header = '%PDF-1.4\n'
  let body = ''
  const offsets: number[] = []

  objects.forEach((object, index) => {
    offsets.push(header.length + body.length)
    body += `${index + 1} 0 obj\n${object}\nendobj\n`
  })

  const xrefOffset = header.length + body.length

  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

  return Buffer.from(header + body + xref + trailer, 'latin1')
}
