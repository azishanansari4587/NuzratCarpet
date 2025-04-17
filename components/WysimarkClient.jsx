'use client'

import dynamic from 'next/dynamic'

// Dynamically import from the root module (not /react)
const Wysimark = dynamic(() =>
  import('wysimark').then((mod) => mod.Wysimark), {
  ssr: false
})

export default function WysimarkClient({ value, onChange }) {
  return <Wysimark value={value} onChange={onChange} />
}

