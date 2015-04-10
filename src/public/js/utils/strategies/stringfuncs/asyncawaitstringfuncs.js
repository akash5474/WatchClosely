let utilFunc = "function promisifyIterator(item, idx, iteratorFunc) {\n"+
"  return new Promise((resolve, reject) => {\n"+
"    iteratorFunc(item, idx, (err) => {\n"+
"      if (err) reject(err);\n"+
"      resolve();\n"+
"    });\n"+
"  });\n"+
"}\n\n"

export default {
  'sequence': utilFunc+"async function sequence(items, iteratorFunc, done) {\n"+
  "  for ( let idx = 0; idx < items.length; idx++ ) {\n"+
  "    await promisifyIterator(items[idx], idx, iteratorFunc);\n"+
  "  };\n"+
  "  \n"+
  "  console.log('completed sequentialFlow asyncAwait');\n"+
  "  done();\n"+
  "}",
  'parallel': utilFunc+"async function parallel(items, iteratorFunc, done) {\n"+
  "  let promises = items.map((item, idx) => {\n"+
  "    return promisifyIterator(item, idx, iteratorFunc);\n"+
  "  });\n"+
  "  \n"+
  "  await* promises;\n"+
  "  console.log('completed parallelFlow asyncAwait');\n"+
  "  done()\n"+
  "}",
  'limitedParallel': utilFunc+"limitedParallel(items, iteratorFunc, done) {\n"+
  "  let concurrency = 2;\n"+
  "  let running = 0;\n"+
  "  let promises = items.map((item, idx) => {\n"+
  "    return () => {\n"+
  "      return promisifyIterator(item, idx, iteratorFunc);\n"+
  "    };\n"+
  "  });\n"+
  "  \n"+
  "  async function limitParallel() {\n"+
  "    while ( running < concurrency && promises.length ) {\n"+
  "      let prom = promises.shift();\n"+
  "      running++;\n"+
  "      \n"+
  "      limitParallel();\n"+
  "      await prom();\n"+
  "      running--;\n"+
  "      \n"+
  "      if ( !running && !promises.length ) {\n"+
  "        console.log('completed limitedParallelFlow asyncAwait');\n"+
  "        done();\n"+
  "      }\n"+
  "    }\n"+
  "  };\n"+
  "  \n"+
  "  return limitParallel();\n"+
  "}"
}