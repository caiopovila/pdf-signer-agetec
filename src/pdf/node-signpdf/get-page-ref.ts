import findObject from './find-object'
import getPagesDictionaryRef from './get-pages-dictionary-ref'

const getPageRef = (pdf: Buffer, info: any, annotationOnPage: number = 0) => {
  const pagesRef = getPagesDictionaryRef(info)
  const pagesDictionary = findObject(pdf, info.xref, pagesRef)
  const kidsPosition = pagesDictionary.indexOf('/Kids')
  const kidsStart = pagesDictionary.indexOf('[', kidsPosition) + 1
  const kidsEnd = pagesDictionary.indexOf(']', kidsPosition)
  const pages = pagesDictionary.slice(kidsStart, kidsEnd).toString()
  let pageIndexList = pages.split('0 R').filter((p) => p !== '')

  pageIndexList.forEach((element: any) => {
    const ob = findObject(pdf, info.xref, `${element} 0 R`.trim());
    const typePosition = ob.indexOf('/Type ') + 7;
    const objectType = ob.slice(typePosition, typePosition + 6);

    if (objectType.toString().trim() == 'Pages') {

      const kidsPosition2 = ob.indexOf('/Kids');
      const kidsStart2 = ob.indexOf('[', kidsPosition2) + 1;
      const kidsEnd2 = ob.indexOf(']', kidsPosition2);
      const pages2 = ob.slice(kidsStart2, kidsEnd2).toString();
      const pageIndexList2 = pages2.replace(/\s+/g, '').split('0R').filter((p) => p !== '');
      pageIndexList = [...pageIndexList2, ...pageIndexList]
    }
  });

  pageIndexList = pageIndexList.sort((a, b) => a - b);
  return `${pageIndexList[annotationOnPage]} 0 R`.trim()
}

export default getPageRef
