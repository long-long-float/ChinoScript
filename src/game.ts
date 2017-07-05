import * as ChinoScript from './index'

const resultElem = document.getElementById('result') as HTMLDivElement
const outputElem = document.getElementById('output') as HTMLTextAreaElement

console.log = (text: string) => {
  outputElem.value += text + '\n'
}

const errorElem = document.getElementById('error') as HTMLDivElement
(document.getElementById('run-button') as HTMLButtonElement).addEventListener('click', () => {
  outputElem.value = ''

  const code = (document.getElementById('src') as HTMLTextAreaElement).value
  try {
    resultElem.innerHTML = ChinoScript.valueToString(ChinoScript.evaluate(code, false))
  } catch (e) {
    errorElem.innerHTML = e.message
  }
})
