import React, { useRef } from 'react'
import SignatureScreen from 'react-native-signature-canvas'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Sign = ({ text, onOK }) => {
  const ref = useRef()

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature: any) => {
    onOK(signature) // Callback from Component props
  }

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {}

  // Called after ref.current.clearSignature()
  const handleClear = () => {}

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature()
  }

  // Called after ref.current.getData()
  const handleData = (data) => {}

  return (
    <SignatureScreen
      ref={ref}
      onEnd={handleEnd}
      onOK={handleOK}
      onEmpty={handleEmpty}
      onClear={handleClear}
      onGetData={handleData}
      autoClear
      descriptionText={text}
    />
  )
}

export default Sign
