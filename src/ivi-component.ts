import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { IVIData, IVIMedication, IVIRegimen } from "./ivi-data.ts";
import { getNumberOrNull } from "./tonometry-component.ts";
import { Console } from "console";

@customElement("ivi-component")
export class IVIComponent extends LitElement {
	@state()
	private formData: IVIData = {
		recordedDate: new Date().toISOString().slice(0, 16),
		rightEye: {
			medication: null,
			regimen: null,
			visus: false,
			appointments: [],
			note: "",
		},
		leftEye: {
			medication: null,
			regimen: null,
			visus: false,
			appointments: [],
			note: "",
		},
	};

	@state()
	private validInput: boolean = false;

	@state()
	private validationMessage: string = "";

	private _max_weeks: number = 20;

	@state()
	private _weeks_left: number[] = [null, null, null];

	@state()
	private _weeks_right: number[] = [null, null, null];

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
                                    <div class="treatment-input select is-small">
                                        <select class="medication-right" required @change="${this._updateFormData}">
										<option value="" disabled selected hidden>Medikament</option>
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
                                    <div class="treatment-input select is-small">
                                        <select class="regimen-right" required @change="${this._updateFormData}">
										<option value="" disabled selected hidden>Therapie</option>
                                        ${Object.entries(IVIRegimen).map(
											([key, value]) => html`
												<option
													value="${key}"
													?selected=${this.formData.rightEye.regimen === value}
												>
													${value}
												</option>
											`
										)}
                                        </select>
                                    </div>
                                </div>
                            </div>
							<div class="inputs-inline">
								<label class="checkbox">
									<input class="visus-right" type="checkbox" @input="${this._updateFormData}" />
									<span class="checkbox-label"> Handbewegungen sichtbar</span>
								</label>
							</div>
							<label class="label">Nächste Spritze(n):</label>
							<div class="inputs-inline">
								${[0, 1, 2].map(
									(i) => html`
										<label class="label">${i + 1}.</label>
										<div class="appointment-input control">
											<div class="appointment-input select is-small">
												<select
													class="appointment-${i}-right"
													.value="${this._weeks_right[i]}"
													required
													@change="${(e: Event) =>
														this._handleAppointmentChange("right", i, e)}"
												>
													${this._weeks_right[i]
														? html`<option value="">Löschen</option>`
														: html`<option value="" disabled selected hidden>
																Optional
														  </option>`}
													${Array.from({ length: this._max_weeks }, (_, i) => i + 1).map(
														(week) => html`
															<option value="${week}">
																${week} Woche${week > 1 ? "n" : ""}
															</option>
														`
													)}
												</select>
											</div>
										</div>
									`
								)}
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
                                    <div class="treatment-input select is-small">
                                        <select class="medication-left" required @change="${this._updateFormData}">
										<option value="" disabled selected hidden>Medikament</option>
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
                                    <div class="treatment-input select is-small">
                                        <select class="regimen-left" required @change="${this._updateFormData}">
										<option value="" disabled selected hidden>Therapie</option>
                                        ${Object.entries(IVIRegimen).map(
											([key, value]) => html`
												<option
													value="${key}"
													?selected=${this.formData.leftEye.regimen === value}
												>
													${value}
												</option>
											`
										)}
                                        </select>
                                    </div>
                                </div>
                            </div>
							<div class="inputs-inline">
								<label class="checkbox">
									<input class="visus-left" type="checkbox" @input="${this._updateFormData}" />
									<span class="checkbox-label"> Handbewegungen sichtbar</span>
								</label>
							</div>
							<label class="label">Nächste Spritze(n):</label>
							<div class="inputs-inline">
								${[0, 1, 2].map(
									(i) => html`
										<label class="label">${i + 1}.</label>
										<div class="appointment-input control">
											<div class="appointment-input select is-small">
												<select
													class="appointment-${i}-left"
													.value="${this._weeks_left[i]}"
													required
													@change="${(e: Event) =>
														this._handleAppointmentChange("left", i, e)}"
												>
													${this._weeks_left[i]
														? html`<option value="">Löschen</option>`
														: html`<option value="" disabled selected hidden>
																Optional
														  </option>`}
													${Array.from({ length: this._max_weeks }, (_, i) => i + 1).map(
														(week) => html`
															<option value="${week}">
																${week} Woche${week > 1 ? "n" : ""}
															</option>
														`
													)}
												</select>
											</div>
										</div>
									`
								)}
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

	private _handleAppointmentChange(side: "left" | "right", index: number, e: Event) {
		const values = side === "left" ? this._weeks_left : this._weeks_right;
		const newValues = [...values];

		let value = (e.target as HTMLSelectElement).value;
		newValues[index] = !value ? null : +value.split(" ")[0];

		if (side === "left") {
			this._weeks_left = newValues;
		} else {
			this._weeks_right = newValues;
		}

		this._updateFormData();
	}

	private _updateFormData() {
		this.formData = {
			recordedDate: this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value,
			rightEye: {
				medication: IVIMedication[this.renderRoot.querySelector<HTMLSelectElement>(".medication-right")?.value],
				regimen: IVIRegimen[this.renderRoot.querySelector<HTMLSelectElement>(".regimen-right")?.value],
				visus: this.renderRoot.querySelector<HTMLInputElement>(".visus-right")?.checked,
				appointments: this._weeks_right,
				note: this.renderRoot.querySelector<HTMLInputElement>(".note-right")?.value,
			},
			leftEye: {
				medication: IVIMedication[this.renderRoot.querySelector<HTMLSelectElement>(".medication-left")?.value],
				regimen: IVIRegimen[this.renderRoot.querySelector<HTMLSelectElement>(".regimen-left")?.value],
				visus: this.renderRoot.querySelector<HTMLInputElement>(".visus-left")?.checked,
				appointments: this._weeks_left,
				note: this.renderRoot.querySelector<HTMLInputElement>(".note-left")?.value,
			},
		};
	}

	private _validateInput() {
		this.validInput = true;
		this.validationMessage = "";

		if (!isValidMedicationAdmin(this.formData.leftEye) && !isValidMedicationAdmin(this.formData.rightEye)) {
			this.validInput = false;
			this.validationMessage =
				"Bitte geben Sie das Behandlungsschemata und Medikament für mindestens eines der beiden Augen an.";
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

			.treatment-input select,
			.appointment-input select {
				width: 10em;
			}

			.treatment-input select:invalid,
			.appointment-input select:invalid {
				color: gray;
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

export function isValidMedicationAdmin(medicationAdmin: {
	medication: IVIMedication;
	regimen: IVIRegimen;
	visus: boolean;
	appointments: number[];
	note: string;
}) {
	return medicationAdmin.medication && medicationAdmin.regimen;
}
