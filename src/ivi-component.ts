import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { IVIData, IVIMedication, IVIRegimen } from "./ivi-data.ts";
import { getNumberOrNull } from "./tonometry-component.ts";
import { MedicationRequest } from "@fhir-typescript/r4b-core/dist/fhir";

@customElement("ivi-component")
export class IVIComponent extends LitElement {
	@state()
	private formData: IVIData = {
		recordedDate: new Date().toISOString().slice(0, 16),
		rightEye: {
			medication: IVIMedication.Be,
			treatment: {
				regimen: IVIRegimen.Fixed,
				min: null,
				max: null,
			},
			note: "",
		},
		leftEye: {
			medication: IVIMedication.Be,
			treatment: {
				regimen: IVIRegimen.Fixed,
				min: null,
				max: null,
			},
			note: "",
		},
	};

	@state()
	private validInput: boolean = false;

	@state()
	private validationMessage: string = "";

	render() {
		this._validateInput();

		return html`
            <section class="section ivi-container">
                <div class="container">
                    <!-- Header -->
                    <div class="field">
                        <label class="label is-medium">
                            <strong>IVOM-Behandlung:</strong>
                        </label>
                        <div class="field is-grouped">
                            <div class="control">
                                <input 
                                    class="recordedDate input is-small" 
                                    type="datetime-local" 
                                    placeholder="Messzeitpunkt (Default: Jetzt)"
                                    .value="${this.formData.recordedDate}"
                                    @input="${this._updateFormData}"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Right and Left Eye Fields -->
                    <div class="horizontal-fields">
                        <!-- Right Eye -->
                        <div class="box">
                            <div class="field-label">Rechtes Auge</div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <div class="select is-small">
                                        <select class="medication-right" @change="${this._updateFormData}">
                                        ${Object.entries(IVIMedication)
											.slice(2, 4)
											.map(
												([key, value]) => html`
													<option
														value="${key}"
														?selected=${this.formData.rightEye.medication === value}
													>
														${value}
													</option>
												`
											)}
                                        </select>
                                    </div>
                                </div>
							</div>
							<div class="field is-grouped">
								<div class="control">
                                    <div class="select is-small">
                                        <select class="regimen-right" @change="${this._updateFormData}">
                                        ${Object.entries(IVIRegimen).map(
											([key, value]) => html`
												<option
													value="${key}"
													?selected=${this.formData.rightEye.treatment.regimen === value}
												>
													${value}
												</option>
											`
										)}
                                        </select>
                                    </div>
                                </div>
								${
									this.formData.rightEye.treatment.regimen === IVIRegimen.Fixed
										? html`
												<div class="control">
													<input
														class="interval-right input is-small"
														type="number"
														min="0"
														step="1"
														placeholder="Intervall (in Wochen)"
														@input="${this._updateFormData}"
													/>
												</div>
										  `
										: html`
												<div class="control is-expanded">
													<input
														class="min-right input is-small"
														type="number"
														min="0"
														step="1"
														placeholder="Min. Abstand (in Wochen)"
														@input="${this._updateFormData}"
													/>
												</div>
												<div class="control is-expanded">
													<input
														class="max-right input is-small"
														type="number"
														min="0"
														step="1"
														placeholder="Max. Abstand (in Wochen)"
														@input="${this._updateFormData}"
													/>
												</div>
										  `
								}
                            </div>
                            <label class="label">Zusätzliche Notizen:</label>
                            <div class="field">
                                <div class="control">
                                    <textarea
                                        class="note-right textarea is-small"
                                        placeholder="Freitext für das rechtes Auge"
                                        @input="${this._updateFormData}"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Left Eye -->
                        <div class="box">
                            <div class="field-label">Linkes Auge</div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <div class="select is-small">
                                        <select class="medication-left" @change="${this._updateFormData}">
                                        ${Object.entries(IVIMedication)
											.slice(2, 4)
											.map(
												([key, value]) => html`
													<option
														value="${key}"
														?selected=${this.formData.leftEye.medication === value}
													>
														${value}
													</option>
												`
											)}
                                        </select>
                                    </div>
                                </div>
							</div>
							<div class="field is-grouped">
								<div class="control">
                                    <div class="select is-small">
                                        <select class="regimen-left" @change="${this._updateFormData}">
                                        ${Object.entries(IVIRegimen).map(
											([key, value]) => html`
												<option
													value="${key}"
													?selected=${this.formData.leftEye.treatment.regimen === value}
												>
													${value}
												</option>
											`
										)}
                                        </select>
                                    </div>
                                </div>
								${
									this.formData.leftEye.treatment.regimen === IVIRegimen.Fixed
										? html`
												<div class="control">
													<input
														class="interval-left input is-small"
														type="number"
														placeholder="Intervall (in Wochen)"
														@input="${this._updateFormData}"
													/>
												</div>
										  `
										: html`
												<div class="control is-expanded">
													<input
														class="min-left input is-small"
														type="number"
														placeholder="Min. Abstand (in Wochen)"
														@input="${this._updateFormData}"
													/>
												</div>
												<div class="control is-expanded">
													<input
														class="max-left input is-small"
														type="number"
														placeholder="Max. Abstand (in Wochen)"
														@input="${this._updateFormData}"
													/>
												</div>
										  `
								}
                            </div>
                            <label class="label">Zusätzliche Notizen:</label>
                            <div class="field">
                                <div class="control">
                                    <textarea
                                        class="note-left textarea is-small"
                                        placeholder="Freitext für das linkes Auge"
                                        @input="${this._updateFormData}"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        class="submit-left button is-primary"
                        ?disabled="${!this.validInput}"
                        title="${this.validationMessage}"
                        @click="${this._handleSubmit}"
                    >
                        Erfassen
                    </button>
            </section>
        `;
	}

