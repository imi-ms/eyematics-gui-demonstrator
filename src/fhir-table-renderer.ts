import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {bulmaStyles} from "./bulma-styles.ts";
import {evaluate} from "fhirpath";

/**
 * Interface for the dynamic table configuration.
 */
export interface ColumnConfig<T> {
    [columnName: string]: string | ((item: T) => any); // Map column name to a function extracting the value
}

@customElement('fhir-table-renderer')
export class FhirTableRenderer<T> extends LitElement {
    // Data array to be displayed in the table
    @property({type: Array})
    data: T[] = [];

    // A map of column names and value retrieval functions
    @property({type: Object, reflect: true})
    columnMap: ColumnConfig<T> = {};

    // CSS for the table
    static styles = [bulmaStyles]

    // Render the table
    render() {
        const columnNames = this.columnMap !== null ? Object.keys(this.columnMap) : []; // Extract column names dynamically

        function extracted<T>(map: ColumnConfig<T>, columnName: string, item: T) {
            let functionOrString = map[columnName];
            let result;
            if (typeof functionOrString === "string") {
                result = evaluate(item, functionOrString as string);
            } else if (functionOrString instanceof Function) {
                result = [functionOrString(item)];
            } else {
                result = ["typecasting error"];
            }

            let resultList = [];
            for (let resultElement of result) {
                console.log("columName", columnName, "result", resultElement);
                console.log("result.system.value", result.system?.value);

                if (typeof result === "string") {
                    resultList += result
                } else if (result.system && result.system.value === "http://snomed.info/sct") {
                    resultList += `SCT ${result.code.value} "${result.display.value}"`
                } else {
                    resultList += JSON.stringify(result)
                }
            }

            return JSON.stringify(resultList);
        }

        return html`
            <table class="table">
                <thead>
                <tr>
                    ${columnNames.map((columnName) => html`
                        <th>${columnName}</th>`)}
                </tr>
                </thead>
                <tbody>
                ${(this.data ?? []).map(
                        (item) => html`
                            <tr>
                                ${columnNames.map((columnName) => html`
                                    <td>${(extracted(this.columnMap, columnName, item))}</td>`)}
                            </tr>
                        `
                )}
                </tbody>
            </table>
        `;
    }
}
