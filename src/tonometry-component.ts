import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { IOPMethod, TonometrieData } from "./tonometry-data.ts";

@customElement("tonometry-component")
export class TonometryComponent extends LitElement {
	@state()
	private formData: TonometrieData = {
		iopMethod: IOPMethod.Applanation,
		recordedDate: new Date().toISOString().slice(0, 16),
		rightEye: { pressure: null, mydriasis: false },
		leftEye: { pressure: null, mydriasis: false },
	};

	@state()
	private validInput: boolean = false;

	@state()
	private validationMessage: string = "";

	render() {
		this._validateInput();

		return html`
			<section class="section tonometry-container">
				<div class="container">
					<!-- Header Section -->
					<div class="field">
						<label class="label is-medium">
							<strong>Tonometrie:</strong>
						</label>
						<div class="field is-grouped is-align-items-center">
							<div class="control">
								<input
									class="recordedDate input is-small"
									type="datetime-local"
									placeholder="Messzeitpunkt (Default: Jetzt)"
									.value="${this.formData.recordedDate}"
									@input="${this._updateFormData}"
								/>
							</div>
							<div class="control">
								<div class="select is-small">
									<select class="iopMethod" @change="${this._updateFormData}">
										${Object.entries(IOPMethod).map(
											([key, value]) => html`
												<option value="${key}" ?selected=${this.formData.iopMethod === value}>
													${value}
												</option>
											`
										)}
									</select>
								</div>
							</div>
						</div>
					</div>
					<!-- Right and Left Eye Fields -->
					<div class="horizontal-fields">
						<!-- Right Eye -->
						<div class="box">
							<div class="field-label">Rechtes Auge</div>
							<div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<div class="control">
										<input
											class="pressure-right input is-small"
											type="number"
											placeholder="Tonometrie rechts"
											min="0"
											@input="${this._updateFormData}"
										/>
									</div>
									<p class="button is-static is-small">mmHg</p>
								</div>
							</div>
							<div class="inputs-inline">
								<label class="checkbox">
									<input class="mydriasis-right" type="checkbox" @input="${this._updateFormData}" />
									<span class="checkbox-label"> Mydriasis</span>
								</label>
							</div>
						</div>

						<!-- Left Eye -->
						<div class="box">
							<div class="field-label">Linkes Auge</div>
							<div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<div class="control">
										<input
											class="pressure-left input is-small"
											type="number"
											placeholder="Tonometrie links"
											min="0"
											@input="${this._updateFormData}"
										/>
									</div>
									<p class="button is-static is-small">mmHg</p>
								</div>
							</div>
							<div class="inputs-inline">
								<label class="checkbox">
									<input class="mydriasis-left" type="checkbox" @input="${this._updateFormData}" />
									<span class="checkbox-label"> Mydriasis</span>
								</label>
							</div>
						</div>
					</div>
					<button
						class="submit button is-primary"
						?disabled="${!this.validInput}"
						title="${this.validationMessage}"
						@click="${this._handleSubmit}"
					>
						Erfassen
					</button>
				</div>
			</section>
		`;
	}

	private _updateFormData() {
		this.formData = {
			iopMethod: IOPMethod[this.renderRoot.querySelector<HTMLSelectElement>(".iopMethod")?.value],
			recordedDate: this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value,
			rightEye: {
				pressure: getNumberOrNull(this.renderRoot, ".pressure-right"),
				mydriasis: this.renderRoot.querySelector<HTMLInputElement>(".mydriasis-right")?.checked,
			},
			leftEye: {
				pressure: getNumberOrNull(this.renderRoot, ".pressure-left"),
				mydriasis: this.renderRoot.querySelector<HTMLInputElement>(".mydriasis-left")?.checked,
			},
		};
	}

	private _validateInput() {
		this.validInput = true;
		this.validationMessage = "";

		let pressureData: [number, string][] = [
			[this.formData.leftEye.pressure, "linke"],
			[this.formData.rightEye.pressure, "rechte"],
		];

		for (let [pressure, label] of pressureData) {
			if (pressure == null) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie einen Augeninnendruck für das ${label} Auge an.\n`;
			} else if (pressure < 0) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie einen positiven Augeninnendruck für das ${label} Auge an.\n`;
			}
		}
	}

	private _handleSubmit(_: Event) {
		const event = new CustomEvent("add-observation", {
			detail: this.formData,
			bubbles: false, // Allow the event to bubble up
			composed: true, // Allow the event to cross shadow DOM boundaries
		});

		this.dispatchEvent(event);
	}

	static styles = [
		bulmaStyles,
		css`
			.tonometry-container {
				margin: 1rem auto;
				max-width: 800px;
			}

			.field-label {
				font-weight: bold;
				text-align: center;
			}

			.horizontal-fields {
				display: flex;
				justify-content: space-between;
				margin: 0.75em;
			}

			.horizontal-fields .box {
				width: 45%;
				margin-bottom: 0;
			}

			.inputs-inline {
				display: flex;
				gap: 0.5rem;
				margin-bottom: 0.75rem;
			}

			.is-small-input {
				width: 30%;
			}
		`,
	];
}

export function getNumberOrNull(root: HTMLElement | DocumentFragment, className: string) {
	return ((value) => (value === "" ? null : Number(value)))(root.querySelector<HTMLInputElement>(className)?.value);
}
