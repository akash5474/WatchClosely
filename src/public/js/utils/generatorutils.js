export default function generatorFlow(generatorFunc) {
  function callback(err) {
    if (err) {
      return generatorFunc.throw(err);
    }

    let results = [].slice.call(arguments, 1);
    generator.next( results.length > 1 ? results : results[0] );
  };

  let generator = generatorFunc(callback);
  generator.next();
};