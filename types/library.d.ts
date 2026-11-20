/**
 * library.js v1.0.1 — Copyright (c) 2026 Julián Cepeda.
 * SPDX-License-Identifier: MIT
 */

declare namespace LibraryJS {
    type Cell = string | number | boolean | Node | null | undefined;
    type ResponseFormat = 'JSON' | 'TEXT' | 'HTML' | 'BLOB';
    type RequestFormat = 'FORM' | 'JSON';

    interface ScriptOptions {
        executeScripts?: boolean;
        allowExternalScripts?: boolean;
        nonce?: string;
    }
    interface TableOptions { html?: boolean; }
    interface AjaxOptions<T = unknown> extends ScriptOptions {
        d?: Record<string, unknown> | FormData;
        f?: RequestFormat;
        r?: ResponseFormat;
        headers?: Record<string, string>;
        timeout?: number;
        signal?: AbortSignal;
        credentials?: RequestCredentials;
        ss?: (data: T, response: Response) => void;
        ee?: (error: Error & { status?: number; data?: unknown }, response?: Response) => void;
        dd?: (data: T | undefined, error: Error | null, response?: Response) => void;
    }
    type SelectLike = string | HTMLSelectElement;
    type ElementTarget = string | HTMLElement;

    interface Library {
        readonly version: string;
        noConflict(): Library;
        ready(callback: () => void): void;
        load(callback: () => void): void;
        id<T extends HTMLElement = HTMLElement>(id: ElementTarget): T;
        qs<T extends Element = Element>(selector: string, scope?: ElementTarget): T | null;
        qsa<T extends Element = Element>(selector: string, scope?: ElementTarget): T[];
        on(target: ElementTarget, eventName: string, handler: EventListener, options?: AddEventListenerOptions): () => void;
        trim(value: unknown): string;
        left(value: unknown, count: number): string;
        right(value: unknown, count: number): string;
        escapeHTML(value: unknown): string;
        isDate(value: unknown): boolean;
        isDateEnglish(value: unknown): boolean;
        isInt(value: unknown): boolean;
        dayWeekNumber(value: string | Date): number;
        dayWeekText(value: string | Date): string;
        input(id: ElementTarget): string;
        input(id: ElementTarget, value: string | number): HTMLElement;
        div(id: ElementTarget): string;
        div(id: ElementTarget, html: string, options?: ScriptOptions): HTMLElement;
        divHide(id: ElementTarget): HTMLElement;
        divShow(id: ElementTarget): HTMLElement;
        sanitizeHTML(html: unknown): string;
        setJS(html: unknown, options?: ScriptOptions): number;
        selectSelectedValue(id: SelectLike): string | undefined;
        selectSelectedText(id: SelectLike): string | undefined;
        selectSelectedTranslate(source: SelectLike, target: SelectLike, sort?: boolean): boolean;
        selectSort(id: SelectLike): HTMLSelectElement;
        selectSelectedDelete(id: SelectLike): boolean;
        radioSelected(container: ElementTarget, name: string): string | undefined;
        json2array(rows: Record<string, unknown>[], keys: string[]): unknown[][];
        tableCreate(headers: Cell[], rows: Cell[][], id?: string, options?: TableOptions): HTMLTableElement;
        tableRowAdd(id: ElementTarget, rows: Cell[][], options?: TableOptions): HTMLTableElement;
        ajax<T = unknown>(method: string, url: string, options?: AjaxOptions<T>): Promise<T>;
        get<T = unknown>(url: string, options?: AjaxOptions<T>): Promise<T>;
        post<T = unknown>(url: string, data: Record<string, unknown> | FormData, options?: AjaxOptions<T>): Promise<T>;
        debounce<T extends (...args: any[]) => void>(callback: T, delay: number): T & { cancel(): void };
    }
}

declare const library: LibraryJS.Library;
export = library;
export as namespace _;

declare global {
    function ax<T = unknown>(method: string, url: string, options?: LibraryJS.AjaxOptions<T>): Promise<T>;
}
