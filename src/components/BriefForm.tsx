import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Button, Checkbox, Input, Textarea } from './Controls'
export type BriefValues = { name: string; company: string; contact: string; task: string; consent: boolean }
export type BriefFormProps = { defaultValues?: Partial<BriefValues> } & (
  | { submissionDisabled?: false; onSubmit: (values: BriefValues) => Promise<void> }
  | { submissionDisabled: true; onSubmit?: (values: BriefValues) => Promise<void> }
)
const empty: BriefValues = { name: '', company: '', contact: '', task: '', consent: false }
type Errors = Partial<Record<keyof BriefValues, string>>
export function validateBrief(values: BriefValues): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Укажите имя'
  if (!values.contact.trim()) errors.contact = 'Укажите телефон или Telegram'
  if (!values.task.trim()) errors.task = 'Опишите задачу'
  if (!values.consent) errors.consent = 'Подтвердите согласие'
  return errors
}
export function BriefForm({ onSubmit, defaultValues, submissionDisabled = false }: BriefFormProps) {
  const [values, setValues] = useState<BriefValues>({ ...empty, ...defaultValues })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'initial' | 'sending' | 'success' | 'failure' | 'unavailable'>('initial')
  const locked = useRef(false), form = useRef<HTMLFormElement>(null), result = useRef<HTMLDivElement>(null), id = useId()
  useEffect(() => { if (status === 'success' || status === 'failure') result.current?.focus() }, [status])
  function change<K extends keyof BriefValues>(key: K, value: BriefValues[K]) { setValues(previous => ({ ...previous, [key]: value })) }
  async function submit(event?: FormEvent) {
    event?.preventDefault()
    if (locked.current) return
    const invalid = validateBrief(values)
    setErrors(invalid)
    const first = Object.keys(invalid)[0]
    if (first) { form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return }
    if (submissionDisabled || !onSubmit) { setStatus('unavailable'); return }
    locked.current = true
    setStatus('sending')
    try { await onSubmit({ ...values }); setStatus('success') }
    catch { setStatus('failure') }
    finally { locked.current = false }
  }
  function reset() { setValues({ ...empty }); setErrors({}); setStatus('initial') }
  return <form ref={form} className="ui-brief" noValidate onSubmit={submit} aria-label="Заявка">
    {status === 'success' || status === 'failure' ? <div ref={result} tabIndex={-1} role={status === 'failure' ? 'alert' : 'status'} className="ui-brief__result"><h2 className="ui-h3">{status === 'success' ? 'Заявка принята' : 'Не удалось отправить'}</h2><p className="ui-control">{status === 'success' ? 'Спасибо! Вернёмся с вопросами по задаче.' : 'Данные сохранены. Проверьте соединение и попробуйте ещё раз.'}</p><Button onClick={status === 'success' ? reset : () => { void submit() }}>{status === 'success' ? 'Заполнить ещё раз' : 'Повторить отправку'}</Button></div> : <>
      <Input id={`${id}-name`} name="name" label="Имя *" autoComplete="given-name" required value={values.name} onChange={e => change('name', e.target.value)} placeholder="Как к вам обращаться" error={errors.name} disabled={status === 'sending'} />
      <Input id={`${id}-company`} name="company" label="Компания или ниша" autoComplete="organization" value={values.company} onChange={e => change('company', e.target.value)} placeholder="Например, мебель" disabled={status === 'sending'} />
      <Input id={`${id}-contact`} name="contact" label="Телефон или Telegram *" required value={values.contact} onChange={e => change('contact', e.target.value)} placeholder="Как с вами связаться" error={errors.contact} disabled={status === 'sending'} />
      <Textarea id={`${id}-task`} name="task" label="Задача *" required value={values.task} onChange={e => change('task', e.target.value)} placeholder="Что хотите изменить?" error={errors.task} disabled={status === 'sending'} />
      <Checkbox name="consent" label="Согласен на обработку персональных данных" required checked={values.consent} onChange={e => change('consent', e.target.checked)} error={errors.consent} disabled={status === 'sending'} />
      {Object.keys(errors).length > 0 && <p className="ui-field__error" role="alert">Заполните обязательные поля и подтвердите согласие.</p>}
      {status === 'unavailable' && <p className="ui-field__error" role="alert">Отправка пока недоступна. Введённые данные остаются в форме.</p>}
      <Button type="submit" busy={status === 'sending'}>{status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}</Button>
    </>}
  </form>
}
