export default {
  'sequence': "function sequence(items, iteratorFunc, done) {\n"+
  "  let idx = 0;\n"+
  "  function iterate(idx, cb) {\n"+
  "    return iteratorFunc(items[idx], idx, (err) => {\n"+
  "      if (err) {\n"+
  "        console.log('ERROR:', err);\n"+
  "        console.log(err.stack);\n"+
  "        throw err;\n"+
  "      }\n"+
  "      \n"+
  "      if ( idx === items.length - 1 ) {\n"+
  "        return cb();\n"+
  "      }\n"+
  "      \n"+
  "      iterate(++idx, cb);\n"+
  "    });\n"+
  "  }\n"+
  "  \n"+
  "  iterate(0, () => {\n"+
  "    console.log('completed sequentialFlow plain');\n"+
  "    done();\n"+
  "  });\n"+
  "}",
  'parallel': "function parallel(items, iteratorFunc, done) {\n"+
  "  let completed = 0;\n"+
  "  \n"+
  "  items.forEach((item, idx) => {\n"+
  "    iteratorFunc(item, idx, (err) => {\n"+
  "      if (err) {\n"+
  "        console.log('ERROR:', err);\n"+
  "        console.log(err.stack);\n"+
  "        throw err;\n"+
  "      }\n"+
  "      \n"+
  "      if ( ++completed === items.length - 1 ) {\n"+
  "        console.log('completed parallelFlow plain');\n"+
  "        done();\n"+
  "      }\n"+
  "    });\n"+
  "  });\n"+
  "}",
  'limitedParallel': "function limitedParallel(items, iteratorFunc, done) {\n"+
  "  let concurrency = 2;\n"+
  "  let running = 0;\n"+
  "  let tasks = items.map((el) => { return el });\n"+
  "  \n"+
  "  function iterate(idx) {\n"+
  "    while(running < concurrency && tasks.length) {\n"+
  "      let item = tasks.shift();\n"+
  "      running++;\n"+
  "      iteratorFunc(item, idx, (err) => {\n"+
  "        if (err) {\n"+
  "          console.log('ERROR:', err);\n"+
  "          console.log(err.stack);\n"+
  "          throw err;\n"+
  "        }\n"+
  "        running--;\n"+
  "        iterate(++idx);\n"+
  "      });\n"+
  "      \n"+
  "      iterate(++idx);\n"+
  "    }\n"+
  "    \n"+
  "    if ( !running && !tasks.length ) {\n"+
  "      console.log('completed limitedParallelFlow plain');\n"+
  "      done();\n"+
  "    }\n"+
  "  }\n"+
  "  \n"+
  "  iterate(0);\n"+
  "}"
}