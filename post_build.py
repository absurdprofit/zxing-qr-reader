import shutil
import os

shutil.copy('./package.json', './build')
shutil.copy('./README.md', './build')

indexFile = open(os.path.join('build', 'index.js'), 'r')
indexJS = indexFile.read()
indexFile.close()
indexFile = open(os.path.join('build', 'index.js'), 'w')
indexJS = indexJS.replace('/* worker import */ __webpack_require__.p + __webpack_require__.u("reader.worker"), __webpack_require__.b', "'./reader.worker.js', import.meta.url")
indexFile.write(indexJS)
indexFile.close()

