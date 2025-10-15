import { Check } from '@phosphor-icons/react'

import { Select } from '../components/Select'

export const Settings = () => {
  return (
    <div className="flex flex-col px-4">
      <header className="flex items-center justify-between mt-8 pb-2 border-b border-border">
        <h1 className="text-xl font-semibold tracking-tight text-primary">Settings</h1>
      </header>
      <div>
        <Select
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ]}
          value=""
          onChange={() => {}}
        />
        <div>
          <label className="flex items-center gap-2">
            <div className="inline-flex relative rounded-md overflow-hidden border border-border">
              <input
                type="checkbox"
                className="peer w-4 h-4 shrink-0 appearance-none border-none  bg-input rounded-sm shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:text-primary-foreground"
              />
              <Check
                weight="bold"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none h-3 w-3 text-primary-foreground peer-checked:block hidden"
              />
            </div>
            <span className="text-xs tracking-tight font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Show grid
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
