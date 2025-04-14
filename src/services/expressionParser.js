import { createToken, Lexer, CstParser } from "chevrotain";

// Token Tanımlamaları
const Eğer = createToken({ name: "Eğer", pattern: /eğer/i });
const İse = createToken({ name: "İse", pattern: /ise/i });
const Değilse = createToken({ name: "Değilse", pattern: /değilse/i });
const Veya = createToken({ name: "Veya", pattern: /veya/i });
const Ve = createToken({
  name: "Ve",
  pattern: /ve/i,
  longer_alt: Veya,
});
const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });
const EşitEşit = createToken({ name: "EşitEşit", pattern: /==/ });
const BüyükEşit = createToken({ name: "BüyükEşit", pattern: />=/ });
const KüçükEşit = createToken({ name: "KüçükEşit", pattern: /<=/ });
const Büyük = createToken({ name: "Büyük", pattern: />/ });
const Küçük = createToken({ name: "Küçük", pattern: /</ });
const EşitDeğil = createToken({ name: "EşitDeğil", pattern: /!=/ });
const String = createToken({
  name: "String",
  pattern: /'[^']*'|"[^"]*"/,
});
const Number = createToken({ name: "Number", pattern: /\d+/ });
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// Değişken token'ı dinamik olarak oluşturulacak
const Variable = createToken({
  name: "Variable",
  pattern: /[a-zçğıöşüA-ZÇĞİÖŞÜ][a-zçğıöşüA-ZÇĞİÖŞÜ\s]+/,
});

const allTokens = [
  WhiteSpace,
  Eğer,
  İse,
  Değilse,
  Veya,
  Ve,
  LParen,
  RParen,
  EşitEşit,
  BüyükEşit,
  KüçükEşit,
  Büyük,
  Küçük,
  EşitDeğil,
  String,
  Number,
  Variable,
];

class ExpressionParser extends CstParser {
  constructor() {
    super(allTokens, {
      errorMessageProvider: {
        buildMismatchTokenMessage: function (options) {
          return `Beklenen: ${options?.expected?.name} fakat bulunan: ${options?.actual?.image}`;
        },
        buildNotAllInputParsedMessage: function (options) {
          return `Fazladan terim: ${options.firstRedundant}`;
        },
        buildNoViableAltMessage: function (options) {
          return `Geçersiz ifade yapısı: ${options.actual}`;
        },
      },
    });

    this.RULE("expression", () => {
      this.CONSUME(Eğer);
      this.SUBRULE(this.condition);
      this.OPTION(() => {
        this.OR([
          { ALT: () => this.CONSUME(İse) },
          { ALT: () => this.CONSUME(Değilse) },
        ]);
      });
    });

    this.RULE("condition", () => {
      this.SUBRULE(this.conditionTerm);
      this.MANY(() => {
        this.OR([
          { ALT: () => this.CONSUME(Ve) },
          { ALT: () => this.CONSUME(Veya) },
        ]);
        this.SUBRULE2(this.conditionTerm);
      });
    });

    this.RULE("conditionTerm", () => {
      this.CONSUME(LParen);
      this.SUBRULE(this.comparison);
      this.CONSUME(RParen);
    });

    this.RULE("comparison", () => {
      this.CONSUME(Variable);
      this.OR([
        { ALT: () => this.CONSUME(EşitEşit) },
        { ALT: () => this.CONSUME(BüyükEşit) },
        { ALT: () => this.CONSUME(KüçükEşit) },
        { ALT: () => this.CONSUME(Büyük) },
        { ALT: () => this.CONSUME(Küçük) },
        { ALT: () => this.CONSUME(EşitDeğil) },
      ]);
      this.OR2([
        { ALT: () => this.CONSUME(String) },
        { ALT: () => this.CONSUME(Number) },
      ]);
    });

    this.performSelfAnalysis();
  }
}

const parser = new ExpressionParser();
const lexer = new Lexer(allTokens);

export function parse(text) {
  const lexResult = lexer.tokenize(text);
  parser.input = lexResult.tokens;

  try {
    const cst = parser.expression();

    if (parser.errors.length > 0) {
      return {
        success: false,
        errors: parser.errors,
        cst: null,
      };
    }

    return {
      success: true,
      errors: [],
      cst,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error],
      cst: null,
    };
  }
}
