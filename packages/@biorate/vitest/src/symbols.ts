import { create } from '@biorate/symbolic';

const Symbols = create('Vitest');

export const Test = Symbols.Test;
export const Skip = Symbols.Skip;
export const Only = Symbols.Only;
export const Todo = Symbols.Todo;
export const Suite = Symbols.Suite;
export const Allure = Symbols.Allure;
export const Scenario = Symbols.Scenario;
export const Timeout = Symbols.Timeout;
export const Repeats = Symbols.Repeats;
export const Extends = Symbols.Extends;
