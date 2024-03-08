export abstract class BaseModel {
  abstract privateFields: string[];

  toJSON() {
    const properties = Object.getOwnPropertyNames(this);
    const publicProperties = properties.filter((property) => {
      return !this.privateFields.includes(property);
    });

    const json: Record<
      string,
      string | number | Record<string, string>[] | Date
    > = publicProperties.reduce(
      (
        obj: Record<string, string | number | Record<string, string>[] | Date>,
        key: string
      ) => {
        const value = this[key as keyof typeof this];
        if (value === this.privateFields) return obj;
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          Array.isArray(value) ||
          value instanceof Date
        ) {
          obj[key] = value;
        }
        return obj;
      },
      {}
    );
    return json;
  }
}
