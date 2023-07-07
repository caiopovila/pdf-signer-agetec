import findObject from './find-object'
import getIndexFromRef from './get-index-from-ref'

const createBufferPageWithAnnotation = (pdf: Buffer, info: any, pagesRef: string, widget: any) => {
  const pagesDictionary = findObject(pdf, info.xref, pagesRef).toString()

  const splittedDictionary = pagesDictionary.split('/Annots')[0]
  let splittedIds = pagesDictionary.split('/Annots')[1]
  const widgetValue = widget.toString()
  splittedIds = splittedIds === undefined ? '[' + widgetValue + ']' : splittedIds.replace(/\]/, ' ' + widgetValue + ']'); // eslint-disable-next-line no-useless-escape

  const pagesDictionaryIndex = getIndexFromRef(info.xref, pagesRef)

  return Buffer.concat([
    Buffer.from(`${pagesDictionaryIndex} 0 obj\n`),
    Buffer.from('<<\n'),
    Buffer.from(`${splittedDictionary}\n`),
    Buffer.from(`/Annots ${splittedIds}`),
    Buffer.from('\n>>\nendobj\n'),
  ])
}

export default createBufferPageWithAnnotation
