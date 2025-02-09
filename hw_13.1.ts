// Завдання #1: DeprecatedMethod
function DeprecatedMethod(reason: string, alternativeMethod?: string) {
  return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
      if (descriptor) {
          const originalMethod = descriptor.value;

          descriptor.value = function (...args: any[]) {
              console.warn(`Method "${propertyKey}" is deprecated. Reason: ${reason}`);
              if (alternativeMethod) {
                  console.warn(`Use "${alternativeMethod}" instead.`);
              }
              return originalMethod.apply(this, args);
          };
      }
  };
}

class MyClass {
  @DeprecatedMethod("This method is outdated due to performance issues.", "newMethod")
  oldMethod() {
      console.log("This is the old method.");
  }

  newMethod() {
      console.log("This is the new method.");
  }
}

const instance = new MyClass();
instance.oldMethod();


//Завдання #2: MinLength, MaxLength, Email
// function MinLength(min: number) {
//   return function (target: any, propertyKey: string) {
//       let value: string;

//       const getter = function () {
//           return value;
//       };

//       const setter = function (newVal: string) {
//           if (newVal.length < min) {
//               throw new Error(`Поле "${propertyKey}" має бути не менше ${min} символів.`);
//           }
//           value = newVal;
//       };

//       Object.defineProperty(target, propertyKey, {
//           get: getter,
//           set: setter,
//           enumerable: true,
//           configurable: true,
//       });
//   };
// }

// function MaxLength(max: number) {
//   return function (target: any, propertyKey: string) {
//       let value: string;

//       const getter = function () {
//           return value;
//       };

//       const setter = function (newVal: string) {
//           if (newVal.length > max) {
//               throw new Error(`Поле "${propertyKey}" має бути не більше ${max} символів.`);
//           }
//           value = newVal;
//       };

//       Object.defineProperty(target, propertyKey, {
//           get: getter,
//           set: setter,
//           enumerable: true,
//           configurable: true,
//       });
//   };
// }

// function Email(target: any, propertyKey: string) {
//   let value: string;

//   const getter = function () {
//       return value;
//   };

//   const setter = function (newVal: string) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(newVal)) {
//           throw new Error(`Поле "${propertyKey}" має бути коректною електронною адресою.`);
//       }
//       value = newVal;
//   };

//   Object.defineProperty(target, propertyKey, {
//       get: getter,
//       set: setter,
//       enumerable: true,
//       configurable: true,
//   });
// }

// class User {
//   @MinLength(5)
//   @MaxLength(20)
//   username: string;

//   @Email
//   email: string;

//   constructor(username: string, email: string) {
//       this.username = username;
//       this.email = email;
//   }
// }

// Завдання #3: Experimental decorators
function Validate(...validators: ((value: string, propertyKey: string) => void)[]) {
    return function (target: any, propertyKey: string) {
        let value: string;

        const getter = function () {
            return value;
        };

        const setter = function (newVal: string) {
            for (const validator of validators) {
                validator(newVal, propertyKey);
            }
            value = newVal;
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}

function MinLength(min: number) {
    return (value: string, propertyKey: string) => {
        if (value.length < min) {
            throw new Error(`Поле "${propertyKey}" має бути не менше ${min} символів.`);
        }
    };
}

function MaxLength(max: number) {
    return (value: string, propertyKey: string) => {
        if (value.length > max) {
            throw new Error(`Поле "${propertyKey}" має бути не більше ${max} символів.`);
        }
    };
}

function EmailValidator(value: string, propertyKey: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        throw new Error(`Поле "${propertyKey}" має бути коректною електронною адресою.`);
    }
}

class User {
    @Validate(MinLength(5), MaxLength(20))
    username: string;

    @Validate(EmailValidator)
    email: string;

    constructor(username: string, email: string) {
        this.username = username;
        this.email = email;
    }
}