	private _updateFormData() {
		let regimenRight = IVIRegimen[this.renderRoot.querySelector<HTMLSelectElement>(".regimen-right")?.value];
		let regimenLeft = IVIRegimen[this.renderRoot.querySelector<HTMLSelectElement>(".regimen-left")?.value];

		this.formData = {
			recordedDate: this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value,
			rightEye: {
				medication: IVIMedication[this.renderRoot.querySelector<HTMLSelectElement>(".medication-right")?.value],
				treatment: {
					regimen: regimenRight,
					min: getNumberOrNull(
						this.renderRoot,
						regimenRight === IVIRegimen.Fixed ? ".interval-right" : ".min-right"
					),
					max: getNumberOrNull(
						this.renderRoot,
						regimenRight === IVIRegimen.Fixed ? ".interval-right" : ".max-right"
					),
				},
				note: this.renderRoot.querySelector<HTMLInputElement>(".note-right")?.value,
			},
			leftEye: {
				medication: IVIMedication[this.renderRoot.querySelector<HTMLSelectElement>(".medication-left")?.value],
				treatment: {
					regimen: regimenLeft,
					min: getNumberOrNull(
						this.renderRoot,
						regimenLeft === IVIRegimen.Fixed ? ".interval-left" : ".min-left"
					),
					max: getNumberOrNull(
						this.renderRoot,
						regimenLeft === IVIRegimen.Fixed ? ".interval-left" : ".max-left"
					),
				},
				note: this.renderRoot.querySelector<HTMLInputElement>(".note-left")?.value,
			},
		};
	}

	private _validateInput() {
		this.validInput = true;
		this.validationMessage = "";

		if (!isValidTreatment(this.formData.leftEye.treatment) && !isValidTreatment(this.formData.rightEye.treatment)) {
			this.validInput = false;
			this.validationMessage = "Bitte geben Sie ein gültiges Intervall für mindestens eines der beiden Augen an.";
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
			.ivi-container {
				margin: 1rem auto;
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

export function isValidMedReq(medReq: {
	treatment: {
		regimen: IVIRegimen;
		min: number;
		max: number;
	};
}) {
	return isValidTreatment(medReq.treatment);
}

export function isValidTreatment(treatment: { regimen: IVIRegimen; min: number; max: number }): boolean {
	return Number.isInteger(treatment.min) && Number.isInteger(treatment.max);
}
