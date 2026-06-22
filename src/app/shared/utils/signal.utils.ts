import { Signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";

/**
 * Creates a new Signal that emits values from the source signal after a specified debounce time.
 * Must be called in an injection context (e.g. inside a component's constructor or as a field initializer).
 * 
 * @param sourceSignal The source signal to debounce.
 * @param debounceMs The debounce time in milliseconds (default: 400).
 * @param initialValue The initial value for the debounced signal.
 * @returns A new debounced Signal.
 */
export function debouncedSignal<T>(
  sourceSignal: Signal<T>,
  debounceMs: number = 400,
  initialValue: T
): Signal<T> {
  return toSignal(
    toObservable(sourceSignal).pipe(debounceTime(debounceMs)),
    { initialValue }
  );
}
