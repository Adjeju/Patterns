interface ISymbol {
  print(): void;
}

const zip = ([...arr]) =>
  Array(Math.max(...arr.map((a) => a.length)))
    .fill(0)
    .map((_, i) => arr.map((a) => a[i]));

class CustomSymbol implements ISymbol {
  public symbol: string;
  public representaion: string[];

  constructor(symbol: string, representation: string[]) {
    this.symbol = symbol;
    this.representaion = representation;
  }

  print() {
    for (const row of this.representaion) {
      console.log(row);
    }
  }
}

class ComplexSymbol implements ISymbol {
  public symbol: string;
  public representaion: string[][];

  constructor(symbol: string, representation: string[][]) {
    this.symbol = symbol;
    this.representaion = representation;
  }

  print() {
    for (const row of this.representaion) {
      console.log(...row);
    }
  }
}

class CustomSymbolFactory {
  private symbols: { [key: string]: CustomSymbol | ComplexSymbol };

  constructor() {
    this.symbols = {};
  }

  create(symbol: string, representaion: string[]) {
    if (!!this.symbols[symbol]) {
      return this.symbols[symbol];
    }
    if (symbol.length > 1) {
      const complexSymbolRepresentations = zip(
        symbol.split("").map((s) => this.symbols[s].representaion as string[])
      );
      this.symbols[symbol] = new ComplexSymbol(
        symbol,
        complexSymbolRepresentations
      );
      return this.symbols[symbol];
    }
    this.symbols[symbol] = new CustomSymbol(symbol, representaion);
    return this.symbols[symbol];
  }

  printAllSymbols() {
    Object.values(this.symbols).forEach((obj) => obj.print());
  }
}

const factory = new CustomSymbolFactory();

const one = factory.create("1", ["** ", " * ", " * ", " * ", "***"]);
const two = factory.create("2", ["***", "  *", " * ", "*  ", "***"]);
const three = factory.create("3", ["***", "  *", "***", "  *", "***"]);

factory.printAllSymbols();

const anotherOne = factory.create("1", ["** ", " * ", " * ", " * ", "***"]);
const oneTwoThree = factory.create("123", []);

factory.printAllSymbols();
