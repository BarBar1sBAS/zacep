import type { SVGProps } from 'react'
export const iconPaths = {
  arrow: 'M5 19L19 5M5 5h14v14', plus: 'M12 4v16M4 12h16', minus: 'M4 12h16',
  close: 'M5 5l14 14M19 5L5 19', menu: 'M4 7h16M4 12h16M4 17h16', check: 'M4 12l5 5L20 6',
} as const
export type IconName = keyof typeof iconPaths
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & { name: IconName; size?: number | string; label?: string }
export function Icon({ name, size = 24, label, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" focusable="false" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...props}><path d={iconPaths[name]} /></svg>
}
