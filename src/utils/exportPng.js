// 미리보기 DOM 요소를 html2canvas로 캡처해 PNG로 저장하는 유틸리티
import html2canvas from 'html2canvas'

export async function exportToPng(element, { width, height, transparent }) {
  if (!element) throw new Error('내보낼 요소가 없습니다.')

  const previewWidth = element.offsetWidth
  const previewHeight = element.offsetHeight

  const scaleX = width / previewWidth
  const scaleY = height / previewHeight
  const scale = Math.min(scaleX, scaleY)

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: transparent ? null : undefined,
    logging: false,
  })

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('PNG 변환에 실패했습니다.'))
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `textstyle-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png')
  })
}
