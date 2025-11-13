const Textarea = (props: React.ComponentProps<'textarea'>) => {
  return <textarea className="w-full" placeholder="Enter your text here" {...props} />
}

Textarea.displayName = 'Textarea'

export { Textarea }
