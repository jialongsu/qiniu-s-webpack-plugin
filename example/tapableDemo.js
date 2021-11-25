const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");

//  class Car {
// 	constructor() {
//     this.name = 'myPlugin';
// 		this.hooks = {
// 			syncHook: new SyncHook(["arg1"]),
// 			syncBailHook: new SyncBailHook(["arg1"]),
// 			syncWaterfallHook: new SyncWaterfallHook(["arg1"]),
// 			syncLoopHook: new SyncLoopHook(["arg1"]),

// 			asyncParallelHook: new AsyncParallelHook(["arg1"]),
// 			asyncParallelBailHook: new AsyncParallelBailHook(["arg1"]),
// 			asyncSeriesHook: new AsyncSeriesHook(["arg1"]),
// 			asyncSeriesBailHook: new AsyncSeriesBailHook(["arg1"]),
// 			asyncSeriesWaterfallHook: new AsyncSeriesWaterfallHook(["arg1"]),
// 		};

//     this.initSyncHook();
//     this.initAsyncHook();
// 	}

//   initSyncHook() {
//     const name = this.name;
//     // syncHook 会以此执行监听函数，没有任何其他操作
//     this.hooks.syncHook.tap(name, (arg1) => {
//       console.log('tapAsync=====listener', arg1);
//     });

//     // syncBailHook 返回一个任何类型的值（不为undefined）
//     // 如果返回了一个任何类型的值，那么则会阻止剩下的syncBailHook监听函数的执行
//     this.hooks.syncBailHook.tap(name, (arg1) => {
//       console.log('syncBailHook==0===listener', arg1);
//       return null;
//     });

//     this.hooks.syncBailHook.tap(name, (arg1) => {
//       // 由于上一个syncBailHook监听函数返回了一个值
//       // 所以当前的监听函数是不会执行的
//       console.log('syncBailHook===1==listener', arg1);
//     });

//     // syncWaterfallHook 返回一个参数
//     // 这个参数会作为下一个syncWaterfallHook的监听函数的参数
//     this.hooks.syncWaterfallHook.tap(name, (arg1) => {
//       console.log('syncWaterfallHook==0===listener', arg1);
//       return 'pre-' + arg1 
//     });

//     this.hooks.syncWaterfallHook.tap(name, (arg1) => {
//       // arg1 等于上一个syncWaterfallHook监听函数返回的值
//       console.log('syncWaterfallHook==1===listener', arg1);
//       return arg1
//     });

//     // syncLoopHook 如果返回一个非undefined值，
//     // 那么则会从第一个syncLoopHook监听函数开始重新执行
//     let  num = 1;

//     this.hooks.syncLoopHook.tap(name, (arg1) => {
//       console.log('syncLoopHook==0===listener', arg1);
//     });

//     this.hooks.syncLoopHook.tap(name, (arg1) => {
//       console.log('syncLoopHook==1===listener', arg1);
//       if(num > 3) {
//         return undefined;
//       }
//       num += 1;
      
//       return 1;
//     });
//   }

//   initAsyncHook() {
//     const name = this.name;

//     // asyncParallelHook 监听函数全部异步并行执行后，才会执行hook回调函数
//     // 可以看做: Promise.all
//     this.hooks.asyncParallelHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb();
//       }, 1000);
//       console.log('asyncParallelHook==0===listener', arg1, cb);
//     });
//     this.hooks.asyncParallelHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb();
//       }, 2000);
//       console.log('asyncParallelHook==1===listener', arg1, cb);
//     });
    
//     // asyncParallelBailHook 监听函数都会全部异步并行执行，
//     // 但是有一个钩子函数返回非undefined，hook回调函数就会执行
//     // 可以看做: Promise.race
//     this.hooks.asyncParallelBailHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb(true);
//       }, 1000);
//       console.log('asyncParallelBailHook==0===listener', arg1);
//     });
//     this.hooks.asyncParallelBailHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb();
//       }, 2000);
//       console.log('asyncParallelBailHook==1===listener', arg1);
//     });
    
