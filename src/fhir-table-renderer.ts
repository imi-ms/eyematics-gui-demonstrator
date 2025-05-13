import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bulmaStyles } from "./bulma-styles.ts";
import { evaluate } from "fhirpath";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

/**
 * Interface for the dynamic table configuration.
 */
export interface ColumnConfig<T> {
	[columnName: string]: string | ((item: T) => any); // Map column name to a function extracting the value
}

@customElement("fhir-table-renderer")
export class FhirTableRenderer<T> extends LitElement {
	// Data array to be displayed in the table
	@property({ type: Array })
	data: T[] = [];

	// A map of column names and value retrieval functions
	@property({ type: Object, reflect: true })
	columnMap: ColumnConfig<T> = {};

	// CSS for the table
	static styles = [
		bulmaStyles,
		css`
			.modal-card {
				padding: 0px;
				background-color: transparent;
				width: 60%;
			}
		`,
	];

	_openModal(item: any) {
		let json = JSON.stringify(item, null, 2);
		let el = this.shadowRoot.getElementById("mycontent"); //as HTMLDialogElement;

		this.shadowRoot.querySelector(".modal-card-body").innerHTML = "<pre>" + json + "</pre>";

		el.classList.add("is-active");
	}

	_closeModal() {
		let el = this.shadowRoot.getElementById("mycontent"); //as HTMLDialogElement;
		el.classList.remove("is-active");
	}

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
			console.log(result);
			let resultList = [];
			for (let resultElement of result) {
				console.log(resultElement);
				if (typeof resultElement === "string") {
					resultList.push(resultElement);
				} else if (resultElement.value) {
					resultList.push(resultElement.value);
				} else if (resultElement.numerator && resultElement.denominator) {
					resultList.push(`${resultElement.numerator.value}/${resultElement.denominator.value}`);
				} else if (resultElement.system && resultElement.system.value === "http://snomed.info/sct") {
					resultList.push(`snomed#${resultElement.code.value} "${resultElement.display.value}"`);
				} else if (resultElement.system && resultElement.system.value === "http://loinc.org") {
					resultList.push(`loinc#${resultElement.code.value} "${resultElement.display.value}"`);
				} else if (resultElement.system) {
					resultList.push(`${resultElement.code.value} "${resultElement.display.value}"`);
				} else if (
					resultElement.url ===
					"https://larfuma.github.io/fhir-eyecare-ig/StructureDefinition/LensDuringVATestSpecification"
				) {
					resultList.push(
						`(sphere: ${resultElement.extension[1].value}, cylinder: ${resultElement.extension[2].value}, axis: ${resultElement.extension[3].value})`
					);
				} else {
					resultList.push(JSON.stringify(resultElement));
				}
			}

			return resultList.join("<br>");
		}

		return html`
			<table class="table">
				<thead>
					<tr>
						<th></th>
						${columnNames.map(
							(columnName) => html`<th title="${this.columnMap[columnName]}">${columnName}</th>`
						)}
					</tr>
				</thead>
				<tbody>
					${(this.data ?? []).map(
						(item) => html`
							<tr>
								<td @click="${() => this._openModal(item)}"><a>🔥</a></td>
								${columnNames.map(
									(columnName) =>
										html`<td>${unsafeHTML(extracted(this.columnMap, columnName, item))}</td>`
								)}
							</tr>
						`
					)}
				</tbody>
			</table>

			<div class="modal" id="mycontent">
				<div class="modal-background"></div>
				<dialog class="modal-card">
					<header class="modal-card-head">
						<p class="modal-card-title">FHIR Resource</p>
						<button class="delete" aria-label="close" @click="${this._closeModal}"></button>
					</header>
					<section class="modal-card-body"></section>
				</dialog>
			</div>

			<script type="text/javascript">
				window.openModal = function ($el) {};

				window.closeModal = function ($el) {
					$el.classList.remove("is-active");
				};

				window.closeAllModals = (function () {
					(document.querySelectorAll(".modal") || []).forEach(($modal) => {
						closeModal($modal);
					});
				})(
					// Add a click event on buttons to open a specific modal
					document.querySelectorAll(".js-modal-trigger") || []
				).forEach(($trigger) => {
					const modal = $trigger.dataset.target;
					const $target = document.getElementById(modal);

					$trigger.addEventListener("click", () => {
						window.openModal($target);
					});
				});

				// Add a click event on various child elements to close the parent modal
				(
					document.querySelectorAll(
						".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
					) || []
				).forEach(($close) => {
					const $target = $close.closest(".modal");

					$close.addEventListener("click", () => {
						window.closeModal($target);
					});
				});

				// Add a keyboard event to close all modals
				document.addEventListener("keydown", (event) => {
					if (event.key === "Escape") {
						window.closeAllModals();
					}
				});
			</script>
		`;
	}
}
