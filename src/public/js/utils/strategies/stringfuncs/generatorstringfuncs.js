let utilFunc = "function runGeneratorFlow(generatorFunc) {\n"+
"  function callback(err) {\n"+
"    if (err) {\n"+
"      generatorFunc.throw(err);\n"+
"    }\n"+
"    \n"+
"    let results = [].slice.call(arguments, 1);\n"+
"    generator.next(results.length > 1 ? results : results[0]);\n"+
"  }\n"+
"  \n"+
"  let generator = generatorFunc(callback);\n"+
"  generator.next();\n"+
"}\n\n";

export default {
  'sequence': utilFunc+"sequence(items, iteratorFunc, done) {\n"+
  "  runGeneratorFlow(function* (callback) {\n"+
  "    for ( let i = 0; i < items.length; i++ ) {\n"+
  "      yield iteratorFunc(items[i], i, callback);\n"+
  "    }\n"+
  "    console.log('completed sequentialFlow generator');\n"+
  "    done();\n"+
  "  });\n"+
  "}",
  'parallel': utilFunc+"parallel(items, iteratorFunc, done) {\n"+
  "  runGeneratorFlow(function* (callback) {\n"+
  "    let tasks = items.map((item, idx) => {\n"+
  "      return iteratorFunc(item, idx, callback);\n"+
  "    });\n"+
  "    \n"+
  "    yield* tasks;\n"+
  "    console.log('completed parallelFlow generator');\n"+
  "    done();\n"+
  "  });\n"+
  "}",
  'limitedParallel': utilFunc+"limitedParallel(items, iteratorFunc, done) {\n"+
  "  let concurrency = 2;\n"+
  "  let running = 0;\n"+
  "  let tasks = items.map((item, idx) => {\n"+
  "    return function(cb) {\n"+
  "      iteratorFunc(item, idx, cb)\n"+
  "    };\n"+
  "  });\n"+
  "  \n"+
  "  function limitParallel() {\n"+
  "    runGeneratorFlow(function* (callback) {\n"+
  "      while ( running < concurrency && tasks.length ) {\n"+
  "        let task = tasks.shift();\n"+
  "        running++;\n"+
  "        limitParallel();\n"+
  "        \n"+
  "        yield task(callback);\n"+
  "        running--;\n"+
  "        \n"+
  "        if ( !running && !tasks.length ) {\n"+
  "          console.log('completed limitedParallelFlow generator');\n"+
  "          done();\n"+
  "        }\n"+
  "      }\n"+
  "    });\n"+
  "  };\n"+
  "  \n"+
  "  limitParallel();\n"+
  "}"
}