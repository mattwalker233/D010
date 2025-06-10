
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model DivisionOrder
 * 
 */
export type DivisionOrder = $Result.DefaultSelection<Prisma.$DivisionOrderPayload>
/**
 * Model Well
 * 
 */
export type Well = $Result.DefaultSelection<Prisma.$WellPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more DivisionOrders
 * const divisionOrders = await prisma.divisionOrder.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more DivisionOrders
   * const divisionOrders = await prisma.divisionOrder.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.divisionOrder`: Exposes CRUD operations for the **DivisionOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DivisionOrders
    * const divisionOrders = await prisma.divisionOrder.findMany()
    * ```
    */
  get divisionOrder(): Prisma.DivisionOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.well`: Exposes CRUD operations for the **Well** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wells
    * const wells = await prisma.well.findMany()
    * ```
    */
  get well(): Prisma.WellDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.9.0
   * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    DivisionOrder: 'DivisionOrder',
    Well: 'Well'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "divisionOrder" | "well"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      DivisionOrder: {
        payload: Prisma.$DivisionOrderPayload<ExtArgs>
        fields: Prisma.DivisionOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DivisionOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DivisionOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>
          }
          findFirst: {
            args: Prisma.DivisionOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DivisionOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>
          }
          findMany: {
            args: Prisma.DivisionOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>[]
          }
          create: {
            args: Prisma.DivisionOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>
          }
          createMany: {
            args: Prisma.DivisionOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DivisionOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>[]
          }
          delete: {
            args: Prisma.DivisionOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>
          }
          update: {
            args: Prisma.DivisionOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>
          }
          deleteMany: {
            args: Prisma.DivisionOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DivisionOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DivisionOrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>[]
          }
          upsert: {
            args: Prisma.DivisionOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisionOrderPayload>
          }
          aggregate: {
            args: Prisma.DivisionOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDivisionOrder>
          }
          groupBy: {
            args: Prisma.DivisionOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<DivisionOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.DivisionOrderCountArgs<ExtArgs>
            result: $Utils.Optional<DivisionOrderCountAggregateOutputType> | number
          }
        }
      }
      Well: {
        payload: Prisma.$WellPayload<ExtArgs>
        fields: Prisma.WellFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WellFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WellFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>
          }
          findFirst: {
            args: Prisma.WellFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WellFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>
          }
          findMany: {
            args: Prisma.WellFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>[]
          }
          create: {
            args: Prisma.WellCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>
          }
          createMany: {
            args: Prisma.WellCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WellCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>[]
          }
          delete: {
            args: Prisma.WellDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>
          }
          update: {
            args: Prisma.WellUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>
          }
          deleteMany: {
            args: Prisma.WellDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WellUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WellUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>[]
          }
          upsert: {
            args: Prisma.WellUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WellPayload>
          }
          aggregate: {
            args: Prisma.WellAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWell>
          }
          groupBy: {
            args: Prisma.WellGroupByArgs<ExtArgs>
            result: $Utils.Optional<WellGroupByOutputType>[]
          }
          count: {
            args: Prisma.WellCountArgs<ExtArgs>
            result: $Utils.Optional<WellCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    divisionOrder?: DivisionOrderOmit
    well?: WellOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DivisionOrderCountOutputType
   */

  export type DivisionOrderCountOutputType = {
    wells: number
  }

  export type DivisionOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wells?: boolean | DivisionOrderCountOutputTypeCountWellsArgs
  }

  // Custom InputTypes
  /**
   * DivisionOrderCountOutputType without action
   */
  export type DivisionOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrderCountOutputType
     */
    select?: DivisionOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DivisionOrderCountOutputType without action
   */
  export type DivisionOrderCountOutputTypeCountWellsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WellWhereInput
  }


  /**
   * Models
   */

  /**
   * Model DivisionOrder
   */

  export type AggregateDivisionOrder = {
    _count: DivisionOrderCountAggregateOutputType | null
    _min: DivisionOrderMinAggregateOutputType | null
    _max: DivisionOrderMaxAggregateOutputType | null
  }

  export type DivisionOrderMinAggregateOutputType = {
    id: string | null
    operator: string | null
    entity: string | null
    effectiveDate: Date | null
    county: string | null
    state: string | null
    status: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DivisionOrderMaxAggregateOutputType = {
    id: string | null
    operator: string | null
    entity: string | null
    effectiveDate: Date | null
    county: string | null
    state: string | null
    status: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DivisionOrderCountAggregateOutputType = {
    id: number
    operator: number
    entity: number
    effectiveDate: number
    county: number
    state: number
    status: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DivisionOrderMinAggregateInputType = {
    id?: true
    operator?: true
    entity?: true
    effectiveDate?: true
    county?: true
    state?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DivisionOrderMaxAggregateInputType = {
    id?: true
    operator?: true
    entity?: true
    effectiveDate?: true
    county?: true
    state?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DivisionOrderCountAggregateInputType = {
    id?: true
    operator?: true
    entity?: true
    effectiveDate?: true
    county?: true
    state?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DivisionOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DivisionOrder to aggregate.
     */
    where?: DivisionOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DivisionOrders to fetch.
     */
    orderBy?: DivisionOrderOrderByWithRelationInput | DivisionOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DivisionOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DivisionOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DivisionOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DivisionOrders
    **/
    _count?: true | DivisionOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DivisionOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DivisionOrderMaxAggregateInputType
  }

  export type GetDivisionOrderAggregateType<T extends DivisionOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateDivisionOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDivisionOrder[P]>
      : GetScalarType<T[P], AggregateDivisionOrder[P]>
  }




  export type DivisionOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DivisionOrderWhereInput
    orderBy?: DivisionOrderOrderByWithAggregationInput | DivisionOrderOrderByWithAggregationInput[]
    by: DivisionOrderScalarFieldEnum[] | DivisionOrderScalarFieldEnum
    having?: DivisionOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DivisionOrderCountAggregateInputType | true
    _min?: DivisionOrderMinAggregateInputType
    _max?: DivisionOrderMaxAggregateInputType
  }

  export type DivisionOrderGroupByOutputType = {
    id: string
    operator: string
    entity: string
    effectiveDate: Date
    county: string
    state: string
    status: string
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: DivisionOrderCountAggregateOutputType | null
    _min: DivisionOrderMinAggregateOutputType | null
    _max: DivisionOrderMaxAggregateOutputType | null
  }

  type GetDivisionOrderGroupByPayload<T extends DivisionOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DivisionOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DivisionOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DivisionOrderGroupByOutputType[P]>
            : GetScalarType<T[P], DivisionOrderGroupByOutputType[P]>
        }
      >
    >


  export type DivisionOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operator?: boolean
    entity?: boolean
    effectiveDate?: boolean
    county?: boolean
    state?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wells?: boolean | DivisionOrder$wellsArgs<ExtArgs>
    _count?: boolean | DivisionOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["divisionOrder"]>

  export type DivisionOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operator?: boolean
    entity?: boolean
    effectiveDate?: boolean
    county?: boolean
    state?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["divisionOrder"]>

  export type DivisionOrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operator?: boolean
    entity?: boolean
    effectiveDate?: boolean
    county?: boolean
    state?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["divisionOrder"]>

  export type DivisionOrderSelectScalar = {
    id?: boolean
    operator?: boolean
    entity?: boolean
    effectiveDate?: boolean
    county?: boolean
    state?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DivisionOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "operator" | "entity" | "effectiveDate" | "county" | "state" | "status" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["divisionOrder"]>
  export type DivisionOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wells?: boolean | DivisionOrder$wellsArgs<ExtArgs>
    _count?: boolean | DivisionOrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DivisionOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DivisionOrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DivisionOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DivisionOrder"
    objects: {
      wells: Prisma.$WellPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      operator: string
      entity: string
      effectiveDate: Date
      county: string
      state: string
      status: string
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["divisionOrder"]>
    composites: {}
  }

  type DivisionOrderGetPayload<S extends boolean | null | undefined | DivisionOrderDefaultArgs> = $Result.GetResult<Prisma.$DivisionOrderPayload, S>

  type DivisionOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DivisionOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DivisionOrderCountAggregateInputType | true
    }

  export interface DivisionOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DivisionOrder'], meta: { name: 'DivisionOrder' } }
    /**
     * Find zero or one DivisionOrder that matches the filter.
     * @param {DivisionOrderFindUniqueArgs} args - Arguments to find a DivisionOrder
     * @example
     * // Get one DivisionOrder
     * const divisionOrder = await prisma.divisionOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DivisionOrderFindUniqueArgs>(args: SelectSubset<T, DivisionOrderFindUniqueArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DivisionOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DivisionOrderFindUniqueOrThrowArgs} args - Arguments to find a DivisionOrder
     * @example
     * // Get one DivisionOrder
     * const divisionOrder = await prisma.divisionOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DivisionOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, DivisionOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DivisionOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisionOrderFindFirstArgs} args - Arguments to find a DivisionOrder
     * @example
     * // Get one DivisionOrder
     * const divisionOrder = await prisma.divisionOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DivisionOrderFindFirstArgs>(args?: SelectSubset<T, DivisionOrderFindFirstArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DivisionOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisionOrderFindFirstOrThrowArgs} args - Arguments to find a DivisionOrder
     * @example
     * // Get one DivisionOrder
     * const divisionOrder = await prisma.divisionOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DivisionOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, DivisionOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DivisionOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisionOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DivisionOrders
     * const divisionOrders = await prisma.divisionOrder.findMany()
     * 
     * // Get first 10 DivisionOrders
     * const divisionOrders = await prisma.divisionOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const divisionOrderWithIdOnly = await prisma.divisionOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DivisionOrderFindManyArgs>(args?: SelectSubset<T, DivisionOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DivisionOrder.
     * @param {DivisionOrderCreateArgs} args - Arguments to create a DivisionOrder.
     * @example
     * // Create one DivisionOrder
     * const DivisionOrder = await prisma.divisionOrder.create({
     *   data: {
     *     // ... data to create a DivisionOrder
     *   }
     * })
     * 
     */
    create<T extends DivisionOrderCreateArgs>(args: SelectSubset<T, DivisionOrderCreateArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DivisionOrders.
     * @param {DivisionOrderCreateManyArgs} args - Arguments to create many DivisionOrders.
     * @example
     * // Create many DivisionOrders
     * const divisionOrder = await prisma.divisionOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DivisionOrderCreateManyArgs>(args?: SelectSubset<T, DivisionOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DivisionOrders and returns the data saved in the database.
     * @param {DivisionOrderCreateManyAndReturnArgs} args - Arguments to create many DivisionOrders.
     * @example
     * // Create many DivisionOrders
     * const divisionOrder = await prisma.divisionOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DivisionOrders and only return the `id`
     * const divisionOrderWithIdOnly = await prisma.divisionOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DivisionOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, DivisionOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DivisionOrder.
     * @param {DivisionOrderDeleteArgs} args - Arguments to delete one DivisionOrder.
     * @example
     * // Delete one DivisionOrder
     * const DivisionOrder = await prisma.divisionOrder.delete({
     *   where: {
     *     // ... filter to delete one DivisionOrder
     *   }
     * })
     * 
     */
    delete<T extends DivisionOrderDeleteArgs>(args: SelectSubset<T, DivisionOrderDeleteArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DivisionOrder.
     * @param {DivisionOrderUpdateArgs} args - Arguments to update one DivisionOrder.
     * @example
     * // Update one DivisionOrder
     * const divisionOrder = await prisma.divisionOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DivisionOrderUpdateArgs>(args: SelectSubset<T, DivisionOrderUpdateArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DivisionOrders.
     * @param {DivisionOrderDeleteManyArgs} args - Arguments to filter DivisionOrders to delete.
     * @example
     * // Delete a few DivisionOrders
     * const { count } = await prisma.divisionOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DivisionOrderDeleteManyArgs>(args?: SelectSubset<T, DivisionOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DivisionOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisionOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DivisionOrders
     * const divisionOrder = await prisma.divisionOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DivisionOrderUpdateManyArgs>(args: SelectSubset<T, DivisionOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DivisionOrders and returns the data updated in the database.
     * @param {DivisionOrderUpdateManyAndReturnArgs} args - Arguments to update many DivisionOrders.
     * @example
     * // Update many DivisionOrders
     * const divisionOrder = await prisma.divisionOrder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DivisionOrders and only return the `id`
     * const divisionOrderWithIdOnly = await prisma.divisionOrder.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DivisionOrderUpdateManyAndReturnArgs>(args: SelectSubset<T, DivisionOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DivisionOrder.
     * @param {DivisionOrderUpsertArgs} args - Arguments to update or create a DivisionOrder.
     * @example
     * // Update or create a DivisionOrder
     * const divisionOrder = await prisma.divisionOrder.upsert({
     *   create: {
     *     // ... data to create a DivisionOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DivisionOrder we want to update
     *   }
     * })
     */
    upsert<T extends DivisionOrderUpsertArgs>(args: SelectSubset<T, DivisionOrderUpsertArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DivisionOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisionOrderCountArgs} args - Arguments to filter DivisionOrders to count.
     * @example
     * // Count the number of DivisionOrders
     * const count = await prisma.divisionOrder.count({
     *   where: {
     *     // ... the filter for the DivisionOrders we want to count
     *   }
     * })
    **/
    count<T extends DivisionOrderCountArgs>(
      args?: Subset<T, DivisionOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DivisionOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DivisionOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisionOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DivisionOrderAggregateArgs>(args: Subset<T, DivisionOrderAggregateArgs>): Prisma.PrismaPromise<GetDivisionOrderAggregateType<T>>

    /**
     * Group by DivisionOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisionOrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DivisionOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DivisionOrderGroupByArgs['orderBy'] }
        : { orderBy?: DivisionOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DivisionOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDivisionOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DivisionOrder model
   */
  readonly fields: DivisionOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DivisionOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DivisionOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wells<T extends DivisionOrder$wellsArgs<ExtArgs> = {}>(args?: Subset<T, DivisionOrder$wellsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DivisionOrder model
   */
  interface DivisionOrderFieldRefs {
    readonly id: FieldRef<"DivisionOrder", 'String'>
    readonly operator: FieldRef<"DivisionOrder", 'String'>
    readonly entity: FieldRef<"DivisionOrder", 'String'>
    readonly effectiveDate: FieldRef<"DivisionOrder", 'DateTime'>
    readonly county: FieldRef<"DivisionOrder", 'String'>
    readonly state: FieldRef<"DivisionOrder", 'String'>
    readonly status: FieldRef<"DivisionOrder", 'String'>
    readonly notes: FieldRef<"DivisionOrder", 'String'>
    readonly createdAt: FieldRef<"DivisionOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"DivisionOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DivisionOrder findUnique
   */
  export type DivisionOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * Filter, which DivisionOrder to fetch.
     */
    where: DivisionOrderWhereUniqueInput
  }

  /**
   * DivisionOrder findUniqueOrThrow
   */
  export type DivisionOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * Filter, which DivisionOrder to fetch.
     */
    where: DivisionOrderWhereUniqueInput
  }

  /**
   * DivisionOrder findFirst
   */
  export type DivisionOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * Filter, which DivisionOrder to fetch.
     */
    where?: DivisionOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DivisionOrders to fetch.
     */
    orderBy?: DivisionOrderOrderByWithRelationInput | DivisionOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DivisionOrders.
     */
    cursor?: DivisionOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DivisionOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DivisionOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DivisionOrders.
     */
    distinct?: DivisionOrderScalarFieldEnum | DivisionOrderScalarFieldEnum[]
  }

  /**
   * DivisionOrder findFirstOrThrow
   */
  export type DivisionOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * Filter, which DivisionOrder to fetch.
     */
    where?: DivisionOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DivisionOrders to fetch.
     */
    orderBy?: DivisionOrderOrderByWithRelationInput | DivisionOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DivisionOrders.
     */
    cursor?: DivisionOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DivisionOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DivisionOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DivisionOrders.
     */
    distinct?: DivisionOrderScalarFieldEnum | DivisionOrderScalarFieldEnum[]
  }

  /**
   * DivisionOrder findMany
   */
  export type DivisionOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * Filter, which DivisionOrders to fetch.
     */
    where?: DivisionOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DivisionOrders to fetch.
     */
    orderBy?: DivisionOrderOrderByWithRelationInput | DivisionOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DivisionOrders.
     */
    cursor?: DivisionOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DivisionOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DivisionOrders.
     */
    skip?: number
    distinct?: DivisionOrderScalarFieldEnum | DivisionOrderScalarFieldEnum[]
  }

  /**
   * DivisionOrder create
   */
  export type DivisionOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a DivisionOrder.
     */
    data: XOR<DivisionOrderCreateInput, DivisionOrderUncheckedCreateInput>
  }

  /**
   * DivisionOrder createMany
   */
  export type DivisionOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DivisionOrders.
     */
    data: DivisionOrderCreateManyInput | DivisionOrderCreateManyInput[]
  }

  /**
   * DivisionOrder createManyAndReturn
   */
  export type DivisionOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * The data used to create many DivisionOrders.
     */
    data: DivisionOrderCreateManyInput | DivisionOrderCreateManyInput[]
  }

  /**
   * DivisionOrder update
   */
  export type DivisionOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a DivisionOrder.
     */
    data: XOR<DivisionOrderUpdateInput, DivisionOrderUncheckedUpdateInput>
    /**
     * Choose, which DivisionOrder to update.
     */
    where: DivisionOrderWhereUniqueInput
  }

  /**
   * DivisionOrder updateMany
   */
  export type DivisionOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DivisionOrders.
     */
    data: XOR<DivisionOrderUpdateManyMutationInput, DivisionOrderUncheckedUpdateManyInput>
    /**
     * Filter which DivisionOrders to update
     */
    where?: DivisionOrderWhereInput
    /**
     * Limit how many DivisionOrders to update.
     */
    limit?: number
  }

  /**
   * DivisionOrder updateManyAndReturn
   */
  export type DivisionOrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * The data used to update DivisionOrders.
     */
    data: XOR<DivisionOrderUpdateManyMutationInput, DivisionOrderUncheckedUpdateManyInput>
    /**
     * Filter which DivisionOrders to update
     */
    where?: DivisionOrderWhereInput
    /**
     * Limit how many DivisionOrders to update.
     */
    limit?: number
  }

  /**
   * DivisionOrder upsert
   */
  export type DivisionOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the DivisionOrder to update in case it exists.
     */
    where: DivisionOrderWhereUniqueInput
    /**
     * In case the DivisionOrder found by the `where` argument doesn't exist, create a new DivisionOrder with this data.
     */
    create: XOR<DivisionOrderCreateInput, DivisionOrderUncheckedCreateInput>
    /**
     * In case the DivisionOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DivisionOrderUpdateInput, DivisionOrderUncheckedUpdateInput>
  }

  /**
   * DivisionOrder delete
   */
  export type DivisionOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
    /**
     * Filter which DivisionOrder to delete.
     */
    where: DivisionOrderWhereUniqueInput
  }

  /**
   * DivisionOrder deleteMany
   */
  export type DivisionOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DivisionOrders to delete
     */
    where?: DivisionOrderWhereInput
    /**
     * Limit how many DivisionOrders to delete.
     */
    limit?: number
  }

  /**
   * DivisionOrder.wells
   */
  export type DivisionOrder$wellsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    where?: WellWhereInput
    orderBy?: WellOrderByWithRelationInput | WellOrderByWithRelationInput[]
    cursor?: WellWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WellScalarFieldEnum | WellScalarFieldEnum[]
  }

  /**
   * DivisionOrder without action
   */
  export type DivisionOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisionOrder
     */
    select?: DivisionOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DivisionOrder
     */
    omit?: DivisionOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisionOrderInclude<ExtArgs> | null
  }


  /**
   * Model Well
   */

  export type AggregateWell = {
    _count: WellCountAggregateOutputType | null
    _avg: WellAvgAggregateOutputType | null
    _sum: WellSumAggregateOutputType | null
    _min: WellMinAggregateOutputType | null
    _max: WellMaxAggregateOutputType | null
  }

  export type WellAvgAggregateOutputType = {
    decimalInterest: number | null
  }

  export type WellSumAggregateOutputType = {
    decimalInterest: number | null
  }

  export type WellMinAggregateOutputType = {
    id: string | null
    wellName: string | null
    propertyDescription: string | null
    decimalInterest: number | null
    interestType: string | null
    divisionOrderId: string | null
  }

  export type WellMaxAggregateOutputType = {
    id: string | null
    wellName: string | null
    propertyDescription: string | null
    decimalInterest: number | null
    interestType: string | null
    divisionOrderId: string | null
  }

  export type WellCountAggregateOutputType = {
    id: number
    wellName: number
    propertyDescription: number
    decimalInterest: number
    interestType: number
    divisionOrderId: number
    _all: number
  }


  export type WellAvgAggregateInputType = {
    decimalInterest?: true
  }

  export type WellSumAggregateInputType = {
    decimalInterest?: true
  }

  export type WellMinAggregateInputType = {
    id?: true
    wellName?: true
    propertyDescription?: true
    decimalInterest?: true
    interestType?: true
    divisionOrderId?: true
  }

  export type WellMaxAggregateInputType = {
    id?: true
    wellName?: true
    propertyDescription?: true
    decimalInterest?: true
    interestType?: true
    divisionOrderId?: true
  }

  export type WellCountAggregateInputType = {
    id?: true
    wellName?: true
    propertyDescription?: true
    decimalInterest?: true
    interestType?: true
    divisionOrderId?: true
    _all?: true
  }

  export type WellAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Well to aggregate.
     */
    where?: WellWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wells to fetch.
     */
    orderBy?: WellOrderByWithRelationInput | WellOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WellWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wells from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wells.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wells
    **/
    _count?: true | WellCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WellAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WellSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WellMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WellMaxAggregateInputType
  }

  export type GetWellAggregateType<T extends WellAggregateArgs> = {
        [P in keyof T & keyof AggregateWell]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWell[P]>
      : GetScalarType<T[P], AggregateWell[P]>
  }




  export type WellGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WellWhereInput
    orderBy?: WellOrderByWithAggregationInput | WellOrderByWithAggregationInput[]
    by: WellScalarFieldEnum[] | WellScalarFieldEnum
    having?: WellScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WellCountAggregateInputType | true
    _avg?: WellAvgAggregateInputType
    _sum?: WellSumAggregateInputType
    _min?: WellMinAggregateInputType
    _max?: WellMaxAggregateInputType
  }

  export type WellGroupByOutputType = {
    id: string
    wellName: string
    propertyDescription: string
    decimalInterest: number | null
    interestType: string
    divisionOrderId: string
    _count: WellCountAggregateOutputType | null
    _avg: WellAvgAggregateOutputType | null
    _sum: WellSumAggregateOutputType | null
    _min: WellMinAggregateOutputType | null
    _max: WellMaxAggregateOutputType | null
  }

  type GetWellGroupByPayload<T extends WellGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WellGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WellGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WellGroupByOutputType[P]>
            : GetScalarType<T[P], WellGroupByOutputType[P]>
        }
      >
    >


  export type WellSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wellName?: boolean
    propertyDescription?: boolean
    decimalInterest?: boolean
    interestType?: boolean
    divisionOrderId?: boolean
    divisionOrder?: boolean | DivisionOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["well"]>

  export type WellSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wellName?: boolean
    propertyDescription?: boolean
    decimalInterest?: boolean
    interestType?: boolean
    divisionOrderId?: boolean
    divisionOrder?: boolean | DivisionOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["well"]>

  export type WellSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wellName?: boolean
    propertyDescription?: boolean
    decimalInterest?: boolean
    interestType?: boolean
    divisionOrderId?: boolean
    divisionOrder?: boolean | DivisionOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["well"]>

  export type WellSelectScalar = {
    id?: boolean
    wellName?: boolean
    propertyDescription?: boolean
    decimalInterest?: boolean
    interestType?: boolean
    divisionOrderId?: boolean
  }

  export type WellOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "wellName" | "propertyDescription" | "decimalInterest" | "interestType" | "divisionOrderId", ExtArgs["result"]["well"]>
  export type WellInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    divisionOrder?: boolean | DivisionOrderDefaultArgs<ExtArgs>
  }
  export type WellIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    divisionOrder?: boolean | DivisionOrderDefaultArgs<ExtArgs>
  }
  export type WellIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    divisionOrder?: boolean | DivisionOrderDefaultArgs<ExtArgs>
  }

  export type $WellPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Well"
    objects: {
      divisionOrder: Prisma.$DivisionOrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      wellName: string
      propertyDescription: string
      decimalInterest: number | null
      interestType: string
      divisionOrderId: string
    }, ExtArgs["result"]["well"]>
    composites: {}
  }

  type WellGetPayload<S extends boolean | null | undefined | WellDefaultArgs> = $Result.GetResult<Prisma.$WellPayload, S>

  type WellCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WellFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WellCountAggregateInputType | true
    }

  export interface WellDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Well'], meta: { name: 'Well' } }
    /**
     * Find zero or one Well that matches the filter.
     * @param {WellFindUniqueArgs} args - Arguments to find a Well
     * @example
     * // Get one Well
     * const well = await prisma.well.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WellFindUniqueArgs>(args: SelectSubset<T, WellFindUniqueArgs<ExtArgs>>): Prisma__WellClient<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Well that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WellFindUniqueOrThrowArgs} args - Arguments to find a Well
     * @example
     * // Get one Well
     * const well = await prisma.well.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WellFindUniqueOrThrowArgs>(args: SelectSubset<T, WellFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WellClient<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Well that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WellFindFirstArgs} args - Arguments to find a Well
     * @example
     * // Get one Well
     * const well = await prisma.well.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WellFindFirstArgs>(args?: SelectSubset<T, WellFindFirstArgs<ExtArgs>>): Prisma__WellClient<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Well that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WellFindFirstOrThrowArgs} args - Arguments to find a Well
     * @example
     * // Get one Well
     * const well = await prisma.well.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WellFindFirstOrThrowArgs>(args?: SelectSubset<T, WellFindFirstOrThrowArgs<ExtArgs>>): Prisma__WellClient<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wells that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WellFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wells
     * const wells = await prisma.well.findMany()
     * 
     * // Get first 10 Wells
     * const wells = await prisma.well.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wellWithIdOnly = await prisma.well.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WellFindManyArgs>(args?: SelectSubset<T, WellFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Well.
     * @param {WellCreateArgs} args - Arguments to create a Well.
     * @example
     * // Create one Well
     * const Well = await prisma.well.create({
     *   data: {
     *     // ... data to create a Well
     *   }
     * })
     * 
     */
    create<T extends WellCreateArgs>(args: SelectSubset<T, WellCreateArgs<ExtArgs>>): Prisma__WellClient<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wells.
     * @param {WellCreateManyArgs} args - Arguments to create many Wells.
     * @example
     * // Create many Wells
     * const well = await prisma.well.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WellCreateManyArgs>(args?: SelectSubset<T, WellCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Wells and returns the data saved in the database.
     * @param {WellCreateManyAndReturnArgs} args - Arguments to create many Wells.
     * @example
     * // Create many Wells
     * const well = await prisma.well.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Wells and only return the `id`
     * const wellWithIdOnly = await prisma.well.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WellCreateManyAndReturnArgs>(args?: SelectSubset<T, WellCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Well.
     * @param {WellDeleteArgs} args - Arguments to delete one Well.
     * @example
     * // Delete one Well
     * const Well = await prisma.well.delete({
     *   where: {
     *     // ... filter to delete one Well
     *   }
     * })
     * 
     */
    delete<T extends WellDeleteArgs>(args: SelectSubset<T, WellDeleteArgs<ExtArgs>>): Prisma__WellClient<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Well.
     * @param {WellUpdateArgs} args - Arguments to update one Well.
     * @example
     * // Update one Well
     * const well = await prisma.well.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WellUpdateArgs>(args: SelectSubset<T, WellUpdateArgs<ExtArgs>>): Prisma__WellClient<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wells.
     * @param {WellDeleteManyArgs} args - Arguments to filter Wells to delete.
     * @example
     * // Delete a few Wells
     * const { count } = await prisma.well.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WellDeleteManyArgs>(args?: SelectSubset<T, WellDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wells.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WellUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wells
     * const well = await prisma.well.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WellUpdateManyArgs>(args: SelectSubset<T, WellUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wells and returns the data updated in the database.
     * @param {WellUpdateManyAndReturnArgs} args - Arguments to update many Wells.
     * @example
     * // Update many Wells
     * const well = await prisma.well.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Wells and only return the `id`
     * const wellWithIdOnly = await prisma.well.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WellUpdateManyAndReturnArgs>(args: SelectSubset<T, WellUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Well.
     * @param {WellUpsertArgs} args - Arguments to update or create a Well.
     * @example
     * // Update or create a Well
     * const well = await prisma.well.upsert({
     *   create: {
     *     // ... data to create a Well
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Well we want to update
     *   }
     * })
     */
    upsert<T extends WellUpsertArgs>(args: SelectSubset<T, WellUpsertArgs<ExtArgs>>): Prisma__WellClient<$Result.GetResult<Prisma.$WellPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Wells.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WellCountArgs} args - Arguments to filter Wells to count.
     * @example
     * // Count the number of Wells
     * const count = await prisma.well.count({
     *   where: {
     *     // ... the filter for the Wells we want to count
     *   }
     * })
    **/
    count<T extends WellCountArgs>(
      args?: Subset<T, WellCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WellCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Well.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WellAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WellAggregateArgs>(args: Subset<T, WellAggregateArgs>): Prisma.PrismaPromise<GetWellAggregateType<T>>

    /**
     * Group by Well.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WellGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WellGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WellGroupByArgs['orderBy'] }
        : { orderBy?: WellGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WellGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWellGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Well model
   */
  readonly fields: WellFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Well.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WellClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    divisionOrder<T extends DivisionOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DivisionOrderDefaultArgs<ExtArgs>>): Prisma__DivisionOrderClient<$Result.GetResult<Prisma.$DivisionOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Well model
   */
  interface WellFieldRefs {
    readonly id: FieldRef<"Well", 'String'>
    readonly wellName: FieldRef<"Well", 'String'>
    readonly propertyDescription: FieldRef<"Well", 'String'>
    readonly decimalInterest: FieldRef<"Well", 'Float'>
    readonly interestType: FieldRef<"Well", 'String'>
    readonly divisionOrderId: FieldRef<"Well", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Well findUnique
   */
  export type WellFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * Filter, which Well to fetch.
     */
    where: WellWhereUniqueInput
  }

  /**
   * Well findUniqueOrThrow
   */
  export type WellFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * Filter, which Well to fetch.
     */
    where: WellWhereUniqueInput
  }

  /**
   * Well findFirst
   */
  export type WellFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * Filter, which Well to fetch.
     */
    where?: WellWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wells to fetch.
     */
    orderBy?: WellOrderByWithRelationInput | WellOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wells.
     */
    cursor?: WellWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wells from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wells.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wells.
     */
    distinct?: WellScalarFieldEnum | WellScalarFieldEnum[]
  }

  /**
   * Well findFirstOrThrow
   */
  export type WellFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * Filter, which Well to fetch.
     */
    where?: WellWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wells to fetch.
     */
    orderBy?: WellOrderByWithRelationInput | WellOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wells.
     */
    cursor?: WellWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wells from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wells.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wells.
     */
    distinct?: WellScalarFieldEnum | WellScalarFieldEnum[]
  }

  /**
   * Well findMany
   */
  export type WellFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * Filter, which Wells to fetch.
     */
    where?: WellWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wells to fetch.
     */
    orderBy?: WellOrderByWithRelationInput | WellOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wells.
     */
    cursor?: WellWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wells from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wells.
     */
    skip?: number
    distinct?: WellScalarFieldEnum | WellScalarFieldEnum[]
  }

  /**
   * Well create
   */
  export type WellCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * The data needed to create a Well.
     */
    data: XOR<WellCreateInput, WellUncheckedCreateInput>
  }

  /**
   * Well createMany
   */
  export type WellCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wells.
     */
    data: WellCreateManyInput | WellCreateManyInput[]
  }

  /**
   * Well createManyAndReturn
   */
  export type WellCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * The data used to create many Wells.
     */
    data: WellCreateManyInput | WellCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Well update
   */
  export type WellUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * The data needed to update a Well.
     */
    data: XOR<WellUpdateInput, WellUncheckedUpdateInput>
    /**
     * Choose, which Well to update.
     */
    where: WellWhereUniqueInput
  }

  /**
   * Well updateMany
   */
  export type WellUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wells.
     */
    data: XOR<WellUpdateManyMutationInput, WellUncheckedUpdateManyInput>
    /**
     * Filter which Wells to update
     */
    where?: WellWhereInput
    /**
     * Limit how many Wells to update.
     */
    limit?: number
  }

  /**
   * Well updateManyAndReturn
   */
  export type WellUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * The data used to update Wells.
     */
    data: XOR<WellUpdateManyMutationInput, WellUncheckedUpdateManyInput>
    /**
     * Filter which Wells to update
     */
    where?: WellWhereInput
    /**
     * Limit how many Wells to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Well upsert
   */
  export type WellUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * The filter to search for the Well to update in case it exists.
     */
    where: WellWhereUniqueInput
    /**
     * In case the Well found by the `where` argument doesn't exist, create a new Well with this data.
     */
    create: XOR<WellCreateInput, WellUncheckedCreateInput>
    /**
     * In case the Well was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WellUpdateInput, WellUncheckedUpdateInput>
  }

  /**
   * Well delete
   */
  export type WellDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
    /**
     * Filter which Well to delete.
     */
    where: WellWhereUniqueInput
  }

  /**
   * Well deleteMany
   */
  export type WellDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wells to delete
     */
    where?: WellWhereInput
    /**
     * Limit how many Wells to delete.
     */
    limit?: number
  }

  /**
   * Well without action
   */
  export type WellDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Well
     */
    select?: WellSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Well
     */
    omit?: WellOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WellInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DivisionOrderScalarFieldEnum: {
    id: 'id',
    operator: 'operator',
    entity: 'entity',
    effectiveDate: 'effectiveDate',
    county: 'county',
    state: 'state',
    status: 'status',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DivisionOrderScalarFieldEnum = (typeof DivisionOrderScalarFieldEnum)[keyof typeof DivisionOrderScalarFieldEnum]


  export const WellScalarFieldEnum: {
    id: 'id',
    wellName: 'wellName',
    propertyDescription: 'propertyDescription',
    decimalInterest: 'decimalInterest',
    interestType: 'interestType',
    divisionOrderId: 'divisionOrderId'
  };

  export type WellScalarFieldEnum = (typeof WellScalarFieldEnum)[keyof typeof WellScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type DivisionOrderWhereInput = {
    AND?: DivisionOrderWhereInput | DivisionOrderWhereInput[]
    OR?: DivisionOrderWhereInput[]
    NOT?: DivisionOrderWhereInput | DivisionOrderWhereInput[]
    id?: StringFilter<"DivisionOrder"> | string
    operator?: StringFilter<"DivisionOrder"> | string
    entity?: StringFilter<"DivisionOrder"> | string
    effectiveDate?: DateTimeFilter<"DivisionOrder"> | Date | string
    county?: StringFilter<"DivisionOrder"> | string
    state?: StringFilter<"DivisionOrder"> | string
    status?: StringFilter<"DivisionOrder"> | string
    notes?: StringNullableFilter<"DivisionOrder"> | string | null
    createdAt?: DateTimeFilter<"DivisionOrder"> | Date | string
    updatedAt?: DateTimeFilter<"DivisionOrder"> | Date | string
    wells?: WellListRelationFilter
  }

  export type DivisionOrderOrderByWithRelationInput = {
    id?: SortOrder
    operator?: SortOrder
    entity?: SortOrder
    effectiveDate?: SortOrder
    county?: SortOrder
    state?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wells?: WellOrderByRelationAggregateInput
  }

  export type DivisionOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DivisionOrderWhereInput | DivisionOrderWhereInput[]
    OR?: DivisionOrderWhereInput[]
    NOT?: DivisionOrderWhereInput | DivisionOrderWhereInput[]
    operator?: StringFilter<"DivisionOrder"> | string
    entity?: StringFilter<"DivisionOrder"> | string
    effectiveDate?: DateTimeFilter<"DivisionOrder"> | Date | string
    county?: StringFilter<"DivisionOrder"> | string
    state?: StringFilter<"DivisionOrder"> | string
    status?: StringFilter<"DivisionOrder"> | string
    notes?: StringNullableFilter<"DivisionOrder"> | string | null
    createdAt?: DateTimeFilter<"DivisionOrder"> | Date | string
    updatedAt?: DateTimeFilter<"DivisionOrder"> | Date | string
    wells?: WellListRelationFilter
  }, "id">

  export type DivisionOrderOrderByWithAggregationInput = {
    id?: SortOrder
    operator?: SortOrder
    entity?: SortOrder
    effectiveDate?: SortOrder
    county?: SortOrder
    state?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DivisionOrderCountOrderByAggregateInput
    _max?: DivisionOrderMaxOrderByAggregateInput
    _min?: DivisionOrderMinOrderByAggregateInput
  }

  export type DivisionOrderScalarWhereWithAggregatesInput = {
    AND?: DivisionOrderScalarWhereWithAggregatesInput | DivisionOrderScalarWhereWithAggregatesInput[]
    OR?: DivisionOrderScalarWhereWithAggregatesInput[]
    NOT?: DivisionOrderScalarWhereWithAggregatesInput | DivisionOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DivisionOrder"> | string
    operator?: StringWithAggregatesFilter<"DivisionOrder"> | string
    entity?: StringWithAggregatesFilter<"DivisionOrder"> | string
    effectiveDate?: DateTimeWithAggregatesFilter<"DivisionOrder"> | Date | string
    county?: StringWithAggregatesFilter<"DivisionOrder"> | string
    state?: StringWithAggregatesFilter<"DivisionOrder"> | string
    status?: StringWithAggregatesFilter<"DivisionOrder"> | string
    notes?: StringNullableWithAggregatesFilter<"DivisionOrder"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DivisionOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DivisionOrder"> | Date | string
  }

  export type WellWhereInput = {
    AND?: WellWhereInput | WellWhereInput[]
    OR?: WellWhereInput[]
    NOT?: WellWhereInput | WellWhereInput[]
    id?: StringFilter<"Well"> | string
    wellName?: StringFilter<"Well"> | string
    propertyDescription?: StringFilter<"Well"> | string
    decimalInterest?: FloatNullableFilter<"Well"> | number | null
    interestType?: StringFilter<"Well"> | string
    divisionOrderId?: StringFilter<"Well"> | string
    divisionOrder?: XOR<DivisionOrderScalarRelationFilter, DivisionOrderWhereInput>
  }

  export type WellOrderByWithRelationInput = {
    id?: SortOrder
    wellName?: SortOrder
    propertyDescription?: SortOrder
    decimalInterest?: SortOrderInput | SortOrder
    interestType?: SortOrder
    divisionOrderId?: SortOrder
    divisionOrder?: DivisionOrderOrderByWithRelationInput
  }

  export type WellWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WellWhereInput | WellWhereInput[]
    OR?: WellWhereInput[]
    NOT?: WellWhereInput | WellWhereInput[]
    wellName?: StringFilter<"Well"> | string
    propertyDescription?: StringFilter<"Well"> | string
    decimalInterest?: FloatNullableFilter<"Well"> | number | null
    interestType?: StringFilter<"Well"> | string
    divisionOrderId?: StringFilter<"Well"> | string
    divisionOrder?: XOR<DivisionOrderScalarRelationFilter, DivisionOrderWhereInput>
  }, "id">

  export type WellOrderByWithAggregationInput = {
    id?: SortOrder
    wellName?: SortOrder
    propertyDescription?: SortOrder
    decimalInterest?: SortOrderInput | SortOrder
    interestType?: SortOrder
    divisionOrderId?: SortOrder
    _count?: WellCountOrderByAggregateInput
    _avg?: WellAvgOrderByAggregateInput
    _max?: WellMaxOrderByAggregateInput
    _min?: WellMinOrderByAggregateInput
    _sum?: WellSumOrderByAggregateInput
  }

  export type WellScalarWhereWithAggregatesInput = {
    AND?: WellScalarWhereWithAggregatesInput | WellScalarWhereWithAggregatesInput[]
    OR?: WellScalarWhereWithAggregatesInput[]
    NOT?: WellScalarWhereWithAggregatesInput | WellScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Well"> | string
    wellName?: StringWithAggregatesFilter<"Well"> | string
    propertyDescription?: StringWithAggregatesFilter<"Well"> | string
    decimalInterest?: FloatNullableWithAggregatesFilter<"Well"> | number | null
    interestType?: StringWithAggregatesFilter<"Well"> | string
    divisionOrderId?: StringWithAggregatesFilter<"Well"> | string
  }

  export type DivisionOrderCreateInput = {
    id?: string
    operator: string
    entity: string
    effectiveDate: Date | string
    county: string
    state: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wells?: WellCreateNestedManyWithoutDivisionOrderInput
  }

  export type DivisionOrderUncheckedCreateInput = {
    id?: string
    operator: string
    entity: string
    effectiveDate: Date | string
    county: string
    state: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wells?: WellUncheckedCreateNestedManyWithoutDivisionOrderInput
  }

  export type DivisionOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wells?: WellUpdateManyWithoutDivisionOrderNestedInput
  }

  export type DivisionOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wells?: WellUncheckedUpdateManyWithoutDivisionOrderNestedInput
  }

  export type DivisionOrderCreateManyInput = {
    id?: string
    operator: string
    entity: string
    effectiveDate: Date | string
    county: string
    state: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DivisionOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DivisionOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WellCreateInput = {
    id?: string
    wellName: string
    propertyDescription: string
    decimalInterest?: number | null
    interestType?: string
    divisionOrder: DivisionOrderCreateNestedOneWithoutWellsInput
  }

  export type WellUncheckedCreateInput = {
    id?: string
    wellName: string
    propertyDescription: string
    decimalInterest?: number | null
    interestType?: string
    divisionOrderId: string
  }

  export type WellUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wellName?: StringFieldUpdateOperationsInput | string
    propertyDescription?: StringFieldUpdateOperationsInput | string
    decimalInterest?: NullableFloatFieldUpdateOperationsInput | number | null
    interestType?: StringFieldUpdateOperationsInput | string
    divisionOrder?: DivisionOrderUpdateOneRequiredWithoutWellsNestedInput
  }

  export type WellUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wellName?: StringFieldUpdateOperationsInput | string
    propertyDescription?: StringFieldUpdateOperationsInput | string
    decimalInterest?: NullableFloatFieldUpdateOperationsInput | number | null
    interestType?: StringFieldUpdateOperationsInput | string
    divisionOrderId?: StringFieldUpdateOperationsInput | string
  }

  export type WellCreateManyInput = {
    id?: string
    wellName: string
    propertyDescription: string
    decimalInterest?: number | null
    interestType?: string
    divisionOrderId: string
  }

  export type WellUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    wellName?: StringFieldUpdateOperationsInput | string
    propertyDescription?: StringFieldUpdateOperationsInput | string
    decimalInterest?: NullableFloatFieldUpdateOperationsInput | number | null
    interestType?: StringFieldUpdateOperationsInput | string
  }

  export type WellUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    wellName?: StringFieldUpdateOperationsInput | string
    propertyDescription?: StringFieldUpdateOperationsInput | string
    decimalInterest?: NullableFloatFieldUpdateOperationsInput | number | null
    interestType?: StringFieldUpdateOperationsInput | string
    divisionOrderId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type WellListRelationFilter = {
    every?: WellWhereInput
    some?: WellWhereInput
    none?: WellWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WellOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DivisionOrderCountOrderByAggregateInput = {
    id?: SortOrder
    operator?: SortOrder
    entity?: SortOrder
    effectiveDate?: SortOrder
    county?: SortOrder
    state?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DivisionOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    operator?: SortOrder
    entity?: SortOrder
    effectiveDate?: SortOrder
    county?: SortOrder
    state?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DivisionOrderMinOrderByAggregateInput = {
    id?: SortOrder
    operator?: SortOrder
    entity?: SortOrder
    effectiveDate?: SortOrder
    county?: SortOrder
    state?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DivisionOrderScalarRelationFilter = {
    is?: DivisionOrderWhereInput
    isNot?: DivisionOrderWhereInput
  }

  export type WellCountOrderByAggregateInput = {
    id?: SortOrder
    wellName?: SortOrder
    propertyDescription?: SortOrder
    decimalInterest?: SortOrder
    interestType?: SortOrder
    divisionOrderId?: SortOrder
  }

  export type WellAvgOrderByAggregateInput = {
    decimalInterest?: SortOrder
  }

  export type WellMaxOrderByAggregateInput = {
    id?: SortOrder
    wellName?: SortOrder
    propertyDescription?: SortOrder
    decimalInterest?: SortOrder
    interestType?: SortOrder
    divisionOrderId?: SortOrder
  }

  export type WellMinOrderByAggregateInput = {
    id?: SortOrder
    wellName?: SortOrder
    propertyDescription?: SortOrder
    decimalInterest?: SortOrder
    interestType?: SortOrder
    divisionOrderId?: SortOrder
  }

  export type WellSumOrderByAggregateInput = {
    decimalInterest?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type WellCreateNestedManyWithoutDivisionOrderInput = {
    create?: XOR<WellCreateWithoutDivisionOrderInput, WellUncheckedCreateWithoutDivisionOrderInput> | WellCreateWithoutDivisionOrderInput[] | WellUncheckedCreateWithoutDivisionOrderInput[]
    connectOrCreate?: WellCreateOrConnectWithoutDivisionOrderInput | WellCreateOrConnectWithoutDivisionOrderInput[]
    createMany?: WellCreateManyDivisionOrderInputEnvelope
    connect?: WellWhereUniqueInput | WellWhereUniqueInput[]
  }

  export type WellUncheckedCreateNestedManyWithoutDivisionOrderInput = {
    create?: XOR<WellCreateWithoutDivisionOrderInput, WellUncheckedCreateWithoutDivisionOrderInput> | WellCreateWithoutDivisionOrderInput[] | WellUncheckedCreateWithoutDivisionOrderInput[]
    connectOrCreate?: WellCreateOrConnectWithoutDivisionOrderInput | WellCreateOrConnectWithoutDivisionOrderInput[]
    createMany?: WellCreateManyDivisionOrderInputEnvelope
    connect?: WellWhereUniqueInput | WellWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type WellUpdateManyWithoutDivisionOrderNestedInput = {
    create?: XOR<WellCreateWithoutDivisionOrderInput, WellUncheckedCreateWithoutDivisionOrderInput> | WellCreateWithoutDivisionOrderInput[] | WellUncheckedCreateWithoutDivisionOrderInput[]
    connectOrCreate?: WellCreateOrConnectWithoutDivisionOrderInput | WellCreateOrConnectWithoutDivisionOrderInput[]
    upsert?: WellUpsertWithWhereUniqueWithoutDivisionOrderInput | WellUpsertWithWhereUniqueWithoutDivisionOrderInput[]
    createMany?: WellCreateManyDivisionOrderInputEnvelope
    set?: WellWhereUniqueInput | WellWhereUniqueInput[]
    disconnect?: WellWhereUniqueInput | WellWhereUniqueInput[]
    delete?: WellWhereUniqueInput | WellWhereUniqueInput[]
    connect?: WellWhereUniqueInput | WellWhereUniqueInput[]
    update?: WellUpdateWithWhereUniqueWithoutDivisionOrderInput | WellUpdateWithWhereUniqueWithoutDivisionOrderInput[]
    updateMany?: WellUpdateManyWithWhereWithoutDivisionOrderInput | WellUpdateManyWithWhereWithoutDivisionOrderInput[]
    deleteMany?: WellScalarWhereInput | WellScalarWhereInput[]
  }

  export type WellUncheckedUpdateManyWithoutDivisionOrderNestedInput = {
    create?: XOR<WellCreateWithoutDivisionOrderInput, WellUncheckedCreateWithoutDivisionOrderInput> | WellCreateWithoutDivisionOrderInput[] | WellUncheckedCreateWithoutDivisionOrderInput[]
    connectOrCreate?: WellCreateOrConnectWithoutDivisionOrderInput | WellCreateOrConnectWithoutDivisionOrderInput[]
    upsert?: WellUpsertWithWhereUniqueWithoutDivisionOrderInput | WellUpsertWithWhereUniqueWithoutDivisionOrderInput[]
    createMany?: WellCreateManyDivisionOrderInputEnvelope
    set?: WellWhereUniqueInput | WellWhereUniqueInput[]
    disconnect?: WellWhereUniqueInput | WellWhereUniqueInput[]
    delete?: WellWhereUniqueInput | WellWhereUniqueInput[]
    connect?: WellWhereUniqueInput | WellWhereUniqueInput[]
    update?: WellUpdateWithWhereUniqueWithoutDivisionOrderInput | WellUpdateWithWhereUniqueWithoutDivisionOrderInput[]
    updateMany?: WellUpdateManyWithWhereWithoutDivisionOrderInput | WellUpdateManyWithWhereWithoutDivisionOrderInput[]
    deleteMany?: WellScalarWhereInput | WellScalarWhereInput[]
  }

  export type DivisionOrderCreateNestedOneWithoutWellsInput = {
    create?: XOR<DivisionOrderCreateWithoutWellsInput, DivisionOrderUncheckedCreateWithoutWellsInput>
    connectOrCreate?: DivisionOrderCreateOrConnectWithoutWellsInput
    connect?: DivisionOrderWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DivisionOrderUpdateOneRequiredWithoutWellsNestedInput = {
    create?: XOR<DivisionOrderCreateWithoutWellsInput, DivisionOrderUncheckedCreateWithoutWellsInput>
    connectOrCreate?: DivisionOrderCreateOrConnectWithoutWellsInput
    upsert?: DivisionOrderUpsertWithoutWellsInput
    connect?: DivisionOrderWhereUniqueInput
    update?: XOR<XOR<DivisionOrderUpdateToOneWithWhereWithoutWellsInput, DivisionOrderUpdateWithoutWellsInput>, DivisionOrderUncheckedUpdateWithoutWellsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type WellCreateWithoutDivisionOrderInput = {
    id?: string
    wellName: string
    propertyDescription: string
    decimalInterest?: number | null
    interestType?: string
  }

  export type WellUncheckedCreateWithoutDivisionOrderInput = {
    id?: string
    wellName: string
    propertyDescription: string
    decimalInterest?: number | null
    interestType?: string
  }

  export type WellCreateOrConnectWithoutDivisionOrderInput = {
    where: WellWhereUniqueInput
    create: XOR<WellCreateWithoutDivisionOrderInput, WellUncheckedCreateWithoutDivisionOrderInput>
  }

  export type WellCreateManyDivisionOrderInputEnvelope = {
    data: WellCreateManyDivisionOrderInput | WellCreateManyDivisionOrderInput[]
  }

  export type WellUpsertWithWhereUniqueWithoutDivisionOrderInput = {
    where: WellWhereUniqueInput
    update: XOR<WellUpdateWithoutDivisionOrderInput, WellUncheckedUpdateWithoutDivisionOrderInput>
    create: XOR<WellCreateWithoutDivisionOrderInput, WellUncheckedCreateWithoutDivisionOrderInput>
  }

  export type WellUpdateWithWhereUniqueWithoutDivisionOrderInput = {
    where: WellWhereUniqueInput
    data: XOR<WellUpdateWithoutDivisionOrderInput, WellUncheckedUpdateWithoutDivisionOrderInput>
  }

  export type WellUpdateManyWithWhereWithoutDivisionOrderInput = {
    where: WellScalarWhereInput
    data: XOR<WellUpdateManyMutationInput, WellUncheckedUpdateManyWithoutDivisionOrderInput>
  }

  export type WellScalarWhereInput = {
    AND?: WellScalarWhereInput | WellScalarWhereInput[]
    OR?: WellScalarWhereInput[]
    NOT?: WellScalarWhereInput | WellScalarWhereInput[]
    id?: StringFilter<"Well"> | string
    wellName?: StringFilter<"Well"> | string
    propertyDescription?: StringFilter<"Well"> | string
    decimalInterest?: FloatNullableFilter<"Well"> | number | null
    interestType?: StringFilter<"Well"> | string
    divisionOrderId?: StringFilter<"Well"> | string
  }

  export type DivisionOrderCreateWithoutWellsInput = {
    id?: string
    operator: string
    entity: string
    effectiveDate: Date | string
    county: string
    state: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DivisionOrderUncheckedCreateWithoutWellsInput = {
    id?: string
    operator: string
    entity: string
    effectiveDate: Date | string
    county: string
    state: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DivisionOrderCreateOrConnectWithoutWellsInput = {
    where: DivisionOrderWhereUniqueInput
    create: XOR<DivisionOrderCreateWithoutWellsInput, DivisionOrderUncheckedCreateWithoutWellsInput>
  }

  export type DivisionOrderUpsertWithoutWellsInput = {
    update: XOR<DivisionOrderUpdateWithoutWellsInput, DivisionOrderUncheckedUpdateWithoutWellsInput>
    create: XOR<DivisionOrderCreateWithoutWellsInput, DivisionOrderUncheckedCreateWithoutWellsInput>
    where?: DivisionOrderWhereInput
  }

  export type DivisionOrderUpdateToOneWithWhereWithoutWellsInput = {
    where?: DivisionOrderWhereInput
    data: XOR<DivisionOrderUpdateWithoutWellsInput, DivisionOrderUncheckedUpdateWithoutWellsInput>
  }

  export type DivisionOrderUpdateWithoutWellsInput = {
    id?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DivisionOrderUncheckedUpdateWithoutWellsInput = {
    id?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    county?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WellCreateManyDivisionOrderInput = {
    id?: string
    wellName: string
    propertyDescription: string
    decimalInterest?: number | null
    interestType?: string
  }

  export type WellUpdateWithoutDivisionOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    wellName?: StringFieldUpdateOperationsInput | string
    propertyDescription?: StringFieldUpdateOperationsInput | string
    decimalInterest?: NullableFloatFieldUpdateOperationsInput | number | null
    interestType?: StringFieldUpdateOperationsInput | string
  }

  export type WellUncheckedUpdateWithoutDivisionOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    wellName?: StringFieldUpdateOperationsInput | string
    propertyDescription?: StringFieldUpdateOperationsInput | string
    decimalInterest?: NullableFloatFieldUpdateOperationsInput | number | null
    interestType?: StringFieldUpdateOperationsInput | string
  }

  export type WellUncheckedUpdateManyWithoutDivisionOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    wellName?: StringFieldUpdateOperationsInput | string
    propertyDescription?: StringFieldUpdateOperationsInput | string
    decimalInterest?: NullableFloatFieldUpdateOperationsInput | number | null
    interestType?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}