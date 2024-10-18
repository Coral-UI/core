import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import CodeMirror from '@uiw/react-codemirror'

import { useSpecValue } from '../state/specValue'

type EditorProps = {
  handleChange?: (value: string) => void
  language: 'javascript' | 'json'
  className?: string
}

export const Editor = ({ language = 'javascript', className, handleChange = () => {} }: EditorProps) => {
  const { value, setValue } = useSpecValue()

  const onChangeHandler = (value: string) => {
    handleChange(value)
    setValue(value)
  }

  return (
    <CodeMirror
      value={value}
      onChange={onChangeHandler}
      extensions={[language === 'javascript' ? javascript() : json()]}
      className={className}
      theme={'dark'}
      height="100%"
      width="100%"
      maxWidth="600"
      maxHeight="430"
    />
  )
}
