import JSZip from 'jszip'
import type { Item } from '../types'
import { toZip } from './zipExport'

// Helper to create a test item
const createTestItem = (overrides: Partial<Item> = {}): Item => ({
  id: `item-${Date.now()}-${Math.random()}`,
  type: 'text',
  content: 'Test content',
  source: {
    title: 'Test Page',
    url: 'https://example.com/test',
    site: 'example.com'
  },
  createdAt: Date.now(),
  ...overrides
})

describe('zipExport', () => {
  describe('toZip', () => {
    it('should create a ZIP with markdown export file', async () => {
      const items = [
        createTestItem({ content: 'First quote', source: { title: 'Page 1', url: 'https://example.com/1' } }),
        createTestItem({ content: 'Second quote', source: { title: 'Page 2', url: 'https://example.com/2' } })
      ]

      const zipBlob = await toZip(items)
      expect(zipBlob).toBeInstanceOf(Blob)

      // Verify the ZIP contents
      const zip = await JSZip.loadAsync(zipBlob)
      const mdFile = zip.file('export.md')
      expect(mdFile).not.toBeNull()

      const mdContent = await mdFile!.async('string')
      expect(mdContent).toContain('First quote')
      expect(mdContent).toContain('Second quote')
      expect(mdContent).toContain('(Page 1)')
      expect(mdContent).toContain('(Page 2)')
    })

    it('should handle text items correctly', async () => {
      const items = [
        createTestItem({
          type: 'text',
          content: 'A great quote',
          source: { title: 'Source Page', url: 'https://example.com' }
        })
      ]

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)
      const mdContent = await zip.file('export.md')!.async('string')

      expect(mdContent).toBe('- A great quote (Source Page)')
    })

    it('should replace newlines in text content with spaces', async () => {
      const items = [
        createTestItem({
          content: 'Multi\nline\ntext',
          source: { title: 'Page', url: 'https://example.com' }
        })
      ]

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)
      const mdContent = await zip.file('export.md')!.async('string')

      expect(mdContent).toContain('Multi line text')
      expect(mdContent).not.toContain('\n\n') // Should not have double newlines from content
    })

    it('should extract images from data URLs and save to images folder', async () => {
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      const items = [
        createTestItem({
          type: 'image',
          content: `data:image/png;base64,${base64Image}`,
          hash: 'test-hash-123',
          source: { title: 'Image Source', url: 'https://example.com/image' }
        })
      ]

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)

      // Check that image file exists
      const imageFile = zip.file('images/test-hash-123.png')
      expect(imageFile).not.toBeNull()

      // Check that markdown references the image
      const mdContent = await zip.file('export.md')!.async('string')
      expect(mdContent).toContain('![snapshot](images/test-hash-123.png)')
      expect(mdContent).toContain('(Image Source)')
    })

    it('should handle snapshots like images', async () => {
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      const items = [
        createTestItem({
          type: 'snapshot',
          content: `data:image/png;base64,${base64Image}`,
          hash: 'snapshot-hash',
          source: { title: 'Snapshot Source', url: 'https://example.com' }
        })
      ]

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)

      const imageFile = zip.file('images/snapshot-hash.png')
      expect(imageFile).not.toBeNull()

      const mdContent = await zip.file('export.md')!.async('string')
      expect(mdContent).toContain('![snapshot](images/snapshot-hash.png)')
    })

    it('should generate filename from timestamp if hash is missing', async () => {
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      const items = [
        createTestItem({
          type: 'image',
          content: `data:image/png;base64,${base64Image}`,
          source: { title: 'Image', url: 'https://example.com' }
        })
      ]
      delete items[0].hash

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)

      // Check that an image file exists in the images folder
      const imagesFolder = zip.folder('images')
      const imageFiles = Object.keys(imagesFolder!.files).filter(f => f.startsWith('images/') && f.endsWith('.png'))
      expect(imageFiles.length).toBe(1)
    })

    it('should use URL as fallback when title is missing', async () => {
      const items = [
        createTestItem({
          content: 'Quote without title',
          source: { title: '', url: 'https://example.com/page' }
        })
      ]

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)
      const mdContent = await zip.file('export.md')!.async('string')

      expect(mdContent).toContain('(https://example.com/page)')
    })

    it('should handle link type items', async () => {
      const items = [
        createTestItem({
          type: 'link',
          content: 'https://example.com/article',
          source: { title: 'Article Title', url: 'https://example.com/article' }
        })
      ]

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)
      const mdContent = await zip.file('export.md')!.async('string')

      expect(mdContent).toContain('https://example.com/article')
      expect(mdContent).toContain('(Article Title)')
    })

    it('should handle empty items array', async () => {
      const zipBlob = await toZip([])
      const zip = await JSZip.loadAsync(zipBlob)
      const mdContent = await zip.file('export.md')!.async('string')

      expect(mdContent).toBe('')
    })

    it('should handle mixed item types', async () => {
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      const items = [
        createTestItem({
          type: 'text',
          content: 'A text quote',
          source: { title: 'Text Page', url: 'https://example.com/1' }
        }),
        createTestItem({
          type: 'image',
          content: `data:image/png;base64,${base64Image}`,
          hash: 'img-hash',
          source: { title: 'Image Page', url: 'https://example.com/2' }
        }),
        createTestItem({
          type: 'link',
          content: 'https://example.com/3',
          source: { title: 'Link Page', url: 'https://example.com/3' }
        })
      ]

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)
      const mdContent = await zip.file('export.md')!.async('string')

      expect(mdContent).toContain('A text quote (Text Page)')
      expect(mdContent).toContain('![snapshot](images/img-hash.png) (Image Page)')
      expect(mdContent).toContain('https://example.com/3 (Link Page)')

      // Verify image was extracted
      const imageFile = zip.file('images/img-hash.png')
      expect(imageFile).not.toBeNull()
    })

    it('should handle different image MIME types', async () => {
      const items = [
        createTestItem({
          type: 'image',
          content: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
          hash: 'jpeg-hash',
          source: { title: 'JPEG Image', url: 'https://example.com' }
        })
      ]

      const zipBlob = await toZip(items)
      const zip = await JSZip.loadAsync(zipBlob)

      // Should still save as .png (as per current implementation)
      const imageFile = zip.file('images/jpeg-hash.png')
      expect(imageFile).not.toBeNull()
    })
  })
})
