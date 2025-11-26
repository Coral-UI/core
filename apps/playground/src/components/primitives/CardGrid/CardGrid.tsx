import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/primitives/Empty/Empty'
import { Component, Library, Organization } from '@/types'
import { IconFolderCode } from '@tabler/icons-react'
import { Fragment } from 'react'

export const CardGrid = ({
  itemList,
  type,
  description,
  children,
  itemComponent,
}: {
  itemList: Organization[] | Library[] | Component[]
  type: 'organizations' | 'libraries' | 'components'
  description?: string
  children: React.ReactNode
  itemComponent: (item: Organization | Library | Component) => React.ReactNode
}) => {
  if (itemList.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderCode />
          </EmptyMedia>
          <EmptyTitle>No {type} yet</EmptyTitle>
          {description && <EmptyDescription>{description}</EmptyDescription>}
        </EmptyHeader>
        <EmptyContent>{children}</EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {itemList.map((item) => (
        <Fragment key={item.id}>{itemComponent(item)}</Fragment>
      ))}
    </div>
  )
}
