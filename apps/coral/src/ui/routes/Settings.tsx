import { Editor } from '../components/Editor'

// import { useSpecValue } from '../state/specValue'

export const Settings = () => {
  // const { setValue } = useSpecValue()

  return (
    <div>
      <h1>Settings</h1>
      <Editor language="json" />
    </div>
  )
}
