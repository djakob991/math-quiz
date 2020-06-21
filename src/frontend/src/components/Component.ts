// Nadklasa wszystkich komponentów. Komponent to 'wrapper' na element DOM
// z konkretną zawartością i przypisanymi event listenerami.

// Dzięki unikalnemu identyfikatorowi instancji, id elementów DOM w 
// komponentach będą unikalne.

export abstract class Component {
  private static instances = 0;
  private instanceId: number;
  
  constructor() {
    Component.instances++;
    this.instanceId = Component.instances;
  }

  // Na podstawie argumentu tworzy unikalne id dla elementu.
  protected id(idRaw: string) {
    return idRaw + this.getClassName() + this.instanceId;
  }

  abstract getClassName(): string;
  abstract getElement(): HTMLElement;
}