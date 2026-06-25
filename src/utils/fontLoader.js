// TTF/OTF 파일을 브라우저 @font-face에 동적으로 등록하는 유틸리티

const ALLOWED_EXTENSIONS = ['ttf', 'otf', 'woff', 'woff2']

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

export function isValidFontFile(file) {
  const ext = getFileExtension(file.name)
  return ALLOWED_EXTENSIONS.includes(ext)
}

export async function loadFontFromFile(file) {
  if (!isValidFontFile(file)) {
    throw new Error('TTF, OTF, WOFF 파일만 업로드할 수 있습니다.')
  }

  const fontName = file.name.replace(/\.[^.]+$/, '') // 확장자 제거
  const url = URL.createObjectURL(file)

  const fontFace = new FontFace(fontName, `url(${url})`)
  const loaded = await fontFace.load()
  document.fonts.add(loaded)

  return fontName
}
