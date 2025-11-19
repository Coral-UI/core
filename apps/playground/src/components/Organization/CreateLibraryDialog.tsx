import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLibrary } from '@/hooks/queries/useLibraries'
import { useState } from 'react'

interface CreateLibraryDialogProps {
  organizationId: string
}

export function CreateLibraryDialog({ organizationId }: CreateLibraryDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createLibrary = useCreateLibrary()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const trimmedDescription = description.trim()
      await createLibrary.mutateAsync({
        organizationId,
        name: name.trim(),
        ...(trimmedDescription && { description: trimmedDescription }),
      })
      setName('')
      setDescription('')
      setOpen(false)
    } catch {
      // Error handling is done in the mutation hook
    }
  }

  return (
    <Dialog
      buttonText="Create New Library"
      title="Create Library"
      description="Create a new library to organize your components"
      open={open}
      onOpenChange={setOpen}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Library"
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A description of this library"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createLibrary.isPending || !name.trim()}>
            {createLibrary.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Dialog>
  )

  // return (
  //   <Dialog open={open} onOpenChange={setOpen}>
  //     <DialogTrigger render={() => <Button>Create New Library</Button>} />
  //     <DialogContent>
  //       <DialogHeader>
  //         <DialogTitle>Create Library</DialogTitle>
  //         <DialogDescription>Create a new library to organize your components</DialogDescription>
  //       </DialogHeader>
  //       <form onSubmit={handleSubmit} className="space-y-4">
  //         <div className="space-y-2">
  //           <Label htmlFor="name">Name</Label>
  //           <Input
  //             id="name"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             placeholder="My Library"
  //             required
  //             autoFocus
  //           />
  //         </div>
  //         <div className="space-y-2">
  //           <Label htmlFor="description">Description (optional)</Label>
  //           <Input
  //             id="description"
  //             value={description}
  //             onChange={(e) => setDescription(e.target.value)}
  //             placeholder="A description of this library"
  //           />
  //         </div>
  //         <div className="flex justify-end gap-2">
  //           <Button type="button" variant="outline" onClick={() => setOpen(false)}>
  //             Cancel
  //           </Button>
  //           <Button type="submit" disabled={createLibrary.isPending || !name.trim()}>
  //             {createLibrary.isPending ? 'Creating...' : 'Create'}
  //           </Button>
  //         </div>
  //       </form>
  //     </DialogContent>
  //   </Dialog>
  // )
}
