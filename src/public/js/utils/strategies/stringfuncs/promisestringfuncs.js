let utilFunc = "function promisifyIterator(item, idx, iteratorFunc) {\n"+
"  return new Promise((resolve, reject) => {\n"+
"    iteratorFunc(item, idx, (err) => {\n"+
"      if (err) reject(err);\n"+
"      resolve();\n"+
"    });\n"+
"  });\n"+
"}\n\n"

export default {
  'sequence': utilFunc+"function sequence(items, iteratorFunc, done) {\n"+
  "  let sequence = Promise.resolve();\n"+
  "  items.forEach((item, idx) => {\n"+
  "    sequence = sequence.then(() => {\n"+
  "      return promisifyIterator(item, idx, iteratorFunc);\n"+
  "    });\n"+
  "  });\n"+
  "  \n"+
  "  return sequence.then(() => {\n"+
  "    console.log('completed sequentialFlow promise');\n"+
  "    done();\n"+
  "  });\n"+
  "}",
  'parallel': utilFunc+"function parallel(items, iteratorFunc, done) {\n"+
  "  let promises = items.map((item, idx) => {\n"+
  "    return promisifyIterator(item, idx, iteratorFunc);\n"+
  "  });\n"+
  "  \n"+
  "  return Promise.all(promises).then(() => {\n"+
  "    console.log('completed parallelFlow promise');\n"+
  "    done()\n"+
  "  });\n"+
  "}",
  'limitedParallel': utilFunc+"function limitedParallel(items, iteratorFunc, done) {\n"+
  "  let concurrency = 2;\n"+
  "  let running = 0;\n"+
  "  let promises = items.map((item, idx) => {\n"+
  "    return () => {\n"+
  "      return promisifyIterator(item, idx, iteratorFunc);\n"+
  "    };\n"+
  "  });\n"+
  "  \n"+
  "  function limitParallel() {\n"+
  "    return new Promise((resolve, reject) => {\n"+
  "      while ( running < concurrency && promises.length ) {\n"+
  "        let prom = promises.shift();\n"+
  "        \n"+
  "        prom().then(() => {\n"+
  "          running--;\n"+
  "          limitParallel().then(resolve);\n"+
  "        });\n"+
  "       \n"+
  "        running++;\n"+
  "      }\n"+
  "      \n"+
  "      if ( !running && !promises.length ) {\n"+
  "        console.log('completed limitedParallelFlow promise');\n"+
  "        return resolve();\n"+
  "      }\n"+
  "    });\n"+
  "  };\n"+
  "  \n"+
  "  return limitParallel().then(done);\n"+
  "}"
}