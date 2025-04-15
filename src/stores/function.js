import { defineStore } from "pinia";

export const useFunctionStore = defineStore("function", {
  state: () => ({
    functions: [],
  }),
  actions: {
    addFunction(func) {
      this.functions.push(func);
    },
    removeFunction(func) {
      this.functions = this.functions.filter((f) => f !== func);
    },
    updateFunction(functionName, newFunc) {
      const index = this.functions.findIndex(
        (f) => f.functionName === functionName
      );
      if (index !== -1) {
        this.functions[index] = newFunc;
      }
    },
  },
});
