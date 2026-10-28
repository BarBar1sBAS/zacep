import { copyFile, mkdir } from 'node:fs/promises'

await mkdir('dist/case-template', { recursive: true })
await copyFile('dist/index.html', 'dist/case-template/index.html')
await copyFile('dist/index.html', 'dist/404.html')
