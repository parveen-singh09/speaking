import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons'

type Option = string | { value: string; label: string }

interface SelectProps {
  value: string
  options: readonly Option[]
  placeholder?: string
  searchable?: boolean
  onChange: (value: string) => void
}

function toValue(o: Option): string {
  return typeof o === 'string' ? o : o.value
}

function toLabel(o: Option): string {
  return typeof o === 'string' ? o : o.label
}

export function Select({
  value,
  options,
  placeholder = 'Select…',
  searchable = false,
  onChange,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (open && searchable) {
      searchRef.current?.focus()
    }
    if (!open) {
      setQuery('')
    }
  }, [open, searchable])

  const filtered = query
    ? options.filter((o) => toLabel(o).toLowerCase().includes(query.toLowerCase()))
    : options

  const selectedLabel = options.map(toLabel).find((_, i) => toValue(options[i]) === value)

  const pick = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
  }

  return (
    <div className="dd" ref={rootRef}>
      <button
        type="button"
        className={open ? 'dd-trigger open' : 'dd-trigger'}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={value ? 'dd-value' : 'dd-value dd-placeholder'}>
          {selectedLabel ?? placeholder}
        </span>
        <span className="dd-chevron" aria-hidden="true">
          <Icon name="chevron-down" size={18} />
        </span>
      </button>

      {open && (
        <div className="dd-panel" role="listbox">
          {searchable && (
            <div className="dd-search">
              <input
                ref={searchRef}
                className="dd-search-input"
                type="text"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search options"
              />
            </div>
          )}
          <div className="dd-list">
            {filtered.length === 0 ? (
              <p className="dd-empty">No match</p>
            ) : (
              filtered.map((option) => {
                const optValue = toValue(option)
                const optLabel = toLabel(option)
                const isSelected = optValue === value
                return (
                  <button
                    key={optValue}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={isSelected ? 'dd-option selected' : 'dd-option'}
                    onClick={() => pick(optValue)}
                  >
                    {optLabel}
                    {isSelected && <Icon name="check" size={16} />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
