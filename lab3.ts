class Product {
  name: string;
  producer: string;
  price: number;

  constructor(name: string, producer: string, price: number) {
    this.name = name;
    this.producer = producer;
    this.price = price;
  }

  getProductInfo(): string {
    return `${this.name} ${this.producer}: ${this.price}$`;
  }
}

class Originator {
  private state: Product;

  constructor(state: Product) {
    this.state = state;
    console.log(`Originator: My initial state is: ${state.getProductInfo()}`);
  }

  public changeProduct(product: Product): void {
    this.state = product;
  }

  public save(): Memento {
    return new ConcreteMemento(this.state);
  }

  public restore(memento: Memento): void {
    this.state = memento.getState();
  }
}

interface Memento {
  getState(): Product;

  getName(): string;
}

class ConcreteMemento implements Memento {
  private state: Product;

  constructor(state: Product) {
    this.state = state;
  }

  public getState(): Product {
    return this.state;
  }

  public getName(): string {
    return this.state.getProductInfo();
  }
}

class Caretaker {
  private mementos: Memento[] = [];

  private originator: Originator;

  constructor(originator: Originator) {
    this.originator = originator;
  }

  public backup(): void {
    this.mementos.push(this.originator.save());
  }

  public removeProduct(): void {
    if (this.isEmpty()) {
      return;
    }
    const memento = this.mementos.pop();

    if (memento) {
      this.originator.restore(memento);
    }
  }

  public removeSomeLastProducts(n: number = 2): void {
    if (this.isEmpty()) {
      return;
    }
    const mementos = this.mementos.splice(-n);

    if (mementos) {
      for (const memento of mementos) {
        this.originator.restore(memento);
      }
    }
  }

  public isEmpty(): boolean {
    return this.mementos.length === 0;
  }

  public showHistory(): void {
    if (this.isEmpty()) {
      console.log("Is empty(");
      return;
    }
    console.log("----------------------------------");
    for (const memento of this.mementos) {
      console.log(memento.getName());
    }
    console.log("----------------------------------");
  }
}

const originator = new Originator(new Product("Notebook", "Acer", 100));
const caretaker = new Caretaker(originator);

caretaker.backup();
originator.changeProduct(new Product("Notebook", "Asus", 150));

caretaker.backup();
originator.changeProduct(new Product("Notebook", "HP", 150));

caretaker.backup();
originator.changeProduct(new Product("Notebook", "Lenovo", 250));

caretaker.backup();
originator.changeProduct(new Product("Notebook", "DELL", 300));

caretaker.backup();
originator.changeProduct(new Product("Notebook", "DELL", 350));

caretaker.showHistory();

caretaker.removeProduct();

caretaker.removeSomeLastProducts();

caretaker.showHistory();
