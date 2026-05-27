import type { Receta } from '@/types'

interface RecipePdfData {
  id: number
  paciente: string
  dentista: string
  servicio: string
  fechaConsulta: string
  horaConsulta: string
  fechaEmision: string
  indicaciones: string
}

type PdfFont = 'F1' | 'F2'

interface PdfTextLine {
  text: string
  x: number
  y: number
  size: number
  font: PdfFont
}

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN_X = 54
const TOP_Y = 790
const BOTTOM_Y = 64

export function downloadRecipePdf(receta: Receta): void {
  const data = mapRecipeToPdfData(receta)
  const blob = createRecipePdf(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = buildRecipeFileName(data)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function mapRecipeToPdfData(receta: Receta): RecipePdfData {
  const cita = receta.cita

  return {
    id: receta.id,
    paciente: cita?.paciente?.nombreCompleto ?? receta.persona?.nombreCompleto ?? 'Paciente no informado',
    dentista:
      cita?.dentista?.nombreCompleto ??
      receta.empleado?.persona?.nombreCompleto ??
      receta.empleado?.usuario ??
      'Dentista no informado',
    servicio: cita?.servicio?.nombre ?? 'Servicio no informado',
    fechaConsulta: formatDate(cita?.fechaProgramada ?? cita?.fecha ?? receta.fecha),
    horaConsulta: formatTime(cita?.hora ?? cita?.horaInicio),
    fechaEmision: formatDate(receta.fechaRegistro ?? receta.createdAt ?? receta.fecha),
    indicaciones: receta.indicaciones || 'Sin indicaciones registradas.',
  }
}

function createRecipePdf(data: RecipePdfData): Blob {
  const pages = paginateRecipe(data)
  const objects: string[] = []

  const addObject = (content: string): number => {
    objects.push(content)
    return objects.length
  }

  const catalogId = addObject('')
  const pagesId = addObject('')
  const regularFontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  const boldFontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
  const pageIds: number[] = []

  pages.forEach((pageLines) => {
    const content = pageLines.map(renderTextLine).join('')
    const contentId = addObject(`<< /Length ${content.length} >>\nstream\n${content}endstream`)
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
        `/Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> ` +
        `/Contents ${contentId} 0 R >>`,
    )
    pageIds.push(pageId)
  })

  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`

  return new Blob([buildPdf(objects, catalogId)], { type: 'application/pdf' })
}

function paginateRecipe(data: RecipePdfData): PdfTextLine[][] {
  const pages: PdfTextLine[][] = [[]]
  let y = TOP_Y

  const currentPage = () => pages[pages.length - 1] ?? []
  const newPage = () => {
    pages.push([])
    y = TOP_Y
    addLine('Receta medica', 16, MARGIN_X, 'F2', 24)
    addLine(`Folio: REC-${data.id}`, 10, MARGIN_X, 'F1', 26)
  }

  const ensureSpace = (height: number) => {
    if (y - height < BOTTOM_Y) newPage()
  }

  const addLine = (
    text: string,
    size = 11,
    x = MARGIN_X,
    font: PdfFont = 'F1',
    lineHeight = 16,
  ) => {
    ensureSpace(lineHeight)
    currentPage().push({ text, x, y, size, font })
    y -= lineHeight
  }

  const addWrapped = (
    text: string,
    size = 11,
    x = MARGIN_X,
    maxWidth = PAGE_WIDTH - MARGIN_X * 2,
    font: PdfFont = 'F1',
    lineHeight = 16,
  ) => {
    wrapText(text, size, maxWidth).forEach((line) => addLine(line, size, x, font, lineHeight))
  }

  addLine('Receta medica', 20, MARGIN_X, 'F2', 26)
  addLine(`Folio: REC-${data.id}`, 10, MARGIN_X, 'F1', 28)
  addLine('Consultorio dental', 13, MARGIN_X, 'F2', 18)
  addLine(`Fecha de emision: ${data.fechaEmision}`, 10, MARGIN_X, 'F1', 28)

  addLine('Datos del paciente', 13, MARGIN_X, 'F2', 20)
  addWrapped(`Paciente: ${data.paciente}`)
  addWrapped(`Servicio: ${data.servicio}`)
  addWrapped(`Fecha de consulta: ${data.fechaConsulta}`)
  addWrapped(`Hora: ${data.horaConsulta}`)
  y -= 8

  addLine('Profesional responsable', 13, MARGIN_X, 'F2', 20)
  addWrapped(`Dentista: ${data.dentista}`)
  y -= 8

  addLine('Indicaciones', 13, MARGIN_X, 'F2', 20)
  addWrapped(data.indicaciones, 11, MARGIN_X, PAGE_WIDTH - MARGIN_X * 2, 'F1', 17)
  y -= 28

  addLine('Firma del dentista', 10, MARGIN_X, 'F1', 16)
  addLine('______________________________', 10, MARGIN_X, 'F1', 16)

  return pages
}

function renderTextLine(line: PdfTextLine): string {
  return `BT /${line.font} ${line.size} Tf ${line.x} ${line.y} Td (${escapePdfText(line.text)}) Tj ET\n`
}

function buildPdf(objects: string[], catalogId: number): string {
  let pdf = '%PDF-1.4\n%\n'
  const offsets = ['0000000000 65535 f \n']

  objects.forEach((object, index) => {
    offsets.push(`${String(pdf.length).padStart(10, '0')} 00000 n \n`)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n${offsets.join('')}`
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\n`
  pdf += `startxref\n${xrefOffset}\n%%EOF`

  return pdf
}

function wrapText(text: string, size: number, maxWidth: number): string[] {
  const maxChars = Math.max(24, Math.floor(maxWidth / (size * 0.52)))
  const lines: string[] = []

  text.split(/\r?\n/).forEach((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean)
    let line = ''

    if (words.length === 0) {
      lines.push('')
      return
    }

    words.forEach((word) => {
      if (word.length > maxChars) {
        if (line) {
          lines.push(line)
          line = ''
        }
        splitLongWord(word, maxChars).forEach((part) => lines.push(part))
        return
      }

      const candidate = line ? `${line} ${word}` : word
      if (candidate.length > maxChars) {
        lines.push(line)
        line = word
      } else {
        line = candidate
      }
    })

    if (line) lines.push(line)
  })

  return lines
}

function splitLongWord(word: string, maxChars: number): string[] {
  const chunks: string[] = []
  for (let index = 0; index < word.length; index += maxChars) {
    chunks.push(word.slice(index, index + maxChars))
  }
  return chunks
}

function escapePdfText(text: string): string {
  return text
    .normalize('NFC')
    .replace(/[()\\]/g, (char) => `\\${char}`)
    .replace(/[^\x20-\x7e]/g, (char) => {
      const code = char.charCodeAt(0)
      if (code > 255) return '?'
      return `\\${code.toString(8).padStart(3, '0')}`
    })
}

function formatDate(date?: string): string {
  if (!date) return 'No informada'
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatTime(time?: string): string {
  if (!time) return 'No informada'
  return time.slice(0, 5)
}

function buildRecipeFileName(data: RecipePdfData): string {
  const patient = data.paciente
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)

  return `receta-${data.id}${patient ? `-${patient}` : ''}.pdf`
}
