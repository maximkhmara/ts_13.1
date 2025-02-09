"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Завдання #1: DeprecatedMethod
function DeprecatedMethod(reason, alternativeMethod) {
    return function (target, propertyKey, descriptor) {
        if (descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (...args) {
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
    oldMethod() {
        console.log("This is the old method.");
    }
    newMethod() {
        console.log("This is the new method.");
    }
}
__decorate([
    DeprecatedMethod("This method is outdated due to performance issues.", "newMethod"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MyClass.prototype, "oldMethod", null);
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
function Validate(...validators) {
    return function (target, propertyKey) {
        let value;
        const getter = function () {
            return value;
        };
        const setter = function (newVal) {
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
function MinLength(min) {
    return (value, propertyKey) => {
        if (value.length < min) {
            throw new Error(`Поле "${propertyKey}" має бути не менше ${min} символів.`);
        }
    };
}
function MaxLength(max) {
    return (value, propertyKey) => {
        if (value.length > max) {
            throw new Error(`Поле "${propertyKey}" має бути не більше ${max} символів.`);
        }
    };
}
function EmailValidator(value, propertyKey) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        throw new Error(`Поле "${propertyKey}" має бути коректною електронною адресою.`);
    }
}
class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }
}
__decorate([
    Validate(MinLength(5), MaxLength(20)),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Validate(EmailValidator),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
