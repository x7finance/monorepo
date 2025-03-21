/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface IOptions {
  before?: boolean;
}

const pDebounce = (
  fn: (...args: any[]) => any,
  wait: number,
  options: IOptions = { before: false },
) => {
  if (!Number.isFinite(wait)) {
    throw new TypeError("Expected `wait` to be a finite number");
  }

  let leadingValue: any;
  let timeout: NodeJS.Timeout | undefined;
  let resolveList: ((value: any) => void)[] = [];

  return function (this: any, ...arguments_: any[]) {
    return new Promise((resolve) => {
      const shouldCallNow = options.before && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        timeout = undefined;

        const result = options.before
          ? leadingValue
          : fn.apply(this, arguments_);

        for (const resolveFunc of resolveList) {
          resolveFunc(result);
        }

        resolveList = [];
      }, wait);

      if (shouldCallNow) {
        leadingValue = fn.apply(this, arguments_);
        resolve(leadingValue);
      } else {
        resolveList.push(resolve);
      }
    });
  };
};

pDebounce.promise = (function_: (...args: any[]) => any) => {
  let currentPromise: Promise<any> | undefined;

  return async function (this: any, ...arguments_: any[]) {
    if (currentPromise) {
      return currentPromise;
    }

    try {
      currentPromise = function_.apply(this, arguments_);
      return await currentPromise;
    } finally {
      currentPromise = undefined;
    }
  };
};

export default pDebounce;
