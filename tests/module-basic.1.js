// node-args: --expose-gc
const ivm = require('../isolated-vm');

const resolver = () => {};

let isolate;
let context;
let moduleMap = {};

const x = () => {
  isolate = new ivm.Isolate();
  context = isolate.createContextSync(); // All modules must share the same context

  moduleMap = {};

  const data = (moduleMap.add = {});
  const code = `export default function add(a, b) { return a + b; };"This is awesome!";`;
  const module = data.module = isolate.compileModuleSync(code);
  const dependencySpecifiers = module.dependencySpecifiers;
  module.instantiateSync(context, resolver);
  const evaluateResult = module.evaluateSync();
  // const reference = module.namespace;
  // const defaultExport = reference.getSync('default');
  // const result = defaultExport.applySync(null, [ 2, 4 ]);

  context.release();
  isolate.dispose();
  setTimeout(x, 2);
};

x();

