import { Schema } from "ai";

interface ToolOptions {
  name: string;
  description: string;
  parameters?: Schema;
  execute: (input: unknown) => Promise<unknown>;
}

export class ToolManager {
  readonly name: string;
  readonly description: string;
  readonly parameters?: Schema;
  private readonly handler: (input: unknown) => Promise<unknown>;

  constructor(options: ToolOptions) {
    this.name = options.name;
    this.description = options.description;
    this.parameters = options.parameters;
    this.handler = options.execute;
  }

  tool() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters,
      execute: this.handler,
    };
  }

  async call(input: unknown): Promise<unknown> {
    return await this.handler(input);
  }
}
