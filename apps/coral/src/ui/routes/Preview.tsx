import { Editor } from '../components/Editor'

// import { useSpecValue } from '../state/specValue'

export const Preview = () => {
  // const { setValue } = useSpecValue()

  return (
    <div>
      <h1>Preview</h1>
      <Editor language="json" />
    </div>
  )
}
