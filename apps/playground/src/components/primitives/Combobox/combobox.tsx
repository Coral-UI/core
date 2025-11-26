'use client'

import { Combobox as BaseCombobox } from '@base-ui-components/react/combobox'
import * as React from 'react'

import { Field } from '../Field/Field'

import './combobox.css'

export const Combobox = ({ items = [] }: { items?: string[] }) => {
  return (
    <BaseCombobox.Root items={items}>
      <Field label="Combobox">
        <BaseCombobox.Input className="combobox-input" />
      </Field>
    </BaseCombobox.Root>
  )
}
