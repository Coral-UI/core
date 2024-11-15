import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { githubDark } from '@uiw/codemirror-theme-github'
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
    <div className="overflow-hidden rounded-lg border border-border">
      <CodeMirror
        value={value}
        onChange={onChangeHandler}
        extensions={[language === 'javascript' ? javascript() : json()]}
        className={className}
        theme={githubDark}
        height={`680px`}
        width="100%"
        maxWidth="600"
      />
    </div>
  )
}
