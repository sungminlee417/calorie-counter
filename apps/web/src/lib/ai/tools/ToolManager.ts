import { Schema } from "ai";

interface ToolOptions {
  name: string;
  description: string;
  parameters: Schema;
  execute: (input: unknown) => Promise<string>;
}

export class ToolManager {
  readonly name: string;
  readonly description: string;
  readonly parameters: Schema;
  private readonly handler: (input: unknown) => Promise<string>;

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

  async call(input: unknown): Promise<string> {
    return await this.handler(input);
  }
}
