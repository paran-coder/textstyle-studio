// 텍스트 스타일러의 전체 상태를 관리하는 커스텀 훅
import { useState } from 'react'

export const PRESET_RESOLUTIONS = [
  { label: '1280 × 720 (HD)', width: 1280, height: 720 },
  { label: '1920 × 1080 (FHD)', width: 1920, height: 1080 },
  { label: '2560 × 1440 (QHD)', width: 2560, height: 1440 },
  { label: '3840 × 2160 (4K)', width: 3840, height: 2160 },
]

export const BUILTIN_FONTS = [
  { label: 'Noto Sans KR', value: 'Noto Sans KR' },
  { label: 'Pretendard', value: 'Pretendard' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
]

const DEFAULT_STATE = {
  // 텍스트
  text: '텍스트를 입력하세요',
  fontFamily: 'Noto Sans KR',
  fontSize: 64,
  fontWeight: 700,
  textColor: '#ffffff',

  // 변형
  skewX: 0,
  skewY: 0,

  // 그림자
  shadowOffsetX: 4,
  shadowOffsetY: 4,
  shadowBlur: 8,
  shadowColor: '#00000088',
  shadowEnabled: false,

  // 테두리
  borderWidth: 0,
  borderColor: '#ffffff',
  borderRadius: 8,

  // 불투명도
  opacity: 100,

  // 배경
  bgType: 'solid', // 'solid' | 'transparent' | 'gradient'
  bgColor: '#6366f1',
  gradientStart: '#6366f1',
  gradientEnd: '#a855f7',
  gradientAngle: 135,

  // 내보내기
  exportPreset: 1, // PRESET_RESOLUTIONS index
  customWidth: 1920,
  customHeight: 1080,
  useCustomSize: false,

  // 업로드 폰트 목록
  uploadedFonts: [],
}

export function useStyleState() {
  const [state, setState] = useState(DEFAULT_STATE)

  const update = (key, value) =>
    setState(prev => ({ ...prev, [key]: value }))

  const addUploadedFont = (fontName) =>
    setState(prev => ({
      ...prev,
      uploadedFonts: prev.uploadedFonts.includes(fontName)
        ? prev.uploadedFonts
        : [...prev.uploadedFonts, fontName],
      fontFamily: fontName,
    }))

  const getExportSize = () => {
    if (state.useCustomSize) {
      return { width: state.customWidth, height: state.customHeight }
    }
    return PRESET_RESOLUTIONS[state.exportPreset]
  }

  return { state, update, addUploadedFont, getExportSize }
}