//     // asyncSeriesHook 监听函数会异步串行执行，会保证钩子执行顺序
//     // 上一个钩子执行结束后，下一个钩子才能执行，等最后一个钩子执行结束后，hook回调函数才会执行
//     this.hooks.asyncSeriesHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb();
//       }, 1000);
//       console.log('asyncSeriesHook==0===listener', arg1, cb);
//     });
//     this.hooks.asyncSeriesHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb();
//       }, 2000);
//       console.log('asyncSeriesHook==1===listener', arg1, cb);
//     }); 
    
//     // asyncSeriesBailHook 监听函数会异步串行执行，会保证钩子执行顺序
//     // 但是在钩子执行时如果返回了非undefined，那么剩下的钩子则不会执行，hook函数会立即执行
//     this.hooks.asyncSeriesBailHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb(true);
//       }, 1000);
//       console.log('asyncSeriesBailHook==0===listener', arg1, cb);
//     });
//     this.hooks.asyncSeriesBailHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb();
//       }, 2000);
//       console.log('asyncSeriesBailHook==1===listener', arg1, cb);
//     });

//     // asyncSeriesWaterfallHook 监听函数会异步串行执行，会保证钩子执行顺序
//     // 上一个钩子返回的参数会传给下一个钩子，当所有钩子执行结束，
//     // hook回调函数会执行并且能拿到最后一个钩子返回的参数
//     this.hooks.asyncSeriesWaterfallHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb(null, arg1 + '0');
//       }, 1000);
//       console.log('asyncSeriesWaterfallHook==0===listener', arg1, cb);
//     });
//     this.hooks.asyncSeriesWaterfallHook.tapAsync(name, (arg1, cb) => {
//       setTimeout(() => {
//         cb(null, arg1 + '1');
//       }, 2000);
//       console.log('asyncSeriesWaterfallHook==1===listener', arg1, cb);
//     });
//   }

//   run() {
//     this.hooks.syncHook.call('syncHook');
//     this.hooks.syncBailHook.call('syncBailHook');
//     this.hooks.syncWaterfallHook.call('syncWaterfallHook');
//     this.hooks.syncLoopHook.call('syncLoopHook');

//     const start = Date.now();
//     this.hooks.asyncParallelHook.callAsync('asyncParallelHook', () => {
//       console.log(`asyncParallelHook=====callback===all done。 耗时：${Date.now() - start}`);
//     });
//     this.hooks.asyncParallelBailHook.callAsync('asyncParallelBailHook', () => {
//       console.log(`asyncParallelBailHook=====callback===all done。 耗时：${Date.now() - start}`);
//     });
//     this.hooks.asyncSeriesHook.callAsync('asyncSeriesHook', () => {
//       console.log(`asyncSeriesHook=====callback===all done。 耗时：${Date.now() - start}`);
//     });
//     this.hooks.asyncSeriesBailHook.callAsync('asyncSeriesBailHook', () => {
//       console.log(`asyncSeriesBailHook=====callback===all done。 耗时：${Date.now() - start}`);
//     });
//     this.hooks.asyncSeriesWaterfallHook.callAsync('asyncSeriesWaterfallHook', (_, arg) => {
//       console.log(`asyncSeriesWaterfallHook=====callback===all done。 耗时：${Date.now() - start}`, _, arg);
//     });
//   }

// }

// const myCar = new Car();

// myCar.run();

// console.log('======end======');


const hook = AsyncSeriesWaterfallHook(['arg']);
const start = Date.now();

hook.tapAsync('listen1', (arg, callback) => {
  console.log('listen1', arg)
  setTimeout(() => {
    callback(null, `${arg} listen1`);
  }, 1000);
});
hook.tapAsync('listen2', (arg, callback) => {
  console.log('listen2', arg)
  setTimeout(() => {
    callback(null, `${arg} listen2`);
  }, 2000);
});

hook.callAsync('hello', (_, arg) => {
  console.log(`回调函数执行，耗时：${Date.now() - start}, arg:`, arg);
});

/**
  输出：
  listen1 hello
  listen2 hello listen1
  回调函数执行，耗时：3016, arg: hello listen1 listen2
 */