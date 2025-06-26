import { lazy } from 'react';

export function lazyload(path, namedExport) {
  return lazy(() => {
    const promise = import(path);
    if (namedExport == null) {
      return promise;
    } else {
      return promise.then(module => ({ default: module[namedExport] }));
    }
  });
}

//const About = lazyload("./components/About","About")
//<Suspense callback={<h2>Loading...</h2>}></Suspense>
// onClick = {() => {
//    import("../sum.js").then(module => {
//      alert(module.sum(2,3))
//})
//}}
