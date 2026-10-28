import { useId, type ButtonHTMLAttributes, type ComponentPropsWithRef, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
export type ButtonProps = ComponentPropsWithRef<'button'> & { variant?: 'primary' | 'secondary' | 'link'; busy?: boolean; icon?: IconName | false }
export function Button({ variant = 'primary', busy = false, icon = 'arrow', disabled, children, className = '', type = 'button', ...props }: ButtonProps) {
  return <button {...props} type={type} className={`ui-button ui-button--${variant} ${className}`} disabled={disabled || busy} aria-busy={busy || undefined}>{children}{icon && <Icon name={icon} />}</button>
}
type FieldProps = { label: string; hint?: string; error?: string }
export type InputProps = ComponentPropsWithRef<'input'> & FieldProps
export type TextareaProps = ComponentPropsWithRef<'textarea'> & FieldProps
function Field({ id, label, hint, error, children }: FieldProps & { id: string; children: ReactNode }) {
  return <div className="ui-field"><label className="ui-field__label" htmlFor={id}>{label}</label>{children}{hint && <p className="ui-field__hint" id={`${id}-hint`}>{hint}</p>}{error && <p className="ui-field__error" id={`${id}-error`}>{error}</p>}</div>
}
function describedBy(id: string, hint?: string, error?: string, external?: string) {
  return [external, hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
}
export function Input({ label, hint, error, id: provided, className = '', 'aria-describedby': description, ...props }: InputProps) {
  const generated = useId(), id = provided || generated
  return <Field {...{ id, label, hint, error }}><input {...props} id={id} className={`ui-input ${className}`} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(id, hint, error, description)} /></Field>
}
export function Textarea({ label, hint, error, id: provided, className = '', 'aria-describedby': description, ...props }: TextareaProps) {
  const generated = useId(), id = provided || generated
  return <Field {...{ id, label, hint, error }}><textarea {...props} id={id} className={`ui-textarea ${className}`} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(id, hint, error, description)} /></Field>
}
export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & { label: ReactNode; error?: string }
export function Checkbox({ label, error, id: provided, className = '', 'aria-describedby': description, ...props }: CheckboxProps) {
  const generated = useId(), id = provided || generated
  return <div><label className={`ui-checkbox ${className}`} htmlFor={id}><span className="ui-checkbox__mark"><input {...props} id={id} type="checkbox" className="ui-checkbox__control" aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(id, undefined, error, description)} /><Icon name="check" /></span><span>{label}</span></label>{error && <p className="ui-field__error" id={`${id}-error`}>{error}</p>}</div>
}
export type SelectionRowProps = ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }
export function SelectionRow({ selected = false, className = '', children, type = 'button', ...props }: SelectionRowProps) {
  return <button {...props} type={type} aria-pressed={selected} className={`ui-selection ${className}`}>{children}<Icon name={selected ? 'arrow' : 'plus'} /></button>
}
